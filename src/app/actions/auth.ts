"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getRequestOrigin } from "@/lib/request-origin";
import { buildAuthConfirmUrl } from "@/lib/auth-confirmation";

export type AuthActionState = {
  status: "idle" | "error" | "success";
  message: string;
  email?: string;
  needsConfirmation?: boolean;
};

export type ResendConfirmationActionState = {
  status: "idle" | "error" | "success";
  message: string;
};

const AuthSchema = z.object({
  intent: z.enum(["sign-in", "sign-up"]),
  email: z.email().trim().toLowerCase(),
  password: z.string().min(8).max(72),
  displayName: z.string().trim().max(80).optional(),
});

const EmailSchema = z.object({
  email: z.email().trim().toLowerCase(),
});

function logAuthError(
  action: string,
  error: { code?: string; status?: number },
) {
  console.error(`Supabase auth ${action} failed`, {
    code: error.code ?? "unknown",
    status: error.status ?? null,
  });
}

function isRateLimitError(error: { code?: string; status?: number }) {
  return error.status === 429 || error.code === "over_email_send_rate_limit";
}

const confirmationRateLimitMessage =
  "Please wait a bit before requesting another confirmation email.";
const genericResendMessage =
  "If that account still needs confirmation, a fresh confirmation link is on its way.";

export async function authenticate(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = AuthSchema.safeParse({
    intent: formData.get("intent"),
    email: formData.get("email"),
    password: formData.get("password"),
    displayName: formData.get("displayName") ?? undefined,
  });

  if (!parsed.success) {
    return {
      status: "error",
      message:
        "Enter a valid email and a password between 8 and 72 characters. For a new account, add a name too.",
    };
  }

  const { intent, email, password, displayName } = parsed.data;
  if (intent === "sign-up" && (!displayName || displayName.length < 2)) {
    return {
      status: "error",
      message: "Please enter your name (at least 2 characters).",
    };
  }

  if (!isSupabaseConfigured()) {
    return {
      status: "error",
      message:
        "Sign-in is not connected yet. Add the Supabase URL and publishable key to your server environment first.",
    };
  }

  const supabase = await createSupabaseServerClient();

  if (intent === "sign-up") {
    const requestHeaders = await headers();
    const origin = getRequestOrigin(requestHeaders);
    if (!origin) {
      return {
        status: "error",
        message:
          "We couldn't determine this app's address safely. Check the app URL configuration and try again.",
      };
    }

    const emailRedirectTo = buildAuthConfirmUrl(origin);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
        emailRedirectTo,
      },
    });

    if (error) {
      logAuthError("sign-up", error);
      if (isRateLimitError(error)) {
        return {
          status: "error",
          message: confirmationRateLimitMessage,
        };
      }

      return {
        status: "error",
        message:
          "We couldn't create your account with those details. Check them and try again.",
      };
    }

    if (!data.session) {
      return {
        status: "success",
        message:
          "Check your email for a confirmation link. Your account is not ready to sign in until it is confirmed.",
        email,
        needsConfirmation: true,
      };
    }

    redirect("/");
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    logAuthError("sign-in", error);
    return {
      status: "error",
      message:
        error.code === "email_not_confirmed"
          ? "Please confirm your email before signing in. Check your inbox or request a fresh confirmation link below."
          : isRateLimitError(error)
            ? confirmationRateLimitMessage
          : "We couldn't sign you in with those details. Please try again.",
      email: error.code === "email_not_confirmed" ? email : undefined,
      needsConfirmation: error.code === "email_not_confirmed",
    };
  }

  redirect("/");
}

export async function signOut() {
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      logAuthError("sign-out", error);
      throw new Error("Unable to sign out. Please try again.");
    }
  }

  redirect("/login");
}

export async function resendConfirmation(
  _previousState: ResendConfirmationActionState,
  formData: FormData,
): Promise<ResendConfirmationActionState> {
  const parsed = EmailSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return {
      status: "error",
      message: "Enter a valid email address to request a confirmation link.",
    };
  }

  if (!isSupabaseConfigured()) {
    return {
      status: "error",
      message: "Sign-in is not connected in this environment yet.",
    };
  }

  const origin = getRequestOrigin(await headers());
  if (!origin) {
    return { status: "success", message: genericResendMessage };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email: parsed.data.email,
    options: { emailRedirectTo: buildAuthConfirmUrl(origin) },
  });

  if (error) {
    logAuthError("resend-confirmation", error);
    if (isRateLimitError(error)) {
      return {
        status: "error",
        message: confirmationRateLimitMessage,
      };
    }
  }

  return { status: "success", message: genericResendMessage };
}
