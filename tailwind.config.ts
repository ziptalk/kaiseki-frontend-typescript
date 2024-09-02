import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./layout/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        basic: "var(--basic)",
        background: "var(--background)",
        card: "var(--card)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        digital: ["var(--font-digital)"],
        arial: ["var(--font-arial)"],
        impact: ["var(--font-impact)"],
        anton: ["var(--font-anton)"],
        comicNeue: ["var(--font-comic-neue)"],
      },
    },
  },
  plugins: [],
};
export default config;
