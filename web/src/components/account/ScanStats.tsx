"use client";

import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { api, type DynamicStats } from "@/lib/api-client";

/**
 * Scan analytics panel (dataviz-skill compliant):
 * - scans/day → thin vertical bars, single validated hue (#16a34a on both
 *   surfaces), rounded data-ends anchored to the baseline, 2px gaps,
 *   per-bar hover tooltip, recessive grid, values in text tokens.
 * - country/device → labeled horizontal bar lists (they double as the
 *   accessible table view).
 */

const MARK = "#16a34a";
const RANGES = [
  { id: "7d", label: "7 days" },
  { id: "30d", label: "30 days" },
  { id: "all", label: "All time" },
] as const;

function lastNDays(n: number): string[] {
  const days: string[] = [];
  const d = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const dt = new Date(d.getTime() - i * 86400_000);
    days.push(dt.toISOString().slice(0, 10));
  }
  return days;
}

function DayBars({ stats }: { stats: DynamicStats }) {
  const [hover, setHover] = useState<number | null>(null);
  const days = useMemo(() => {
    const window = Math.min(stats.rangeDays, 30);
    const map = new Map(stats.byDay.map((d) => [d.day, d.n]));
    return lastNDays(window).map((day) => ({ day, n: map.get(day) ?? 0 }));
  }, [stats]);

  const max = Math.max(1, ...days.map((d) => d.n));
  const W = 560;
  const H = 120;
  const PAD_BOTTOM = 18;
  const gap = 2;
  const barW = (W - gap * (days.length - 1)) / days.length;
  const plotH = H - PAD_BOTTOM;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Scans per day, last ${days.length} days`}
      >
        {/* recessive gridlines at 0 and max */}
        <line x1="0" x2={W} y1={plotH} y2={plotH} stroke="var(--border)" strokeWidth="1" />
        <line x1="0" x2={W} y1={2} y2={2} stroke="var(--border)" strokeWidth="1" strokeDasharray="3 4" />
        <text x={W} y={10} textAnchor="end" fontSize="10" fill="var(--fg-faint)">
          {max}
        </text>

        {days.map((d, i) => {
          const h = d.n === 0 ? 2 : Math.max(3, (d.n / max) * (plotH - 8));
          const x = i * (barW + gap);
          return (
            <g key={d.day}>
              {/* generous hit target */}
              <rect
                x={x}
                y={0}
                width={barW + gap}
                height={H}
                fill="transparent"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              />
              <rect
                x={x}
                y={plotH - h}
                width={barW}
                height={h}
                rx={Math.min(4, barW / 2)}
                fill={d.n === 0 ? "var(--border)" : MARK}
                opacity={hover === null || hover === i ? 1 : 0.45}
                style={{ transition: "opacity 120ms" }}
                pointerEvents="none"
              />
            </g>
          );
        })}
        {/* x labels: first and last day only (recessive) */}
        <text x={0} y={H - 4} fontSize="10" fill="var(--fg-faint)">
          {days[0]?.day.slice(5)}
        </text>
        <text x={W} y={H - 4} textAnchor="end" fontSize="10" fill="var(--fg-faint)">
          {days[days.length - 1]?.day.slice(5)}
        </text>
      </svg>

      {hover !== null && (
        <div
          className="glass pointer-events-none absolute -top-2 z-10 -translate-x-1/2 -translate-y-full rounded-md px-2.5 py-1.5 text-xs shadow-pop"
          style={{ left: `${((hover + 0.5) / days.length) * 100}%` }}
          role="status"
        >
          <span className="font-heading font-semibold text-fg">{days[hover].n}</span>{" "}
          <span className="text-fg-muted">
            scan{days[hover].n === 1 ? "" : "s"} · {days[hover].day.slice(5)}
          </span>
        </div>
      )}
    </div>
  );
}

function BreakdownList({
  title,
  rows,
  total,
}: {
  title: string;
  rows: { label: string; n: number }[];
  total: number;
}) {
  return (
    <div>
      <h4 className="font-heading text-xs font-semibold uppercase tracking-[0.14em] text-fg-faint">
        {title}
      </h4>
      {rows.length === 0 ? (
        <p className="mt-2 text-sm text-fg-faint">No data yet.</p>
      ) : (
        <ul className="mt-2 space-y-2">
          {rows.map((r) => (
            <li key={r.label} className="text-sm">
              <div className="flex items-baseline justify-between gap-3">
                <span className="truncate text-fg-muted">{r.label}</span>
                <span className="font-heading shrink-0 text-fg">{r.n}</span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-primary-soft">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.max(3, (r.n / Math.max(1, total)) * 100)}%`,
                    background: MARK,
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const COUNTRY_NAMES: Record<string, string> = {
  IN: "India", US: "United States", GB: "United Kingdom", AE: "UAE",
  SG: "Singapore", DE: "Germany", FR: "France", CA: "Canada", AU: "Australia",
  unknown: "Unknown",
};

export function ScanStats({ dynamicId }: { dynamicId: string }) {
  const [range, setRange] = useState<(typeof RANGES)[number]["id"]>("30d");
  const [stats, setStats] = useState<DynamicStats | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let stale = false;
    setStats(null);
    setError(false);
    api
      .get<DynamicStats>(`/api/dynamic/${dynamicId}/stats?range=${range}`)
      .then((s) => !stale && setStats(s))
      .catch(() => !stale && setError(true));
    return () => {
      stale = true;
    };
  }, [dynamicId, range]);

  return (
    <div className="mt-4 rounded-lg border border-line bg-bg p-4 sm:p-5">
      {/* filters in one row above the chart */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-fg-muted">
          <span className="font-heading text-xl font-bold text-fg">
            {stats ? stats.total : "–"}
          </span>{" "}
          scans
        </p>
        <div role="radiogroup" aria-label="Time range" className="flex rounded-md border border-line p-0.5">
          {RANGES.map((r) => (
            <button
              key={r.id}
              role="radio"
              aria-checked={range === r.id}
              onClick={() => setRange(r.id)}
              className={clsx(
                "h-7 cursor-pointer rounded-[0.3rem] px-2.5 text-[11px] font-medium transition-colors",
                range === r.id ? "bg-primary text-primary-fg" : "text-fg-muted hover:text-fg",
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {error ? (
          <p className="text-sm text-danger">Couldn&apos;t load stats — try again.</p>
        ) : !stats ? (
          <div className="skeleton h-28 w-full rounded-md" />
        ) : stats.total === 0 ? (
          <p className="rounded-md bg-primary-soft/50 px-3 py-6 text-center text-sm text-fg-muted">
            No scans in this period yet — print it, share it, watch this space.
          </p>
        ) : (
          <>
            <DayBars stats={stats} />
            <div className="mt-5 grid gap-6 sm:grid-cols-2">
              <BreakdownList
                title="Countries"
                total={stats.total}
                rows={stats.byCountry.map((c) => ({
                  label: COUNTRY_NAMES[c.country] ?? c.country,
                  n: c.n,
                }))}
              />
              <BreakdownList
                title="Devices"
                total={stats.total}
                rows={stats.byDevice.map((d) => ({ label: d.device, n: d.n }))}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
