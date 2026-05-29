/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
        grotesk: ["Anton", "sans-serif"],
        condiment: ["Condiment", "cursive"],
      },
      colors: {
        spaceBg: '#010828',
        cream: '#EFF4FF',
        neon: '#6FFF00',
      },
    },
  },
  plugins: [],
}