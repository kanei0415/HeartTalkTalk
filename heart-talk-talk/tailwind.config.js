/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        black: '#191919',
        red: '#DC0000',
        green: '#42C803',
        blue: '#021F3E',
        gray: '#E5E5EC',
        pink: '#FFB1B1',
        stone: '#131314',
        zinc: '#FFFAF8',
      },
      fontFamily: {
        sans: ['Pretendard', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
