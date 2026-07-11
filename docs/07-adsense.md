# 07 · Google AdSense — when and how

## When to apply (patience pays)

Apply only after ALL of these are true, or rejection is likely:

- [ ] Site live on the domain for 4+ weeks and indexed (Search Console shows pages)
- [ ] Some organic traffic (even 20–50 visits/day helps approval)
- [ ] 8–10+ blog posts published (4 ship with the site — add a few more, docs/06)
- [ ] Privacy policy, terms, about, contact pages present (already built ✓)

## Applying

1. https://adsense.google.com → sign up with the site `qr.theslpl.in` and
   your payment address (India → payee name must match the bank account).
2. AdSense gives a publisher ID `ca-pub-XXXXXXXXXXXXXXXX`. Put it in
   `~/apps/qrcode-nexo/.env.production`:
   ```
   NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
   ```
   and redeploy. This automatically:
   - serves `/ads.txt` with your publisher line,
   - loads the AdSense script (only when the ID exists — zero cost until then).
3. AdSense review takes days to weeks. Fix anything they flag and resubmit.

## Placement policy (protects both UX and approval)

- Never inside the generator workspace or between its controls.
- Good slots: below the generator card on landing pages, inside blog posts,
  the FAQ page. Ads must sit in fixed-height containers (layout shift kills
  Core Web Vitals — the AdSlot component already reserves space).
- EEA/UK visitors legally require a consent prompt for personalized ads:
  in AdSense → Privacy & messaging → create the **Consent (GDPR)** message
  (Google-hosted, one click). India traffic needs none.

## Reality check on earnings

Utility-tool traffic monetizes at roughly $0.5–$3 RPM (per 1,000 pageviews)
from India-heavy audiences, more from US/EU. 10k visits/month ≈ pocket money;
100k ≈ meaningful. The compounding levers are SEO content (docs/06) and the
letters-QR feature going viral — ads just harvest whatever traffic exists.
