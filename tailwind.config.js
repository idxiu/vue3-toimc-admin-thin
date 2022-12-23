/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}', './src/**/*.scss'],
  theme: {
    extend: {
      colors: {
        'content-bg': '#F5F6FA'
      },
      lineClamp: {
        sm: '3',
        lg: '10'
      },
      'wh-full': 'w-full h-full',
      'f-center': 'flex justify-center items-center',
      'f-between': 'flex justify-between items-center'
    }
  },
  plugins: [require('@tailwindcss/line-clamp'), require('@tailwindcss/forms')]
}
