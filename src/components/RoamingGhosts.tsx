"use client";

import { GhostSprite } from "./GhostSprite";

export function RoamingGhosts() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden>
      {/* Ghost 1 — Blinky (red), roams across the top area */}
      <div
        className="absolute animate-ghost-roam"
        style={{ top: "15%", animationDelay: "0s" }}
      >
        <div className="animate-ghost-float">
          <GhostSprite color="red" size={32} />
        </div>
      </div>

      {/* Ghost 2 — Inky (cyan), roams across the lower area, slower */}
      <div
        className="absolute animate-ghost-roam-slow"
        style={{ top: "72%", animationDelay: "8s" }}
      >
        <div className="animate-ghost-float" style={{ animationDelay: "0.5s" }}>
          <GhostSprite color="cyan" size={28} />
        </div>
      </div>
    </div>
  );
}
