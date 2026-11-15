/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8b5cfc',
        secondary: '#c084fc',
        text: '#8fafcc',
        'muted-text': '#9ca3af',
        card: '#151521',
      },
    },
  },
  plugins: [],
}
