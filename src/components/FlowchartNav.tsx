"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

interface NavNode {
  id: string;
  label: string;
  href: string;
}

const nodes: NavNode[] = [
  { id: "main", label: "main", href: "/" },
  { id: "resume", label: "resume", href: "/resume" },
  { id: "projects", label: "projects", href: "/projects" },
  { id: "bio", label: "bio", href: "/bio" },
  { id: "dogs", label: "dogs", href: "/dog-pictures" },
];

export function FlowchartNav() {
  const pathname = usePathname();
  const router = useRouter();
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const normalizedPath = pathname === "" ? "/" : pathname;
  const pathRef = useRef(normalizedPath);
  pathRef.current = normalizedPath;

  const routerRef = useRef(router);
  routerRef.current = router;

  useEffect(() => {
    const svg = svgRef.current;
    const container = containerRef.current;
    if (!svg || !container) return;

    let cancelled = false;

    const draw = async () => {
      const rough = (await import("roughjs")).default;
      if (cancelled) return;

      const currentPath = pathRef.current;
      const currentRouter = routerRef.current;

      const containerWidth = container.offsetWidth;
      const isMobile = containerWidth < 500;

      const boxW = isMobile ? 58 : 90;
      const boxH = isMobile ? 30 : 38;
      const arrowLen = isMobile ? 20 : 36;
      const totalW = nodes.length * boxW + (nodes.length - 1) * arrowLen;
      const svgH = boxH + 16;
      const offsetX = Math.max(0, (containerWidth - totalW) / 2);

      svg.setAttribute("width", String(containerWidth));
      svg.setAttribute("height", String(svgH));
      svg.setAttribute("viewBox", `0 0 ${containerWidth} ${svgH}`);

      while (svg.firstChild) svg.removeChild(svg.firstChild);

      const rc = rough.svg(svg);
      const cy = svgH / 2;

      nodes.forEach((node, i) => {
        const x = offsetX + i * (boxW + arrowLen);
        const isActive = node.href === currentPath;

        const rect = rc.rectangle(x, cy - boxH / 2, boxW, boxH, {
          stroke: isActive ? "#4a90d9" : "#1e1e1e",
          strokeWidth: isActive ? 2.2 : 1.5,
          roughness: 1.0,
          bowing: 1.5,
          fill: isActive ? "rgba(74, 144, 217, 0.1)" : "transparent",
          fillStyle: "solid",
        });
        svg.appendChild(rect);

        const text = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );
        text.setAttribute("x", String(x + boxW / 2));
        text.setAttribute("y", String(cy + (isMobile ? 4 : 5)));
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("fill", isActive ? "#4a90d9" : "#333333");
        text.setAttribute("font-size", isMobile ? "10" : "14");
        text.setAttribute(
          "font-family",
          "Virgil, 'Segoe Print', 'Comic Sans MS', cursive"
        );
        text.setAttribute("class", "pointer-events-none select-none");
        text.textContent = node.label;
        svg.appendChild(text);

        const hitArea = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect"
        );
        hitArea.setAttribute("x", String(x));
        hitArea.setAttribute("y", String(cy - boxH / 2));
        hitArea.setAttribute("width", String(boxW));
        hitArea.setAttribute("height", String(boxH));
        hitArea.setAttribute("fill", "transparent");
        hitArea.setAttribute("class", "cursor-pointer");
        hitArea.setAttribute("role", "link");
        hitArea.setAttribute("tabindex", "0");
        hitArea.addEventListener("click", () =>
          currentRouter.push(node.href)
        );
        hitArea.addEventListener("keydown", (e: KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ")
            currentRouter.push(node.href);
        });
        svg.appendChild(hitArea);

        if (i < nodes.length - 1) {
          const arrowStartX = x + boxW + 2;
          const arrowEndX = arrowStartX + arrowLen - 4;
          const arrowY = cy;

          const line = rc.line(arrowStartX, arrowY, arrowEndX, arrowY, {
            stroke: "#b0aeaa",
            strokeWidth: 1.5,
            roughness: 0.8,
          });
          svg.appendChild(line);

          const headSize = isMobile ? 5 : 7;
          const ah1 = rc.line(
            arrowEndX,
            arrowY,
            arrowEndX - headSize,
            arrowY - headSize / 1.5,
            { stroke: "#b0aeaa", strokeWidth: 1.5, roughness: 0.6 }
          );
          const ah2 = rc.line(
            arrowEndX,
            arrowY,
            arrowEndX - headSize,
            arrowY + headSize / 1.5,
            { stroke: "#b0aeaa", strokeWidth: 1.5, roughness: 0.6 }
          );
          svg.appendChild(ah1);
          svg.appendChild(ah2);
        }
      });
    };

    draw();

    const observer = new ResizeObserver(() => draw());
    observer.observe(container);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [normalizedPath]);

  return (
    <nav ref={containerRef} aria-label="Main navigation" className="w-full">
      <svg ref={svgRef} className="w-full" />
    </nav>
  );
}
