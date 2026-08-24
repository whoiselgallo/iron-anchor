/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        iron: '#F3E5E3', // Rosa palo (Fondo principal)
        anchor: '#E6D0CE', // Rosa palo ligeramente más oscuro (Navbar, secciones)
        copper: '#C9A3A0', // Tono rosado medio (Bordes y separadores)
        yellowcta: '#FFC107', // Amarillo CTA
        ivory: '#2D2D2D', // Texto oscuro para contraste sobre el fondo rosa palo
      },
      fontFamily: {
        serif: ['"Black Ops One"', 'system-ui'], // Tipografía militar (H1, H2, H3)
        sans: ['Raleway', 'sans-serif'], // Cuerpo y navegación
      }
    },
  },
  plugins: [],
}
