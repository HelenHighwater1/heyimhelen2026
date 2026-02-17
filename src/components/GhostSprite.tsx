interface GhostSpriteProps {
  color?: "red" | "pink" | "cyan" | "orange";
  size?: number;
  className?: string;
}

const ghostColors: Record<string, string> = {
  red: "#FF0000",
  pink: "#FFB8FF",
  cyan: "#00FFFF",
  orange: "#FFB852",
};

export function GhostSprite({
  color = "red",
  size = 28,
  className = "",
}: GhostSpriteProps) {
  const fill = ghostColors[color];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      className={className}
      aria-hidden
    >
      {/* Body */}
      <path
        d={`M4,28 L4,12 C4,5.4 8.5,1 14,1 C19.5,1 24,5.4 24,12 L24,28 L21,24 L18,28 L14,24 L10,28 L7,24 Z`}
        fill={fill}
      />
      {/* Eyes */}
      <ellipse cx="10" cy="12" rx="3" ry="3.5" fill="white" />
      <ellipse cx="18" cy="12" rx="3" ry="3.5" fill="white" />
      <circle cx="11" cy="12.5" r="1.8" fill="#2121DE" />
      <circle cx="19" cy="12.5" r="1.8" fill="#2121DE" />
    </svg>
  );
}
