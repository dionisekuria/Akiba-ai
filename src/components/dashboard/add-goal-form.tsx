"use client";

import { Plus } from "lucide-react";
import { useActionState, useState } from "react";
import { createGoal, type GoalActionState } from "@/app/actions/goals";
import { Button } from "@/components/ui/button";

const initialState: GoalActionState = { status: "idle", message: "" };

export function AddGoalForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(
    createGoal,
    initialState,
  );

  return (
    <div className="rounded-[1.5rem] border border-border/70 bg-white p-5 shadow-[0_10px_30px_rgba(70,38,21,0.05)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
            Make a plan
          </p>
          <h3 className="mt-1 text-base font-semibold tracking-tight">
            Add a new goal
          </h3>
        </div>
        <Button
          className="h-10 gap-1.5 rounded-full px-4"
          onClick={() => setIsOpen((current) => !current)}
          type="button"
          variant="outline"
        >
          <Plus aria-hidden="true" className="size-4" />
          {isOpen ? "Close" : "Add"}
        </Button>
      </div>

      {state.message && (
        <p
          aria-live="polite"
          className={`mt-3 rounded-xl px-3 py-2 text-sm leading-5 ${
            state.status === "error"
              ? "bg-destructive/10 text-destructive"
              : "bg-secondary text-primary"
          }`}
          role={state.status === "error" ? "alert" : "status"}
        >
          {state.message}
        </p>
      )}

      {isOpen && (
        <form action={formAction} className="mt-4 space-y-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium" htmlFor="goal-name">
              Goal name
            </label>
            <input
              className="min-h-12 w-full rounded-2xl border border-input bg-background px-4 text-sm outline-none transition-shadow placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30"
              id="goal-name"
              maxLength={120}
              name="name"
              placeholder="Emergency fund"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium" htmlFor="goal-category">
              Category
            </label>
            <input
              className="min-h-12 w-full rounded-2xl border border-input bg-background px-4 text-sm outline-none transition-shadow placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30"
              id="goal-category"
              maxLength={80}
              name="category"
              placeholder="Emergency, Education, Home..."
              required
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label
                className="mb-1.5 block text-sm font-medium"
                htmlFor="goal-targetAmount"
              >
                Target amount
              </label>
              <input
                className="min-h-12 w-full rounded-2xl border border-input bg-background px-4 text-sm outline-none transition-shadow placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30"
                id="goal-targetAmount"
                min="0.01"
                name="targetAmount"
                placeholder="60000"
                required
                step="0.01"
                type="number"
              />
            </div>

            <div>
              <label
                className="mb-1.5 block text-sm font-medium"
                htmlFor="goal-targetDate"
              >
                Target date
              </label>
              <input
                className="min-h-12 w-full rounded-2xl border border-input bg-background px-4 text-sm outline-none transition-shadow placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30"
                id="goal-targetDate"
                name="targetDate"
                type="date"
              />
            </div>
          </div>

          <Button
            className="h-12 w-full rounded-full"
            disabled={isPending}
            type="submit"
          >
            {isPending ? "Saving..." : "Save goal"}
          </Button>
        </form>
      )}
    </div>
  );
}
