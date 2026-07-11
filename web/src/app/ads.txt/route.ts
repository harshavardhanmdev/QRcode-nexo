export const dynamic = "force-dynamic";

/**
 * Serves /ads.txt automatically once NEXT_PUBLIC_ADSENSE_CLIENT is set
 * (e.g. ca-pub-1234567890123456). Until then: 404, which is correct —
 * an empty ads.txt is worse than none.
 */
export function GET(): Response {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const pub = client?.replace(/^ca-/, "");
  if (!pub) {
    return new Response("Not configured", { status: 404 });
  }
  return new Response(`google.com, ${pub}, DIRECT, f08c47fec0942fa0\n`, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
