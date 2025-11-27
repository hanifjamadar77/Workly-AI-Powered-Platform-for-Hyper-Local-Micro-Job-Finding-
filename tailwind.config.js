/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ "./app/**/*.{js,jsx,ts,tsx}",   // include expo-router pages
    "./components/**/*.{js,jsx,ts,tsx}", // include your components
     "./lib/**/*.{js,jsx,ts,tsx}",
    ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      safelist: [
  'text-white',
  'text-gray-800',
  'text-gray-300',
  'text-gray-600',
  'text-green-400',
  'text-green-700',
  'bg-gray-800',
  'bg-white',
  'bg-gray-700',
  'border-gray-700',
  'border-gray-200',
],
    },
  },
  plugins: [],
}