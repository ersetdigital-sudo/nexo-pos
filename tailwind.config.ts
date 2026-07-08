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
        primary: {
          50: "#FFF6EF",
          100: "#FFEBDB",
          200: "#FFD6B8",
          300: "#FFBC8C",
          400: "#FFA163",
          500: "#FF8A3D",
          600: "#F26D1B",
          700: "#C75512",
          800: "#9E4413",
          900: "#7F3913",
        },
        secondary: {
          50: "#F4F6F9",
          100: "#E7EBF1",
          200: "#CBD4E1",
          300: "#9AA9BF",
          400: "#71839D",
          500: "#556781",
          600: "#425169",
          700: "#334155",
          800: "#25303F",
          900: "#161D27",
        },
        surface: {
          DEFAULT: "#F8F9FB",
          50: "#FFFFFF",
          100: "#FCFCFD",
          200: "#F8F9FB",
          300: "#F1F3F6",
          400: "#E9ECF1",
        },
        line: "#ECECEC",
        text: {
          DEFAULT: "#0F172A",
          secondary: "#475569",
          muted: "#94A3B8",
        },
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        sm: "10px",
        DEFAULT: "12px",
        md: "14px",
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
        "3xl": "28px",
      },
      boxShadow: {
        bento: "0 1px 2px 0 rgba(15,23,42,0.04), 0 1px 3px -1px rgba(15,23,42,0.03)",
        "bento-md": "0 4px 16px -4px rgba(15,23,42,0.06), 0 2px 6px -2px rgba(15,23,42,0.04)",
        "bento-lg": "0 12px 32px -8px rgba(15,23,42,0.08), 0 4px 12px -4px rgba(15,23,42,0.04)",
        "bento-hover": "0 16px 40px -8px rgba(15,23,42,0.1), 0 6px 16px -6px rgba(15,23,42,0.05)",
        float: "0 8px 32px -8px rgba(15,23,42,0.08), 0 2px 8px -2px rgba(15,23,42,0.04)",
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
