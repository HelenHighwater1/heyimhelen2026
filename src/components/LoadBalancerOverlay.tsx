"use client";

import { useReducer, useCallback, useRef, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type TaskType =
  | "ping"
  | "image_resize"
  | "ml_inference"
  | "batch_export"
  | "db_migration";

type Algorithm = "round-robin" | "least-connections" | "weighted";

type TaskStatus = "pending" | "done" | "error";

interface Task {
  id: string;
  type: TaskType;
  label: string;
  workerId: string;
  status: TaskStatus;
  submittedAt: number;
  completedAt?: number;
  processingMs?: number;
  retried?: boolean;
}

interface LogEntry {
  id: string;
  text: string;
  timestamp: number;
  ok: boolean;
}

interface State {
  tasks: Task[];
  algorithm: Algorithm;
  rrIndex: number;
  log: LogEntry[];
}

type Action =
  | { type: "DISPATCH"; task: Task }
  | { type: "COMPLETE"; taskId: string; processingMs: number; completedAt: number; queueDepth: number; worker: string }
  | { type: "FAIL"; taskId: string; reason: string }
  | { type: "RETRY"; oldTaskId: string; newTask: Task }
  | { type: "SET_ALGORITHM"; algorithm: Algorithm }
  | { type: "INC_RR" }
  | { type: "LOG"; entry: LogEntry }
  | { type: "CLEAR_LOG" };

// ─── Constants ────────────────────────────────────────────────────────────────

const WORKER_IDS = ["1", "2", "3"];
const WEIGHTS = [3, 2, 1];

const TASK_DEFS: { type: TaskType; label: string; complexity: string; hint: string }[] = [
  { type: "ping", label: "ping", complexity: "trivial", hint: "~200ms" },
  { type: "image_resize", label: "image resize", complexity: "medium", hint: "~1–2s" },
  { type: "ml_inference", label: "ml inference", complexity: "heavy", hint: "~3–5s" },
  { type: "batch_export", label: "batch export", complexity: "heavy", hint: "~6–9s" },
  { type: "db_migration", label: "db migration", complexity: "unpredictable", hint: "~0.5–8s · unpredictable" },
];

const ALGO_LABELS: Record<Algorithm, string> = {
  "round-robin": "round robin",
  "least-connections": "least connections",
  weighted: "weighted",
};

const ALGO_DESCRIPTIONS: Record<Algorithm, string> = {
  "round-robin": "cycles through workers in order",
  "least-connections": "always picks the least-busy worker (what nginx uses)",
  weighted: "worker-1 gets 3x traffic, worker-2 gets 2x, worker-3 gets 1x",
};

// ─── Reducer ──────────────────────────────────────────────────────────────────

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "DISPATCH":
      return { ...state, tasks: [...state.tasks, action.task] };

    case "COMPLETE":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.taskId
            ? { ...t, status: "done", completedAt: action.completedAt, processingMs: action.processingMs }
            : t
        ),
      };

    case "FAIL":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.taskId ? { ...t, status: "error" } : t
        ),
      };

    case "RETRY":
      return {
        ...state,
        tasks: [
          ...state.tasks.filter((t) => t.id !== action.oldTaskId),
          action.newTask,
        ],
      };

    case "SET_ALGORITHM":
      return { ...state, algorithm: action.algorithm, rrIndex: 0 };

    case "INC_RR":
      return { ...state, rrIndex: state.rrIndex + 1 };

    case "LOG":
      return { ...state, log: [action.entry, ...state.log].slice(0, 50) };

    case "CLEAR_LOG":
      return { ...state, log: [] };

    default:
      return state;
  }
}

// ─── Load balancer logic ──────────────────────────────────────────────────────

