"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { AnimatePresence, m, springs } from "@/components/motion/Motion";
import { navLinks } from "@/components/layout/nav-links";
import { IconMenu, IconX } from "@/components/ui/icons";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex size-11 cursor-pointer items-center justify-center rounded-md text-fg-muted transition-colors hover:bg-primary-soft hover:text-fg"
      >
        {open ? <IconX /> : <IconMenu />}
      </button>

      <AnimatePresence>
        {open && (
          <m.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0, transition: springs.ui }}
            exit={{ opacity: 0, y: -6, transition: { duration: 0.15 } }}
            className="glass absolute inset-x-3 top-[calc(100%+0.5rem)] z-50 rounded-lg p-2 shadow-pop"
          >
            <ul className="flex flex-col">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={clsx(
                      "flex min-h-11 items-center rounded-md px-4 py-2.5 text-sm font-medium transition-colors",
                      pathname === link.href
                        ? "bg-primary-soft text-accent-text"
                        : "text-fg-muted hover:bg-primary-soft hover:text-fg",
                      link.highlight && "text-accent-text",
                    )}
                  >
                    {link.label}
                    {link.highlight && (
                      <span className="ml-2 rounded-full bg-primary-soft px-2 py-0.5 font-heading text-[10px] font-semibold uppercase tracking-wider text-accent-text">
                        new
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </m.nav>
        )}
      </AnimatePresence>
    </div>
  );
}
