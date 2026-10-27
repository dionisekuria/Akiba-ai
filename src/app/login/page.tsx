import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, BookOpen, Sparkles } from "lucide-react";
import { AuthForm } from "@/app/login/auth-form";
import { AkibaWordmark, HeroDiscs } from "@/components/brand/akiba-visuals";
import { Card, CardContent } from "@/components/ui/card";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in or create your private Akiba AI planning account.",
};

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string | string[];
    notice?: string | string[];
  }>;
}) {
  const { error, notice } = await searchParams;
  const noticeValue = Array.isArray(notice) ? notice[0] : notice;
  const errorValue = Array.isArray(error) ? error[0] : error;
  const authNotice =
    noticeValue === "auth-not-configured"
      ? "auth-not-configured"
      : noticeValue === "confirmation-failed" ||
          errorValue === "confirmation-failed" ||
          errorValue === "link-expired"
        ? "confirmation-failed"
        : null;
  const isConfigured = isSupabaseConfigured();
  if (isConfigured) {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getClaims();
    if (data?.claims) {
      redirect("/");
    }
  }

  return (
    <main className="min-h-screen bg-background lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
      <section className="akiba-hero-gradient relative isolate flex min-h-[280px] flex-col overflow-hidden px-6 py-6 text-white sm:min-h-[340px] sm:px-10 sm:py-9 lg:min-h-screen lg:px-12 lg:py-11 xl:px-16">
        <HeroDiscs className="-z-10" variant="compact" />
        <div className="relative z-10 flex items-center justify-between">
          <Link
            aria-label="Akiba AI home"
            className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            href="/"
          >
            <AkibaWordmark tone="light" />
          </Link>
          <Link
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/40 px-4 text-xs font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            href="/"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back
          </Link>
        </div>

        <div className="relative z-10 mt-auto max-w-xl py-10 lg:pb-[15vh]">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-4 py-2 text-xs font-semibold tracking-wide backdrop-blur-md">
            <BookOpen aria-hidden="true" className="size-4" />
            Learn · Plan · Grow
          </p>
          <h1 className="max-w-lg text-5xl leading-[0.94] font-semibold tracking-[-0.07em] sm:text-6xl xl:text-7xl">
            Money, made clearer.
          </h1>
          <p className="mt-5 max-w-md text-sm leading-6 text-white/95 sm:text-base sm:leading-7">
            A calm place to learn about money and make a plan for what matters
            to you.
          </p>
          <div className="mt-8 flex items-center gap-2 text-xs leading-5 text-white">
            <Sparkles aria-hidden="true" className="size-4 shrink-0" />
            Personal planning, at your own pace.
          </div>
        </div>
      </section>

      <section className="flex min-w-0 items-center justify-center px-4 py-10 sm:px-8 sm:py-14 lg:px-10 xl:px-16">
        <div className="w-full max-w-[500px]">
          <Card className="rounded-[2rem] border-border/70 bg-white p-1 shadow-[0_24px_70px_rgba(75,42,24,0.09)]">
            <CardContent className="px-5 py-7 sm:px-9 sm:py-10">
              <p className="mb-2 text-xs font-bold tracking-[0.14em] text-primary uppercase">
                Your private planning space
              </p>
              <h2 className="text-3xl font-semibold tracking-[-0.05em]">
                Your journey, your pace.
              </h2>
              <p className="mt-2 mb-7 text-sm leading-6 text-muted-foreground">
                Sign in or create an account to keep your goals private and
                organised.
              </p>
              <AuthForm
                notice={authNotice}
                isConfigured={isConfigured}
              />
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-xs leading-5 text-muted-foreground">
            Akiba AI provides educational information and personal planning
            tools, not personalised investment advice or a financial service.
          </p>
        </div>
      </section>
    </main>
  );
}
