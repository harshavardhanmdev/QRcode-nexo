"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, m, springs } from "@/components/motion/Motion";
import { useAuthStore } from "@/store/auth-store";
import { IconUser } from "@/components/ui/icons";

export function UserMenu() {
  const { user, loaded, refresh, signOut } = useAuthStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // reserve space pre-hydration so the header never shifts
  if (!loaded) return <span className="inline-block h-11 w-20" aria-hidden />;

  if (!user) {
    return (
      <Link
        href="/login"
        className="inline-flex h-9 items-center rounded-md border border-line px-3.5 text-sm font-medium text-fg-muted transition-colors duration-200 hover:border-line-strong hover:text-fg"
      >
        Sign in
      </Link>
    );
  }

  const initial = user.email[0]?.toUpperCase() ?? "?";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Account menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="font-heading inline-flex size-9 cursor-pointer items-center justify-center rounded-full bg-primary-soft text-sm font-bold text-accent-text ring-1 ring-[var(--ring)] transition-transform hover:scale-105"
      >
        {initial}
      </button>
      <AnimatePresence>
        {open && (
          <m.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: springs.snap }}
            exit={{ opacity: 0, y: -4, transition: { duration: 0.12 } }}
            className="glass absolute right-0 top-[calc(100%+0.5rem)] z-50 w-56 rounded-lg p-2 shadow-pop"
          >
            <p className="truncate px-3 py-2 text-xs text-fg-faint">{user.email}</p>
            <Link
              href="/account"
              onClick={() => setOpen(false)}
              className="flex min-h-10 items-center gap-2 rounded-md px-3 text-sm text-fg-muted transition-colors hover:bg-primary-soft hover:text-fg"
            >
              <IconUser size={16} />
              My codes & designs
            </Link>
            <button
              type="button"
              onClick={async () => {
                setOpen(false);
                await signOut();
                router.push("/");
              }}
              className="flex min-h-10 w-full cursor-pointer items-center gap-2 rounded-md px-3 text-left text-sm text-fg-muted transition-colors hover:bg-danger-soft hover:text-danger"
            >
              Sign out
            </button>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
