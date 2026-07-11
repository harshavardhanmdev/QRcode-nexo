# 06 · Search Console & SEO operations

## One-time setup (do this the day the domain goes live)

1. **Google Search Console** — https://search.google.com/search-console
   - Add property → *URL prefix* → `https://qr.theslpl.in`
   - Verify via DNS (Cloudflare → DNS → add the TXT record Google shows) —
     verifies the whole domain in one shot.
   - Sitemaps → submit `https://qr.theslpl.in/sitemap.xml` (31 URLs).
   - URL Inspection → paste the homepage → *Request indexing*. Repeat for
     `/qr-code-with-letters` and `/qr-code-generator/upi` (the two best
     ranking bets).
2. **Bing Webmaster Tools** — https://www.bing.com/webmasters → *Import from
   Google Search Console* (one click, covers Bing + DuckDuckGo + ChatGPT search).
3. **Cloudflare Web Analytics** (docs/04) for traffic numbers without cookies.

## What's already built in (don't redo)

- Unique title/description/canonical per page, OG + Twitter cards, OG image
- JSON-LD: WebApplication, Organization, FAQPage, HowTo, Breadcrumb, Article
- `sitemap.xml`, `robots.txt` (blocks /account, /api, /q), static prerendering
- 16 keyword landing pages + 4 blog posts, interlinked

## Ranking expectations & the weekly 15 minutes

New domains take 2–6 months to rank for competitive terms. The wedge terms
here are **"qr code with letters/name/initials"** (no real competition) and
**"upi qr code generator"** (high intent, thin competition). Weekly:

1. Search Console → Performance: which queries get impressions? Pages
   getting impressions but few clicks → improve their title/description copy
   in `web/src/lib/seo/landing-content.ts`.
2. Publish one blog post per 1–2 weeks (add to `web/src/lib/blog/posts.ts`
   — follow the existing structure; the sitemap updates itself). Post ideas:
   restaurant menu QR guide, QR codes on business cards, wedding invitation
   QR, "why your QR code won't scan" troubleshooting.
3. Backlinks: answer QR-related questions on Reddit/Quora/IndieHackers
   linking the relevant landing page; submit to tool directories
   (AlternativeTo, Product Hunt launch, free-tool lists).
