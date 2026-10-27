export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        indigo: {
          50: "#f2f4e9",
          100: "#e5e9d4",
          200: "#d0d7b0",
          300: "#b6c18c",
          400: "#98a76c",
          500: "#7d8e51",
          600: "#5e6e3d",
          700: "#495632",
          800: "#3b462b",
          900: "#303a25",
          950: "#1b2115",
        },
        gray: {
          50: "#faf9f6",
          100: "#f1f0eb",
          200: "#e3e1d9",
          300: "#ccc9bf",
          400: "#a09d92",
          500: "#76766d",
          600: "#585b52",
          700: "#3c4038",
          800: "#292e27",
          900: "#1c211c",
          950: "#121710",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Georgia", "Times New Roman", "serif"],
      },
    },
  },
  plugins: [],
};
