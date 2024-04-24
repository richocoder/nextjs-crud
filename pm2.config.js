module.exports = {
  apps: [
    {
      name: 'ADMIN-ERP',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '250M',
      env: {
        NODE_ENV: 'production',
        PORT: 6500,
      },
    },
  ],
};
