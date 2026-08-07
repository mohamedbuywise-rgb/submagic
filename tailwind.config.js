/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#faf8f5',
        surface: '#ffffff',
        accent: '#f97316',
        'accent-soft': '#fed7aa',
        'accent-wash': '#fff7ed',
        'accent-dark': '#ea580c',
        stone: {
          850: '#292524',
          750: '#78716c',
          650: '#e7e5e4',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Arabic', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'organic': '20px 24px 22px 26px',
        'organic-sm': '14px 18px 16px 20px',
        'organic-lg': '30px 40px 35px 45px',
      }
    },
  },
  plugins: [],
}