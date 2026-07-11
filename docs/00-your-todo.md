# ✅ Your to-do list (the human steps)

Everything the site needs from *you*, in order. Updated 2026-07-11 — at this
point the site is **live at https://qr.theslpl.in** and deploys, backups and
process management are automated. Each item links to the doc with full steps.

## This week

- [ ] **Rotate the server password** — it was shared in chat during the build.
      SSH in, run `passwd`. → [11 · Security](11-security-checklist.md)
- [ ] **One sudo command for reboot-resilience** (pm2 + backups auto-start
      after a server reboot): `sudo loginctl enable-linger slplserver`
      → [02 · Server setup](02-server-setup.md)
- [ ] **Google Search Console** (~10 min): add `https://qr.theslpl.in`,
      verify, submit `sitemap.xml`, request indexing for `/`,
      `/qr-code-with-letters` and `/qr-code-generator/upi`. Then one click in
      Bing Webmaster ("import from GSC"). → [06 · Search Console](06-search-console-seo.md)
- [ ] **Cloudflare Web Analytics** (2 min, free, no cookies): Cloudflare
      dashboard → Analytics → Web Analytics → add site. → [04 · Cloudflare](04-cloudflare-hostname.md)

## Soon (unlocks features that are already built)

- [ ] **Contact-form email**: create a Gmail app password for
      saradapublications18@gmail.com, add the SMTP_* lines to
      `.env.production`, redeploy. Until then messages are safely stored in
      the database. → [09 · SMTP email](09-smtp-email.md)
- [ ] **Google sign-in**: create the OAuth client (two redirect URIs), add
      GOOGLE_CLIENT_ID/SECRET to `.env.production`, redeploy — the button
      appears by itself. → [05 · Google OAuth](05-google-oauth.md)

## In ~a month (once indexed + some traffic)

- [ ] **AdSense**: apply, then set `NEXT_PUBLIC_ADSENSE_CLIENT`; after
      approval create one Display ad unit and set `NEXT_PUBLIC_ADSENSE_SLOT`.
      Ads + `/ads.txt` switch on automatically. → [07 · AdSense](07-adsense.md)
- [ ] **Weekly 15 minutes of SEO**: check Search Console queries, add one
      blog post every week or two (`web/src/lib/blog/posts.ts`), drop links
      on Reddit/Quora where QR questions come up. → [06](06-search-console-seo.md) + [08 · Monetization](08-monetization-strategy.md)

## Monthly habit

- [ ] Copy the newest DB backup off the server to this PC (one `scp`
      command). → [10 · Backups](10-backups.md)

## Later, when traffic justifies it

- [ ] **Razorpay Pro tier**: start business KYC early (it takes days); the
      build plan for paid subscriptions is written down. → [12 · Razorpay](12-razorpay-pro-future.md)

## Routine operations (whenever you change code or I do)

Deploy any update:

```bash
ssh slplserver@100.109.145.97
cd ~/apps/qrcode-nexo && bash deploy/deploy.sh
```
