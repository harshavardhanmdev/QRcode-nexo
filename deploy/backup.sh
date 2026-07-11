#!/usr/bin/env bash
# Manual backup entry point — the scheduled path is the systemd user timer
# installed by deploy/install-timers.sh (the minimized server has no cron or
# sqlite3 CLI; backup.mjs uses the app's own better-sqlite3 instead).
set -euo pipefail
cd "$(dirname "$0")/.."
exec node deploy/backup.mjs
