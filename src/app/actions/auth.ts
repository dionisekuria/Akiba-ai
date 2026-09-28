"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AuthActionState = {
  status: "idle" | "error" | "success";
  message: string;
};

const AuthSchema = z.object({
  intent: z.enum(["sign-in", "sign-up"]),
  email: z.email().trim().toLowerCase(),
  password: z.string().min(8).max(72),
  displayName: z.string().trim().max(80).optional(),
});

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
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } },
    });

    if (error) {
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
      };
    }

    redirect("/");
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return {
      status: "error",
      message: "We couldn't sign you in with those details. Please try again.",
    };
  }

  redirect("/");
}

export async function signOut() {
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error("Unable to sign out. Please try again.");
    }
  }

  redirect("/login");
}
