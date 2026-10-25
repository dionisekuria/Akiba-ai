import type { Database } from "@/lib/supabase/database.types";
import type { createSupabaseServerClient } from "@/lib/supabase/server";
import { getGoalSummary, type GoalSummary } from "@/lib/goals";

type SupabaseServerClient = Awaited<
  ReturnType<typeof createSupabaseServerClient>
>;

type ContributionRow = Database["public"]["Tables"]["goal_contributions"]["Row"];

export type GoalRecord = {
  id: string;
  name: string;
  category: string;
  targetAmount: number;
  savedAmount: number;
  targetDate: string | null;
  createdAt: string;
  summary: GoalSummary;
};

export async function getGoalsForUser(
  supabase: SupabaseServerClient,
  userId: string,
): Promise<GoalRecord[]> {
  const { data: goals, error: goalsError } = await supabase
    .from("goals")
    .select("id, name, category, target_amount, target_date, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (goalsError || !goals) {
    return [];
  }

  const goalIds = goals.map((goal) => goal.id);
  const { data: contributions, error: contributionsError } = goalIds.length
    ? await supabase
        .from("goal_contributions")
        .select("goal_id, amount")
        .eq("user_id", userId)
        .in("goal_id", goalIds)
    : { data: [] as ContributionRow[], error: null };

  if (contributionsError) {
    return [];
  }

  const savedByGoal = new Map<string, number>();
  for (const contribution of contributions ?? []) {
    savedByGoal.set(
      contribution.goal_id,
      (savedByGoal.get(contribution.goal_id) ?? 0) + contribution.amount,
    );
  }

  return goals.map((goal) => {
    const savedAmount = savedByGoal.get(goal.id) ?? 0;
    const summary = getGoalSummary({
      savedAmount,
      targetAmount: goal.target_amount,
      targetDate: goal.target_date,
    });

    return {
      id: goal.id,
      name: goal.name,
      category: goal.category,
      targetAmount: goal.target_amount,
      savedAmount,
      targetDate: goal.target_date,
      createdAt: goal.created_at,
      summary,
    };
  });
}

export async function getGoalById(
  supabase: SupabaseServerClient,
  { userId, goalId }: { userId: string; goalId: string },
): Promise<GoalRecord | null> {
  const { data: goal, error: goalError } = await supabase
    .from("goals")
    .select("id, name, category, target_amount, target_date, created_at")
    .eq("user_id", userId)
    .eq("id", goalId)
    .maybeSingle();

  if (goalError || !goal) {
    return null;
  }

  const { data: contributions, error: contributionsError } = await supabase
    .from("goal_contributions")
    .select("id, goal_id, amount, noted_on, note, created_at")
    .eq("user_id", userId)
    .eq("goal_id", goalId)
    .order("noted_on", { ascending: false });

  if (contributionsError) {
    return null;
  }

  const savedAmount = (contributions ?? []).reduce(
    (sum, contribution) => sum + contribution.amount,
    0,
  );
  const summary = getGoalSummary({
    savedAmount,
    targetAmount: goal.target_amount,
    targetDate: goal.target_date,
  });

  return {
    id: goal.id,
    name: goal.name,
    category: goal.category,
    targetAmount: goal.target_amount,
    savedAmount,
    targetDate: goal.target_date,
    createdAt: goal.created_at,
    summary,
  };
}
