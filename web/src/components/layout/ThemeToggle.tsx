"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { IconMoon, IconSun } from "@/components/ui/icons";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Reserve the exact box before mount so the header never shifts.
  if (!mounted) {
    return <span className="inline-block size-11" aria-hidden />;
  }

  const dark = resolvedTheme === "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      className="inline-flex size-11 cursor-pointer items-center justify-center rounded-md text-fg-muted transition-colors duration-200 hover:bg-primary-soft hover:text-fg"
    >
      {dark ? <IconSun /> : <IconMoon />}
    </button>
  );
}
