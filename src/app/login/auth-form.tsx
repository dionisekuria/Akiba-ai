"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { ArrowRight, LoaderCircle, LockKeyhole, Mail, UserRound } from "lucide-react";
import {
  authenticate,
  resendConfirmation,
  type AuthActionState,
  type ResendConfirmationActionState,
} from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

const initialState: AuthActionState = { status: "idle", message: "" };
const initialResendState: ResendConfirmationActionState = {
  status: "idle",
  message: "",
};

export function AuthForm({
  isConfigured,
  notice,
}: {
  isConfigured: boolean;
  notice: "confirmation-failed" | "auth-not-configured" | null;
}) {
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [state, formAction, isPending] = useActionState(
    authenticate,
    initialState,
  );
  const isSigningUp = mode === "sign-up";

  return (
    <div>
      {!isConfigured && (
        <div
          className="mb-6 rounded-2xl border border-[#e8d9ad] bg-[#faf5e5] p-4 text-sm leading-6 text-[#69572f]"
          role="status"
        >
          Authentication is not connected in this environment. You can still
          explore the clearly marked sample dashboard, but sign-in and personal
          accounts need Supabase setup.
          {process.env.NODE_ENV === "development" && (
            <Link className="mt-2 inline-flex items-center gap-1 font-semibold underline underline-offset-2" href="/">
              Open sample preview <ArrowRight aria-hidden="true" className="size-3.5" />
            </Link>
          )}
        </div>
      )}

      {notice === "confirmation-failed" && (
        <p
          className="mb-6 rounded-xl bg-destructive/10 px-3.5 py-3 text-sm leading-5 text-destructive"
          role="alert"
        >
          That confirmation link didn&apos;t work or has expired. Try signing
          in, or create the account again to get a fresh link.
        </p>
      )}
      {notice === "auth-not-configured" && (
        <p
          className="mb-6 rounded-xl bg-destructive/10 px-3.5 py-3 text-sm leading-5 text-destructive"
          role="alert"
        >
          Authentication is not configured in this environment. Please check
          the app setup and try again.
        </p>
      )}

      <div
        aria-label="Choose sign-in mode"
        className="mb-6 grid grid-cols-2 rounded-full border border-border bg-[#f7eee7] p-1"
        role="group"
      >
        <button
          aria-pressed={!isSigningUp}
          className={`min-h-11 rounded-full px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            !isSigningUp
              ? "bg-white text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setMode("sign-in")}
          type="button"
        >
          Sign in
        </button>
        <button
          aria-pressed={isSigningUp}
          className={`min-h-11 rounded-full px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            isSigningUp
              ? "bg-white text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setMode("sign-up")}
          type="button"
        >
          Create account
        </button>
      </div>

      <form action={formAction} className="space-y-5">
        <input name="intent" type="hidden" value={mode} />
        {isSigningUp && (
          <div>
            <label
              className="mb-2 block text-sm font-medium"
              htmlFor="displayName"
            >
              Your name
            </label>
            <div className="relative">
              <UserRound
                aria-hidden="true"
                className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <input
                autoComplete="name"
                className="min-h-14 w-full rounded-2xl border border-input bg-white pl-11 pr-4 text-sm outline-none transition-shadow placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30"
                id="displayName"
                maxLength={80}
                name="displayName"
                placeholder="What should we call you?"
                required
              />
            </div>
          </div>
        )}
        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="email">
            Email address
          </label>
          <div className="relative">
            <Mail
              aria-hidden="true"
              className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <input
              autoComplete="email"
              className="min-h-14 w-full rounded-2xl border border-input bg-white pl-11 pr-4 text-sm outline-none transition-shadow placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30"
              id="email"
              maxLength={254}
              name="email"
              placeholder="you@example.com"
              required
              type="email"
            />
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <LockKeyhole
              aria-hidden="true"
              className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <input
              autoComplete={isSigningUp ? "new-password" : "current-password"}
              className="min-h-14 w-full rounded-2xl border border-input bg-white pl-11 pr-4 text-sm outline-none transition-shadow placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30"
              id="password"
              maxLength={72}
              minLength={8}
              name="password"
              placeholder="At least 8 characters"
              required
              type="password"
            />
          </div>
        </div>

        {state.message && (
          <p
            aria-live="polite"
            className={`rounded-xl px-3.5 py-3 text-sm leading-5 ${
              state.status === "error"
                ? "bg-destructive/10 text-destructive"
                : "bg-secondary text-primary"
            }`}
            role={state.status === "error" ? "alert" : "status"}
          >
            {state.message}
          </p>
        )}

        <Button
          className="h-14 w-full rounded-full bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          disabled={isPending}
          type="submit"
        >
          {isPending ? (
            <>
              <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
              One moment…
            </>
          ) : (
            <>
              {isSigningUp ? "Create my account" : "Sign in"}
              <ArrowRight aria-hidden="true" className="size-4" />
            </>
          )}
        </Button>
      </form>

      {isConfigured &&
        (notice === "confirmation-failed" || state.needsConfirmation) && (
          <ResendConfirmationForm
            email={state.email ?? ""}
            key={state.email ?? "no-email"}
          />
        )}

      <p className="mt-6 text-center text-xs leading-5 text-muted-foreground">
        Your plans are private. We&apos;ll never ask for your bank PIN, M-Pesa
        PIN, or account password.
      </p>
    </div>
  );
}

function ResendConfirmationForm({ email }: { email: string }) {
  const [state, formAction, isPending] = useActionState(
    resendConfirmation,
    initialResendState,
  );

  return (
    <form action={formAction} className="mt-5 space-y-3">
      <label
        className="block text-sm font-medium"
        htmlFor="resend-confirmation-email"
      >
        Send a fresh confirmation link
      </label>
      <input
        autoComplete="email"
        className="min-h-12 w-full rounded-2xl border border-input bg-white px-4 text-sm outline-none transition-shadow placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30"
        defaultValue={email}
        id="resend-confirmation-email"
        maxLength={254}
        name="email"
        placeholder="you@example.com"
        required
        type="email"
      />
      {state.message && (
        <p
          aria-live="polite"
          className={`rounded-xl px-3.5 py-3 text-sm leading-5 ${
            state.status === "error"
              ? "bg-destructive/10 text-destructive"
              : "bg-secondary text-primary"
          }`}
          role={state.status === "error" ? "alert" : "status"}
        >
          {state.message}
        </p>
      )}
      <Button
        className="min-h-11 w-full rounded-full border border-border bg-white text-sm font-semibold text-foreground hover:bg-secondary"
        disabled={isPending}
        type="submit"
        variant="outline"
      >
        {isPending ? (
          <>
            <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
            Sending…
          </>
        ) : (
          "Resend confirmation email"
        )}
      </Button>
    </form>
  );
}
