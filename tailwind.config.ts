import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0E1112",
          soft: "#1A2128",
          muted: "#5B6770",
          subtle: "#8B95A0"
        },
        paper: {
          DEFAULT: "#FAF8F4",
          soft: "#F2EFE8",
          line: "#E6E1D7"
        },
        teal: {
          DEFAULT: "#0F4C5C",
          deep: "#0A3742",
          soft: "#5B7F89",
          wash: "#E8EFF1"
        },
        amber: {
          DEFAULT: "#F2A63B",
          deep: "#C8801E",
          soft: "#F8C57A",
          wash: "#FBEED5"
        },
        sage: {
          DEFAULT: "#5C8A6A",
          wash: "#E5EEE7"
        },
        clay: {
          DEFAULT: "#B5563E",
          wash: "#F2DDD5"
        }
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        serif: ["'Source Serif 4'", "Charter", "Georgia", "serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "Menlo", "monospace"]
      },
      fontSize: {
        "display": ["clamp(2.75rem, 5vw, 4.5rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "headline": ["clamp(2rem, 3.5vw, 3rem)", { lineHeight: "1.1", letterSpacing: "-0.015em" }],
        "title": ["clamp(1.5rem, 2.5vw, 2rem)", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        "lede": ["1.25rem", { lineHeight: "1.6" }]
      },
      maxWidth: {
        prose: "640px",
        readable: "720px"
      },
      borderRadius: {
        sm: "6px",
        DEFAULT: "10px",
        lg: "14px",
        xl: "20px"
      },
      boxShadow: {
        card: "0 1px 2px rgba(14, 17, 18, 0.04), 0 4px 12px rgba(14, 17, 18, 0.04)",
        cardHover: "0 2px 4px rgba(14, 17, 18, 0.06), 0 12px 28px rgba(14, 17, 18, 0.08)"
      },
      transitionDuration: {
        "60": "60ms"
      }
    }
  },
  plugins: []
};

export default config;
