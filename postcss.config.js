module.exports = {
  plugins: {
    tailwindcss: {
      config: './tailwind.config.js',
    },
    autoprefixer: {},
  },
  map: process.env.NODE_ENV === 'development' ? { inline: false } : false,
};