function selectWorker(
  algorithm: Algorithm,
  rrIndex: number,
  inFlight: Record<string, number>
): string {
  if (algorithm === "round-robin") {
    return WORKER_IDS[rrIndex % WORKER_IDS.length];
  }
  if (algorithm === "least-connections") {
    let minId = WORKER_IDS[0];
    let minCount = inFlight[WORKER_IDS[0]] ?? 0;
    for (const id of WORKER_IDS) {
      const count = inFlight[id] ?? 0;
      if (count < minCount) { minCount = count; minId = id; }
    }
    return minId;
  }
  // weighted round-robin
  const totalWeight = WEIGHTS.reduce((a, b) => a + b, 0);
  const pos = rrIndex % totalWeight;
  let acc = 0;
  for (let i = 0; i < WEIGHTS.length; i++) {
    acc += WEIGHTS[i];
    if (pos < acc) return WORKER_IDS[i];
  }
  return WORKER_IDS[0];
}

function pickFallbackWorker(excluding: string): string {
  const others = WORKER_IDS.filter((id) => id !== excluding);
  return others[Math.floor(Math.random() * others.length)];
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  onClose: () => void;
}

export function LoadBalancerOverlay({ onClose }: Props) {
  const [state, dispatch] = useReducer(reducer, {
    tasks: [],
    algorithm: "round-robin",
    rrIndex: 0,
    log: [],
  });

  // Track in-flight counts independently of render cycle for routing decisions
  const inFlightRef = useRef<Record<string, number>>({ "1": 0, "2": 0, "3": 0 });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Keep a ref to current state values we need inside async callbacks
  const stateRef = useRef(state);
  stateRef.current = state;

  const doFetch = useCallback(
    async (taskId: string, workerId: string, taskType: TaskType, isRetry = false) => {
      inFlightRef.current[workerId] = (inFlightRef.current[workerId] ?? 0) + 1;

      try {
        const res = await fetch(`/api/lb/worker/${workerId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ taskId, type: taskType }),
        });

        inFlightRef.current[workerId] = Math.max(
          0,
          (inFlightRef.current[workerId] ?? 1) - 1
        );

        if (res.status === 503) {
          dispatch({ type: "FAIL", taskId, reason: "overloaded" });

          if (!isRetry) {
            const fallback = pickFallbackWorker(workerId);
            const newTaskId = crypto.randomUUID();
            const currentTask = stateRef.current.tasks.find((t) => t.id === taskId);
            if (!currentTask) return;

            const retryTask: Task = {
              ...currentTask,
              id: newTaskId,
              workerId: fallback,
              status: "pending",
              submittedAt: Date.now(),
              retried: true,
            };

            dispatch({ type: "RETRY", oldTaskId: taskId, newTask: retryTask });
            dispatch({
              type: "LOG",
              entry: {
                id: crypto.randomUUID(),
                text: `→ ${currentTask.label} → worker-${workerId} → 503 overloaded → retrying on worker-${fallback}`,
                timestamp: Date.now(),
                ok: false,
              },
            });
            doFetch(newTaskId, fallback, taskType, true);
          }
          return;
        }

        const data = await res.json();
        const secs = (data.processingMs / 1000).toFixed(2);
        const currentTask = stateRef.current.tasks.find(
          (t) => t.id === taskId
        ) ?? { label: taskType, workerId };

        dispatch({
          type: "COMPLETE",
          taskId,
          processingMs: data.processingMs,
          completedAt: data.completedAt,
          queueDepth: data.queueDepth,
          worker: data.worker,
        });
        dispatch({
          type: "LOG",
          entry: {
            id: crypto.randomUUID(),
            text: `→ ${currentTask.label} → worker-${workerId}${isRetry ? " (retry)" : ""} → 200 OK in ${secs}s`,
            timestamp: Date.now(),
            ok: true,
          },
        });
      } catch {
        inFlightRef.current[workerId] = Math.max(
          0,
          (inFlightRef.current[workerId] ?? 1) - 1
        );
        dispatch({ type: "FAIL", taskId, reason: "network error" });
        dispatch({
          type: "LOG",
          entry: {
            id: crypto.randomUUID(),
            text: `→ worker-${workerId} → network error`,
            timestamp: Date.now(),
            ok: false,
          },
        });
      }
    },
    []
  );

  const submitTask = useCallback(
    (taskType: TaskType, label: string) => {
      const { algorithm, rrIndex } = stateRef.current;
      const workerId = selectWorker(algorithm, rrIndex, inFlightRef.current);

      if (algorithm === "round-robin" || algorithm === "weighted") {
        dispatch({ type: "INC_RR" });
      }

      const taskId = crypto.randomUUID();
      const task: Task = {
        id: taskId,
        type: taskType,
        label,
        workerId,
        status: "pending",
        submittedAt: Date.now(),
      };

      dispatch({ type: "DISPATCH", task });
      dispatch({
        type: "LOG",
        entry: {
          id: crypto.randomUUID(),
          text: `→ ${label} dispatched → worker-${workerId} (${ALGO_LABELS[algorithm]})`,
          timestamp: Date.now(),
          ok: true,
        },
      });

      doFetch(taskId, workerId, taskType);
    },
    [doFetch]
  );

  // Group tasks by worker, only show active (pending/error) + recently completed
  const now = Date.now();
  const tasksByWorker: Record<string, Task[]> = { "1": [], "2": [], "3": [] };
  for (const task of state.tasks) {
    // Show pending/error tasks, and completed tasks for 3 seconds after finishing
    const isRecent =
      task.status === "pending" ||
      task.status === "error" ||
      (task.status === "done" && task.completedAt && now - task.completedAt < 3000);
    if (isRecent && tasksByWorker[task.workerId]) {
      tasksByWorker[task.workerId].push(task);
    }
  }

  // Force re-render every 500ms to clear completed chips
  const [, setTick] = useReducer((x: number) => x + 1, 0);
  useEffect(() => {
    const id = setInterval(() => setTick(), 500);
    return () => clearInterval(id);
  }, []);

  const pendingCounts = {
    "1": state.tasks.filter((t) => t.workerId === "1" && t.status === "pending").length,
    "2": state.tasks.filter((t) => t.workerId === "2" && t.status === "pending").length,
    "3": state.tasks.filter((t) => t.workerId === "3" && t.status === "pending").length,
  };

  return (
    <div
      className="animate-fade-in fixed inset-0 z-[9999] flex flex-col overflow-hidden"
      style={{ background: "#f8f7f4" }}
      role="dialog"
      aria-modal="true"
      aria-label="Load Balancer"
    >
      {/* ── Top bar ── */}
      <div
        className="flex flex-shrink-0 items-center justify-between px-6 py-3"
        style={{
          background: "#f3f1ec",
          borderBottom: "1.5px solid #b0aeaa",
        }}
      >
        <div className="flex flex-col gap-0.5">
          <span className="font-sketch text-base text-sketch-text">
            load balancer simulator
          </span>
          <span className="font-sketch text-xs text-sketch-text-muted">
            each task fires a real <span style={{ fontFamily: "monospace" }}>POST /api/lb/worker/[n]</span> — open DevTools → Network to watch
          </span>
        </div>
        <button
          onClick={onClose}
          aria-label="Close load balancer"
          className="font-sketch text-xs text-sketch-text-muted transition-opacity hover:opacity-60"
          style={{
            border: "1.5px solid #b0aeaa",
            background: "transparent",
            padding: "4px 12px",
            cursor: "pointer",
            borderRadius: "3px",
            flexShrink: 0,
            marginLeft: "1.5rem",
          }}
        >
          ✕ close
        </button>
      </div>

      {/* ── Main content ── */}
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-auto p-6">

        {/* Controls: configuration + task submission */}
        <div
          className="flex flex-wrap gap-0"
          style={{
            border: "1.5px solid #b0aeaa",
            borderRadius: "4px",
            overflow: "hidden",
          }}
        >
          {/* Left panel — configuration */}
          <div
            className="flex flex-col gap-3 p-4"
            style={{
              background: "rgba(107, 163, 104, 0.04)",
              borderRight: "1.5px solid #b0aeaa",
              minWidth: 220,
              flex: "0 0 auto",
            }}
          >
            <span className="font-sketch text-xs text-sketch-text-muted">
              ⚙ configuration
            </span>

            <div className="flex flex-col gap-2">
              <span className="font-sketch text-xs text-sketch-text-muted" style={{ opacity: 0.7 }}>
                routing algorithm
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(["round-robin", "least-connections", "weighted"] as Algorithm[]).map((algo) => (
                  <button
                    key={algo}
                    onClick={() => dispatch({ type: "SET_ALGORITHM", algorithm: algo })}
                    className="font-sketch text-xs transition-all"
                    style={{
                      border: `1.5px solid ${state.algorithm === algo ? "#6ba368" : "#b0aeaa"}`,
                      background: state.algorithm === algo ? "rgba(107, 163, 104, 0.1)" : "transparent",
                      color: state.algorithm === algo ? "#6ba368" : "#777777",
                      padding: "3px 9px",
                      cursor: "pointer",
                      borderRadius: "3px",
                      transform: state.algorithm === algo ? "translate(-1px, -1px)" : "none",
                    }}
                  >
                    {ALGO_LABELS[algo]}
                  </button>
                ))}
              </div>
              <p
                className="font-sketch text-xs text-sketch-text-muted"
                style={{
                  borderLeft: "2px solid #6ba368",
                  paddingLeft: "8px",
                  maxWidth: 280,
                  lineHeight: 1.5,
                }}
              >
                {ALGO_DESCRIPTIONS[state.algorithm]}
              </p>
            </div>
          </div>

          {/* Right panel — task submission */}
          <div className="flex flex-1 flex-col gap-3 p-4">
            <span className="font-sketch text-xs text-sketch-text-muted">
              ▶ submit a task
            </span>
            <div className="flex flex-wrap gap-x-4 gap-y-3">
              {TASK_DEFS.map((def) => (
                <div key={def.type} className="flex flex-col gap-0.5">
                  <button
                    onClick={() => submitTask(def.type, def.label)}
                    className="btn-sketch font-sketch text-xs"
                    style={{ borderColor: "#6ba368", color: "#6ba368", padding: "4px 12px" }}
                  >
                    {def.label}
                  </button>
                  <span
                    className="font-sketch text-sketch-text-muted"
                    style={{ fontSize: "10px", paddingLeft: "2px" }}
                  >
                    {def.hint}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Worker columns */}
        <div className="grid grid-cols-3 gap-4" style={{ minHeight: 180 }}>
          {WORKER_IDS.map((wid) => {
            const chips = tasksByWorker[wid] ?? [];
            const pending = pendingCounts[wid as keyof typeof pendingCounts];
            return (
              <div key={wid} className="flex flex-col gap-2">
                {/* Worker header */}
                <div
                  className="flex items-center justify-between px-3 py-2.5"
                  style={{
                    borderTop: "2.5px solid #6ba368",
                    borderLeft: "1.5px solid #6ba368",
                    borderRight: "1.5px solid #6ba368",
                    borderBottom: "1.5px solid #6ba368",
                    borderRadius: "4px 4px 0 0",
                    background: "rgba(107, 163, 104, 0.12)",
                  }}
                >
                  <div className="flex flex-col gap-0.5">
                    <span
                      className="font-sketch"
                      style={{ color: "#4a7a47", fontSize: "13px", fontWeight: 600, letterSpacing: "0.01em" }}
                    >
                      worker-{wid}
                    </span>
                    <span
                      className="font-mono"
                      style={{ color: "#6ba368", fontSize: "9px", opacity: 0.8 }}
                    >
                      /api/lb/worker/{wid}
                    </span>
                  </div>
                  {pending > 0 && (
                    <span
                      className="font-sketch text-xs"
                      style={{
                        background: "#6ba368",
                        color: "#fff",
                        borderRadius: "9999px",
                        padding: "1px 7px",
                        fontSize: "10px",
                      }}
                    >
                      {pending}
                    </span>
                  )}
                </div>

                {/* Task chips */}
                <div
                  className="flex flex-col gap-1.5 p-2"
                  style={{
                    minHeight: 80,
                    border: "1.5px solid #b0aeaa",
                    borderTop: "none",
                    borderRadius: "0 0 4px 4px",
                    background: "#fdfcf9",
                  }}
                >
                  {chips.length === 0 ? (
                    <span
                      className="font-sketch text-xs text-sketch-text-muted"
                      style={{ paddingLeft: 4, opacity: 0.5 }}
                    >
                      idle
                    </span>
                  ) : (
                    chips.map((task) => (
                      <TaskChip key={task.id} task={task} />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Log strip */}
        <div
          className="flex-1 overflow-y-auto"
          style={{
            border: "1.5px solid #b0aeaa",
            borderRadius: "4px",
            background: "#fdfcf9",
            padding: "8px 12px",
            minHeight: 80,
            maxHeight: 200,
          }}
        >
          <div className="mb-2 flex items-center justify-between">
            <p className="font-sketch text-xs text-sketch-text-muted">
              request log
            </p>
            {state.log.length > 0 && (
              <button
                onClick={() => dispatch({ type: "CLEAR_LOG" })}
                className="font-sketch text-xs text-sketch-text-muted transition-opacity hover:opacity-60"
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                clear
              </button>
            )}
          </div>
          {state.log.length === 0 ? (
            <p className="font-mono text-xs text-sketch-text-muted" style={{ opacity: 0.5 }}>
              waiting for tasks...
            </p>
          ) : (
            state.log.map((entry) => (
              <p
                key={entry.id}
                className="font-mono text-xs leading-relaxed"
                style={{ color: entry.ok ? "#6ba368" : "#e07a5f" }}
              >
                {entry.text}
              </p>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

// ─── Task Chip ────────────────────────────────────────────────────────────────

function TaskChip({ task }: { task: Task }) {
  const isDone = task.status === "done";
  const isError = task.status === "error";
  const isPending = task.status === "pending";

  return (
    <div
      className="flex items-center justify-between gap-2 px-2 py-1"
      style={{
        border: `1.5px solid ${isDone ? "#6ba368" : isError ? "#e07a5f" : "#b0aeaa"}`,
        borderRadius: "3px",
        background: isDone
          ? "rgba(107, 163, 104, 0.08)"
          : isError
          ? "rgba(224, 122, 95, 0.08)"
          : "rgba(176, 174, 170, 0.06)",
        transition: "all 0.3s ease",
      }}
    >
      <span
        className="font-sketch text-xs"
        style={{ color: isDone ? "#6ba368" : isError ? "#e07a5f" : "#555" }}
      >
        {task.label}
      </span>
      <span className="font-mono text-xs" style={{ color: "#999", flexShrink: 0 }}>
        {isPending && <SpinnerIcon />}
        {isDone && task.processingMs && (
          <span style={{ color: "#6ba368" }}>✓ {(task.processingMs / 1000).toFixed(2)}s</span>
        )}
        {isError && <span style={{ color: "#e07a5f" }}>✕ 503</span>}
      </span>
    </div>
  );
}

function SpinnerIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      <circle
        cx="6"
        cy="6"
        r="4.5"
        fill="none"
        stroke="#b0aeaa"
        strokeWidth="1.5"
        strokeDasharray="14 8"
        style={{
          transformOrigin: "6px 6px",
          animation: "spin 0.9s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </svg>
  );
}
