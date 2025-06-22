import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/componente/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./componente/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        white: "#ffffff", // Culoare alba
        blue: {
          200: "#93c5fd", // Albastru deschis
          400: "#60a5fa", // Albastru mediu
          500: "#3b82f6", // Albastru vibrant
        },
        gray: {
          100: "#f3f4f6", // Gri foarte deschis
          200: "#e5e7eb", // Gri deschis
          300: "#d1d5db", // Gri mediu
          500: "#6b7280", // Gri inchis
          700: "#374151", // Gri foarte inchis
          800: "#1f2937", // Gri aproape negru
        },
        "blue-primary": "#0275ff", // Albastru primar
        "stroke-dark": "#2d3135", // Contur (poate fi redenumit dacă nu mai e nevoie de dark)
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))", // Gradient radial
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))", // Gradient conic
      },
    },
  },
  plugins: [],
};

export default config;
