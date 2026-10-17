/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  theme: {
    extend: {
      spacing: {
        'safe': 'env(safe-area-inset-bottom)',
      },
      padding: {
        'safe': 'env(safe-area-inset-bottom)',
      },
     
     animation: {
       'shimmer': 'shimmer 3s linear infinite',
       'fade-slide-up': 'fade-slide-up 0.5s ease-out',
       'progress': 'progress 4s linear',
       'scale-in': 'scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
     },
     keyframes: {
       shimmer: {
         '0%': { backgroundPosition: '250% 50%' },
         '100%': { backgroundPosition: '-150% 50%' },
       },
       'fade-slide-up': {
         '0%': {
           opacity: '0',
           transform: 'translateY(20px)'
         },
         '100%': {
           opacity: '1',
           transform: 'translateY(0)'
         },
       },
       progress: {
         '0%': { width: '0%' },
         '100%': { width: '100%' },
       },
       'scale-in': {
         '0%': { transform: 'scale(0)' },
         '100%': { transform: 'scale(1)' },
       },
     },
    },
  
  },
  plugins: [],
};