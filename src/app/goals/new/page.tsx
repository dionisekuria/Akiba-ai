import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { NewGoalForm } from "@/app/goals/new/goal-form";
import { AkibaWordmark } from "@/components/brand/akiba-visuals";
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
    <main className="min-h-screen bg-background px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-xl">
        <header className="mb-8 flex items-center justify-between gap-4">
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
        <Link
          className="mb-6 inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-sm text-muted-foreground transition-colors hover:bg-white hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          href="/goals"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to goals
        </Link>

        <section className="rounded-[2rem] border border-border/70 bg-white p-5 shadow-[0_16px_50px_rgba(70,38,21,0.07)] sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-secondary text-primary">
              <Plus aria-hidden="true" className="size-5" />
            </span>
            <div>
              <p className="text-xs font-bold tracking-[0.16em] text-primary uppercase">
                New goal
              </p>
              <h1 className="mt-1 text-3xl font-semibold tracking-[-0.05em]">Create a plan</h1>
            </div>
          </div>

          <NewGoalForm />
        </section>
      </div>
    </main>
  );
}
