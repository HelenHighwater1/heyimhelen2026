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
        display: ["'Amatic SC'", "cursive"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      colors: {
        blueprint: {
          primary: "#002c8c",
          ink: "#0a2540",
          line: "#1e3a5f",
          light: "#2d5a87",
          pale: "#e8f0f7",
          paper: "#f5f9fc",
          canvas: "#e8ecf7",
          accent: "#b8860b",
        },
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(to right, rgba(0, 44, 140, 0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 44, 140, 0.2) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "24px 24px",
      },
      transitionDuration: {
        DEFAULT: "200ms",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
