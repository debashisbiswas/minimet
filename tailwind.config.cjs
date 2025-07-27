/** @type {import('tailwindcss').Config}*/
const config = {
  content: ["index.html", "./src/**/*.{html,js,svelte,ts}"],

  theme: {
    extend: {
      fontSize: {
        "responsive-bpm": "clamp(4rem, 12vw, 6rem)",
      },
      spacing: {
        "responsive-gap": "clamp(0.5rem, 4vw, 2rem)",
      },
    },
  },

  plugins: [],
};

module.exports = config;
