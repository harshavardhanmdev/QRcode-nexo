# qrdock

**Free QR code & barcode generator with a twist: your letters, woven into the code itself.**

Live at [qr.theslpl.in](https://qr.theslpl.in) · Powered by Nexorium Systems Private Limited

## What makes qrdock different

- **Letter forge** — type up to 4 letters and they appear *inside* the QR pattern, formed by the modules themselves. Fully scannable, verified live by a real decoder.
- **Private by architecture** — every code is generated in your browser. Links, Wi-Fi passwords and UPI IDs never touch the server.
- **Actually free** — no watermarks, no expiring codes, free SVG/PNG/JPEG/WebP up to 4096 px.
- **Every content type** — URL, text, Wi-Fi, vCard, email, SMS, WhatsApp, UPI payment, location, calendar event + 6 barcode formats.
- **Dynamic QR codes** — free accounts get short links with editable destinations and scan analytics (by day, country, device).
- **Scannability guardrails** — contrast checking, logo damage budget, and a live decode badge on every edit.

## Repository layout

| Path | What it is |
|---|---|
| `web/` | Next.js 15 app — UI, QR/barcode engine, SEO pages |
| `server/` | Fastify API — accounts, dynamic QR redirects, analytics *(lands in Milestone F)* |
| `docs/` | Owner runbooks — deployment, Cloudflare, AdSense, SEO, backups |
| `deploy/` | pm2 config + deploy/port-audit/backup scripts |
| `web/design-system/` | Generated design-system source of truth |

## Local development

```bash
# Node 24+ (see .nvmrc)
npm install
npm run dev        # web on http://localhost:3000
```

## Production build

```bash
npm run build
npm run start
```

Deployment, environment variables and server runbooks live in [`docs/`](./docs/).

---

© Nexorium Systems Private Limited. All rights reserved.
