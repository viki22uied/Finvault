/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'sans-serif'],
        body: ['"Geist"', 'sans-serif'],
        mono: ['"Geist Mono"', 'monospace'],
      },
      colors: {
        gold: { 400: '#F5C842', 500: '#D4A017', 600: '#B8860B' },
        void: '#060608',
        cream: '#F8F4ED',
        background: '#060608',
        foreground: '#F8F4ED',
        border: 'rgba(255, 255, 255, 0.07)',
        input: 'rgba(255, 255, 255, 0.1)',
        ring: '#F5C842',
        primary: { DEFAULT: '#F5C842', foreground: '#060608' },
        secondary: { DEFAULT: 'rgba(255,255,255,0.06)', foreground: '#F8F4ED' },
        destructive: { DEFAULT: '#ef4444', foreground: '#ffffff' },
        accent: { DEFAULT: 'rgba(255,255,255,0.06)', foreground: '#F8F4ED' },
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '24px',
      },
      transitionTimingFunction: {
        'premium': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      letterSpacing: {
        'display': '-0.02em',
      },
    },
  },
  plugins: [],
}
