"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, m } from "@/components/motion/Motion";
import { api, ApiError, type DynamicCode, type SavedDesign } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/Button";
import { Label, TextInput } from "@/components/ui/fields";
import { ScanStats } from "./ScanStats";
import {
  IconChart,
  IconCheck,
  IconChevronDown,
  IconCopy,
  IconLink,
  IconQr,
  IconX,
} from "@/components/ui/icons";

function shortUrl(slug: string): string {
  return `${typeof location !== "undefined" ? location.origin : ""}/q/${slug}`;
}

function DynamicRow({
  code,
  onChanged,
}: {
  code: DynamicCode;
  onChanged: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [dest, setDest] = useState(code.destination);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setError(null);
    try {
      await api.put(`/api/dynamic/${code.id}`, { destination: dest });
      setEditing(false);
      onChanged();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Update failed.");
    }
  }

  async function toggleActive() {
    try {
      await api.put(`/api/dynamic/${code.id}`, { active: code.active !== 1 });
      onChanged();
    } catch {
      /* refetch shows truth */
    }
  }

  return (
    <li className="card p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-heading truncate text-sm font-semibold">
              {code.name || code.slug}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                code.active ? "bg-primary-soft text-accent-text" : "bg-danger-soft text-danger"
              }`}
            >
              {code.active ? "active" : "off"}
            </span>
          </div>
          <button
            type="button"
            onClick={async () => {
              await navigator.clipboard.writeText(shortUrl(code.slug));
              setCopied(true);
              setTimeout(() => setCopied(false), 1400);
            }}
            title="Copy short link"
            className="mt-1 inline-flex cursor-pointer items-center gap-1.5 font-heading text-xs text-accent-text hover:underline"
          >
            {copied ? <IconCheck size={12} /> : <IconCopy size={12} />}
            /q/{code.slug}
          </button>
        </div>

        <span className="font-heading text-sm text-fg-muted">
          <span className="text-lg font-bold text-fg">{code.scans}</span> scans
        </span>

        <div className="flex items-center gap-1.5">
          <Button
            href={`/?t=url&url=${encodeURIComponent(shortUrl(code.slug))}#generator`}
            variant="secondary"
            size="sm"
            title="Design a QR code for this short link"
          >
            <IconQr size={15} />
            Make QR
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleActive}
            title={code.active ? "Deactivate (scans will 404)" : "Reactivate"}
          >
            {code.active ? "Turn off" : "Turn on"}
          </Button>
          <button
            type="button"
            aria-label={expanded ? "Hide analytics" : "Show analytics"}
            aria-expanded={expanded}
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex size-9 cursor-pointer items-center justify-center rounded-md text-fg-muted transition-colors hover:bg-primary-soft hover:text-fg"
          >
            <IconChart size={16} />
          </button>
        </div>
      </div>

      {/* destination */}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
        <span className="text-fg-faint">→</span>
        {editing ? (
          <span className="flex min-w-0 flex-1 items-center gap-2">
            <TextInput
              value={dest}
              onChange={(e) => setDest(e.target.value)}
              className="h-9 flex-1 text-[13px]"
              aria-label="Destination URL"
            />
            <Button size="sm" onClick={save}>
              Save
            </Button>
            <Button size="sm" variant="ghost" onClick={() => { setEditing(false); setDest(code.destination); }}>
              Cancel
            </Button>
          </span>
        ) : (
          <>
            <span className="min-w-0 flex-1 truncate text-fg-muted">{code.destination}</span>
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="cursor-pointer text-xs text-accent-text underline underline-offset-2"
            >
              edit destination
            </button>
          </>
        )}
      </div>
      {error && <p className="mt-2 text-xs text-danger">{error}</p>}

      <AnimatePresence initial={false}>
        {expanded && (
          <m.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <ScanStats dynamicId={code.id} />
          </m.div>
        )}
      </AnimatePresence>
    </li>
  );
}

