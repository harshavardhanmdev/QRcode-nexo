"use client";

import { useState } from "react";
import clsx from "clsx";
import { AnimatePresence, m, easeOutExpo } from "@/components/motion/Motion";
import { IconChevronDown } from "@/components/ui/icons";
import type { Faq } from "@/lib/seo/faq";

export function FaqAccordion({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-surface">
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `faq-panel-${i}`;
        const buttonId = `faq-button-${i}`;
        return (
          <div key={item.q}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left text-[15px] font-medium transition-colors duration-200 hover:bg-primary-soft/40 sm:px-6"
              >
                {item.q}
                <IconChevronDown
                  size={18}
                  className={clsx(
                    "shrink-0 text-fg-faint transition-transform duration-300",
                    isOpen && "rotate-180 text-accent-text",
                  )}
                />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <m.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: easeOutExpo }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-sm leading-relaxed text-fg-muted sm:px-6">
                    {item.a}
                  </p>
                </m.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
