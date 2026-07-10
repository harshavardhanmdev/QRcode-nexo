import type { NextConfig } from "next";

/**
 * The Fastify API runs on a localhost-only port (dev: 4000, prod: set via
 * API_ORIGIN). Next proxies /api/* and /q/* to it so the whole product is
 * served from a single public port — Cloudflare only ever sees the web port.
 */
const API_ORIGIN = process.env.API_ORIGIN ?? "http://127.0.0.1:4000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/api/:path*", destination: `${API_ORIGIN}/api/:path*` },
      { source: "/q/:slug", destination: `${API_ORIGIN}/q/:slug` },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Permissions-Policy",
            // camera=self is required by the /scan page decoder
            value: "camera=(self), microphone=(), geolocation=(), payment=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
