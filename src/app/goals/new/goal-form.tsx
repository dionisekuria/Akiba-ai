"use client";

import { useActionState } from "react";
import { createGoal, type GoalActionState } from "@/app/actions/goals";
import { Button } from "@/components/ui/button";

const initialState: GoalActionState = { status: "idle", message: "" };

export function NewGoalForm() {
  const [state, formAction, isPending] = useActionState(createGoal, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {state.message ? (
        <p
          aria-live="polite"
          className={`rounded-2xl px-4 py-3 text-sm leading-5 ${
            state.status === "error"
              ? "bg-destructive/10 text-destructive"
              : "bg-secondary text-primary"
          }`}
          role={state.status === "error" ? "alert" : "status"}
        >
          {state.message}
        </p>
      ) : null}

      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium">Goal name</label>
        <input
          id="name"
          name="name"
          placeholder="Emergency fund"
          className="min-h-12 w-full rounded-2xl border border-input bg-white px-4 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30"
          required
        />
      </div>

      <div>
        <label htmlFor="category" className="mb-1.5 block text-sm font-medium">Category</label>
        <input
          id="category"
          name="category"
          placeholder="Emergency, Education, Home..."
          className="min-h-12 w-full rounded-2xl border border-input bg-white px-4 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30"
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="targetAmount" className="mb-1.5 block text-sm font-medium">Target amount</label>
          <input
            id="targetAmount"
            name="targetAmount"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="60000"
            className="min-h-12 w-full rounded-2xl border border-input bg-white px-4 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30"
            required
          />
        </div>

        <div>
          <label htmlFor="targetDate" className="mb-1.5 block text-sm font-medium">Target date</label>
          <input
            id="targetDate"
            name="targetDate"
            type="date"
            className="min-h-12 w-full rounded-2xl border border-input bg-white px-4 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30"
          />
        </div>
      </div>

      <Button className="h-12 w-full rounded-full" disabled={isPending} type="submit">
        {isPending ? "Saving..." : "Save goal"}
      </Button>
    </form>
  );
}
