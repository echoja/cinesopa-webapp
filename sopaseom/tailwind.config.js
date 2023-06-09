const colors = require('tailwindcss/colors');

module.exports = {
  // purge: [],
  prefix: 'T',
  purge: ['./public/index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        gray: colors.trueGray,
      },
    },
    screens: {
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
      '2xl': '1400px',
    },
  },
  variants: {
    extend: {
      borderColor: ['last'],
      cursor: ['disabled'],
    },
  },
  plugins: [],
};
