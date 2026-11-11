import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: "#0F5C4C",
          mid: "#0A3D34",
          deep: "#062820",
        },
        teal: "#14919B",
        champagne: "#C4A35A",
        soft: "#E2C98A",
        ivory: "#FFFBF5",
        sand: "#FFF6EC",
        ink: "#1C2B26",
        mist: "#5C6F68",
        coral: "#E8A87C",
      },
      fontFamily: {
        script: ["var(--font-script)", "cursive"],
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        arabic: ["var(--font-arabic)", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
