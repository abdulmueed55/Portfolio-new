import type { Config } from "tailwindcss";

// Colors/fonts pulled from af.net's live CSS (Kadence global palette) —
// see design-reference/README.md for how these were extracted.
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          pink: "#E21E51",
          blue: "#5d9eff",
          navy: "#000b33",
          "navy-alt": "#003153",
          lavender: "#deddeb",
          "off-white": "#f9f9f9",
        },
      },
      fontFamily: {
        sans: ["var(--font-lexend)", "sans-serif"],
        heading: ["var(--font-montserrat)", "sans-serif"],
        accent: ["var(--font-playfair)", "serif"],
      },
      borderRadius: {
        pill: "500%",
      },
    },
  },
  plugins: [],
};

export default config;
