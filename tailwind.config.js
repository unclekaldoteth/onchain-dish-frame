/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}", // <- tambahin ini juga
  ],
  safelist: [
    "bg-blue-600",
    "hover:bg-blue-700",
    "border-blue-800",
    "border",
    "text-white",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
