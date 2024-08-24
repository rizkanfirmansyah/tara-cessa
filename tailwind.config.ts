import type { Config } from "tailwindcss";
const colors = require("tailwindcss/colors");

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    colors: {
      ...colors,
      transparent: "transparent",
      current: "currentColor",
      primary: "#3276E8",
      "primary-70": "rgba(50, 118, 232, 0.7) ",
      "primary-15": "rgba(50, 118, 232, 0.15) ",
      success: "#83AD7D",
      danger: "#E83232",
      warning: "#F0C426",
      "success-light": "#EFFFED",
      muted: "#8F8F8F",
      semigray: "#ABABAB",
      semimuted: "#C3C3C3",
      light: "#f6f6f6",
      "semi-light": "#fafafa",
      dark: "#1f1f1f",
      "dark-50": "rgba(17, 17, 17, 0.5)",
      "light-50": "rgba(200, 200, 200, 0.6)",
      "white-50": "rgba(255, 255, 255, 0.5)",
      semidark: "#333333",
      "muted-line": "#E3E5E5",
    },
    fontSize: {
      h1: "54px",
      h2: "42px",
      h3: "38px",
      h4: ["24px", "36px"],
      h5: ["20px", "30px"],
      h6: "18px",
      title: "32px",
      subtitle: "24px",
      body: "15px",
      sm: "14px",
      xs: "12px",
    },
  },
  plugins: [],
};
export default config;
