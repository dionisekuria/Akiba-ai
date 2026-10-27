import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Pencil, Trash2 } from "lucide-react";
import { addContribution, archiveGoal } from "@/app/actions/goals-management";
import { AkibaWordmark } from "@/components/brand/akiba-visuals";
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
    <main className="min-h-screen bg-background px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-7 flex items-center justify-between gap-4">
          <Link
            aria-label="Akiba AI overview"
            className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            href="/"
          >
            <AkibaWordmark />
          </Link>
          <Link
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border bg-white px-4 text-xs font-semibold transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            href="/goals"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            All goals
          </Link>
        </header>

        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            className="inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-sm text-muted-foreground transition-colors hover:bg-white hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            href="/goals"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back to goals
          </Link>

          <div className="flex gap-2">
            <Button asChild variant="outline" className="h-10 gap-2 rounded-full px-4">
              <Link href={`/goals/${goalId}/edit`}>
                <Pencil aria-hidden="true" className="size-4" />
                Edit
              </Link>
            </Button>
            <form action={() => archiveGoal(goalId)}>
              <Button type="submit" variant="destructive" className="h-10 gap-2 rounded-full px-4">
                <Trash2 aria-hidden="true" className="size-4" />
                Delete
              </Button>
            </form>
          </div>
        </div>

        <section className="rounded-[2rem] border border-border/70 bg-white p-5 shadow-[0_16px_50px_rgba(70,38,21,0.07)] sm:p-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold tracking-[0.16em] text-primary uppercase">
                {goal.category}
              </p>
              <h1 className="mt-2 break-words text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">{goal.name}</h1>
            </div>
            <span className="inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary">
              {goal.summary.status}
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="min-w-0 rounded-[1.4rem] bg-[#21130e] p-4 text-white sm:p-5">
              <p className="text-sm text-white/80">Saved</p>
              <p className="mt-2 break-all text-2xl font-semibold">KSh {new Intl.NumberFormat("en-KE").format(goal.savedAmount)}</p>
            </div>
            <div className="min-w-0 rounded-[1.4rem] bg-[#f9e3d3] p-4 sm:p-5">
              <p className="text-sm text-muted-foreground">Target</p>
              <p className="mt-2 break-all text-2xl font-semibold">KSh {new Intl.NumberFormat("en-KE").format(goal.targetAmount)}</p>
            </div>
            <div className="rounded-[1.4rem] bg-[#f7eee7] p-4 sm:p-5">
              <p className="text-sm text-muted-foreground">Progress</p>
              <p className="mt-2 text-2xl font-semibold">{goal.summary.progressPercent}%</p>
            </div>
          </div>

          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Progress</h2>
              <span className="text-sm text-muted-foreground">
                {goal.summary.monthsRemaining
                  ? `${goal.summary.monthsRemaining} months left`
                  : "No deadline"}
              </span>
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
          }} className="mt-8 rounded-[1.6rem] border border-border/70 bg-[#faf2eb] p-4 sm:p-5">
            <h3 className="text-lg font-semibold">Add contribution</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1.25fr_auto]">
              <input
                name="amount"
                type="number"
                min="1"
                step="0.01"
                placeholder="Amount"
                className="min-h-12 min-w-0 rounded-2xl border border-input bg-white px-4 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30"
                required
              />
              <input
                name="note"
                placeholder="Optional note"
                className="min-h-12 min-w-0 rounded-2xl border border-input bg-white px-4 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30"
              />
              <Button type="submit" className="h-12 gap-2 rounded-full px-5">
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