export function AccountDashboard() {
  const router = useRouter();
  const { user, loaded, refresh } = useAuthStore();
  const [dynamic, setDynamic] = useState<DynamicCode[] | null>(null);
  const [designs, setDesigns] = useState<SavedDesign[] | null>(null);
  const [newDest, setNewDest] = useState("");
  const [newName, setNewName] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (loaded && !user) router.replace("/login");
  }, [loaded, user, router]);

  const load = useCallback(() => {
    api.get<{ dynamic: DynamicCode[] }>("/api/dynamic").then((r) => setDynamic(r.dynamic)).catch(() => setDynamic([]));
    api.get<{ designs: SavedDesign[] }>("/api/designs").then((r) => setDesigns(r.designs)).catch(() => setDesigns([]));
  }, []);

  useEffect(() => {
    if (user) load();
  }, [user, load]);

  if (!loaded || !user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <div className="skeleton h-10 w-64 rounded-md" />
        <div className="skeleton mt-6 h-40 w-full rounded-lg" />
      </div>
    );
  }

  async function createDynamic(e: React.FormEvent) {
    e.preventDefault();
    setCreateError(null);
    setCreating(true);
    try {
      let dest = newDest.trim();
      if (dest && !/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(dest)) dest = `https://${dest}`;
      await api.post("/api/dynamic", { destination: dest, name: newName.trim() || undefined });
      setNewDest("");
      setNewName("");
      load();
    } catch (err) {
      setCreateError(err instanceof ApiError ? err.message : "Couldn't create the code.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <h1 className="font-heading text-3xl font-bold tracking-tight">
        Your qrdock
      </h1>
      <p className="mt-2 text-sm text-fg-muted">{user.email} · free plan</p>

      {/* DYNAMIC CODES ------------------------------------------------- */}
      <section className="mt-10">
        <h2 className="font-heading flex items-center gap-2 text-lg font-semibold">
          <IconLink size={18} className="text-accent-text" />
          Dynamic QR codes
        </h2>
        <p className="mt-1 text-sm text-fg-muted">
          Short links you can repoint anytime — with scan analytics. Free plan
          includes 5 active codes.
        </p>

        <form onSubmit={createDynamic} className="card mt-4 grid gap-3 p-4 sm:grid-cols-[1fr_12rem_auto] sm:items-end sm:p-5">
          <div>
            <Label htmlFor="dyn-dest" required>
              Destination link
            </Label>
            <TextInput
              id="dyn-dest"
              value={newDest}
              onChange={(e) => setNewDest(e.target.value)}
              placeholder="https://your-site.com/menu"
              required
            />
          </div>
          <div>
            <Label htmlFor="dyn-name">Name</Label>
            <TextInput
              id="dyn-name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Diwali campaign"
              maxLength={80}
            />
          </div>
          <Button type="submit" disabled={creating || !newDest.trim()}>
            {creating ? "Creating…" : "Create"}
          </Button>
          {createError && (
            <p className="text-xs text-danger sm:col-span-3">{createError}</p>
          )}
        </form>

        {dynamic === null ? (
          <div className="skeleton mt-4 h-24 w-full rounded-lg" />
        ) : dynamic.length === 0 ? (
          <p className="mt-4 rounded-lg border border-dashed border-line-strong px-4 py-8 text-center text-sm text-fg-muted">
            No dynamic codes yet — create your first above, then design a QR
            for its short link.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {dynamic.map((code) => (
              <DynamicRow key={code.id} code={code} onChanged={load} />
            ))}
          </ul>
        )}
      </section>

      {/* SAVED DESIGNS ------------------------------------------------- */}
      <section className="mt-12">
        <h2 className="font-heading flex items-center gap-2 text-lg font-semibold">
          <IconQr size={18} className="text-accent-text" />
          Saved designs
        </h2>
        <p className="mt-1 text-sm text-fg-muted">
          Saved from the generator with the stack icon — reopen to keep editing.
        </p>

        {designs === null ? (
          <div className="skeleton mt-4 h-24 w-full rounded-lg" />
        ) : designs.length === 0 ? (
          <p className="mt-4 rounded-lg border border-dashed border-line-strong px-4 py-8 text-center text-sm text-fg-muted">
            Nothing saved yet.{" "}
            <Link href="/#generator" className="text-accent-text underline underline-offset-2">
              Design a code
            </Link>{" "}
            and hit save.
          </p>
        ) : (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {designs.map((d) => {
              const params = new URLSearchParams(
                Object.entries(d.config).filter(
                  (kv): kv is [string, string] => typeof kv[1] === "string",
                ),
              );
              return (
                <li key={d.id} className="card flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="font-heading truncate text-sm font-semibold">{d.name}</p>
                    <p className="mt-0.5 text-xs text-fg-faint">
                      {new Date(d.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <Button href={`/?${params.toString()}#generator`} variant="secondary" size="sm">
                      Open
                    </Button>
                    <button
                      type="button"
                      aria-label={`Delete ${d.name}`}
                      onClick={async () => {
                        await api.del(`/api/designs/${d.id}`);
                        load();
                      }}
                      className="inline-flex size-9 cursor-pointer items-center justify-center rounded-md text-fg-faint transition-colors hover:bg-danger-soft hover:text-danger"
                    >
                      <IconX size={15} />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

export default AccountDashboard;
