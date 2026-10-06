export type GoalInputLike = {
  name?: unknown;
  category?: unknown;
  targetAmount?: unknown;
  targetDate?: unknown;
};

export type GoalDraft = {
  name: string;
  category: string;
  targetAmount: number;
  targetDate: string | null;
};

export type GoalSummary = {
  totalTarget: number;
  savedAmount: number;
  remainingAmount: number;
  progressPercent: number;
  monthsRemaining: number | null;
  monthlyRequired: number | null;
  status: "complete" | "on-track" | "needs-attention";
};

function monthDiff(start: Date, end: Date) {
  return (
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth())
  );
}

export function validateGoalInput(input: GoalInputLike): GoalDraft {
  const name = String(input.name ?? "").trim();
  if (name.length < 1 || name.length > 120) {
    throw new Error("Goal name must be between 1 and 120 characters.");
  }

  const category = String(input.category ?? "").trim();
  if (category.length < 1 || category.length > 80) {
    throw new Error("Choose a category for this goal.");
  }

  const rawAmount = Number(input.targetAmount);
  if (!Number.isFinite(rawAmount) || rawAmount <= 0) {
    throw new Error("Set a target amount greater than zero.");
  }

  const targetDateValue = String(input.targetDate ?? "").trim();
  let targetDate: string | null = null;
  if (targetDateValue) {
    const parsedDate = new Date(`${targetDateValue}T12:00:00Z`);
    if (Number.isNaN(parsedDate.getTime())) {
      throw new Error("Choose a valid target date.");
    }
    targetDate = targetDateValue;
  }

  return {
    name,
    category,
    targetAmount: Number(rawAmount.toFixed(2)),
    targetDate,
  };
}

export function getGoalSummary(input: {
  savedAmount: number;
  targetAmount: number;
  targetDate?: string | null;
}): GoalSummary {
  const savedAmount = Number(input.savedAmount) || 0;
  const totalTarget = Number(input.targetAmount) || 0;
  const remainingAmount = Math.max(totalTarget - savedAmount, 0);
  const progressPercent =
    totalTarget > 0 ? Math.min(100, Math.round((savedAmount / totalTarget) * 100)) : 0;

  let monthsRemaining: number | null = null;
  let monthlyRequired: number | null = null;
  let status: GoalSummary["status"] = "needs-attention";

  if (input.targetDate) {
    const targetDate = new Date(`${input.targetDate}T12:00:00Z`);
    const today = new Date();
    const monthsFromNow = Math.max(1, monthDiff(today, targetDate));
    monthsRemaining = monthsFromNow;
    monthlyRequired = remainingAmount > 0 ? remainingAmount / monthsFromNow : 0;
  }

  if (savedAmount >= totalTarget && totalTarget > 0) {
    status = "complete";
  } else if (monthlyRequired !== null && monthlyRequired > 0) {
    status = "on-track";
  }

  return {
    totalTarget,
    savedAmount,
    remainingAmount,
    progressPercent,
    monthsRemaining,
    monthlyRequired,
    status,
  };
}
