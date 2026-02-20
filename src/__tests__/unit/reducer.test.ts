import { describe, it, expect } from "vitest";
import { reducer } from "@/components/LoadBalancerOverlay";
import type { State, Task, LogEntry } from "@/components/LoadBalancerOverlay";

const emptyState: State = {
  tasks: [],
  algorithm: "round-robin",
  rrIndex: 0,
  log: [],
};

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: "task-1",
    type: "ping",
    label: "ping",
    workerId: "1",
    status: "pending",
    submittedAt: 1000,
    ...overrides,
  };
}

function makeLog(overrides: Partial<LogEntry> = {}): LogEntry {
  return {
    id: "log-1",
    text: "test entry",
    timestamp: 1000,
    ok: true,
    ...overrides,
  };
}

describe("reducer — DISPATCH", () => {
  it("appends the task to an empty task list", () => {
    const task = makeTask();
    const next = reducer(emptyState, { type: "DISPATCH", task });
    expect(next.tasks).toHaveLength(1);
    expect(next.tasks[0]).toEqual(task);
  });

  it("appends to an existing task list without mutating other state", () => {
    const existing = makeTask({ id: "existing" });
    const state: State = { ...emptyState, tasks: [existing] };
    const newTask = makeTask({ id: "new" });
    const next = reducer(state, { type: "DISPATCH", task: newTask });
    expect(next.tasks).toHaveLength(2);
    expect(next.tasks[1].id).toBe("new");
    expect(next.algorithm).toBe("round-robin");
  });
});

describe("reducer — COMPLETE", () => {
  it("sets the matching task to done with processingMs and completedAt", () => {
    const task = makeTask({ id: "t1" });
    const state: State = { ...emptyState, tasks: [task] };
    const next = reducer(state, {
      type: "COMPLETE",
      taskId: "t1",
      processingMs: 250,
      completedAt: 2000,
      queueDepth: 0,
      worker: "worker-1",
    });
    expect(next.tasks[0].status).toBe("done");
    expect(next.tasks[0].processingMs).toBe(250);
    expect(next.tasks[0].completedAt).toBe(2000);
  });

  it("does not modify other tasks", () => {
    const t1 = makeTask({ id: "t1" });
    const t2 = makeTask({ id: "t2" });
    const state: State = { ...emptyState, tasks: [t1, t2] };
    const next = reducer(state, {
      type: "COMPLETE",
      taskId: "t1",
      processingMs: 100,
      completedAt: 1500,
      queueDepth: 0,
      worker: "worker-1",
    });
    expect(next.tasks[1].status).toBe("pending");
  });
});

describe("reducer — FAIL", () => {
  it("marks the matching task as error", () => {
    const task = makeTask({ id: "t1" });
    const state: State = { ...emptyState, tasks: [task] };
    const next = reducer(state, { type: "FAIL", taskId: "t1", reason: "overloaded" });
    expect(next.tasks[0].status).toBe("error");
  });

  it("does not affect tasks with different ids", () => {
    const t1 = makeTask({ id: "t1" });
    const t2 = makeTask({ id: "t2" });
    const state: State = { ...emptyState, tasks: [t1, t2] };
    const next = reducer(state, { type: "FAIL", taskId: "t1", reason: "overloaded" });
    expect(next.tasks[1].status).toBe("pending");
  });
});

describe("reducer — RETRY", () => {
  it("removes the old task and appends the new one", () => {
    const oldTask = makeTask({ id: "old", status: "error" });
    const newTask = makeTask({ id: "new", workerId: "2", status: "pending", retried: true });
    const state: State = { ...emptyState, tasks: [oldTask] };
    const next = reducer(state, { type: "RETRY", oldTaskId: "old", newTask });
    expect(next.tasks).toHaveLength(1);
    expect(next.tasks[0].id).toBe("new");
    expect(next.tasks[0].retried).toBe(true);
  });

  it("preserves other tasks while retrying", () => {
    const other = makeTask({ id: "other" });
    const oldTask = makeTask({ id: "old" });
    const newTask = makeTask({ id: "new" });
    const state: State = { ...emptyState, tasks: [other, oldTask] };
    const next = reducer(state, { type: "RETRY", oldTaskId: "old", newTask });
    expect(next.tasks).toHaveLength(2);
    expect(next.tasks.find((t) => t.id === "other")).toBeDefined();
    expect(next.tasks.find((t) => t.id === "old")).toBeUndefined();
  });
});

describe("reducer — SET_ALGORITHM", () => {
  it("updates the algorithm and resets rrIndex to 0", () => {
    const state: State = { ...emptyState, algorithm: "round-robin", rrIndex: 5 };
    const next = reducer(state, { type: "SET_ALGORITHM", algorithm: "weighted" });
    expect(next.algorithm).toBe("weighted");
    expect(next.rrIndex).toBe(0);
  });
});

describe("reducer — INC_RR", () => {
  it("increments rrIndex by 1", () => {
    const state: State = { ...emptyState, rrIndex: 2 };
    const next = reducer(state, { type: "INC_RR" });
    expect(next.rrIndex).toBe(3);
  });
});

describe("reducer — LOG", () => {
  it("prepends the new entry to the log", () => {
    const existing = makeLog({ id: "old" });
    const state: State = { ...emptyState, log: [existing] };
    const newEntry = makeLog({ id: "new", text: "new entry" });
    const next = reducer(state, { type: "LOG", entry: newEntry });
    expect(next.log[0].id).toBe("new");
    expect(next.log[1].id).toBe("old");
  });

  it("caps the log at 50 entries", () => {
    const entries: LogEntry[] = Array.from({ length: 50 }, (_, i) =>
      makeLog({ id: `entry-${i}` })
    );
    const state: State = { ...emptyState, log: entries };
    const overflow = makeLog({ id: "overflow" });
    const next = reducer(state, { type: "LOG", entry: overflow });
    expect(next.log).toHaveLength(50);
    expect(next.log[0].id).toBe("overflow");
    expect(next.log[49].id).toBe("entry-48");
  });
});

describe("reducer — CLEAR_LOG", () => {
  it("empties the log array", () => {
    const state: State = {
      ...emptyState,
      log: [makeLog(), makeLog({ id: "log-2" })],
    };
    const next = reducer(state, { type: "CLEAR_LOG" });
    expect(next.log).toHaveLength(0);
  });
});
