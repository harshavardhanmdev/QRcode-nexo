#!/usr/bin/env bash
# Nightly SQLite backup — add to crontab on the server:
#   10 3 * * * bash ~/apps/qrcode-nexo/deploy/backup.sh >> ~/apps/qrcode-nexo/backups/backup.log 2>&1
set -euo pipefail

cd "$(dirname "$0")/.."
DB="${DATABASE_PATH:-server/data/qrdock.db}"
OUT_DIR="backups"
KEEP=14

mkdir -p "$OUT_DIR"
STAMP="$(date +%F)"
sqlite3 "$DB" ".backup '$OUT_DIR/qrdock-$STAMP.db'"
echo "$(date -Is) backed up $DB -> $OUT_DIR/qrdock-$STAMP.db"

# rotate
ls -1t "$OUT_DIR"/qrdock-*.db 2>/dev/null | tail -n +$((KEEP + 1)) | xargs -r rm --
