import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { GoalEditForm } from "@/app/goals/[goalId]/edit/goal-edit-form";
import { getGoalById } from "@/lib/goal-data";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function EditGoalPage({
  params,
}: {
  params: Promise<{ goalId: string }>;
}) {
  const { goalId } = await params;

  if (!isSupabaseConfigured()) {
    redirect("/");
  }

  const supabase = await createSupabaseServerClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims?.sub) {
    redirect("/login");
  }

  const goal = await getGoalById(supabase, claimsData.claims.sub, goalId);

  if (!goal) {
    redirect("/goals");
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl">
        <Link
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          href={`/goals/${goalId}`}
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to goal
        </Link>

        <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-[0_2px_12px_rgba(31,55,42,0.025)] sm:p-8">
          <div className="mb-6">
            <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              Edit goal
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">Update your plan</h1>
          </div>

          <GoalEditForm
            goalId={goalId}
            initialValues={{
              name: goal.name,
              category: goal.category,
              targetAmount: goal.targetAmount,
              targetDate: goal.targetDate,
            }}
          />
        </section>
      </div>
    </main>
  );
}
