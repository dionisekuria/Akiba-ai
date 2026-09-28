"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { ArrowRight, LoaderCircle, LockKeyhole, Mail, UserRound } from "lucide-react";
import { authenticate, type AuthActionState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

const initialState: AuthActionState = { status: "idle", message: "" };

export function AuthForm({ isConfigured }: { isConfigured: boolean }) {
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

      <form action={formAction} className="space-y-4">
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
                className="min-h-12 w-full rounded-xl border border-input bg-white pl-10 pr-4 text-sm outline-none transition-shadow placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/20"
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
              className="min-h-12 w-full rounded-xl border border-input bg-white pl-10 pr-4 text-sm outline-none transition-shadow placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/20"
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
              className="min-h-12 w-full rounded-xl border border-input bg-white pl-10 pr-4 text-sm outline-none transition-shadow placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/20"
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
          className="h-12 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90"
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

      <p className="mt-5 text-center text-sm text-muted-foreground">
        {isSigningUp ? "Already have an account?" : "New to Akiba?"}{" "}
        <button
          className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() =>
            setMode(isSigningUp ? "sign-in" : "sign-up")
          }
          type="button"
        >
          {isSigningUp ? "Sign in" : "Create an account"}
        </button>
      </p>

      <p className="mt-6 text-center text-xs leading-5 text-muted-foreground">
        Your plans are private. We&apos;ll never ask for your bank PIN, M-Pesa
        PIN, or account password.
      </p>
    </div>
  );
}
