module.exports = {
  content: ['./index.html','./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0055FF',       // deep blue
        primaryLight: '#3f7fff',  // hover highlight
        accent: '#00D1FF',        // aqua accent
        pageBg: '#F4F7FA',        // subtle gray page background
        cardBg: '#FFFFFF',        // white card
      },
      fontFamily: {
        poppins: ['Poppins','sans-serif'],
      }
    }
  },
}
