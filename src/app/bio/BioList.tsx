"use client";

import { useState } from "react";
import { bioItems } from "@/content/bio";

export function BioList() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <ul className="space-y-4">
      {bioItems.map((item, index) => (
        <li
          key={index}
          className="relative"
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <div className="flex items-start gap-3">
            <span
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white"
              aria-hidden
            />
            <span className="text-white">{item.text}</span>
          </div>
          {item.annotation && (
            <div
              className={`
                absolute left-6 top-full z-10 mt-2 w-full max-w-md rounded border-2 border-white/50 bg-blueprint-ink px-4 py-3 text-sm text-white/95 shadow-lg transition-all duration-200 ease-out
                md:left-8
                ${hoveredIndex === index ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"}
              `}
              style={{
                boxShadow: "2px 2px 0 rgba(0, 0, 0, 0.2)",
              }}
              role="note"
            >
              <div className="absolute -top-2 left-4 h-2 w-2 rotate-45 border-l-2 border-t-2 border-white/50 bg-blueprint-ink" />
              <p>{item.annotation}</p>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
