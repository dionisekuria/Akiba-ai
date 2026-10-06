"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { validateGoalInput } from "@/lib/goals";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type GoalManagementActionState = {
  status: "idle" | "error" | "success";
  message: string;
};

export async function updateGoal(
  goalId: string,
  _previousState: GoalManagementActionState,
  formData: FormData,
): Promise<GoalManagementActionState> {
  try {
    if (!isSupabaseConfigured()) {
      return { status: "error", message: "Connect Supabase before updating goals." };
    }

    const supabase = await createSupabaseServerClient();
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();

    if (claimsError || !claimsData?.claims?.sub) {
      return { status: "error", message: "Please sign in to update a goal." };
    }

    const goal = validateGoalInput({
      name: formData.get("name"),
      category: formData.get("category"),
      targetAmount: formData.get("targetAmount"),
      targetDate: formData.get("targetDate"),
    });

    const { error } = await supabase
      .from("goals")
      .update({
        name: goal.name,
        category: goal.category,
        target_amount: goal.targetAmount,
        target_date: goal.targetDate,
      })
      .eq("id", goalId)
      .eq("user_id", claimsData.claims.sub);

    if (error) {
      return { status: "error", message: "We could not update this goal." };
    }

    revalidatePath("/");
    revalidatePath(`/goals/${goalId}`);

    return {
      status: "success",
      message: `"${goal.name}" updated successfully.`,
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "We could not update this goal.",
    };
  }
}

export async function archiveGoal(goalId: string) {
  if (!isSupabaseConfigured()) {
    throw new Error("Connect Supabase before updating goals.");
  }

  const supabase = await createSupabaseServerClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  if (claimsError || !claimsData?.claims?.sub) {
    throw new Error("Please sign in to manage goals.");
  }

  const { error } = await supabase
    .from("goals")
    .delete()
    .eq("id", goalId)
    .eq("user_id", claimsData.claims.sub);

  if (error) {
    throw new Error("We could not archive this goal.");
  }

  revalidatePath("/");
  revalidatePath("/goals");
  redirect("/goals");
}

export async function addContribution(
  goalId: string,
  amount: number,
  note?: string,
) {
  if (!isSupabaseConfigured()) {
    throw new Error("Connect Supabase before adding contributions.");
  }

  const value = Number(amount);
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error("Contribution amount must be greater than zero.");
  }

  const supabase = await createSupabaseServerClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  if (claimsError || !claimsData?.claims?.sub) {
    throw new Error("Please sign in to add a contribution.");
  }

  const { error } = await supabase.from("goal_contributions").insert({
    user_id: claimsData.claims.sub,
    goal_id: goalId,
    amount: value,
    note: note?.trim() || null,
    noted_on: new Date().toISOString().slice(0, 10),
  });

  if (error) {
    throw new Error("We could not add that contribution.");
  }

  revalidatePath("/");
  revalidatePath(`/goals/${goalId}`);
}
