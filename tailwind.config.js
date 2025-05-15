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
      },
      fontFamily: {
        'averia': ['"Averia Gruesa Libre"', 'cursive'],
        'lato': ['Lato', 'sans-serif'],
      }
    },
    // Make Lato the default font for everything
    fontFamily: {
      'sans': ['Lato', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
    },
  },
  plugins: [],
}