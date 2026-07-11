# 11 · Security — what's built in, what you must do

## Built into the code (no action needed)

- Passwords hashed with argon2id (OWASP parameters); never stored or logged raw
- Opaque session tokens (32 random bytes), SHA-256+pepper hashed at rest,
  httpOnly/Secure/SameSite=Lax cookies, 30-day sliding expiry, revocable
- CSRF: strict Origin verification on every state-changing request
- All inputs zod-validated; SQL only via prepared statements; body size capped
- Rate limits per endpoint (login 10/15min, register 5/15min, contact 3/hr,
  redirects 120/min, global 300/min)
- Dynamic-link destinations restricted to plain http(s), no embedded
  credentials; per-code kill switch; abuse contact on the 404 page
- Scanner privacy: raw IPs never stored — month-rotating salted hashes only
- API bound to 127.0.0.1 (unreachable from LAN/internet directly); the only
  public entrance is Cloudflare → Next
- Security headers: nosniff, frame-deny, referrer-policy, restrictive
  permissions-policy; helmet on the API
- Secrets only in `.env.production` (git-ignored); production refuses to boot
  with default secrets

## Your one-time actions

- [ ] Install the deploy key, then **change the server password** — it was
      shared in chat during the build (docs/02 step 1)
- [ ] Generate real `SESSION_PEPPER` and `IP_HASH_MASTER`
      (`openssl rand -base64 32`) in `.env.production`
- [ ] Keep the Cloudflare DNS record proxied (orange cloud) so the server IP
      stays hidden; enable *Always Use HTTPS*
- [ ] Set up backups (docs/10)

## Ongoing habits

- [ ] Monthly: `npm audit --omit=dev` locally; deploy fixes if anything red
- [ ] When an abuse email arrives about a `/q/` link: deactivate the code
      from the owner's account, or directly:
      `sqlite3 server/data/qrdock.db "UPDATE dynamic_qrs SET active=0 WHERE slug='xxxx';"`
- [ ] Never commit `.env*` files; never paste secrets into the repo or issues
