"use client";

import { ReactNode, useEffect, useRef } from "react";

interface SketchPanelProps {
  children: ReactNode;
  className?: string;
}

export function SketchPanel({ children, className = "" }: SketchPanelProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const container = containerRef.current;
    if (!svg || !container) return;

    let cancelled = false;

    const draw = async () => {
      const rough = (await import("roughjs")).default;
      if (cancelled) return;

      const w = container.offsetWidth;
      const h = container.offsetHeight;

      svg.setAttribute("width", String(w));
      svg.setAttribute("height", String(h));
      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);

      // Clear previous drawings
      while (svg.firstChild) svg.removeChild(svg.firstChild);

      const rc = rough.svg(svg);

      // Hand-drawn border rectangle
      const rect = rc.rectangle(4, 4, w - 8, h - 8, {
        stroke: "#1e1e1e",
        strokeWidth: 1.8,
        roughness: 1.2,
        bowing: 1.5,
        fill: "rgba(255, 254, 249, 0.5)",
        fillStyle: "solid",
      });
      svg.appendChild(rect);

      // Small corner decorations — like hand-drawn "+" marks
      const cornerSize = 8;
      const offset = 12;
      const corners = [
        [offset, offset],
        [w - offset, offset],
        [offset, h - offset],
        [w - offset, h - offset],
      ];

      for (const [cx, cy] of corners) {
        const h1 = rc.line(cx - cornerSize, cy, cx + cornerSize, cy, {
          stroke: "#b0aeaa",
          strokeWidth: 1,
          roughness: 0.8,
        });
        const v1 = rc.line(cx, cy - cornerSize, cx, cy + cornerSize, {
          stroke: "#b0aeaa",
          strokeWidth: 1,
          roughness: 0.8,
        });
        svg.appendChild(h1);
        svg.appendChild(v1);
      }
    };

    draw();

    const observer = new ResizeObserver(() => draw());
    observer.observe(container);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative min-h-[60vh] ${className}`}>
      {/* Rough.js SVG border layer */}
      <svg
        ref={svgRef}
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden
      />
      {/* Content */}
      <div className="relative z-10 animate-fade-in p-6 md:p-10">
        {children}
      </div>
    </div>
  );
}
