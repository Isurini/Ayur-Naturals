/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: "#d4af37", // Gold
        black: "#000000", // Black
        white: "#ffffff", // White
      },
    },
  },
  plugins: [],
};
