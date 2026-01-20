/** @type {import('tailwindcss').Config} */
export default {
  // On cible l'app starter pour que Tailwind génère bien les styles utilisés.
  content: [
    "./apps/starter/index.html",
    "./apps/starter/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
