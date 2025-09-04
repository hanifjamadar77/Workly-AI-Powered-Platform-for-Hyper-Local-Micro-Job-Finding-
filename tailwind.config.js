/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ "./app/**/*.{js,jsx,ts,tsx}",   // include expo-router pages
    "./components/**/*.{js,jsx,ts,tsx}", // include your components
    ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}