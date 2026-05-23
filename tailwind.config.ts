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
          50: "#FFF5E6",
          100: "#FFECD4",
          200: "#FAD4C0",
          300: "#F5B89E",
          400: "#F09C7D",
          500: "#E8845C",
          600: "#D4693F",
          700: "#B85232",
          800: "#8C3D26",
          900: "#602A1A",
        },
        secondary: {
          50: "#EEF4FA",
          100: "#D9E7F3",
          200: "#B3CFE7",
          300: "#80A1C1",
          400: "#5E87AB",
          500: "#4A7099",
          600: "#3A5A7D",
          700: "#2D4661",
          800: "#1F3145",
          900: "#131E2B",
        },
        surface: {
          DEFAULT: "#FFF5E6",
          50: "#FFFCF7",
          100: "#FFF9F0",
          200: "#FFF5E6",
          300: "#FFEDCC",
          400: "#FFE4B3",
        },
        text: {
          DEFAULT: "#111827",
          secondary: "#4B5563",
          muted: "#9CA3AF",
        },
        success: "#16A34A",
        warning: "#D97706",
        danger: "#DC2626",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        xs: ["12px", { lineHeight: "16px" }],
        sm: ["14px", { lineHeight: "20px" }],
        base: ["16px", { lineHeight: "24px" }],
        lg: ["20px", { lineHeight: "28px" }],
        xl: ["24px", { lineHeight: "32px" }],
        "2xl": ["32px", { lineHeight: "40px" }],
      },
      spacing: {
        "1": "4px",
        "2": "8px",
        "3": "12px",
        "4": "16px",
        "6": "24px",
        "8": "32px",
      },
      borderRadius: {
        sm: "8px",
        DEFAULT: "12px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
      },
      boxShadow: {
        bento: "0 1px 3px 0 rgba(0,0,0,0.04), 0 1px 2px -1px rgba(0,0,0,0.03)",
        "bento-md": "0 4px 12px -2px rgba(0,0,0,0.06), 0 2px 6px -2px rgba(0,0,0,0.04)",
        "bento-lg": "0 8px 24px -4px rgba(0,0,0,0.08), 0 4px 12px -4px rgba(0,0,0,0.04)",
        "bento-hover": "0 12px 32px -4px rgba(0,0,0,0.1), 0 4px 16px -4px rgba(0,0,0,0.06)",
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
