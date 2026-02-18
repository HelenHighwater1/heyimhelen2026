import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sketch: ["Virgil", "Segoe Print", "Comic Sans MS", "cursive"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      colors: {
        sketch: {
          bg: "#f8f7f4",
          "bg-warm": "#f3f1ec",
          stroke: "#1e1e1e",
          "stroke-light": "#b0aeaa",
          text: "#333333",
          "text-muted": "#777777",
          blue: "#4a90d9",
          coral: "#e07a5f",
          green: "#6ba368",
          purple: "#8b5cf6",
          amber: "#d4a843",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out forwards",
        "draw-in": "drawIn 0.6s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        drawIn: {
          "0%": { opacity: "0", strokeDashoffset: "100%" },
          "100%": { opacity: "1", strokeDashoffset: "0%" },
        },
      },
      transitionDuration: {
        DEFAULT: "200ms",
      },
    },
  },
  plugins: [],
};

export default config;
