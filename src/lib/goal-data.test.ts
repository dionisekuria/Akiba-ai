import test from "node:test";
import assert from "node:assert/strict";

import { getGoalById } from "./goal-data";

type QueryResult = { data: unknown; error: null };
type RecordedQuery = {
  table: string;
  filters: [column: string, value: unknown][];
};

/**
 * Minimal thenable stand-in for the Supabase query builder. Records every
 * `.eq()` filter so tests can prove userId/goalId land on the right columns.
 */
class FakeQuery implements PromiseLike<QueryResult> {
  readonly filters: [column: string, value: unknown][] = [];

  constructor(private readonly resultData: unknown) {}

  select() {
    return this;
  }

  eq(column: string, value: unknown) {
    this.filters.push([column, value]);
    return this;
  }

  order() {
    return this;
  }

  maybeSingle(): Promise<QueryResult> {
    return Promise.resolve({ data: this.resultData, error: null });
  }

  then<TResult1 = QueryResult, TResult2 = never>(
    onfulfilled?:
      | ((value: QueryResult) => TResult1 | PromiseLike<TResult1>)
      | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): Promise<TResult1 | TResult2> {
    return Promise.resolve({ data: this.resultData, error: null }).then(
      onfulfilled,
      onrejected,
    );
  }
}

function createFakeClient(goalRow: unknown, contributionRows: unknown) {
  const queries: RecordedQuery[] = [];

  const client = {
    from(table: string) {
      const query = new FakeQuery(
        table === "goals" ? goalRow : contributionRows,
      );
      queries.push({ table, filters: query.filters });
      return query;
    },
  };

  return {
    client: client as unknown as Parameters<typeof getGoalById>[0],
    queries,
  };
}

const goalRow = {
  id: "goal-123",
  name: "Emergency fund",
  category: "Emergency",
  target_amount: 60000,
  target_date: null,
  created_at: "2026-10-01T00:00:00.000Z",
};

test("getGoalById filters goals by user_id + id, not swapped", async () => {
  const { client, queries } = createFakeClient(goalRow, [
    { amount: 10000 },
    { amount: 5000 },
  ]);

  const goal = await getGoalById(client, {
    userId: "user-abc",
    goalId: "goal-123",
  });

  assert.equal(goal?.id, "goal-123");
  assert.equal(goal?.savedAmount, 15000);

  const goalsQuery = queries.find((query) => query.table === "goals");
  assert.deepEqual(goalsQuery?.filters, [
    ["user_id", "user-abc"],
    ["id", "goal-123"],
  ]);

  const contributionsQuery = queries.find(
    (query) => query.table === "goal_contributions",
  );
  assert.deepEqual(contributionsQuery?.filters, [
    ["user_id", "user-abc"],
    ["goal_id", "goal-123"],
  ]);
});

test("getGoalById returns null without querying contributions when the goal is missing", async () => {
  const { client, queries } = createFakeClient(null, []);

  const goal = await getGoalById(client, {
    userId: "user-abc",
    goalId: "missing-goal",
  });

  assert.equal(goal, null);
  assert.equal(queries.length, 1);
  assert.equal(queries[0]?.table, "goals");
});
