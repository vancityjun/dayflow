/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('nativewind/preset')],
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#FAF8F4',
        ink: '#232422',
        ink2: '#3A3A38',
        warm: '#8A857A',
        warm2: '#C9C3B5',
        warm3: '#E8E3D7',
        warm4: '#F2EEE5',
        accent: '#D7FE03',
        danger: '#A23A2E',
      },
      fontFamily: {
        sans: ['Inter', 'System'],
      },
    },
  },
  plugins: [],
};
