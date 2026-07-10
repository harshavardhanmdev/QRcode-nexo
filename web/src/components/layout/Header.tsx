import Link from "next/link";
import clsx from "clsx";
import { Wordmark } from "@/components/layout/Wordmark";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { MobileNav } from "@/components/layout/MobileNav";
import { navLinks } from "@/components/layout/nav-links";

export function Header() {
  return (
    <header className="glass sticky top-0 z-40 border-x-0 border-t-0">
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Wordmark />

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={clsx(
                    "inline-flex min-h-11 items-center rounded-md px-3.5 text-sm font-medium transition-colors duration-200",
                    link.highlight
                      ? "text-accent-text hover:bg-primary-soft"
                      : "text-fg-muted hover:bg-primary-soft hover:text-fg",
                  )}
                >
                  {link.label}
                  {link.highlight && (
                    <span
                      aria-hidden
                      className="ml-1.5 inline-block size-1.5 rounded-full bg-primary"
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
