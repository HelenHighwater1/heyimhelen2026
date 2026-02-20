import { describe, it, expect } from "vitest";
import { selectWorker } from "@/components/LoadBalancerOverlay";

const WORKER_IDS = ["1", "2", "3"];

describe("selectWorker — round-robin", () => {
  it("maps index 0 to worker-1", () => {
    expect(selectWorker("round-robin", 0, {})).toBe("1");
  });

  it("maps index 1 to worker-2", () => {
    expect(selectWorker("round-robin", 1, {})).toBe("2");
  });

  it("maps index 2 to worker-3", () => {
    expect(selectWorker("round-robin", 2, {})).toBe("3");
  });

  it("wraps back to worker-1 at index 3", () => {
    expect(selectWorker("round-robin", 3, {})).toBe("1");
  });

  it("wraps correctly for large indices", () => {
    expect(selectWorker("round-robin", 9, {})).toBe("1");
    expect(selectWorker("round-robin", 10, {})).toBe("2");
  });
});

describe("selectWorker — least-connections", () => {
  it("picks the worker with zero in-flight when all are idle", () => {
    const result = selectWorker("least-connections", 0, { "1": 0, "2": 0, "3": 0 });
    expect(WORKER_IDS).toContain(result);
  });

  it("picks the worker with fewest in-flight tasks", () => {
    expect(selectWorker("least-connections", 0, { "1": 3, "2": 1, "3": 2 })).toBe("2");
  });

  it("picks worker-3 when it has the least connections", () => {
    expect(selectWorker("least-connections", 0, { "1": 5, "2": 4, "3": 0 })).toBe("3");
  });

  it("ignores the rrIndex parameter", () => {
    expect(selectWorker("least-connections", 99, { "1": 2, "2": 0, "3": 5 })).toBe("2");
  });
});

describe("selectWorker — weighted", () => {
  it("routes the first 3 out of 6 positions to worker-1 (weight 3)", () => {
    expect(selectWorker("weighted", 0, {})).toBe("1");
    expect(selectWorker("weighted", 1, {})).toBe("1");
    expect(selectWorker("weighted", 2, {})).toBe("1");
  });

  it("routes positions 3–4 to worker-2 (weight 2)", () => {
    expect(selectWorker("weighted", 3, {})).toBe("2");
    expect(selectWorker("weighted", 4, {})).toBe("2");
  });

  it("routes position 5 to worker-3 (weight 1)", () => {
    expect(selectWorker("weighted", 5, {})).toBe("3");
  });

  it("wraps correctly after a full cycle of 6", () => {
    expect(selectWorker("weighted", 6, {})).toBe("1");
    expect(selectWorker("weighted", 9, {})).toBe("2");
    expect(selectWorker("weighted", 11, {})).toBe("3");
  });
});
