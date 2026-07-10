"use client";

/**
 * Central framer-motion entry point.
 * Everything animated imports from here so LazyMotion's reduced bundle
 * (domAnimation) is loaded exactly once, and reduced-motion is respected
 * globally via MotionConfig.
 */
import {
  LazyMotion,
  domAnimation,
  MotionConfig,
  m,
  AnimatePresence,
  useReducedMotion,
  useInView,
} from "framer-motion";
import type { ReactNode } from "react";

export { m, AnimatePresence, useReducedMotion, useInView };

/** Shared spring presets — one rhythm across the whole product. */
export const springs = {
  /** snappy micro-interaction (buttons, toggles) */
  snap: { type: "spring", stiffness: 420, damping: 30, mass: 0.7 } as const,
  /** standard UI movement (panels, cards) */
  ui: { type: "spring", stiffness: 260, damping: 26, mass: 0.9 } as const,
  /** soft entrance (hero, sections) */
  soft: { type: "spring", stiffness: 120, damping: 20, mass: 1 } as const,
};

export const easeOutExpo = [0.16, 1, 0.3, 1] as const;

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
