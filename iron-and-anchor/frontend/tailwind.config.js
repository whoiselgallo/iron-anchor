/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rosapalo: '#F3E5E3', // Rosa palo
        terracota: '#D35400', // Terracota
        marron: '#4A2E1B', // Marrón
        naranjaviejo: '#D97736', // Naranja viejo (CTA)
        textdark: '#2D2D2D', // Texto oscuro para contrastar en rosa palo
        textlight: '#F5F5F5', // Texto claro para contrastar en marrón/terracota
      },
      fontFamily: {
        serif: ['"Black Ops One"', 'system-ui'],
        sans: ['Raleway', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
