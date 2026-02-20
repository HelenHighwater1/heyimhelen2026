import { describe, it, expect, vi, beforeAll, afterEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TechDiagram } from "@/components/TechDiagram";

// roughjs does imperative SVG DOM manipulation — return lightweight stubs so
// the draw() effect can run without errors in jsdom.
vi.mock("roughjs", () => ({
  default: {
    svg: () => ({
      rectangle: () =>
        document.createElementNS("http://www.w3.org/2000/svg", "rect"),
      line: () =>
        document.createElementNS("http://www.w3.org/2000/svg", "line"),
    }),
  },
}));

// LoadBalancerOverlay is a large component — stub it so tests stay focused.
vi.mock("@/components/LoadBalancerOverlay", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/components/LoadBalancerOverlay")>();
  return {
    ...actual,
    LoadBalancerOverlay: ({ onClose }: { onClose: () => void }) => (
      <div data-testid="lb-overlay">
        <button onClick={onClose}>close lb</button>
      </div>
    ),
  };
});

// ResizeObserver is not implemented in jsdom. Arrow functions cannot be used
// as constructors, so we use a class here.
beforeAll(() => {
  global.ResizeObserver = class {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  };
});

afterEach(() => {
  vi.clearAllMocks();
});

// Helper: after the async draw() effect fires, cursor-pointer rects appear in the SVG.
// They are ordered: frontend (index 0), backend (index 1), database (index 2).
async function getHitAreas() {
  return await waitFor(() => {
    const areas = document.querySelectorAll<SVGRectElement>(".cursor-pointer");
    if (areas.length < 2) throw new Error("hit areas not yet rendered");
    return areas;
  });
}

describe("TechDiagram — easter eggs", () => {
  it("clicking the Frontend box opens the ASCII cam overlay", async () => {
    render(<TechDiagram />);
    const areas = await getHitAreas();
    fireEvent.click(areas[0]); // Frontend is index 0

    await waitFor(() => {
      expect(screen.getByRole("dialog", { name: /ascii webcam/i })).toBeInTheDocument();
    });
  });

  it("clicking the close button dismisses the ASCII cam overlay", async () => {
    render(<TechDiagram />);
    const areas = await getHitAreas();
    fireEvent.click(areas[0]);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("button", { name: /close ascii webcam/i }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("pressing Escape dismisses the ASCII cam overlay", async () => {
    render(<TechDiagram />);
    const areas = await getHitAreas();
    fireEvent.click(areas[0]);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    await userEvent.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("clicking the Backend box opens the load balancer overlay", async () => {
    render(<TechDiagram />);
    const areas = await getHitAreas();
    fireEvent.click(areas[1]); // Backend is index 1

    await waitFor(() => {
      expect(screen.getByTestId("lb-overlay")).toBeInTheDocument();
    });
  });

  it("clicking close on the load balancer overlay dismisses it", async () => {
    render(<TechDiagram />);
    const areas = await getHitAreas();
    fireEvent.click(areas[1]);

    await waitFor(() => {
      expect(screen.getByTestId("lb-overlay")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText("close lb"));

    await waitFor(() => {
      expect(screen.queryByTestId("lb-overlay")).not.toBeInTheDocument();
    });
  });

  it("the Database box click does not open any overlay", async () => {
    render(<TechDiagram />);
    const areas = await getHitAreas();
    fireEvent.click(areas[2]); // Database has no easter egg

    // Neither overlay should appear
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.queryByTestId("lb-overlay")).not.toBeInTheDocument();
  });
});
