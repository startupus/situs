module.exports = {
  apps: [
    {
      name: 'situs-api',
      script: 'node',
      args: 'dist/server/main.js',
      cwd: __dirname,
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      watch: false,
      max_restarts: 10,
      min_uptime: '10s',
      autorestart: true,
      kill_timeout: 10000,
      exp_backoff_restart_delay: 200,
    },
  ],
};
