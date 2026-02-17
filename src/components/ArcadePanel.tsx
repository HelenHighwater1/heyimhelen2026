import { ReactNode } from "react";

interface ArcadePanelProps {
  children: ReactNode;
  className?: string;
}

function PelletCorner({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const posClasses = {
    tl: "left-3 top-3",
    tr: "right-3 top-3",
    bl: "left-3 bottom-3",
    br: "right-3 bottom-3",
  };
  return (
    <div
      className={`absolute ${posClasses[position]} h-2 w-2 rounded-full bg-pac-dot opacity-70`}
      aria-hidden
    />
  );
}

export function ArcadePanel({ children, className = "" }: ArcadePanelProps) {
  return (
    <div
      className={`maze-border relative min-h-[80vh] bg-pac-black p-6 md:p-10 ${className}`}
    >
      {/* CRT effects */}
      <div className="crt-vignette" />
      <div className="crt-overlay" />

      {/* Corner pellets */}
      <PelletCorner position="tl" />
      <PelletCorner position="tr" />
      <PelletCorner position="bl" />
      <PelletCorner position="br" />

      {/* Content */}
      <div className="relative z-20 animate-fade-in">{children}</div>
    </div>
  );
}
