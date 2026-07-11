"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { m, springs } from "@/components/motion/Motion";
import { navLinks } from "@/components/layout/nav-links";

/** Which nav item owns the current route. */
export function activeHref(pathname: string): string | null {
  if (pathname === "/" || pathname.startsWith("/qr-code-generator")) {
    return "/qr-code-generator/url";
  }
  if (pathname.startsWith("/barcode-generator")) return "/barcode-generator";
  if (pathname.startsWith("/qr-code-with-letters")) return "/qr-code-with-letters";
  if (pathname.startsWith("/scan")) return "/scan";
  if (pathname.startsWith("/faq") || pathname.startsWith("/blog")) return "/faq";
  return null;
}

export function NavLinks() {
  const pathname = usePathname();
  const active = activeHref(pathname ?? "/");

  return (
    <ul className="flex items-center gap-1">
      {navLinks.map((link) => {
        const isActive = active === link.href;
        return (
          <li key={link.href} className="relative">
            <Link
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              className={clsx(
                "relative inline-flex min-h-11 items-center rounded-md px-3.5 text-sm font-medium transition-colors duration-200",
                isActive
                  ? "text-fg"
                  : link.highlight
                    ? "text-accent-text hover:bg-primary-soft"
                    : "text-fg-muted hover:bg-primary-soft hover:text-fg",
              )}
            >
              {link.label}
              {link.highlight && !isActive && (
                <span
                  aria-hidden
                  className="ml-1.5 inline-block size-1.5 rounded-full bg-primary"
                />
              )}
            </Link>
            {isActive && (
              <m.span
                layoutId="nav-underline"
                transition={springs.snap}
                aria-hidden
                className="absolute inset-x-3 -bottom-[13px] h-[2.5px] rounded-full bg-primary"
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}
