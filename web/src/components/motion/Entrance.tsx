"use client";

import { m, springs } from "@/components/motion/Motion";
import type { ReactNode } from "react";

/**
 * Load-time entrance choreography (vs Reveal, which fires on scroll).
 * Server components wrap their content in these — the text stays
 * server-rendered in the HTML, only the motion shell is a client component.
 */

export function Rise({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springs.soft, delay }}
    >
      {children}
    </m.div>
  );
}

/** Hero-card treatment: springs in, then floats gently forever. */
export function Float({
  children,
  delay = 0.15,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: 34, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ ...springs.soft, delay }}
    >
      <m.div
        animate={{ y: [0, -9, 0] }}
        transition={{
          duration: 6.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay + 0.8,
        }}
      >
        {children}
      </m.div>
    </m.div>
  );
}
