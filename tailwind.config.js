
module.exports = {
  content: ['./index.html', './src/**/*.{js,json}'],
  theme: {
    extend: {
      animation: {
        heartbeat: 'heartbeat 0.8s infinite',
      },
      keyframes: {
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
      },
    },
  },
  plugins: [],
};
