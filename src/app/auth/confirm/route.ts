import { NextResponse, type NextRequest } from "next/server";
import {
  getSafeNextPath,
  parseAuthConfirmationParams,
} from "@/lib/auth-confirmation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function loginRedirect(
  request: NextRequest,
  notice: "confirmation-failed" | "auth-not-configured",
) {
  const destination = new URL("/login", request.url);
  destination.searchParams.set("notice", notice);
  return NextResponse.redirect(destination, { status: 303 });
}

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return loginRedirect(request, "auth-not-configured");
  }

  const confirmationParams = parseAuthConfirmationParams(
    request.nextUrl.searchParams,
  );

  if (!confirmationParams) {
    return loginRedirect(request, "confirmation-failed");
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { error } =
      confirmationParams.kind === "code"
        ? await supabase.auth.exchangeCodeForSession(confirmationParams.code)
        : await supabase.auth.verifyOtp({
            token_hash: confirmationParams.tokenHash,
            type: confirmationParams.type,
          });

    if (error) {
      console.error("Supabase email confirmation failed", {
        code: error.code ?? "unknown",
        status: error.status ?? null,
      });
      return loginRedirect(request, "confirmation-failed");
    }

    const nextPath = getSafeNextPath(
      request.nextUrl.searchParams.get("next"),
    );
    return NextResponse.redirect(new URL(nextPath, request.url), {
      status: 303,
    });
  } catch (error) {
    console.error("Supabase email confirmation failed", {
      code: error instanceof Error ? "unexpected" : "unknown",
      status: null,
    });
    return loginRedirect(request, "confirmation-failed");
  }
}
