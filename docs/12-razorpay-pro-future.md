# 12 · qrdock Pro via Razorpay (future — not built yet)

Build this only when the free tier shows real engagement (docs/08 phase 3:
steady signups + users hitting the 5-dynamic-code cap).

## Your prerequisites (can start anytime — KYC takes days)

1. Razorpay account at https://razorpay.com → business KYC with Nexorium
   Systems Private Limited details + bank account.
2. Once approved: Dashboard → Subscriptions → create two Plans
   (e.g. `qrdock-pro-monthly` ₹149/mo, `qrdock-pro-yearly` ₹999/yr).
3. Settings → API Keys → generate live keys (for `.env.production` later:
   `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`).

## What Pro should include (from the strategy doc)

- 100 active dynamic codes (free stays 5)
- Custom slugs (`/q/your-brand`)
- Longer analytics retention + CSV export of scans
- Bulk batches beyond 500 rows
- API key for programmatic generation

## Implementation sketch (for the next build session)

- DB: `plan` column already exists on `users` ('free'/'pro'); add a
  `subscriptions` table (razorpay_sub_id, user_id, status, current_period_end).
- API: `POST /api/billing/subscribe` → create Razorpay Subscription → return
  checkout params; `POST /api/billing/webhook` (raw-body HMAC verification
  with the webhook secret) handling `subscription.activated/charged/halted/
  cancelled` → flip `users.plan`.
- Web: pricing page + Razorpay Checkout JS on the account page; caps in the
  API read `user.plan` (the dynamic-code cap already does).
- Keep webhook idempotent; store event ids.

Until then, the caps advertise Pro silently: users hitting them see what a
paid tier would offer.
