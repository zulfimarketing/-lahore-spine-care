import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#0a0906",
          secondary: "#14110a",
          panel: "#181510",
        },
        gold: {
          DEFAULT: "#c99a4a",
          bright: "#f0c674",
          dim: "#8a6b34",
          line: "rgba(201,154,74,0.25)",
        },
        ink: {
          primary: "#f5f2ea",
          secondary: "#a8a296",
          muted: "#6b6558",
        },
        teal: {
          DEFAULT: "#4a9d96",
          dark: "#2f6b66",
        },
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-space)", "monospace"],
      },
      borderRadius: {
        card: "18px",
      },
      maxWidth: {
        prose: "68ch",
      },
    },
  },
  plugins: [],
};
export default config;
