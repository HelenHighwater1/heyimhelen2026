import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoadBalancerOverlay } from "@/components/LoadBalancerOverlay";

beforeEach(() => {
  vi.spyOn(global, "fetch");
});

afterEach(() => {
  vi.restoreAllMocks();
});

function mockFetchOk(processingMs = 200) {
  (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
    new Response(
      JSON.stringify({
        taskId: "task-1",
        worker: "worker-1",
        processingMs,
        completedAt: Date.now(),
        queueDepth: 0,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  );
}

function mockFetch503() {
  (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
    new Response(
      JSON.stringify({ error: "overloaded", worker: "worker-1", taskId: "task-1" }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    )
  );
}

describe("LoadBalancerOverlay", () => {
  it("renders all three algorithm buttons", () => {
    render(<LoadBalancerOverlay onClose={() => {}} />);
    expect(screen.getByText("round robin")).toBeInTheDocument();
    expect(screen.getByText("least connections")).toBeInTheDocument();
    expect(screen.getByText("weighted")).toBeInTheDocument();
  });

  it("renders all five task type buttons", () => {
    render(<LoadBalancerOverlay onClose={() => {}} />);
    expect(screen.getByText("ping")).toBeInTheDocument();
    expect(screen.getByText("image resize")).toBeInTheDocument();
    expect(screen.getByText("ml inference")).toBeInTheDocument();
    expect(screen.getByText("batch export")).toBeInTheDocument();
    expect(screen.getByText("db migration")).toBeInTheDocument();
  });

  it("renders all three worker columns", () => {
    render(<LoadBalancerOverlay onClose={() => {}} />);
    expect(screen.getByText("worker-1")).toBeInTheDocument();
    expect(screen.getByText("worker-2")).toBeInTheDocument();
    expect(screen.getByText("worker-3")).toBeInTheDocument();
  });

  it("calls onClose when the close button is clicked", async () => {
    const onClose = vi.fn();
    render(<LoadBalancerOverlay onClose={onClose} />);
    await userEvent.click(screen.getByText("✕ close"));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("calls onClose when Escape is pressed", async () => {
    const onClose = vi.fn();
    render(<LoadBalancerOverlay onClose={onClose} />);
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("submitting a ping task calls fetch with the correct worker URL", async () => {
    mockFetchOk();
    render(<LoadBalancerOverlay onClose={() => {}} />);
    await userEvent.click(screen.getByText("ping"));
    expect(fetch).toHaveBeenCalledOnce();
    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toMatch(/^\/api\/lb\/worker\/[123]$/);
  });

  it("dispatched task appears in the log", async () => {
    mockFetchOk();
    render(<LoadBalancerOverlay onClose={() => {}} />);
    await userEvent.click(screen.getByText("ping"));
    await waitFor(() => {
      expect(screen.getByText(/ping dispatched → worker/)).toBeInTheDocument();
    });
  });

  it("selecting a different algorithm updates the active button styling cue", async () => {
    render(<LoadBalancerOverlay onClose={() => {}} />);
    const weightedBtn = screen.getByText("weighted");
    await userEvent.click(weightedBtn);
    // After clicking, the description for weighted should appear
    expect(
      screen.getByText(/worker-1 gets 3x traffic/i)
    ).toBeInTheDocument();
  });

  it("a 503 response logs a retry message", async () => {
    // First call → 503, second call (retry) → 200
    (fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ error: "overloaded", worker: "worker-1", taskId: "t1" }),
          { status: 503, headers: { "Content-Type": "application/json" } }
        )
      )
      .mockResolvedValue(
        new Response(
          JSON.stringify({
            taskId: "t2",
            worker: "worker-2",
            processingMs: 150,
            completedAt: Date.now(),
            queueDepth: 0,
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        )
      );

    render(<LoadBalancerOverlay onClose={() => {}} />);
    await userEvent.click(screen.getByText("ping"));

    await waitFor(() => {
      expect(
        screen.getByText(/503 overloaded → retrying on worker/i)
      ).toBeInTheDocument();
    });

    // Retry fetch should also have been called
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("clearing the log empties the request log panel", async () => {
    mockFetchOk();
    render(<LoadBalancerOverlay onClose={() => {}} />);
    await userEvent.click(screen.getByText("ping"));

    await waitFor(() => {
      expect(screen.getByText(/ping dispatched/)).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText("clear"));
    expect(screen.queryByText(/ping dispatched/)).not.toBeInTheDocument();
    expect(screen.getByText("waiting for tasks...")).toBeInTheDocument();
  });
});
