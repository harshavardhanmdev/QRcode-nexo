import { Wordmark } from "@/components/layout/Wordmark";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { MobileNav } from "@/components/layout/MobileNav";
import { NavLinks } from "@/components/layout/NavLinks";
import { UserMenu } from "@/components/auth/UserMenu";

export function Header() {
  return (
    <header className="glass sticky top-0 z-40 border-x-0 border-t-0">
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Wordmark />

        <nav aria-label="Primary" className="hidden md:block">
          <NavLinks />
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserMenu />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
