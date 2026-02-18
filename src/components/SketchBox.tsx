"use client";

import { ReactNode, useEffect, useRef } from "react";

interface SketchBoxProps {
  children: ReactNode;
  className?: string;
  strokeColor?: string;
  roughness?: number;
}

export function SketchBox({
  children,
  className = "",
  strokeColor = "#1e1e1e",
  roughness = 1.0,
}: SketchBoxProps) {
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

      while (svg.firstChild) svg.removeChild(svg.firstChild);

      const rc = rough.svg(svg);
      const rect = rc.rectangle(2, 2, w - 4, h - 4, {
        stroke: strokeColor,
        strokeWidth: 1.5,
        roughness,
        bowing: 1.2,
        fill: "rgba(255, 254, 249, 0.3)",
        fillStyle: "solid",
      });
      svg.appendChild(rect);
    };

    draw();

    const observer = new ResizeObserver(() => draw());
    observer.observe(container);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [strokeColor, roughness]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <svg
        ref={svgRef}
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden
      />
      <div className="relative z-10 p-5 md:p-6">{children}</div>
    </div>
  );
}
