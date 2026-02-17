interface PacManSpriteProps {
  size?: number;
  direction?: "right" | "left" | "up" | "down";
  className?: string;
  animate?: boolean;
}

const rotationMap: Record<string, string> = {
  right: "rotate(0deg)",
  left: "rotate(180deg)",
  up: "rotate(-90deg)",
  down: "rotate(90deg)",
};

export function PacManSprite({
  size = 24,
  direction = "right",
  className = "",
  animate = true,
}: PacManSpriteProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      style={{ transform: rotationMap[direction] }}
      aria-hidden
    >
      <circle cx="12" cy="12" r="11" fill="#FFFF00">
        {animate && (
          <animate
            attributeName="r"
            values="11;11;11"
            dur="0.3s"
            repeatCount="indefinite"
          />
        )}
      </circle>
      {/* Mouth wedge — animated open/close */}
      <path fill="#000000">
        <animate
          attributeName="d"
          values="M12,12 L24,6 L24,18 Z;M12,12 L24,11 L24,13 Z;M12,12 L24,6 L24,18 Z"
          dur="0.3s"
          repeatCount="indefinite"
        />
      </path>
      {/* Eye */}
      <circle cx="14" cy="7" r="1.5" fill="#000000" />
    </svg>
  );
}
