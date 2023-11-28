/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-tw': '#0C3256', // paragon primary
        'accent-tw': '#FFCC33', // paragon accent
        'accent-second-tw': '#e4e8ed' // paragon accent
      }
    },
  },
  plugins: [],
}
