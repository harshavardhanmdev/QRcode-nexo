"use client";

import { m, springs } from "@/components/motion/Motion";
import type { ReactNode } from "react";

/** Fade+rise on scroll into view. Wrap sections/cards with it. */
export function Reveal({
  children,
  delay = 0,
  y = 24,
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
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ ...springs.soft, delay }}
    >
      {children}
    </m.div>
  );
}

/** Parent that staggers its <StaggerItem> children by 40ms. */
export function Stagger({
  children,
  className,
  step = 0.04,
}: {
  children: ReactNode;
  className?: string;
  step?: number;
}) {
  return (
    <m.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: step } },
      }}
    >
      {children}
    </m.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <m.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 18, scale: 0.99 },
        show: { opacity: 1, y: 0, scale: 1, transition: springs.ui },
      }}
    >
      {children}
    </m.div>
  );
}
