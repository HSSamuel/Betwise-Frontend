/** @type {import('tailwindcss').Config} */
export default {
  // THIS IS THE CRUCIAL FIX
  darkMode: "class",

  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
