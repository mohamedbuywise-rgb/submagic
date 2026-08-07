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
        ink: '#fbf5ea',
        'ink-soft': '#ffffff',
        panel: '#ffffff',
        'panel-raised': '#fdf1e0',
        line: '#f0e2cc',
        gold: '#f0801e',
        'gold-dim': '#d66c10',
        'gold-wash': 'rgba(240,128,30,0.10)',
        teal: '#22b8a6',
        'teal-wash': 'rgba(34,184,166,0.10)',
        danger: '#e2604f',
        'danger-wash': 'rgba(226,96,79,0.10)',
        'text-hi': '#241a10',
        'text-lo': '#8a7a64',
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Arabic', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Cairo', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        card: '18px',
        pill: '999px',
      },
      boxShadow: {
        gold: '0 8px 30px -8px rgba(231,163,62,0.45)',
        panel: '0 1px 0 0 rgba(255,255,255,0.03) inset',
      },
    },
  },
  plugins: [],
}
