import test from "node:test";
import assert from "node:assert/strict";

import { getGoalSummary, validateGoalInput } from "./goals";

test("validateGoalInput accepts a valid goal draft", () => {
  const result = validateGoalInput({
    name: "Emergency fund",
    category: "Emergency",
    targetAmount: "60000",
    targetDate: "2027-06-30",
  });

  assert.equal(result.name, "Emergency fund");
  assert.equal(result.category, "Emergency");
  assert.equal(result.targetAmount, 60000);
  assert.equal(result.targetDate, "2027-06-30");
});

test("validateGoalInput rejects invalid amounts and empty names", () => {
  assert.throws(() => {
    validateGoalInput({
      name: "",
      category: "Emergency",
      targetAmount: "0",
      targetDate: "",
    });
  });
});

test("getGoalSummary reports progress and remaining amount without a target date", () => {
  const summary = getGoalSummary({
    savedAmount: 15000,
    targetAmount: 60000,
    targetDate: null,
  });

  assert.equal(summary.remainingAmount, 45000);
  assert.equal(summary.progressPercent, 25);
  assert.equal(summary.monthsRemaining, null);
  assert.equal(summary.monthlyRequired, null);
  assert.equal(summary.status, "needs-attention");
});

test("getGoalSummary caps progress at 100 and marks an overfunded goal complete", () => {
  const summary = getGoalSummary({
    savedAmount: 75000,
    targetAmount: 60000,
    targetDate: null,
  });

  assert.equal(summary.remainingAmount, 0);
  assert.equal(summary.progressPercent, 100);
  assert.equal(summary.status, "complete");
});

test("getGoalSummary derives a monthly amount from a future target date", () => {
  const now = new Date();
  const future = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 6, 15),
  );
  const targetDate = future.toISOString().slice(0, 10);

  const summary = getGoalSummary({
    savedAmount: 0,
    targetAmount: 60000,
    targetDate,
  });

  assert.ok(summary.monthsRemaining !== null);
  assert.ok(summary.monthsRemaining >= 5 && summary.monthsRemaining <= 7);
  assert.ok(summary.monthlyRequired !== null);
  assert.ok(
    Math.abs(
      summary.monthlyRequired -
        summary.remainingAmount / summary.monthsRemaining,
    ) < 0.001,
  );
  assert.equal(summary.status, "on-track");
});
