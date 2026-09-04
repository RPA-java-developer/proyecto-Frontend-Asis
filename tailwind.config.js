/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1C2530',
        paper: '#F5F3EE',
        moss: '#56694A',
        mossdark: '#42502F',
        rust: '#9C4A34',
        slate: '#8B939E',
        amber: '#C0872E',
        line: '#E3E0D6'
      },
      fontFamily: {
        sans: ['Archivo', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace']
      }
    }
  },
  plugins: []
}
