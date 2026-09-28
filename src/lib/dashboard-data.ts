import type { Database } from "@/lib/supabase/database.types";
import type { createSupabaseServerClient } from "@/lib/supabase/server";

type SupabaseServerClient = Awaited<
  ReturnType<typeof createSupabaseServerClient>
>;
type GoalRow = Database["public"]["Tables"]["goals"]["Row"];

export type GoalSnapshot = {
  id: string;
  name: string;
  category: string;
  targetAmount: number;
  savedAmount: number;
  targetDate: string | null;
};

export type DashboardData =
  | {
      status: "ready";
      displayName: string;
      goals: GoalSnapshot[];
    }
  | {
      status: "error";
      displayName: string;
      goals: [];
    };

export async function getDashboardData(
  supabase: SupabaseServerClient,
  userId: string,
  email: string | null,
): Promise<DashboardData> {
  const [profileResult, goalsResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("display_name")
      .eq("id", userId)
      .maybeSingle(),
    supabase
      .from("goals")
      .select("id, name, category, target_amount, target_date")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
  ]);

  const fallbackName = email?.split("@")[0]?.trim() || "there";
  const displayName = profileResult.data?.display_name?.trim() || fallbackName;

  if (profileResult.error || goalsResult.error) {
    return { status: "error", displayName, goals: [] };
  }

  const goalRows: Pick<
    GoalRow,
    "id" | "name" | "category" | "target_amount" | "target_date"
  >[] = goalsResult.data;

  if (goalRows.length === 0) {
    return { status: "ready", displayName, goals: [] };
  }

  const goalIds = goalRows.map((goal) => goal.id);
  const { data: contributionRows, error: contributionsError } = await supabase
    .from("goal_contributions")
    .select("goal_id, amount")
    .eq("user_id", userId)
    .in("goal_id", goalIds);

  if (contributionsError) {
    return { status: "error", displayName, goals: [] };
  }

  const savedByGoal = new Map<string, number>();
  for (const contribution of contributionRows) {
    savedByGoal.set(
      contribution.goal_id,
      (savedByGoal.get(contribution.goal_id) ?? 0) + contribution.amount,
    );
  }

  return {
    status: "ready",
    displayName,
    goals: goalRows.map((goal) => ({
      id: goal.id,
      name: goal.name,
      category: goal.category,
      targetAmount: goal.target_amount,
      savedAmount: savedByGoal.get(goal.id) ?? 0,
      targetDate: goal.target_date,
    })),
  };
}
