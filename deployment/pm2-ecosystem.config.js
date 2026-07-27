module.exports = {
  apps: [
    {
      name: 'syncdocs-backend',
      script: 'dist/index.js',
      cwd: '/var/www/syncdocs/backend',
      
      // AWS Free Tier Single Instance Configuration
      // Note: Running 1 instance prevents Socket.IO state fragmentation without Redis Pub/Sub adapter
      instances: 1,
      exec_mode: 'fork',
      
      // Auto-restart and memory protection
      autorestart: true,
      watch: false,
      max_memory_restart: '400M',
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 3000,
      
      // Environment variables
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000
      },

      // Logging configuration
      output: '/home/ubuntu/logs/backend-out.log',
      error: '/home/ubuntu/logs/backend-error.log',
      log_type: 'json',
      merge_logs: true,
      time: true
    }
  ]
};
