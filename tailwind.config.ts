import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
          950: "#1e1b4b",
        },
        accent: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
        },
        neon: {
          blue: "#00d4ff",
          purple: "#a855f7",
          pink: "#ec4899",
          green: "#10b981",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "float-delay": "float 6s ease-in-out 2s infinite",
        "float-reverse": "floatReverse 7s ease-in-out infinite",
        "spin-slow": "spin 20s linear infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "gradient-shift": "gradientShift 8s ease infinite",
        "slide-up": "slideUp 0.6s ease-out",
        "slide-up-delay": "slideUp 0.6s ease-out 0.2s both",
        "slide-up-delay-2": "slideUp 0.6s ease-out 0.4s both",
        "scale-in": "scaleIn 0.5s ease-out",
        "blob": "blob 7s infinite",
        "shimmer": "shimmer 2s linear infinite",
        "tilt-in": "tiltIn 0.8s ease-out",
        "bounce-gentle": "bounceGentle 2s ease-in-out infinite",
        "morph": "morph 8s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-20px) rotate(2deg)" },
        },
        floatReverse: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(20px) rotate(-2deg)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" },
        },
        gradientShift: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        tiltIn: {
          "0%": { opacity: "0", transform: "perspective(1000px) rotateX(10deg) translateY(20px)" },
          "100%": { opacity: "1", transform: "perspective(1000px) rotateX(0deg) translateY(0)" },
        },
        bounceGentle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        morph: {
          "0%": { borderRadius: "60% 40% 30% 70%/60% 30% 70% 40%" },
          "50%": { borderRadius: "30% 60% 70% 40%/50% 60% 30% 60%" },
          "100%": { borderRadius: "60% 40% 30% 70%/60% 30% 70% 40%" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        "glow-sm": "0 0 15px -3px rgba(99, 102, 241, 0.3)",
        "glow": "0 0 30px -5px rgba(99, 102, 241, 0.4)",
        "glow-lg": "0 0 50px -10px rgba(99, 102, 241, 0.5)",
        "glow-accent": "0 0 30px -5px rgba(249, 115, 22, 0.4)",
        "3d": "0 20px 60px -15px rgba(0, 0, 0, 0.3)",
        "3d-hover": "0 30px 80px -15px rgba(0, 0, 0, 0.4)",
        "inner-glow": "inset 0 1px 0 0 rgba(255, 255, 255, 0.1)",
        "glass": "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
        "glass-lg": "0 16px 48px 0 rgba(31, 38, 135, 0.2)",
        "neon-blue": "0 0 20px rgba(0, 212, 255, 0.3), 0 0 40px rgba(0, 212, 255, 0.1)",
        "neon-purple": "0 0 20px rgba(168, 85, 247, 0.3), 0 0 40px rgba(168, 85, 247, 0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
