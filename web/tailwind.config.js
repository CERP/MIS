module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
        colors: {
          'red-primary': '#FC6171',
          'green-primary': '#1BB4BB',
          'orange-primary': '#FFC107',
          'blue-primary': '#74ACED',
          'gray-primary': '#E0E0E0'
        }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
