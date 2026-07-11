# 08 · Monetization strategy (passive-income roadmap)

The product is deliberately free-first: free tools win QR search terms, and
traffic is the asset. Monetization layers on top in this order:

## Phase 1 — now (built)

- **Free account gate**: 10 anonymous downloads → free signup. Every signup
  is a contactable user and pushes people into dynamic codes (the sticky,
  recurring-visit feature). Costs nothing, builds the audience.
- **Cloudflare Web Analytics** to know what's growing.

## Phase 2 — traffic exists (1–3 months after launch)

- **AdSense** (docs/07) on landing + blog pages. Passive, zero maintenance.
- **Affiliate links** inside relevant blog posts (label printers, sticker
  printing services, Amazon Associates India) — tool-adjacent purchases
  convert well. One honest recommendation per post, disclosed.

## Phase 3 — engaged users (3–6 months)

- **qrdock Pro** via Razorpay (docs/12), ₹99–199/month or ₹999/year:
  - more dynamic codes (free keeps 5; Pro 100)
  - custom slugs (`/q/your-brand`), longer analytics retention, CSV export
  - bulk batches beyond 500 rows, API access
  - The free tier stays genuinely free — downloads are never paywalled.
    That's the brand moat; don't erode it.
- **Sponsorships**: printing shops / label businesses sponsoring the barcode
  pages ("printed by …") convert better than programmatic ads at scale.

## What NOT to do

- Don't watermark, don't expire codes, don't paywall SVG — undoing the whole
  differentiator against qr-code-generator.com et al.
- Don't add popups/interstitials; Core Web Vitals are a ranking factor.
- Don't sell user data — the privacy promise is a marketing asset.

## The metric that matters

Signups per week. Ads monetize visitors once; accounts monetize forever
(Pro upgrades, retention, word of mouth). Watch Search Console + the
`users` table (`sqlite3 server/data/qrdock.db 'SELECT COUNT(*) FROM users;'`).
