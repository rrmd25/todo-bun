/** @type {import('tailwindcss').Config} */

const colors = require("tailwindcss/colors")

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        primary: colors.sky,
        secondary: colors.zinc,
        danger: colors.red[500],
        success: colors.green[500]
      }
    },
  },
  plugins: [],
}

