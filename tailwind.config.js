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
        // Host Cloud Theme Colors - UPDATED TO AQUA BLUE
        'host-purple': '#003366', // Was purple, now Deep Navy Blue for text/contrast
        'host-blue': '#0ea5e9',   // Was #1a73e8, now Sky 500
        'host-cyan': '#00ffff',   // Was #00c6ff, now Bright Cyan/Aqua
        'host-dark': '#0f172a',   // Was #1e1e1e, now Slate 900 (matches blue theme)
      },
      backgroundImage: {
        'host-gradient': 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)', // Host Blue to Blue 600
        'host-gradient-btn': 'linear-gradient(to right, #0ea5e9, #2563eb)', // Matching button gradient
        'brand-gradient': 'linear-gradient(145deg, #0ea5e9 0%, #2563eb 100%)', // Consistent brand gradient
      }
    },
  },
  plugins: [],
}
