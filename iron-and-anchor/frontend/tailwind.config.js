/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        marron: '#4A2E1B',
        mostaza: '#E1AD01',
        perla: '#F8F6F0',
        textdark: '#2D2D2D',
      },
      fontFamily: {
        serif: ['"Black Ops One"', 'system-ui'],
        sans: ['Raleway', 'sans-serif'],
      },
      boxShadow: {
        'glow-smoke': '0 0 25px rgba(169, 169, 169, 0.4)',
      }
    },
  },
  plugins: [],
}
