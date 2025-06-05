// tailwind.config.js
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    "close",
    "current",
    "incorrect"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
