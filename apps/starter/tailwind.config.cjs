/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    '../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      /* Aligné avec --dm-* dans index.css (thème sombre type Cursor) */
      colors: {
        'cursor-bg': '#1e1e1e',
        'cursor-sidebar': '#252526',
        'cursor-surface': '#2d2d2d',
        'cursor-surface-hover': '#333333',
        'cursor-border': '#3c3c3c',
        'cursor-text': '#cccccc',
        'cursor-text-muted': '#9e9e9e',
        'cursor-accent': '#007acc',
        'cursor-thead': '#252526',
      },
    },
  },
  plugins: [],
};
