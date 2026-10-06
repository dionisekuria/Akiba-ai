import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { NewGoalForm } from "@/app/goals/new/goal-form";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function NewGoalPage() {
  if (!isSupabaseConfigured()) {
    redirect("/");
  }

  const supabase = await createSupabaseServerClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims?.sub) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl">
        <Link
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          href="/goals"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to goals
        </Link>

        <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-[0_2px_12px_rgba(31,55,42,0.025)] sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-secondary text-primary">
              <Plus aria-hidden="true" className="size-5" />
            </span>
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                New goal
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight">Create a plan</h1>
            </div>
          </div>

          <NewGoalForm />
        </section>
      </div>
    </main>
  );
}
