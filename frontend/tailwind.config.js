/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#ecf9f3",
          100: "#d4f2e6",
          200: "#a8e5cd",
          300: "#6fd4ad",
          400: "#45b892",
          500: "#2FA084",
          600: "#268a6d",
          700: "#1e6d56",
          800: "#165640",
          900: "#0f3d2e",
          950: "#0a2a20",
        },
      },
    },
  },
  plugins: [],
};
