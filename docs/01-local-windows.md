# 01 · Running qrdock on this Windows PC

For local preview and development. Needs Node 24+ (already installed).

## Start everything (web + API)

```powershell
cd "C:\HARSHA_claude\QR Code"
npm run dev
```

- Website: http://localhost:3000
- API (internal): http://127.0.0.1:4000 — proxied automatically, you never call it directly.
- Accounts, dynamic codes and the contact form all work locally; data lives in `server\data\qrdock.db`.

Only the website (`npm run dev:web`) or only the API (`npm run dev:api`) can be started too.

## Production preview (what the server runs)

```powershell
npm run build
npm run start        # web on :3000; start the api with: node server\dist\index.js
```

## Gotchas

- **Don't run `npm run build` while `npm run dev` is running** — they share `web\.next` and the dev server will start throwing "Cannot find module ./vendor-chunks/…". Stop dev, build, restart dev.
- If port 3000 is busy: `npx next dev -p 3001` inside `web\`, or stop the stale process:
  `Get-NetTCPConnection -LocalPort 3000 -State Listen | % { Stop-Process -Id $_.OwningProcess -Force }`
- Google sign-in and SMTP are off locally unless you put the env vars in `server\.env` (see docs 05 / 09).
