# 03 · Deploying updates

Every update is the same one command on the server:

```bash
cd ~/apps/qrcode-nexo && bash deploy/deploy.sh
```

It does: `git pull` → `npm ci` → build web+server → run DB migrations →
`pm2 startOrReload` → health-check both ports. Zero-config, idempotent.

## Useful pm2 commands

```bash
pm2 ls                      # status of qrdock-web / qrdock-api
pm2 logs qrdock-api         # live API logs (Ctrl+C to exit)
pm2 logs qrdock-web
pm2 restart qrdock-web      # restart one app
pm2 monit                   # CPU/memory dashboard
```

## Rules of the box

- **Never** scale `qrdock-api` to multiple instances or cluster mode — it uses
  SQLite (single-writer). It comfortably serves this workload as one process.
- Ports live only in `~/apps/qrcode-nexo/.env.production`. If a port conflict
  ever appears (shared server!), run `bash deploy/port-audit.sh`, pick new
  ones, update `.env.production`, re-run `deploy.sh`, and update the
  Cloudflare hostname (docs/04).
- The SQLite database is `server/data/qrdock.db` — it is **not** in git and
  survives deploys. Backups: docs/10.

## Rollback

```bash
cd ~/apps/qrcode-nexo
git log --oneline -5            # find the last good commit
git reset --hard <commit>
bash deploy/deploy.sh           # rebuild + reload (skip the git pull error — already at commit)
```
