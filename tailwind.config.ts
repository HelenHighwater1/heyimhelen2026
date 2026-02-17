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
        pixel: ["'Press Start 2P'", "monospace"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      colors: {
        pac: {
          black: "#000000",
          blue: "#2121DE",
          yellow: "#FFFF00",
          dot: "#FFB8AE",
          white: "#FFFFFF",
        },
        ghost: {
          red: "#FF0000",
          pink: "#FFB8FF",
          cyan: "#00FFFF",
          orange: "#FFB852",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out forwards",
        "pellet-pulse": "pellet-pulse 0.6s ease-in-out infinite alternate",
        "ghost-float": "ghost-float 2s ease-in-out infinite",
        "ghost-roam": "ghost-roam 18s linear infinite",
        "ghost-roam-slow": "ghost-roam 25s linear infinite",
        chomp: "chomp 0.3s steps(2) infinite",
        "arcade-blink": "arcade-blink 1s steps(1) infinite",
        "dot-eaten": "dot-eaten 0.25s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
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
