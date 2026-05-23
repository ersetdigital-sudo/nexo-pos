import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FDC800",
        secondary: "#432DD7",
        success: "#16A34A",
        warning: "#D97706",
        danger: "#DC2626",
        surface: "#FBFBF9",
        text: "#1C293C",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        brutal: "4px 4px 0px 0px #1C293C",
        "brutal-sm": "2px 2px 0px 0px #1C293C",
        "brutal-lg": "6px 6px 0px 0px #1C293C",
        "brutal-xl": "8px 8px 0px 0px #1C293C",
      },
    },
  },
  plugins: [],
};

export default config;
