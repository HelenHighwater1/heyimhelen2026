"use client";

import { useState } from "react";
import { bioItems } from "@/content/bio";

const bulletColors = ["#4a90d9", "#e07a5f", "#6ba368", "#8b5cf6", "#d4a843"];

export function BioList() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <ul className="space-y-6">
      {bioItems.map((item, index) => {
        const isHovered = hoveredIndex === index;
        const bulletColor = bulletColors[index % bulletColors.length];
        return (
          <li
            key={index}
            className="relative"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="flex items-start gap-3 cursor-pointer">
              {/* Hand-drawn style bullet — a small sketchy circle */}
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                className="mt-1.5 shrink-0"
                aria-hidden
              >
                <circle
                  cx="6"
                  cy="6"
                  r="4"
                  fill="none"
                  stroke={bulletColor}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeDasharray={isHovered ? "none" : "none"}
                  style={{
                    transform: isHovered ? "scale(1.3)" : "scale(1)",
                    transformOrigin: "center",
                    transition: "transform 0.15s ease",
                  }}
                />
                {isHovered && (
                  <circle cx="6" cy="6" r="2" fill={bulletColor} />
                )}
              </svg>
              <span
                className={`font-sketch text-sm leading-relaxed md:text-base transition-colors duration-150 ${
                  isHovered ? "text-sketch-blue" : "text-sketch-text"
                }`}
              >
                {item.text}
              </span>
            </div>

            {/* Annotation — Excalidraw-style callout */}
            {item.annotation && (
              <div
                className={`absolute left-6 top-full z-30 mt-2 w-full max-w-md transition-all duration-200 ease-out md:left-8 ${
                  isHovered
                    ? "translate-y-0 opacity-100"
                    : "pointer-events-none -translate-y-1 opacity-0"
                }`}
              >
                <div className="annotation-callout">
                  <p className="font-sketch text-xs leading-relaxed text-sketch-text-muted md:text-sm">
                    {item.annotation}
                  </p>
                </div>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
