/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          50: '#fdfcf9',
          100: '#fbf8f1',
          200: '#f5f0e4',
          300: '#ede5d4',
          lines: '#d4e1ed',
          margin: '#e89090',
        },
        graphite: {
          50: '#8c92a0',
          100: '#686f7d',
          200: '#4e5461',
          300: '#383d47',
          400: '#282b32',
          500: '#1b1d22',
        },
        pencil: {
          yellow: '#e8b86d',
          wood: '#d89b4f',
          ferrule: '#b5b8ba',
          eraser: '#e5989b',
          lead: '#333538',
        }
      },
      fontFamily: {
        hand: ['"Patrick Hand"', '"Caveat"', 'cursive', 'sans-serif'],
        caveat: ['"Caveat"', 'cursive', 'sans-serif'],
        architect: ['"Architects Daughter"', 'cursive', 'sans-serif'],
      },
      boxShadow: {
        'sketch': '2px 3px 0px rgba(40, 43, 50, 0.25)',
        'sketch-pressed': '1px 1px 0px rgba(40, 43, 50, 0.35)',
        'sketch-card': '4px 6px 0px rgba(40, 43, 50, 0.08), 10px 18px 25px -5px rgba(0, 0, 0, 0.06)',
        'pencil-hover': '3px 4px 0px rgba(40, 43, 50, 0.2)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-6px) rotate(1.5deg)' },
        },
        drift: {
          '0%': { transform: 'translate(0, 0) rotate(0deg)' },
          '50%': { transform: 'translate(15px, 40vh) rotate(45deg)' },
          '100%': { transform: 'translate(-10px, 85vh) rotate(90deg)' },
        },
        scribble: {
          '0%': { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: '0' },
        },
        pencilTap: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.96) translate(1px, 1px)' },
          '100%': { transform: 'scale(1)' },
        }
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pencil-tap': 'pencilTap 0.15s ease-out',
      }
    },
  },
  plugins: [],
}
