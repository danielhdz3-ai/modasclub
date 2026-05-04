import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base
        bg: "#FFFFFF",
        surface: "#FFF8F8",
        "surface-2": "#FDF0F0",
        // Rosa pastel
        primary: "#E8A0A8",
        "primary-hover": "#D9848E",
        "primary-light": "#F5D5D8",
        "primary-pale": "#FDE8EA",
        // Nude
        nude: "#D4B5A0",
        "nude-light": "#F0E6DC",
        // Texto
        text: "#2C2C2C",
        "text-secondary": "#7A6B6B",
        "text-muted": "#B5A5A5",
        // Dorado
        gold: "#C9A87C",
        // Utilidades
        border: "#EED9DA",
        success: "#A8C5A0",
        error: "#E09090",
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "serif"],
        body: ["var(--font-jost)", "sans-serif"],
        accent: ["var(--font-pinyon)", "cursive"],
      },
      maxWidth: {
        content: "1200px",
      },
      borderRadius: {
        card: "12px",
        pill: "50px",
      },
      boxShadow: {
        card: "0 8px 30px rgba(232,160,168,0.15)",
        btn: "0 6px 20px rgba(232,160,168,0.4)",
        input: "0 0 0 3px rgba(232,160,168,0.2)",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-in-up": "fadeInUp 600ms ease forwards",
        ticker: "ticker 20s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
