import { describe, it, expect, beforeEach, vi } from "vitest";

// The route uses a module-level `inFlight` Map. We must reset modules between
// tests so each test starts with a clean slate (no carryover in-flight counts).
// We also use fake timers to skip the actual sleep delays.

type PostFn = (
  request: Request,
  ctx: { params: Promise<{ workerId: string }> }
) => Promise<Response>;

let POST: PostFn;

beforeEach(async () => {
  vi.useFakeTimers();
  vi.resetModules();
  const mod = await import("@/app/api/lb/worker/[workerId]/route");
  POST = mod.POST as PostFn;
});

afterEach(() => {
  vi.useRealTimers();
});

function makeRequest(body: object): Request {
  return new Request("http://localhost/api/lb/worker/1", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function makeParams(workerId: string) {
  return { params: Promise.resolve({ workerId }) };
}

describe("POST /api/lb/worker/[workerId]", () => {
  it("returns 200 with expected fields for a known task type", async () => {
    const req = makeRequest({ taskId: "task-abc", type: "ping" });
    const promise = POST(req, makeParams("1"));
    await vi.runAllTimersAsync();
    const res = await promise;
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.taskId).toBe("task-abc");
    expect(data.worker).toBe("worker-1");
    expect(typeof data.processingMs).toBe("number");
    expect(typeof data.completedAt).toBe("number");
    expect(typeof data.queueDepth).toBe("number");
  });

  it("returns 200 for an unknown task type (falls back to default range)", async () => {
    const req = makeRequest({ taskId: "task-xyz", type: "unknown_type" });
    const promise = POST(req, makeParams("2"));
    await vi.runAllTimersAsync();
    const res = await promise;
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.worker).toBe("worker-2");
  });

  it("returns 503 when a worker has MAX_IN_FLIGHT (4) tasks already in flight", async () => {
    // Fire 4 tasks concurrently to saturate the worker — do NOT advance timers yet
    const inflight = [
      POST(makeRequest({ taskId: "t1", type: "ping" }), makeParams("3")),
      POST(makeRequest({ taskId: "t2", type: "ping" }), makeParams("3")),
      POST(makeRequest({ taskId: "t3", type: "ping" }), makeParams("3")),
      POST(makeRequest({ taskId: "t4", type: "ping" }), makeParams("3")),
    ];

    // 5th request arrives before any of the 4 complete → should be rejected
    const overloadReq = makeRequest({ taskId: "t5", type: "ping" });
    const overloadPromise = POST(overloadReq, makeParams("3"));

    // Resolve the overload check (it's synchronous up to the capacity check)
    await vi.runAllTimersAsync();
    const overloadRes = await overloadPromise;
    expect(overloadRes.status).toBe(503);
    const overloadData = await overloadRes.json();
    expect(overloadData.error).toBe("overloaded");
    expect(overloadData.worker).toBe("worker-3");
    expect(overloadData.taskId).toBe("t5");

    // Clean up the in-flight tasks
    await Promise.all(inflight);
  });

  it("allows a new task once previous tasks complete", async () => {
    // Fill up the worker
    const inflight = [
      POST(makeRequest({ taskId: "a1", type: "ping" }), makeParams("1")),
      POST(makeRequest({ taskId: "a2", type: "ping" }), makeParams("1")),
      POST(makeRequest({ taskId: "a3", type: "ping" }), makeParams("1")),
      POST(makeRequest({ taskId: "a4", type: "ping" }), makeParams("1")),
    ];

    // Complete them all
    await vi.runAllTimersAsync();
    await Promise.all(inflight);

    // Now a new task should succeed
    const req = makeRequest({ taskId: "a5", type: "ping" });
    const promise = POST(req, makeParams("1"));
    await vi.runAllTimersAsync();
    const res = await promise;
    expect(res.status).toBe(200);
  });

  it("each worker maintains its own in-flight count independently", async () => {
    // Saturate worker-1 (4 tasks)
    const w1tasks = [
      POST(makeRequest({ taskId: "w1t1", type: "ping" }), makeParams("1")),
      POST(makeRequest({ taskId: "w1t2", type: "ping" }), makeParams("1")),
      POST(makeRequest({ taskId: "w1t3", type: "ping" }), makeParams("1")),
      POST(makeRequest({ taskId: "w1t4", type: "ping" }), makeParams("1")),
    ];

    // worker-2 should still accept tasks
    const w2req = makeRequest({ taskId: "w2t1", type: "ping" });
    const w2promise = POST(w2req, makeParams("2"));
    await vi.runAllTimersAsync();
    const w2res = await w2promise;
    expect(w2res.status).toBe(200);

    await Promise.all(w1tasks);
  });
});
