/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        yatra: {
          terracotta: "#E05A3E",
          "terracotta-dark": "#C5452B",
          "terracotta-light": "#FFF3EF",
          saffron: "#F59E0B",
          "saffron-dark": "#D97706",
          "saffron-light": "#FEF3C7",
          navy: "#131E3A",
          "navy-light": "#1E2A4A",
          sand: "#FAF7F2",
          "sand-card": "#FFFFFF",
          emerald: "#059669",
          "emerald-light": "#ECFDF5"
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        display: ['Outfit', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(19, 30, 58, 0.06), 0 2px 6px -1px rgba(19, 30, 58, 0.04)',
        'card': '0 10px 30px -4px rgba(19, 30, 58, 0.08), 0 4px 12px -2px rgba(19, 30, 58, 0.04)',
        'hover': '0 20px 35px -4px rgba(224, 90, 62, 0.15), 0 8px 16px -2px rgba(19, 30, 58, 0.06)',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      }
    },
  },
  plugins: [],
}
