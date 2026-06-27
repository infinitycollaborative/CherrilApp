import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#0057B8",
          50: "#e6f0fb",
          100: "#cce0f7",
          200: "#99c2ef",
          300: "#66a3e6",
          400: "#3385de",
          500: "#0057B8",
          600: "#004693",
          700: "#00346e",
          800: "#00234a",
          900: "#001125",
        },
        secondary: {
          DEFAULT: "#AEC6CF",
        },
        accent: {
          DEFAULT: "#FF6B6B",
        },
        // Dark-mode surface palette
        surface: {
          base: "#0b0f17",
          raised: "#111827",
          overlay: "#1a2233",
          border: "#26304a",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        h1: ["36px", { lineHeight: "1.15", fontWeight: "700" }],
        h2: ["28px", { lineHeight: "1.2", fontWeight: "700" }],
        h3: ["22px", { lineHeight: "1.3", fontWeight: "600" }],
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
      },
      boxShadow: {
        soft: "0 4px 24px -8px rgba(0, 0, 0, 0.4)",
        glow: "0 0 0 1px rgba(0, 87, 184, 0.4), 0 8px 32px -8px rgba(0, 87, 184, 0.35)",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #0057B8 0%, #003a7a 100%)",
        "hero-gradient":
          "radial-gradient(1200px 600px at 50% -10%, rgba(0,87,184,0.25), transparent 60%), radial-gradient(800px 400px at 90% 10%, rgba(255,107,107,0.12), transparent 55%)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
