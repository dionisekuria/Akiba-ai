import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Target } from "lucide-react";
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
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              Your goals
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Goal planner</h1>
          </div>
          <Link
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            href="/goals/new"
          >
            <Plus aria-hidden="true" className="size-4" />
            Create Goal
          </Link>
        </header>

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
                className="rounded-2xl border border-border/70 bg-card p-5 shadow-[0_2px_12px_rgba(31,55,42,0.025)] transition-transform hover:-translate-y-0.5"
                href={`/goals/${goal.id}`}
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                    {goal.category}
                  </span>
                  <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-semibold text-primary">
                    {goal.summary.status}
                  </span>
                </div>
                <h2 className="text-xl font-semibold tracking-tight">{goal.name}</h2>
                <p className="mt-4 text-sm text-muted-foreground">
                  KSh {new Intl.NumberFormat("en-KE").format(goal.savedAmount)} / KSh {new Intl.NumberFormat("en-KE").format(goal.targetAmount)}
                </p>
                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
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
