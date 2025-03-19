/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'glow': 'glow 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      colors: {
        cyan: {
          DEFAULT: '#00f2fe',
          dark: '#0093b7'
        },
        orange: {
          DEFAULT: '#ff5722',
          dark: '#f4511e'
        }
      }
    },
  },
  plugins: [],
};