import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#1565C0",
        knowledge: "#1976D2",
        skill: "#7B1FA2",
        experience: "#C62828",
        environment: "#2E7D32",
      },
    },
  },
  plugins: [],
};
export default config;
