/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './apps/starter/index.html',
    './apps/starter/src/**/*.{js,ts,jsx,tsx}',
    './packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#2563eb', hover: '#1d4ed8' },
        secondary: '#64748b',
        success: '#10b981',
        error: '#dc2626',
        muted: '#64748b',
      },
      borderRadius: { card: '0.5rem', button: '0.375rem' },
      spacing: { 'card-padding': '1.5rem' },
    },
  },
  plugins: [],
};
