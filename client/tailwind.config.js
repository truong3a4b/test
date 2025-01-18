/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        raleway: ["Raleway", "sans-serif"], // Thêm font Raleway
      },
      backgroundImage: {
        "custom-pattern": "url('./asset/image/nen2.jpg')",
      },
    },
  },
  plugins: [],
};
