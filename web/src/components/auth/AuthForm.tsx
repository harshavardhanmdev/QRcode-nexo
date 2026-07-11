"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { api, ApiError } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/Button";
import { Label, TextInput } from "@/components/ui/fields";
import { IconAlert } from "@/components/ui/icons";

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.3 6.1 29.4 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 18.9 12 24 12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.3 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.4-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C36.9 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z"/>
    </svg>
  );
}

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const search = useSearchParams();
  const refresh = useAuthStore((s) => s.refresh);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    search.get("error")?.startsWith("oauth")
      ? "Google sign-in didn't complete — try again or use email."
      : null,
  );
  const [busy, setBusy] = useState(false);
  const [googleEnabled, setGoogleEnabled] = useState(false);

  useEffect(() => {
    api
      .get<{ google: boolean }>("/api/auth/config")
      .then((c) => setGoogleEnabled(c.google))
      .catch(() => {});
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await api.post(`/api/auth/${mode}`, { email, password });
      await refresh();
      router.push("/account");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong — try again.");
    } finally {
      setBusy(false);
    }
  }

  const other =
    mode === "login"
      ? { href: "/register", label: "New here? Create a free account" }
      : { href: "/login", label: "Already have an account? Sign in" };

  return (
    <div className="card mx-auto w-full max-w-md p-6 sm:p-8">
      <h1 className="font-heading text-2xl font-bold tracking-tight">
        {mode === "login" ? "Welcome back" : "Create your free account"}
      </h1>
      <p className="mt-2 text-sm text-fg-muted">
        {mode === "login"
          ? "Unlimited downloads, saved designs and your dynamic codes."
          : "Unlimited downloads, cloud-saved designs, 5 dynamic QR codes with scan analytics, and bulk generation. Free."}
      </p>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <div>
          <Label htmlFor="auth-email" required>
            Email
          </Label>
          <TextInput
            id="auth-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <div>
          <Label htmlFor="auth-password" required>
            Password
          </Label>
          <TextInput
            id="auth-password"
            type="password"
            required
            minLength={8}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={mode === "register" ? "8+ characters" : "••••••••"}
          />
        </div>

        {error && (
          <p
            role="alert"
            className="inline-flex items-center gap-2 rounded-md bg-danger-soft px-3 py-2 text-[13px] text-danger"
          >
            <IconAlert size={15} />
            {error}
          </p>
        )}

        <Button type="submit" disabled={busy} size="lg" className="w-full">
          {busy ? "One moment…" : mode === "login" ? "Sign in" : "Create account"}
        </Button>
      </form>

      {googleEnabled && (
        <>
          <div className="my-5 flex items-center gap-3 text-xs text-fg-faint">
            <span className="h-px flex-1 bg-line" />
            or
            <span className="h-px flex-1 bg-line" />
          </div>
          <Button href="/api/auth/google" variant="secondary" size="lg" className="w-full">
            <GoogleMark />
            Continue with Google
          </Button>
        </>
      )}

      <p className="mt-6 text-center text-sm">
        <Link href={other.href} className="text-accent-text underline underline-offset-4">
          {other.label}
        </Link>
      </p>
    </div>
  );
}
