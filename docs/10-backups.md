# 10 · Backups & restore

Everything that matters lives in ONE file: `server/data/qrdock.db`
(users, sessions, saved designs, dynamic codes, scans, contact messages).
The code itself is safe on GitHub; the database is what needs backups.

## Nightly backup (set once — docs/02 step 5)

```bash
crontab -e
10 3 * * * bash ~/apps/qrcode-nexo/deploy/backup.sh >> ~/apps/qrcode-nexo/backups/backup.log 2>&1
```

Keeps 14 daily copies in `~/apps/qrcode-nexo/backups/` using SQLite's online
`.backup` (safe while the API is running).

## Monthly off-server copy (from this Windows PC)

The server's disk dying takes the backups with it. Once a month:

```powershell
scp -i $env:USERPROFILE\.ssh\qrdock_deploy slplserver@100.109.145.97:~/apps/qrcode-nexo/backups/qrdock-$(Get-Date -Format yyyy-MM-dd).db "C:\HARSHA_claude\qrdock-backups\"
```

(Adjust the date to the latest existing backup, or copy the whole folder.)

## Restore

```bash
cd ~/apps/qrcode-nexo
pm2 stop qrdock-api
cp backups/qrdock-YYYY-MM-DD.db server/data/qrdock.db
pm2 start qrdock-api
curl -s http://127.0.0.1:$API_PORT/api/health   # {"ok":true,...}
```

## Verify a backup is sound (occasionally)

```bash
sqlite3 backups/qrdock-YYYY-MM-DD.db "PRAGMA integrity_check; SELECT COUNT(*) FROM users;"
```
