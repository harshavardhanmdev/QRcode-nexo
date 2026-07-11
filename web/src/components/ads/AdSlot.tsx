"use client";

import { useEffect, useRef } from "react";

const CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
const SLOT = process.env.NEXT_PUBLIC_ADSENSE_SLOT;

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * Responsive AdSense unit inside a FIXED-HEIGHT container (Core Web Vitals:
 * ads must never shift layout). Renders nothing at all until both
 * NEXT_PUBLIC_ADSENSE_CLIENT and NEXT_PUBLIC_ADSENSE_SLOT are configured
 * (docs/07-adsense.md) — zero DOM, zero requests before approval.
 */
export function AdSlot({ minHeight = 280 }: { minHeight?: number }) {
  const pushed = useRef(false);

  useEffect(() => {
    if (!CLIENT || !SLOT || pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* blocked or not yet loaded — the reserved box just stays empty */
    }
  }, []);

  if (!CLIENT || !SLOT) return null;

  return (
    <div
      className="mx-auto my-10 w-full max-w-3xl overflow-hidden"
      style={{ minHeight }}
      aria-label="Advertisement"
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block", minHeight }}
        data-ad-client={CLIENT}
        data-ad-slot={SLOT}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
