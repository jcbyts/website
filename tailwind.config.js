import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */

export default {
  content: ['./src/**/*.{html,js,svelte,ts,svx}'],
  theme: {
    extend: {
			fontFamily: {
				sans: ['Inter', ...defaultTheme.fontFamily.sans],
				serif: ["Parclo", ...defaultTheme.fontFamily.serif],
      },
    },
  },
  plugins: [],
}


