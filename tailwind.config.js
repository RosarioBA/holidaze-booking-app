// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0081A7', // teal blue
          dark: '#13262F',   // dark navy
        },
        secondary: {
          DEFAULT: '#F5F7DC', // light cream/yellow
          dark: '#8F754F',    // brown
        }
      }
    },
  },
  plugins: [],
}