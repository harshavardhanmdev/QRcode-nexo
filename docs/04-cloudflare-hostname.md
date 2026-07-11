# 04 · Pointing qr.theslpl.in at the server

The site listens on `localhost:<WEB_PORT>` on the office server. Cloudflare
reaches it through a **cloudflared tunnel** — no ports are opened to the
internet, and Tailscale stays admin-only.

## If a cloudflared tunnel already runs on the server (other sites)

You said other websites are already configured — if they use cloudflared,
just add one more public hostname:

**Dashboard route (easiest):** Cloudflare Zero Trust → Networks → Tunnels →
your tunnel → Public Hostname → *Add a public hostname*:
- Subdomain: `qr` · Domain: `theslpl.in`
- Service: `HTTP` · URL: `localhost:<WEB_PORT>` (the port from deploy)

**Config-file route:** add to the tunnel's `config.yml` ingress list, above
the catch-all:

```yaml
  - hostname: qr.theslpl.in
    service: http://localhost:4620   # your WEB_PORT
```

then `sudo systemctl restart cloudflared`.

## If no tunnel exists yet

```bash
# on the server
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb -o cloudflared.deb
sudo dpkg -i cloudflared.deb
cloudflared tunnel login          # prints a URL — open it on your PC, pick theslpl.in
cloudflared tunnel create qrdock
cloudflared tunnel route dns qrdock qr.theslpl.in
mkdir -p ~/.cloudflared && nano ~/.cloudflared/config.yml
```

```yaml
tunnel: qrdock
credentials-file: /home/slplserver/.cloudflared/<TUNNEL_ID>.json
ingress:
  - hostname: qr.theslpl.in
    service: http://localhost:4620   # your WEB_PORT
  - service: http_status:404
```

```bash
sudo cloudflared service install
sudo systemctl enable --now cloudflared
```

## Verify

1. `curl -I https://qr.theslpl.in` from anywhere → `200` with the qrdock page.
2. In Cloudflare DNS the `qr` record shows as proxied (orange cloud) — leave it proxied.
3. SSL/TLS mode: **Full** is fine (tunnel traffic is already encrypted).

## Nice extras (Cloudflare dashboard, all free)

- **Web Analytics**: Analytics → Web Analytics → add qr.theslpl.in → done.
  Cookieless, so no consent banner needed for it.
- **Always Use HTTPS**: SSL/TLS → Edge Certificates → on.
- Later optimization: a second public hostname `qr.theslpl.in/q/*` pointing
  at `localhost:<API_PORT>` makes dynamic-QR redirects skip the Next hop.
