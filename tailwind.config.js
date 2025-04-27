/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EFF6FF', 
          100: '#DBEAFE', 
          200: '#BFDBFE', 
          300: '#93C5FD', 
          400: '#60A5FA', 
          500: '#3B82F6', 
          600: '#2563EB', 
          700: '#1D4ED8', 
          800: '#1E40AF', 
          900: '#1E3A8A',
          950: '#172554',
        },
        secondary: {
          50: '#F0F9FF', 
          100: '#E0F2FE', 
          200: '#BAE6FD', 
          300: '#7DD3FC', 
          400: '#38BDF8', 
          500: '#0EA5E9', 
          600: '#0284C7', 
          700: '#0369A1', 
          800: '#075985', 
          900: '#0C4A6E',
          950: '#082F49',
        },
        accent: {
          50: '#F5F3FF', 
          100: '#EDE9FE', 
          200: '#DDD6FE', 
          300: '#C4B5FD', 
          400: '#A78BFA', 
          500: '#8B5CF6', 
          600: '#7C3AED', 
          700: '#6D28D9', 
          800: '#5B21B6', 
          900: '#4C1D95',
          950: '#2E1065',
        },
        success: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          500: '#10B981',
          700: '#047857',
        },
        warning: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          500: '#F59E0B',
          700: '#B45309',
        },
        error: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          500: '#EF4444',
          700: '#B91C1C',
        },
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)',
      },
      spacing: {
        '88': '22rem',
        '104': '26rem',
        '120': '30rem',
      },
      minHeight: {
        '1/2': '50vh',
        '3/4': '75vh',
      },
      transitionProperty: {
        'height': 'height',
        'max-height': 'max-height',
      }
    },
  },
  plugins: [],
};