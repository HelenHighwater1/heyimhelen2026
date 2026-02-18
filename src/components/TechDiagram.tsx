"use client";

import { useEffect, useRef, useState } from "react";

interface TechBox {
  id: string;
  label: string;
  color: string;
  fillColor: string;
  items: string[];
}

const techBoxes: TechBox[] = [
  {
    id: "frontend",
    label: "Frontend",
    color: "#4a90d9",
    fillColor: "rgba(74, 144, 217, 0.08)",
    items: ["React", "Redux", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "Bootstrap"],
  },
  {
    id: "backend",
    label: "Backend",
    color: "#6ba368",
    fillColor: "rgba(107, 163, 104, 0.08)",
    items: ["Python", "Flask", "Ruby on Rails", "Node.js", "Express", "OpenAI API"],
  },
  {
    id: "database",
    label: "Database",
    color: "#e07a5f",
    fillColor: "rgba(224, 122, 95, 0.08)",
    items: ["PostgreSQL", "MongoDB", "SQLAlchemy", "AWS S3"],
  },
];

interface BoxPosition {
  centerX: number;
  bottomY: number;
}

export function TechDiagram() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredBox, setHoveredBox] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [boxPositions, setBoxPositions] = useState<Record<string, BoxPosition>>({});

  useEffect(() => {
    const svg = svgRef.current;
    const container = containerRef.current;
    if (!svg || !container) return;

    let cancelled = false;

    const draw = async () => {
      const rough = (await import("roughjs")).default;
      if (cancelled) return;

      const containerWidth = container.offsetWidth;
      const isMobile = containerWidth < 600;

      const boxW = isMobile ? containerWidth - 40 : 180;
      const boxH = 60;
      const gapX = isMobile ? 0 : 60;
      const gapY = isMobile ? 50 : 0;

      let svgW: number;
      let svgH: number;

      if (isMobile) {
        svgW = containerWidth;
        svgH = techBoxes.length * boxH + (techBoxes.length - 1) * gapY + 20;
      } else {
        svgW = techBoxes.length * boxW + (techBoxes.length - 1) * gapX;
        svgH = boxH + 20;
      }

      setDimensions({ width: svgW, height: svgH });

      svg.setAttribute("width", String(svgW));
      svg.setAttribute("height", String(svgH));
      svg.setAttribute("viewBox", `0 0 ${svgW} ${svgH}`);

      while (svg.firstChild) svg.removeChild(svg.firstChild);

      const rc = rough.svg(svg);
      const positions: Record<string, BoxPosition> = {};

      techBoxes.forEach((box, i) => {
        let x: number;
        let y: number;

        if (isMobile) {
          x = (svgW - boxW) / 2;
          y = 10 + i * (boxH + gapY);
        } else {
          x = i * (boxW + gapX);
          y = 10;
        }

        positions[box.id] = {
          centerX: x + boxW / 2,
          bottomY: y + boxH,
        };

        const group = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "g"
        );
        group.style.transition = "transform 0.12s ease, opacity 0.12s ease";

        const rect = rc.rectangle(x, y, boxW, boxH, {
          stroke: box.color,
          strokeWidth: 2,
          roughness: 1.2,
          bowing: 1.5,
          fill: box.fillColor,
          fillStyle: "solid",
        });
        group.appendChild(rect);

        const text = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );
        text.setAttribute("x", String(x + boxW / 2));
        text.setAttribute("y", String(y + boxH / 2 + 5));
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("fill", box.color);
        text.setAttribute("font-size", "16");
        text.setAttribute(
          "font-family",
          "Virgil, 'Segoe Print', 'Comic Sans MS', cursive"
        );
        text.setAttribute("class", "pointer-events-none select-none");
        text.textContent = box.label;
        group.appendChild(text);

        const hitArea = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect"
        );
        hitArea.setAttribute("x", String(x));
        hitArea.setAttribute("y", String(y));
        hitArea.setAttribute("width", String(boxW));
        hitArea.setAttribute("height", String(boxH));
        hitArea.setAttribute("fill", "transparent");
        hitArea.setAttribute("class", "cursor-pointer");
        hitArea.addEventListener("mouseenter", () => {
          setHoveredBox(box.id);
          group.style.transform = "translateY(-2px)";
        });
        hitArea.addEventListener("mouseleave", () => {
          setHoveredBox(null);
          group.style.transform = "";
        });
        group.appendChild(hitArea);

        svg.appendChild(group);

        if (i < techBoxes.length - 1) {
          if (isMobile) {
            const arrowX = x + boxW / 2;
            const arrowStartY = y + boxH + 4;
            const arrowEndY = arrowStartY + gapY - 8;

            const line = rc.line(arrowX, arrowStartY, arrowX, arrowEndY, {
              stroke: "#b0aeaa",
              strokeWidth: 1.5,
              roughness: 0.8,
            });
            svg.appendChild(line);

            const headSize = 6;
            const ah1 = rc.line(
              arrowX,
              arrowEndY,
              arrowX - headSize,
              arrowEndY - headSize,
              { stroke: "#b0aeaa", strokeWidth: 1.5, roughness: 0.6 }
            );
            const ah2 = rc.line(
              arrowX,
              arrowEndY,
              arrowX + headSize,
              arrowEndY - headSize,
              { stroke: "#b0aeaa", strokeWidth: 1.5, roughness: 0.6 }
            );
            svg.appendChild(ah1);
            svg.appendChild(ah2);
          } else {
            const arrowStartX = x + boxW + 4;
            const arrowEndX = arrowStartX + gapX - 8;
            const arrowY = y + boxH / 2;

            const line = rc.line(arrowStartX, arrowY, arrowEndX, arrowY, {
              stroke: "#b0aeaa",
              strokeWidth: 1.5,
              roughness: 0.8,
            });
            svg.appendChild(line);

            const headSize = 6;
            const ah1 = rc.line(
              arrowEndX,
              arrowY,
              arrowEndX - headSize,
              arrowY - headSize,
              { stroke: "#b0aeaa", strokeWidth: 1.5, roughness: 0.6 }
            );
            const ah2 = rc.line(
              arrowEndX,
              arrowY,
              arrowEndX + headSize,
              arrowY + headSize,
              { stroke: "#b0aeaa", strokeWidth: 1.5, roughness: 0.6 }
            );
            svg.appendChild(ah1);
            svg.appendChild(ah2);
          }
        }
      });

      setBoxPositions(positions);
    };

    draw();

    const observer = new ResizeObserver(() => draw());
    observer.observe(container);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, []);

  const hoveredData = techBoxes.find((b) => b.id === hoveredBox);
  const hoveredPos = hoveredBox ? boxPositions[hoveredBox] : null;

  // Calculate the SVG's left offset within the container for proper alignment
  const svgLeftOffset =
    containerRef.current && dimensions.width
      ? (containerRef.current.offsetWidth - dimensions.width) / 2
      : 0;

  return (
    <div ref={containerRef} className="w-full">
      <div className="relative" style={{ overflow: "visible" }}>
        <svg ref={svgRef} className="mx-auto block" />

        {hoveredData && hoveredPos && (
          <div
            className="pointer-events-none absolute z-30 -translate-x-1/2 animate-fade-in"
            style={{
              left: svgLeftOffset + hoveredPos.centerX,
              top: hoveredPos.bottomY + 16,
            }}
          >
            <div className="annotation-callout callout-center min-w-[160px] text-center">
              <p
                className="mb-1.5 font-sketch text-sm"
                style={{ color: hoveredData.color }}
              >
                {hoveredData.label}
              </p>
              <ul className="space-y-0.5">
                {hoveredData.items.map((item) => (
                  <li
                    key={item}
                    className="font-sketch text-xs text-sketch-text-muted"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      <div className="h-8" />

      <p className="text-center font-sketch text-xs text-sketch-text-muted">
        hover over a box to see technologies
      </p>
    </div>
  );
}
