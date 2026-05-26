/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        navy: {
          950: '#070F27',
          900: '#011F5B',
          800: '#0D2470',
          700: '#0236A0',
          600: '#0249D0',
          500: '#3074FD',
          400: '#6096FE',
          300: '#93B8FE',
          200: '#C0D8FE',
          100: '#E0EDFF',
          50:  '#F0F6FF',
        },
        app: {
          bg:      '#F1F5FB',
          surface: '#FFFFFF',
          border:  '#E2E8F2',
        },
      },
    },
  },
  plugins: [],
}
