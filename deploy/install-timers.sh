#!/usr/bin/env bash
# Installs systemd USER units (no sudo, no cron needed):
#   qrdock-resurrect.service — brings pm2 apps back after a reboot
#   qrdock-backup.{service,timer} — nightly database backup at 03:10
# Run once on the server: bash deploy/install-timers.sh
# NOTE: surviving reboots additionally requires lingering:
#   sudo loginctl enable-linger $USER   (one-time, needs sudo)
set -euo pipefail

REPO="$(cd "$(dirname "$0")/.." && pwd)"
UNIT_DIR="$HOME/.config/systemd/user"
NODE_BIN="$(dirname "$(command -v node)")"

mkdir -p "$UNIT_DIR"

cat > "$UNIT_DIR/qrdock-resurrect.service" <<EOF
[Unit]
Description=Resurrect pm2 apps (qrdock)
After=network-online.target

[Service]
Type=oneshot
RemainAfterExit=yes
Environment=PATH=$NODE_BIN:/usr/bin:/bin
ExecStart=$NODE_BIN/pm2 resurrect

[Install]
WantedBy=default.target
EOF

cat > "$UNIT_DIR/qrdock-backup.service" <<EOF
[Unit]
Description=qrdock nightly SQLite backup

[Service]
Type=oneshot
WorkingDirectory=$REPO
Environment=PATH=$NODE_BIN:/usr/bin:/bin
ExecStart=$NODE_BIN/node $REPO/deploy/backup.mjs
EOF

cat > "$UNIT_DIR/qrdock-backup.timer" <<EOF
[Unit]
Description=Run qrdock backup nightly

[Timer]
OnCalendar=*-*-* 03:10:00
Persistent=true

[Install]
WantedBy=timers.target
EOF

systemctl --user daemon-reload
systemctl --user enable qrdock-resurrect.service >/dev/null 2>&1
systemctl --user enable --now qrdock-backup.timer

echo "installed:"
systemctl --user list-timers qrdock-backup.timer --no-pager | head -3
if loginctl show-user "$USER" --property=Linger 2>/dev/null | grep -q "Linger=yes"; then
  echo "lingering: enabled — units survive reboots"
else
  echo "lingering: NOT enabled — run once:  sudo loginctl enable-linger $USER"
fi
