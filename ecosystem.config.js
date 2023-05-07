module.exports = {
  apps: [
    {
      name: "ttp-scheduler",
      script: "index.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
      },
      error_file: "err.log",
      out_file: "out.log",
      log_file: "combined.log",
      time: true,
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm Z",
      post_update: ["npm install"],
      exec_mode: "fork",
    },
  ],
  deploy: {},
};
