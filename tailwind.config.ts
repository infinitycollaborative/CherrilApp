import type { Config } from "tailwindcss";

/**
 * Task Flow design system — built for elderly users.
 * Priorities: high contrast, large type, generous spacing, calm & trustworthy
 * colors. Light-first (seniors read light screens more comfortably), warm and
 * reassuring rather than "techy".
 */
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Trust blue — primary brand
        brand: {
          DEFAULT: "#1466B8",
          50: "#eaf3fb",
          100: "#d3e6f6",
          200: "#a7cded",
          300: "#7ab4e4",
          400: "#4e9bdb",
          500: "#1466B8",
          600: "#105293",
          700: "#0c3e6f",
          800: "#08294a",
          900: "#041525",
        },
        // Verified / success green — background checks, confirmations
        verified: {
          DEFAULT: "#2E8B57",
          50: "#eaf6ef",
          100: "#d2ecdd",
          200: "#a6d8bb",
          300: "#79c599",
          400: "#4da777",
          500: "#2E8B57",
          600: "#256f46",
          700: "#1c5334",
          800: "#123723",
          900: "#091c11",
        },
        // Warm, inviting accent — the big primary call-to-action
        warm: {
          DEFAULT: "#E4703A",
          50: "#fdf0e9",
          100: "#fbe0d3",
          200: "#f6c1a7",
          300: "#f2a17b",
          400: "#ed824f",
          500: "#E4703A",
          600: "#c0552a",
          700: "#8f3f20",
          800: "#5f2a15",
          900: "#2f150b",
        },
        // Light surfaces — high contrast, warm off-white
        surface: {
          base: "#F5F8FC",
          raised: "#FFFFFF",
          overlay: "#EEF3F9",
          border: "#D6E0EC",
        },
        ink: {
          DEFAULT: "#16202E",
          soft: "#3D4A5C",
          muted: "#65717F",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      // Larger-than-usual scale for readability
      fontSize: {
        base: ["18px", { lineHeight: "1.6" }],
        lg: ["20px", { lineHeight: "1.55" }],
        xl: ["23px", { lineHeight: "1.5" }],
        h1: ["44px", { lineHeight: "1.1", fontWeight: "800" }],
        h2: ["34px", { lineHeight: "1.15", fontWeight: "800" }],
        h3: ["26px", { lineHeight: "1.25", fontWeight: "700" }],
      },
      borderRadius: {
        xl: "14px",
        "2xl": "20px",
        "3xl": "28px",
      },
      boxShadow: {
        soft: "0 6px 24px -10px rgba(16, 42, 78, 0.18)",
        card: "0 2px 10px -4px rgba(16, 42, 78, 0.12)",
        glow: "0 0 0 4px rgba(20, 102, 184, 0.15)",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #1466B8 0%, #0c3e6f 100%)",
        "warm-gradient": "linear-gradient(135deg, #E4703A 0%, #c0552a 100%)",
        "hero-gradient":
          "radial-gradient(1100px 520px at 15% -10%, rgba(20,102,184,0.12), transparent 60%), radial-gradient(900px 500px at 95% 0%, rgba(46,139,87,0.12), transparent 55%)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
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
