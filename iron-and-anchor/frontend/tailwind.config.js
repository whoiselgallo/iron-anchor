/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        iron: '#4A2E1B', // Marrón profundo (Dominante)
        anchor: '#2A1A0F', // Tono ultra oscuro de marrón para fondos secundarios/Navbar
        copper: '#B7410E', // Óxido (Estructural/Divisores)
        terracota: '#D35400', // Terracota CTA
        ivory: '#F5F5F5', // Blanco roto para texto
      },
      fontFamily: {
        serif: ['"Black Ops One"', 'system-ui'], // Tipografía militar (H1, H2, H3)
        sans: ['Raleway', 'sans-serif'], // Cuerpo y navegación
      }
    },
  },
  plugins: [],
}
