"use client";

import clsx from "clsx";
import { m, springs } from "@/components/motion/Motion";
import { typeSpecs } from "@/lib/form-specs";
import { useGeneratorStore } from "@/store/generator-store";

export function ContentTabs() {
  const type = useGeneratorStore((s) => s.type);
  const setType = useGeneratorStore((s) => s.setType);

  return (
    <div
      role="tablist"
      aria-label="QR code content type"
      className="flex gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {typeSpecs.map((spec) => {
        const active = type === spec.type;
        return (
          <button
            key={spec.type}
            role="tab"
            aria-selected={active}
            onClick={() => setType(spec.type)}
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
