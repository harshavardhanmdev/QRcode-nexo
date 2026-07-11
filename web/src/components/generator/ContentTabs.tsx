"use client";

import { useEffect, useRef } from "react";
import clsx from "clsx";
import { m, springs } from "@/components/motion/Motion";
import { typeSpecs } from "@/lib/form-specs";
import { useGeneratorStore } from "@/store/generator-store";

/** Center a tab inside its scroll row without moving the page. */
export function centerInRow(container: HTMLElement | null, el: HTMLElement | null) {
  if (!container || !el) return;
  const target = el.offsetLeft - (container.clientWidth - el.offsetWidth) / 2;
  container.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
}

/** Fade the clipped edges so a cut-off tab reads as "scroll me", not a bug. */
export const scrollRowClass =
  "flex gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden " +
  "[mask-image:linear-gradient(90deg,transparent,black_14px,black_calc(100%-14px),transparent)]";

export function ContentTabs() {
  const type = useGeneratorStore((s) => s.type);
  const setType = useGeneratorStore((s) => s.setType);
  const rowRef = useRef<HTMLDivElement>(null);

  // keep the active tab visible — matters when a landing page presets a
  // type that lives at the end of the row (WhatsApp, UPI, …)
  useEffect(() => {
    const row = rowRef.current;
    centerInRow(row, row?.querySelector<HTMLElement>('[aria-selected="true"]') ?? null);
  }, [type]);

  return (
    <div
      ref={rowRef}
      role="tablist"
      aria-label="QR code content type"
      className={scrollRowClass}
    >
      {typeSpecs.map((spec) => {
        const active = type === spec.type;
        return (
          <button
            key={spec.type}
            role="tab"
            aria-selected={active}
            onClick={(e) => {
              setType(spec.type);
              centerInRow(rowRef.current, e.currentTarget);
            }}
            className={clsx(
              "relative flex h-10 shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 text-[13px] font-medium transition-colors duration-200",
              active
                ? "border-transparent text-primary-fg"
                : "border-line bg-bg text-fg-muted hover:border-line-strong hover:text-fg",
            )}
          >
            {active && (
              <m.span
                layoutId="tab-pill"
                transition={springs.snap}
                className="absolute inset-0 rounded-full bg-primary"
              />
            )}
            <span className="relative z-10 inline-flex items-center gap-1.5">
              <spec.icon size={15} />
              {spec.shortLabel ?? spec.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
