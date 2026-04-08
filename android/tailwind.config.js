/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        xianren: {
          bg:             '#0A0A0A',
          surface:        '#202020',
          surface2:       '#252525',
          border:         '#2A2A2A',
          'text-primary':   '#E0E0E0',
          'text-secondary': '#D4D4D4',
          'text-muted':     '#A0A0A0',
          'text-dim':       '#505050',
          blue:           '#3B82F6',
        },
      },
    },
  },
  plugins: [],
}
