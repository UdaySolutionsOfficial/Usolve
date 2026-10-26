/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#245BCC',
          'blue-hover': '#1D4CB0',
          'blue-light': '#EBF2FC',
          'blue-soft': '#D9E6FA',
          navy: '#142744',
          'navy-dark': '#0E1C33',
          slate: '#526176',
          'slate-light': '#6B7A90',
          bg: '#FFFFFF',
          'bg-alt': '#F5F8FC',
          border: '#DFE6EF',
          'border-subtle': '#EEF2F7',
        }
      },
      fontFamily: {
        heading: ['Manrope', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px -2px rgba(20, 39, 68, 0.05), 0 1px 4px -1px rgba(20, 39, 68, 0.03)',
        'card-hover': '0 12px 24px -6px rgba(36, 91, 204, 0.12), 0 4px 8px -2px rgba(20, 39, 68, 0.04)',
        'elevated': '0 20px 40px -12px rgba(20, 39, 68, 0.1)',
      }
    },
  },
  plugins: [],
}
