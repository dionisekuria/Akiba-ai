import { ArrowUpRight, CircleHelp, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { AkibaWordmark, HeroDiscs } from "@/components/brand/akiba-visuals";

export function DashboardSetup() {
  return (
    <main className="akiba-hero-gradient relative isolate flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 sm:px-6 sm:py-14">
      <HeroDiscs className="-z-10" variant="compact" />
      <section className="relative z-10 w-full max-w-2xl rounded-[2rem] border border-white/70 bg-[#fffaf4] p-6 shadow-[0_28px_90px_rgba(90,31,9,0.24)] sm:p-10 lg:p-12">
        <div className="mb-9 flex items-center justify-between gap-4">
          <AkibaWordmark />
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#fff0e7] text-primary">
            <ShieldCheck aria-hidden="true" className="size-5" />
          </span>
        </div>
        <p className="mb-3 text-xs font-bold tracking-[0.16em] text-primary uppercase">
          A little clarity goes a long way
        </p>
        <h1 className="max-w-lg text-4xl leading-[1.02] font-semibold tracking-[-0.06em] sm:text-5xl">
          Connect your private workspace.
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
          Akiba AI uses Supabase to keep each person&apos;s plans private. Add
          your project&apos;s public connection details to the server
          environment to enable sign-in and live, personal goals.
        </p>
        <div className="mt-7 rounded-[1.4rem] border border-border/70 bg-[#f8efe7] p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <ShieldCheck
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0 text-primary"
            />
            <div className="min-w-0">
              <h2 className="font-semibold">No personal figures are shown yet</h2>
              <p className="mt-2 break-words text-sm leading-6 text-muted-foreground">
                Set{" "}
                <code className="break-all rounded-lg bg-white px-1.5 py-0.5 text-xs">
                  NEXT_PUBLIC_SUPABASE_URL
                </code>{" "}
                and{" "}
                <code className="break-all rounded-lg bg-white px-1.5 py-0.5 text-xs">
                  NEXT_PUBLIC_SUPABASE_ANON_KEY
                </code>{" "}
                (or{" "}
                <code className="break-all rounded-lg bg-white px-1.5 py-0.5 text-xs">
                  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
                </code>
                ) on your server. Never add a service-role key to the browser.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Link
            className="inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            href="https://supabase.com/dashboard"
            rel="noreferrer"
            target="_blank"
          >
            Open Supabase <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
          <Link
            className="inline-flex min-h-12 items-center gap-2 rounded-full px-5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
