import { ReactNode } from "react";

interface BlueprintSheetProps {
  children: ReactNode;
  className?: string;
}

function CornerMark({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const classes = {
    tl: "left-4 top-4 border-l-2 border-t-2",
    tr: "right-4 top-4 border-r-2 border-t-2",
    bl: "bottom-4 left-4 border-b-2 border-l-2",
    br: "bottom-4 right-4 border-b-2 border-r-2",
  };
  return (
    <div
      className={`absolute h-3 w-3 border-white ${classes[position]}`}
      aria-hidden
    />
  );
}

export function BlueprintSheet({ children, className = "" }: BlueprintSheetProps) {
  return (
    <div
      className={`relative min-h-[80vh] rounded border-[3px] border-white/40 bg-blueprint-grid p-6 md:p-10 ${className}`}
      style={{
        boxShadow:
          "inset 0 0 0 1px rgba(255, 255, 255, 0.15), 0 4px 24px rgba(0, 44, 140, 0.2)",
      }}
    >
      <CornerMark position="tl" />
      <CornerMark position="tr" />
      <CornerMark position="bl" />
      <CornerMark position="br" />
      <div className="animate-fade-in">{children}</div>
    </div>
  );
}
