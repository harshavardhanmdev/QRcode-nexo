# 09 · Contact-form email (SMTP)

Contact messages are ALWAYS stored in the database (`contact_messages`
table), so nothing is lost while SMTP is unconfigured. SMTP additionally
forwards each message to saradapublications18@gmail.com.

## Option A — Gmail app password (simplest)

1. Google Account for saradapublications18@gmail.com → Security → enable
   **2-Step Verification** (required for app passwords).
2. Security → **App passwords** → app: Mail, device: Other → "qrdock server"
   → copy the 16-character password.
3. In `~/apps/qrcode-nexo/.env.production`:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=saradapublications18@gmail.com
   SMTP_PASS=xxxxxxxxxxxxxxxx
   SMTP_FROM=saradapublications18@gmail.com
   ```
4. `pm2 restart qrdock-api --update-env`, then submit the form on
   https://qr.theslpl.in/contact — the mail should arrive in the inbox.
   `curl http://127.0.0.1:<API_PORT>/api/health` shows `"mailer":true` when
   configured.

Gmail limit ≈ 500 mails/day — far beyond a contact form's needs.

## Option B — reuse the server's existing mail setup

Other sites on this server reportedly send mail already. Check how:
`grep -ri smtp ~/apps --include=".env*" -l` (their env files) or
`systemctl status postfix`. If a shared SMTP relay exists, point the same
`SMTP_*` variables at it.

## Reading stored messages directly

```bash
sqlite3 ~/apps/qrcode-nexo/server/data/qrdock.db \
  "SELECT datetime(created_at/1000,'unixepoch'), name, email, substr(message,1,80) FROM contact_messages ORDER BY id DESC LIMIT 20;"
```
