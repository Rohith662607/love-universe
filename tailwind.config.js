/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,scss}"
  ],
  theme: {
    extend: {
      colors: {
        bg: '#03020a',
        deep: '#06040f',
        accent: '#e8c9a0',
        rose: '#c97a8a',
        gold: '#d4a65a',
        blue: '#6b9bd1',
        soft: '#f0e8dc',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        body: ['"Crimson Pro"', 'serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      animation: {
        'twinkle': 'twinkle 3s ease-in-out infinite alternate',
        'spin-slow': 'spin 20s linear infinite',
        'pulse-soft': 'pulse 4s ease-in-out infinite',
        'heartbeat': 'heartbeat 2s ease-in-out infinite',
      },
      keyframes: {
        twinkle: {
          '0%': { opacity: '0.2', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1.3)' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
        }
      }
    }
  },
  plugins: []
};
