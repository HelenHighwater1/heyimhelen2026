"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

/* ── Node positions in the SVG viewBox (600 x 160) ── */
interface MazeNode {
  id: string;
  label: string;
  href: string;
  x: number;
  y: number;
}

const nodes: MazeNode[] = [
  { id: "main", label: "MAIN", href: "/", x: 80, y: 80 },
  { id: "resume", label: "RESUME", href: "/resume", x: 200, y: 80 },
  { id: "projects", label: "PROJECTS", href: "/projects", x: 320, y: 80 },
  { id: "bio", label: "BIO", href: "/bio", x: 440, y: 80 },
  { id: "dogs", label: "DOGS", href: "/dog-pictures", x: 560, y: 80 },
];

/* Edges connect adjacent rooms */
const edges: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
];

/* Dots along each edge path — evenly spaced */
function dotsAlongEdge(
  ax: number,
  ay: number,
  bx: number,
  by: number,
  count: number
) {
  const dots: { x: number; y: number }[] = [];
  for (let i = 1; i <= count; i++) {
    const t = i / (count + 1);
    dots.push({ x: ax + (bx - ax) * t, y: ay + (by - ay) * t });
  }
  return dots;
}

const DOT_COUNT_PER_EDGE = 5;

export function MazeNav() {
  const pathname = usePathname();
  const router = useRouter();
  const normalizedPath = pathname === "" ? "/" : pathname;

  const activeIndex = nodes.findIndex((n) => n.href === normalizedPath);
  const [pacPos, setPacPos] = useState({ x: nodes[0].x, y: nodes[0].y });
  const [eatenDots, setEatenDots] = useState<Set<string>>(new Set());
  const [isAnimating, setIsAnimating] = useState(false);
  const animFrameRef = useRef<number>(0);
  const targetIndexRef = useRef<number>(activeIndex >= 0 ? activeIndex : 0);

  /* Sync position if path changes externally */
  useEffect(() => {
    if (activeIndex >= 0 && !isAnimating) {
      setPacPos({ x: nodes[activeIndex].x, y: nodes[activeIndex].y });
      targetIndexRef.current = activeIndex;
    }
  }, [activeIndex, isAnimating]);

  /* Build all dots with their keys */
  const allDots = edges.flatMap(([a, b]) => {
    const na = nodes[a];
    const nb = nodes[b];
    return dotsAlongEdge(na.x, na.y, nb.x, nb.y, DOT_COUNT_PER_EDGE).map(
      (d, i) => ({
        ...d,
        key: `${a}-${b}-${i}`,
      })
    );
  });

  /* Animate Pac-Man along the path from current node to target node */
  const navigateTo = useCallback(
    (targetIdx: number) => {
      if (isAnimating) return;
      const startIdx = targetIndexRef.current;
      if (startIdx === targetIdx) return;

      setIsAnimating(true);

      /* Build the ordered list of node indices to traverse */
      const path: number[] = [];
      if (startIdx < targetIdx) {
        for (let i = startIdx; i <= targetIdx; i++) path.push(i);
      } else {
        for (let i = startIdx; i >= targetIdx; i--) path.push(i);
      }

      /* Build waypoints: every node + every dot along the way */
      interface Waypoint {
        x: number;
        y: number;
        dotKey?: string;
      }
      const waypoints: Waypoint[] = [];
      for (let seg = 0; seg < path.length - 1; seg++) {
        const fromIdx = path[seg];
        const toIdx = path[seg + 1];
        const from = nodes[fromIdx];
        const to = nodes[toIdx];

        /* Edge key (always lower-higher) */
        const eA = Math.min(fromIdx, toIdx);
        const eB = Math.max(fromIdx, toIdx);

        const dots = dotsAlongEdge(
          from.x,
          from.y,
          to.x,
          to.y,
          DOT_COUNT_PER_EDGE
        );
        /* Reverse dots if going backwards */
        if (fromIdx > toIdx) dots.reverse();

        for (let di = 0; di < dots.length; di++) {
          const origI =
            fromIdx < toIdx ? di : DOT_COUNT_PER_EDGE - 1 - di;
          waypoints.push({
            x: dots[di].x,
            y: dots[di].y,
            dotKey: `${eA}-${eB}-${origI}`,
          });
        }
        waypoints.push({ x: to.x, y: to.y });
      }

      let wpIndex = 0;
      const speed = 6; /* px per frame */
      let cx = nodes[startIdx].x;
      let cy = nodes[startIdx].y;
      const eaten = new Set(eatenDots);

      function step() {
        if (wpIndex >= waypoints.length) {
          setIsAnimating(false);
          targetIndexRef.current = targetIdx;
          /* Regenerate dots after a short pause */
          setTimeout(() => setEatenDots(new Set()), 600);
          router.push(nodes[targetIdx].href);
          return;
        }

        const wp = waypoints[wpIndex];
        const dx = wp.x - cx;
        const dy = wp.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist <= speed) {
          cx = wp.x;
          cy = wp.y;
          if (wp.dotKey) {
            eaten.add(wp.dotKey);
            setEatenDots(new Set(eaten));
          }
          wpIndex++;
        } else {
          cx += (dx / dist) * speed;
          cy += (dy / dist) * speed;
        }

        setPacPos({ x: cx, y: cy });
        animFrameRef.current = requestAnimationFrame(step);
      }

      animFrameRef.current = requestAnimationFrame(step);
    },
    [isAnimating, eatenDots, router]
  );

  /* Clean up animation on unmount */
  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  /* Determine Pac-Man direction */
  const currentNodeX = nodes[targetIndexRef.current]?.x ?? 80;
  const direction = pacPos.x >= currentNodeX ? "right" : "left";
  const mouthDir = isAnimating ? direction : "right";

  return (
    <nav aria-label="Main navigation" className="w-full select-none">
      {/* Desktop maze */}
      <div className="hidden md:block">
        <svg
          viewBox="0 0 640 160"
          className="w-full"
          style={{ maxHeight: "140px" }}
        >
          {/* Maze walls (decorative border) */}
          <rect
            x="20"
            y="20"
            width="600"
            height="120"
            rx="12"
            fill="none"
            stroke="#2121DE"
            strokeWidth="3"
          />
          <rect
            x="26"
            y="26"
            width="588"
            height="108"
            rx="9"
            fill="none"
            stroke="#2121DE"
            strokeWidth="1.5"
            strokeDasharray="6 4"
          />

          {/* Edge paths */}
          {edges.map(([a, b]) => (
            <line
              key={`edge-${a}-${b}`}
              x1={nodes[a].x}
              y1={nodes[a].y}
              x2={nodes[b].x}
              y2={nodes[b].y}
              stroke="#2121DE"
              strokeWidth="2"
              strokeDasharray="4 3"
              opacity="0.5"
            />
          ))}

          {/* Dots */}
          {allDots.map((dot) => (
            <circle
              key={dot.key}
              cx={dot.x}
              cy={dot.y}
              r="3"
              fill="#FFB8AE"
              opacity={eatenDots.has(dot.key) ? 0 : 0.9}
              style={{
                transition: "opacity 0.15s",
              }}
            />
          ))}

          {/* Room nodes (clickable) */}
          {nodes.map((node, i) => {
            const isActive = node.href === normalizedPath;
            return (
              <g
                key={node.id}
                onClick={() => navigateTo(i)}
                className="cursor-pointer"
                role="link"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") navigateTo(i);
                }}
              >
                {/* Node background */}
                <rect
                  x={node.x - 30}
                  y={node.y - 22}
                  width="60"
                  height="44"
                  rx="6"
                  fill={isActive ? "#2121DE" : "#000000"}
                  stroke="#2121DE"
                  strokeWidth={isActive ? "2.5" : "1.5"}
                  opacity={isActive ? 1 : 0.8}
                />
                {/* Node label */}
                <text
                  x={node.x}
                  y={node.y + 3}
                  textAnchor="middle"
                  fill={isActive ? "#FFFF00" : "#FFFFFF"}
                  fontSize="8"
                  fontFamily="'Press Start 2P', monospace"
                  className="pointer-events-none"
                >
                  {node.label}
                </text>
              </g>
            );
          })}

          {/* Pac-Man sprite */}
          <g
            transform={`translate(${pacPos.x}, ${pacPos.y})`}
            className="pointer-events-none"
          >
            <g
              transform={`translate(-10, -10) ${mouthDir === "left" ? "scale(-1,1) translate(-20,0)" : ""}`}
            >
              <circle cx="10" cy="10" r="9" fill="#FFFF00" />
              <path fill="#000000">
                <animate
                  attributeName="d"
                  values="M10,10 L20,5 L20,15 Z;M10,10 L20,9 L20,11 Z;M10,10 L20,5 L20,15 Z"
                  dur="0.3s"
                  repeatCount="indefinite"
                />
              </path>
              <circle cx="12" cy="5.5" r="1.2" fill="#000000" />
            </g>
          </g>
        </svg>
      </div>

      {/* Mobile maze — compact horizontal strip */}
      <div className="block md:hidden">
        <svg
          viewBox="0 0 340 60"
          className="w-full"
          style={{ maxHeight: "70px" }}
        >
          {edges.map(([a, b]) => {
            const mobileX = (i: number) => 30 + i * 70;
            return (
              <line
                key={`m-edge-${a}-${b}`}
                x1={mobileX(a)}
                y1={30}
                x2={mobileX(b)}
                y2={30}
                stroke="#2121DE"
                strokeWidth="2"
                strokeDasharray="4 3"
                opacity="0.5"
              />
            );
          })}

          {/* Mobile dots */}
          {edges.flatMap(([a, b]) => {
            const mobileX = (i: number) => 30 + i * 70;
            return dotsAlongEdge(
              mobileX(a),
              30,
              mobileX(b),
              30,
              3
            ).map((d, di) => (
              <circle
                key={`m-${a}-${b}-${di}`}
                cx={d.x}
                cy={d.y}
                r="2"
                fill="#FFB8AE"
                opacity={0.8}
              />
            ));
          })}

          {/* Mobile room nodes */}
          {nodes.map((node, i) => {
            const mx = 30 + i * 70;
            const isActive = node.href === normalizedPath;
            return (
              <g
                key={`m-${node.id}`}
                onClick={() => {
                  router.push(node.href);
                }}
                className="cursor-pointer"
                role="link"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    router.push(node.href);
                }}
              >
                <rect
                  x={mx - 24}
                  y={8}
                  width="48"
                  height="44"
                  rx="5"
                  fill={isActive ? "#2121DE" : "#000000"}
                  stroke="#2121DE"
                  strokeWidth={isActive ? "2" : "1"}
                />
                <text
                  x={mx}
                  y={34}
                  textAnchor="middle"
                  fill={isActive ? "#FFFF00" : "#FFFFFF"}
                  fontSize="5.5"
                  fontFamily="'Press Start 2P', monospace"
                  className="pointer-events-none"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </nav>
  );
}
