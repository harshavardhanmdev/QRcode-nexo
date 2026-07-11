"use client";

import Link from "next/link";
import { AnimatePresence, m, springs } from "@/components/motion/Motion";
import { Button } from "@/components/ui/Button";
import { IconSparkles, IconX } from "@/components/ui/icons";
import { FREE_LIMIT } from "@/lib/quota";

/**
 * Shown when an anonymous visitor exhausts the 10 free downloads.
 * A free account lifts the limit — that's the whole trade.
 */
export function DownloadGate({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="gate-title"
        >
          <m.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: springs.ui }}
            exit={{ opacity: 0, y: 12, scale: 0.98, transition: { duration: 0.15 } }}
            className="card relative w-full max-w-md p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="absolute right-3 top-3 inline-flex size-9 cursor-pointer items-center justify-center rounded-md text-fg-faint transition-colors hover:bg-primary-soft hover:text-fg"
            >
              <IconX size={16} />
            </button>

            <div className="inline-flex size-11 items-center justify-center rounded-md bg-primary-soft text-accent-text">
              <IconSparkles size={22} />
            </div>
            <h2 id="gate-title" className="font-heading mt-4 text-xl font-bold tracking-tight">
              Your {FREE_LIMIT} free downloads are used up
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">
              Downloads stay free — a free account just lifts the limit. You
              also get cloud-saved designs, 5 dynamic QR codes with scan
              analytics, and bulk CSV generation.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <Button href="/register" size="lg" className="w-full">
                Create a free account
              </Button>
              <Button href="/login" variant="secondary" size="lg" className="w-full">
                I already have one
              </Button>
            </div>
            <p className="mt-4 text-center text-xs text-fg-faint">
              No credit card. No watermarks. Ever.{" "}
              <Link href="/faq" className="underline underline-offset-2">
                Why the limit?
              </Link>
            </p>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
