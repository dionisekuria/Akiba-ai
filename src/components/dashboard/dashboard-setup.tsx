import { ArrowUpRight, CircleHelp, Leaf, ShieldCheck } from "lucide-react";
import Link from "next/link";

export function DashboardSetup() {
  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-12">
      <section className="w-full max-w-xl rounded-3xl border bg-card p-7 shadow-sm sm:p-10">
        <div className="mb-8 flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Leaf aria-hidden="true" className="size-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight">akiba</span>
        </div>
        <p className="mb-3 text-xs font-semibold tracking-[0.16em] text-primary uppercase">
          A little clarity goes a long way
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Connect your private workspace.
        </h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          Akiba AI uses Supabase to keep each person&apos;s plans private. Add
          your project&apos;s public connection details to the server
          environment to enable sign-in and live, personal goals.
        </p>
        <div className="mt-7 rounded-2xl bg-muted p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0 text-primary"
            />
            <div>
              <h2 className="font-medium">No personal figures are shown yet</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Set{" "}
                <code className="rounded bg-background px-1.5 py-0.5">
                  NEXT_PUBLIC_SUPABASE_URL
                </code>{" "}
                and{" "}
                <code className="rounded bg-background px-1.5 py-0.5">
                  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
                </code>{" "}
                on your server. Never add a service-role key to the browser.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-7 flex flex-wrap items-center gap-4">
          <Link
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            href="https://supabase.com/dashboard"
            rel="noreferrer"
            target="_blank"
          >
            Open Supabase <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
          <Link
            className="inline-flex min-h-11 items-center gap-2 rounded-xl px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            href="/login"
          >
            <CircleHelp aria-hidden="true" className="size-4" />
            Sign-in setup
          </Link>
        </div>
      </section>
    </main>
  );
}
