export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  extend: {
    maxWidth: {
      'mdf': '800px',
    },
  },
},
  plugins: [
  require('@tailwindcss/forms'),
],
}
