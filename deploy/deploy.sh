#!/usr/bin/env bash
# qrdock deploy — run ON the office server from the repo root:
#   cd ~/apps/qrcode-nexo && bash deploy/deploy.sh
# Prereqs (once): nvm + Node 24, pm2 global, .env.production present.
set -euo pipefail

cd "$(dirname "$0")/.."
ROOT="$(pwd)"

if [ ! -f .env.production ]; then
  echo "ERROR: .env.production missing. Copy deploy/env/production.env.example," \
       "fill in ports + secrets, and re-run." >&2
  exit 1
fi

# shellcheck disable=SC1091
set -a; source .env.production; set +a

echo "==> pulling latest main"
git pull --ff-only origin main

echo "==> installing dependencies (npm ci)"
# --include=dev: NODE_ENV=production is exported above, but building
# (tsc, tailwind, typescript) needs devDependencies regardless
npm ci --include=dev --no-audit --no-fund

echo "==> building web + server"
NEXT_PUBLIC_SITE_URL="${NEXT_PUBLIC_SITE_URL:-https://qr.theslpl.in}" npm run build

echo "==> running database migrations"
node server/dist/db/migrate.js

echo "==> (re)starting pm2 apps"
pm2 startOrReload deploy/ecosystem.config.cjs --update-env
pm2 save

echo "==> health checks"
sleep 2
curl -fsS "http://127.0.0.1:${API_PORT}/api/health" >/dev/null && echo "api  OK (:${API_PORT})"
curl -fsS "http://127.0.0.1:${WEB_PORT}/" >/dev/null && echo "web  OK (:${WEB_PORT})"

echo
echo "Deployed. Cloudflare should point qr.theslpl.in -> http://localhost:${WEB_PORT}"
