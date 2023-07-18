/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      gridTemplateColumns: {
        calendar: "1fr 1fr 1fr 1fr 1fr 1fr 1fr",
      },
      gridTemplateRows: {
        calendar: "1fr 1fr 1fr 1fr 1fr 1fr 1fr",
      },
    },
  },
  plugins: [],
}
