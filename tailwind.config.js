/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        'surface-hover': 'var(--color-surface-hover)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-muted': 'var(--color-text-muted)',
        border: 'var(--color-border)',
        crimson: {
          50: '#FDE8E8',
          100: '#FAC0C0',
          200: '#F59898',
          300: '#F06D6D',
          400: '#E23D3F',
          500: '#D42A2C',
          600: '#C41E20',
          700: '#B01517',
          800: '#9A0E10',
          900: '#800A0B',
        },
      },
      backgroundImage: {
        'crimson-gradient': 'linear-gradient(135deg, #E23D3F 0%, #F06D39 100%)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        glow: 'var(--shadow-glow)',
      },
    },
  },
  plugins: [],
};