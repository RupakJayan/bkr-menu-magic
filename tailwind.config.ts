import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1.25rem",
      screens: {
        "2xl": "1180px",
      },
    },
    extend: {
      colors: {
        /* Theme Pack 164 vocabulary - preferred in all new components */
        bg: "var(--tp-bg)",
        canvas: "var(--tp-canvas)",
        surf: "var(--tp-surf)",
        surf2: "var(--tp-surf-2)",
        ink: "var(--tp-ink)",
        mute: "var(--tp-mute)",
        acc: "var(--tp-acc)",
        acc2: "var(--tp-acc-2)",
        accink: "var(--tp-acc-ink)",
        line: "var(--tp-line)",
        danger: "var(--tp-danger)",

        /* Aliases: existing shadcn primitives resolve to the same variables,
           so both vocabularies stay in sync under light and dark. */
        background: "var(--tp-bg)",
        foreground: "var(--tp-ink)",
        border: "var(--tp-line)",
        input: "var(--tp-line)",
        ring: "var(--tp-acc)",
        card: {
          DEFAULT: "var(--tp-surf)",
          foreground: "var(--tp-ink)",
        },
        popover: {
          DEFAULT: "var(--tp-surf)",
          foreground: "var(--tp-ink)",
        },
        primary: {
          DEFAULT: "var(--tp-acc)",
          foreground: "var(--tp-acc-ink)",
        },
        secondary: {
          DEFAULT: "var(--tp-surf-2)",
          foreground: "var(--tp-ink)",
        },
        accent: {
          DEFAULT: "var(--tp-surf-2)",
          foreground: "var(--tp-ink)",
        },
        muted: {
          DEFAULT: "var(--tp-surf-2)",
          foreground: "var(--tp-mute)",
        },
        destructive: {
          DEFAULT: "var(--tp-danger)",
          foreground: "var(--tp-acc-ink)",
        },
      },
      borderColor: {
        DEFAULT: "var(--tp-line)",
      },
      backgroundImage: {
        grad: "var(--tp-grad)",
      },
      borderWidth: {
        theme: "var(--tp-bw)",
      },
      borderRadius: {
        DEFAULT: "var(--tp-r)",
        sm: "var(--tp-r-sm)",
        lg: "var(--tp-r-lg)",
        btn: "var(--tp-r-btn)",
      },
      boxShadow: {
        theme: "var(--tp-sh)",
        "theme-sm": "var(--tp-sh-sm)",
      },
      fontFamily: {
        display: "var(--tp-font-display)",
        body: "var(--tp-font-body)",
        mono: "var(--tp-font-mono)",
      },
      fontSize: {
        hero: "var(--tp-hero)",
      },
      transitionDuration: {
        theme: "var(--tp-dur)",
        themeSlow: "var(--tp-dur-slow)",
      },
      transitionTimingFunction: {
        theme: "var(--tp-ease)",
      },
      scale: {
        press: "var(--tp-press)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
        pop: "tp-pop var(--tp-dur) var(--tp-ease) both",
        up: "tp-up calc(var(--tp-dur) * 2.4) var(--tp-ease) both",
        sheet: "tp-sheet calc(var(--tp-dur) * 3) var(--tp-ease) both",
        breathe: "tp-breathe 3.4s var(--tp-ease) infinite",
        float: "tp-float 4s ease-in-out infinite",
        shimmer: "tp-shimmer 1.4s linear infinite",
        spin: "tp-spin 800ms linear infinite",
        tilt: "tp-tilt 2.6s ease-in-out infinite",
      },
    },
  },
  plugins: [animate],
} satisfies Config;
