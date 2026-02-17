"use client";

import { useState } from "react";
import { bioItems } from "@/content/bio";
import { GhostSprite } from "@/components/GhostSprite";

const ghostColors: ("red" | "pink" | "cyan" | "orange")[] = [
  "red",
  "pink",
  "cyan",
  "orange",
];

export function BioList() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <ul className="space-y-5">
      {bioItems.map((item, index) => {
        const isHovered = hoveredIndex === index;
        const gColor = ghostColors[index % ghostColors.length];
        return (
          <li
            key={index}
            className="relative"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="flex items-start gap-3">
              {/* Pac-Man dot — gets "eaten" on hover */}
              <span
                className={`mt-2 inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-pac-dot transition-all duration-200 ${
                  isHovered ? "scale-0 opacity-0" : "scale-100 opacity-100"
                }`}
                aria-hidden
              />
              <span className="text-sm leading-relaxed text-white/90 md:text-base">
                {item.text}
              </span>
            </div>

            {/* Annotation — ghost thought bubble */}
            {item.annotation && (
              <div
                className={`absolute left-6 top-full z-30 mt-2 w-full max-w-md transition-all duration-200 ease-out md:left-8 ${
                  isHovered
                    ? "translate-y-0 opacity-100"
                    : "pointer-events-none -translate-y-1 opacity-0"
                }`}
              >
                <div className="relative flex items-start gap-3 rounded-lg border-2 border-pac-blue bg-pac-black px-4 py-3 shadow-[0_0_12px_rgba(33,33,222,0.3)]">
                  <GhostSprite color={gColor} size={22} className="shrink-0 mt-0.5" />
                  <p className="text-xs leading-relaxed text-white/90 md:text-sm">
                    {item.annotation}
                  </p>
                  {/* Pointer triangle */}
                  <div className="absolute -top-2 left-6 h-3 w-3 rotate-45 border-l-2 border-t-2 border-pac-blue bg-pac-black" />
                </div>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
