"use server";

import { revalidatePath } from "next/cache";
import { validateGoalInput } from "@/lib/goals";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type GoalActionState = {
  status: "idle" | "error" | "success";
  message: string;
};

export async function createGoal(
  _previousState: GoalActionState,
  formData: FormData,
): Promise<GoalActionState> {
  try {
    const goal = validateGoalInput({
      name: formData.get("name"),
      category: formData.get("category"),
      targetAmount: formData.get("targetAmount"),
      targetDate: formData.get("targetDate"),
    });

    if (!isSupabaseConfigured()) {
      return {
        status: "error",
        message: "Connect Supabase before adding goals.",
      };
    }

    const supabase = await createSupabaseServerClient();
    const { data, error: claimsError } = await supabase.auth.getClaims();

    if (claimsError || !data?.claims?.sub) {
      return {
        status: "error",
        message: "Please sign in to add a goal.",
      };
    }

    const { error } = await supabase.from("goals").insert({
      user_id: data.claims.sub,
      name: goal.name,
      category: goal.category,
      target_amount: goal.targetAmount,
      target_date: goal.targetDate,
    });

    if (error) {
      return {
        status: "error",
        message: "We couldn't save that goal. Please try again.",
      };
    }

    revalidatePath("/");

    return {
      status: "success",
      message: `"${goal.name}" is now in your plan.`,
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "We couldn't save that goal. Please try again.",
    };
  }
}
