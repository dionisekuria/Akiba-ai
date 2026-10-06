import test from "node:test";
import assert from "node:assert/strict";

import { validateGoalInput } from "./goals";

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
