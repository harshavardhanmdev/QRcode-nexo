"use client";

import { create } from "zustand";
import { api, type ApiUser } from "@/lib/api-client";

interface AuthState {
  user: ApiUser | null;
  /** false until the first /me check completes */
  loaded: boolean;
  refresh(): Promise<void>;
  signOut(): Promise<void>;
}

let refreshing: Promise<void> | null = null;

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loaded: false,

  refresh: () => {
    refreshing ??= (async () => {
      try {
        const res = await api.get<{ user: ApiUser }>("/api/auth/me");
        set({ user: res.user, loaded: true });
      } catch {
        set({ user: null, loaded: true });
      } finally {
        refreshing = null;
      }
    })();
    return refreshing;
  },

  signOut: async () => {
    try {
      await api.post("/api/auth/logout");
    } catch {
      /* session may already be dead */
    }
    set({ user: null });
  },
}));
