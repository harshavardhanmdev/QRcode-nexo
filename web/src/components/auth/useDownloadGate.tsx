"use client";

import { useCallback, useEffect, useState } from "react";
import { DownloadGate } from "./DownloadGate";
import { useAuthStore } from "@/store/auth-store";
import { checkGate, recordDownload } from "@/lib/quota";

/**
 * Wraps any download action with the freemium gate:
 *   const { guard, gateModal } = useDownloadGate();
 *   ... onClick={() => guard(actualDownload)} ... {gateModal}
 * Signed-in users pass straight through; anonymous users get 10, then the
 * sign-up modal.
 */
export function useDownloadGate() {
  const user = useAuthStore((s) => s.user);
  const loaded = useAuthStore((s) => s.loaded);
  const refresh = useAuthStore((s) => s.refresh);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!loaded) void refresh();
  }, [loaded, refresh]);

  const guard = useCallback(
    async (download: () => Promise<void> | void): Promise<boolean> => {
      if (!checkGate(Boolean(user))) {
        setOpen(true);
        return false;
      }
      await download();
      if (!user) recordDownload();
      return true;
    },
    [user],
  );

  const gateModal = <DownloadGate open={open} onClose={() => setOpen(false)} />;
  return { guard, gateModal };
}
