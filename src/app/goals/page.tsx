import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Target } from "lucide-react";
import { AkibaWordmark, HeroDiscs } from "@/components/brand/akiba-visuals";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getGoalsForUser } from "@/lib/goal-data";

export const dynamic = "force-dynamic";

export default async function GoalsPage() {
  if (!isSupabaseConfigured()) {
    redirect("/");
  }

  const supabase = await createSupabaseServerClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims?.sub) {
    redirect("/login");
  }

  const goals = await getGoalsForUser(supabase, claimsData.claims.sub);

  return (
    <main className="min-h-screen bg-background px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-5 flex items-center justify-between gap-4">
          <Link
            aria-label="Akiba AI home"
            className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            href="/"
          >
            <AkibaWordmark />
          </Link>
          <Link
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border bg-white px-4 text-xs font-semibold transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-sm"
            href="/"
          >
            Overview
          </Link>
        </header>

        <section className="akiba-hero-gradient relative isolate mb-8 overflow-hidden rounded-[1.8rem] px-5 py-7 text-white shadow-[0_18px_48px_rgba(166,57,20,0.14)] sm:rounded-[2.3rem] sm:px-8 sm:py-9">
          <HeroDiscs className="-z-10" variant="compact" />
          <div className="relative z-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold tracking-[0.16em] text-white/90 uppercase">
                Your goals
              </p>
              <h1 className="mt-2 max-w-2xl text-4xl leading-[0.95] font-semibold tracking-[-0.06em] sm:text-5xl">
                Goals in focus.
              </h1>
              <p className="mt-3 max-w-lg text-sm leading-6 text-white/95">
                Keep your plans together and check in on your progress at your
                own pace.
              </p>
            </div>
            <Link
              className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-[#9f2d10] transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              href="/goals/new"
            >
              <Plus aria-hidden="true" className="size-4" />
              Create goal
            </Link>
          </div>
        </section>

        {goals.length === 0 ? (
          <section className="rounded-3xl border border-dashed border-border bg-card p-8 text-center">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-secondary text-primary">
              <Target aria-hidden="true" className="size-5" />
            </div>
            <h2 className="text-xl font-semibold tracking-tight">No goals yet</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Create your first goal to start tracking progress toward what matters to you.
            </p>
          </section>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {goals.map((goal) => (
              <Link
                key={goal.id}
                className="group min-w-0 rounded-[1.6rem] border border-border/70 bg-white p-5 shadow-[0_12px_36px_rgba(70,38,21,0.06)] transition-all hover:-translate-y-0.5 hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-6"
                href={`/goals/${goal.id}`}
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="min-w-0 break-words text-xs font-bold tracking-[0.1em] text-primary uppercase">
                    {goal.category}
                  </span>
                  <span className="shrink-0 rounded-full bg-secondary px-3 py-1.5 text-[10px] font-semibold text-secondary-foreground">
                    {goal.summary.status}
                  </span>
                </div>
                <h2 className="break-words text-xl font-semibold tracking-tight group-hover:text-primary">
                  {goal.name}
                </h2>
                <p className="mt-4 break-all text-sm font-medium text-muted-foreground">
                  KSh {new Intl.NumberFormat("en-KE").format(goal.savedAmount)}{" "}
                  <span className="text-muted-foreground/80">/</span>{" "}
                  KSh {new Intl.NumberFormat("en-KE").format(goal.targetAmount)}
                </p>
                <div
                  aria-label={`${goal.name}: ${goal.summary.progressPercent}% of target`}
                  className="mt-4 h-2.5 overflow-hidden rounded-full bg-[#f3e7dd]"
                  role="img"
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#e93d0d] to-[#ff9a4a]"
                    style={{ width: `${goal.summary.progressPercent}%` }}
                  />
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{goal.summary.progressPercent}%</span>
                  <span>
                    {goal.summary.monthsRemaining
                      ? `${goal.summary.monthsRemaining} months left`
                      : "No deadline"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
