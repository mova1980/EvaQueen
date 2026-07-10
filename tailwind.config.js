/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#FDFCFA',
          100: '#F7F4EF',
          200: '#EDE8E0',
        },
        stone: {
          warm: '#DDD5CA',
          mid: '#C5BAB0',
          deep: '#A09690',
        },
        gold: {
          light: '#D4BC8A',
          DEFAULT: '#BFA36A',
          dark: '#9A8250',
        },
        soft: {
          black: '#181818',
          gray: '#6F6A64',
          light: '#9C9690',
        },
      },
      fontFamily: {
        fa: ['Vazirmatn', 'serif'],
        nastaliq: ['"Noto Nastaliq Urdu"', 'serif'],
        en: ['Steiner', '"DM Sans"', 'sans-serif'],
      },
      backgroundImage: {
        'shimmer': 'linear-gradient(90deg, transparent 0%, rgba(191,163,106,0.8) 50%, transparent 100%)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(32px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        clipReveal: {
          '0%': { clipPath: 'inset(0 0 100% 0)', opacity: '0' },
          '100%': { clipPath: 'inset(0 0 0% 0)', opacity: '1' },
        },
        goldUnderline: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      animation: {
        shimmer: 'shimmer 3s linear infinite',
        fadeInUp: 'fadeInUp 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        fadeIn: 'fadeIn 0.8s ease forwards',
        slideInRight: 'slideInRight 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        slideInLeft: 'slideInLeft 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        scaleIn: 'scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        clipReveal: 'clipReveal 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      },
      transitionTimingFunction: {
        luxury: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      boxShadow: {
        'gold-sm': '0 2px 12px rgba(191, 163, 106, 0.2)',
        'gold': '0 4px 24px rgba(191, 163, 106, 0.3)',
        'gold-lg': '0 8px 40px rgba(191, 163, 106, 0.4)',
        'luxury': '0 20px 60px rgba(24, 24, 24, 0.08)',
        'luxury-lg': '0 30px 80px rgba(24, 24, 24, 0.15)',
      },
    },
  },
  plugins: [],
};
