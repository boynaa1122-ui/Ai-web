/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#070b14',
          900: '#0b1120',
          850: '#0f172a',
          800: '#131e36',
          700: '#1e293b',
          600: '#334155',
        },
        neon: {
          blue: '#00e5ff',
          cyan: '#38bdf8',
          purple: '#a855f7',
          green: '#10b981',
          red: '#f43f5e',
          amber: '#f59e0b'
        }
      },
      boxShadow: {
        'glow-cyan': '0 0 15px -2px rgba(0, 229, 255, 0.3)',
        'glow-blue': '0 0 20px -3px rgba(59, 130, 246, 0.4)',
        'glow-green': '0 0 15px -2px rgba(16, 185, 129, 0.35)',
        'glow-purple': '0 0 15px -2px rgba(168, 85, 247, 0.35)',
      }
    },
  },
  plugins: [],
}
