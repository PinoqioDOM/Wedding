import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#fdfaf5",
          100: "#f8f1e6",
          200: "#f1e4d1",
        },
        blush: {
          100: "#fbe6e1",
          200: "#f4ccc4",
          300: "#ecaea2",
          400: "#dc8e80",
          500: "#c47568",
        },
        gold: {
          400: "#d4ad6a",
          500: "#b8924d",
          600: "#9a7838",
        },
        ink: {
          700: "#4a3f3a",
          800: "#332a26",
          900: "#1f1916",
        },
      },
      fontFamily: {
        display: ['"Noto Serif Georgian"', "serif"],
        sans: ['"Noto Sans Georgian"', "sans-serif"],
        script: ['"Allura"', "cursive"],
      },
      boxShadow: {
        soft: "0 10px 40px -20px rgba(122, 79, 60, 0.25)",
        card: "0 4px 24px -8px rgba(122, 79, 60, 0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
