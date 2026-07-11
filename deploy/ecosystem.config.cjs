/**
 * pm2 process file for the office server.
 * IMPORTANT: fork mode with exactly 1 instance each — the API uses SQLite;
 * never switch qrdock-api to cluster mode or add instances.
 *
 * Ports and secrets come from ~/apps/qrcode-nexo/.env.production which pm2
 * loads via `env_file` below. Run deploy.sh; don't call pm2 by hand.
 */
const path = require("node:path");
const fs = require("node:fs");

const root = path.resolve(__dirname, "..");
const envFile = path.join(root, ".env.production");

// parse KEY=VALUE lines (no quotes handling needed for our values)
const env = {};
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !line.trim().startsWith("#")) env[m[1]] = m[2];
  }
}

const WEB_PORT = env.WEB_PORT || "4620";
const API_PORT = env.API_PORT || "4621";

module.exports = {
  apps: [
    {
      name: "qrdock-web",
      cwd: path.join(root, "web"),
      script: "node_modules/next/dist/bin/next",
      args: `start -p ${WEB_PORT} -H 127.0.0.1`,
      exec_mode: "fork",
      instances: 1,
      max_memory_restart: "450M",
      env: {
        NODE_ENV: "production",
        ...env,
        API_ORIGIN: `http://127.0.0.1:${API_PORT}`,
      },
    },
    {
      name: "qrdock-api",
      cwd: path.join(root, "server"),
      script: "dist/index.js",
      exec_mode: "fork", // NEVER cluster — SQLite
      instances: 1,
      max_memory_restart: "300M",
      env: {
        NODE_ENV: "production",
        ...env,
      },
    },
  ],
};
