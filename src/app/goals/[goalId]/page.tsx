import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Pencil, Trash2 } from "lucide-react";
import { addContribution, archiveGoal } from "@/app/actions/goals-management";
import { Button } from "@/components/ui/button";
import { getGoalById } from "@/lib/goal-data";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function GoalDetailPage({ params }: { params: Promise<{ goalId: string }> }) {
  const { goalId } = await params;

  if (!isSupabaseConfigured()) {
    redirect("/");
  }

  const supabase = await createSupabaseServerClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims?.sub) {
    redirect("/login");
  }

  const goal = await getGoalById(supabase, {
    userId: claimsData.claims.sub,
    goalId,
  });

  if (!goal) {
    redirect("/goals");
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            href="/goals"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back to goals
          </Link>

          <div className="flex gap-2">
            <Button asChild variant="outline" className="gap-2">
              <Link href={`/goals/${goalId}/edit`}>
                <Pencil aria-hidden="true" className="size-4" />
                Edit
              </Link>
            </Button>
            <form action={() => archiveGoal(goalId)}>
              <Button type="submit" variant="destructive" className="gap-2">
                <Trash2 aria-hidden="true" className="size-4" />
                Delete
              </Button>
            </form>
          </div>
        </div>

        <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-[0_2px_12px_rgba(31,55,42,0.025)] sm:p-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                {goal.category}
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">{goal.name}</h1>
            </div>
            <span className="inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary">
              {goal.summary.status}
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-muted/70 p-4">
              <p className="text-sm text-muted-foreground">Saved</p>
              <p className="mt-2 text-2xl font-semibold">KSh {new Intl.NumberFormat("en-KE").format(goal.savedAmount)}</p>
            </div>
            <div className="rounded-2xl bg-muted/70 p-4">
              <p className="text-sm text-muted-foreground">Target</p>
              <p className="mt-2 text-2xl font-semibold">KSh {new Intl.NumberFormat("en-KE").format(goal.targetAmount)}</p>
            </div>
            <div className="rounded-2xl bg-muted/70 p-4">
              <p className="text-sm text-muted-foreground">Progress</p>
              <p className="mt-2 text-2xl font-semibold">{goal.summary.progressPercent}%</p>
            </div>
          </div>

          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Progress</h2>
              <span className="text-sm text-muted-foreground">{goal.summary.monthsRemaining ?? 0} months left</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${Math.min(goal.summary.progressPercent, 100)}%` }}
              />
            </div>
          </div>

          <form action={async (formData: FormData) => {
            "use server";
            const amount = Number(formData.get("amount"));
            await addContribution(goalId, amount, String(formData.get("note") ?? ""));
          }} className="mt-8 rounded-2xl border border-border/70 bg-muted/30 p-4">
            <h3 className="text-lg font-semibold">Add contribution</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1.25fr_auto]">
              <input
                name="amount"
                type="number"
                min="1"
                step="0.01"
                placeholder="Amount"
                className="min-h-11 rounded-xl border border-input bg-background px-3 text-sm"
                required
              />
              <input
                name="note"
                placeholder="Optional note"
                className="min-h-11 rounded-xl border border-input bg-background px-3 text-sm"
              />
              <Button type="submit" className="gap-2">
                <ArrowUpRight aria-hidden="true" className="size-4" />
                Save
              </Button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
