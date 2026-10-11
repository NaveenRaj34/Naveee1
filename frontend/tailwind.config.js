/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        shield: {
          dark: '#0a0f1d',
          navy: '#0f172a',
          card: '#131e36',
          border: '#1e293b',
          muted: '#64748b',
          accent: '#38bdf8',
          safe: '#10b981',
          warning: '#f59e0b',
          danger: '#ef4444',
          critical: '#dc2626',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
