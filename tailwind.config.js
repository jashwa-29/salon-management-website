/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: "class",
   theme: {
    extend: {
      colors: {
        gold: {
          50: '#fff9e6',
          100: '#fff2cc',
          200: '#ffe699',
          300: '#ffd966',
          400: '#ffcc33',
          500: '#ffbf00', // Primary gold
          600: '#cc9900',
          700: '#997300',
          800: '#664d00',
          900: '#332600',
        },
      },
      boxShadow: {
        'gold-sm': '0 1px 2px 0 rgba(255, 191, 0, 0.05)',
        'gold': '0 1px 3px 0 rgba(255, 191, 0, 0.1), 0 1px 2px 0 rgba(255, 191, 0, 0.06)',
        'gold-md': '0 4px 6px -1px rgba(255, 191, 0, 0.1), 0 2px 4px -1px rgba(255, 191, 0, 0.06)',
        'gold-lg': '0 10px 15px -3px rgba(255, 191, 0, 0.1), 0 4px 6px -2px rgba(255, 191, 0, 0.05)',
        'gold-xl': '0 20px 25px -5px rgba(255, 191, 0, 0.1), 0 10px 10px -5px rgba(255, 191, 0, 0.04)',
        'gold-2xl': '0 25px 50px -12px rgba(255, 191, 0, 0.25)',
      }
    },
  },
    plugins: [],
};
