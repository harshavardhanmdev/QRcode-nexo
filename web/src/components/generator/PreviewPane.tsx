"use client";

import { useMemo } from "react";
import { m, springs } from "@/components/motion/Motion";
import { useGeneratorStore } from "@/store/generator-store";
import { IconAlert, IconCheck, IconInfo, IconQr } from "@/components/ui/icons";

export function PreviewPane() {
  const result = useGeneratorStore((s) => s.result);
  const verify = useGeneratorStore((s) => s.verify);
  const transparent = useGeneratorStore((s) => s.style.bg.kind === "transparent");

  const warnings = result?.warnings ?? [];
  const empty = !result;

  const checker = useMemo(
    () =>
      transparent
        ? {
            backgroundImage:
              "conic-gradient(var(--color-line) 0 25%, transparent 0 50%, var(--color-line) 0 75%, transparent 0)",
            backgroundSize: "20px 20px",
          }
        : undefined,
    [transparent],
  );

  return (
    <div>
      <div
        className="relative mx-auto aspect-square w-full max-w-[26rem] overflow-hidden rounded-lg border border-line"
        style={checker}
      >
        {empty ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-fg-faint">
            <IconQr size={44} />
            <p className="max-w-[16rem] text-center text-sm">
              Fill in the form and your code appears here, live.
            </p>
          </div>
        ) : (
          <>
            <m.div
              key={result.version + result.svg.length}
              initial={{ opacity: 0.4, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={springs.ui}
              className="absolute inset-0 [&_svg]:h-full [&_svg]:w-full"
              // engine output is our own sanitized SVG string
              dangerouslySetInnerHTML={{ __html: result.svg }}
            />
            {/* scanline sweep — replays on every regeneration */}
            <m.div
              key={`scan-${result.version}-${result.svg.length}`}
              aria-hidden
              initial={{ top: "-8%", opacity: 0.9 }}
              animate={{ top: "108%", opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-none absolute inset-x-0 h-1"
              style={{
                background:
                  "linear-gradient(90deg, transparent, var(--primary) 30%, var(--primary) 70%, transparent)",
                boxShadow: "0 0 18px 2px var(--primary)",
              }}
            />
          </>
        )}
      </div>

      {/* status row */}
      <div className="mx-auto mt-3 flex w-full max-w-[26rem] flex-wrap items-center gap-2 text-xs">
        {result && (
          <span className="font-heading inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-fg-faint">
            v{result.version} · {result.sizeModules - 8}×{result.sizeModules - 8}
          </span>
        )}
        {verify === "pass" && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-2.5 py-1 font-medium text-accent-text">
            <IconCheck size={13} /> Scannability verified
          </span>
        )}
        {verify === "fail" && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-danger-soft px-2.5 py-1 font-medium text-danger">
            <IconAlert size={13} /> Decode failed — see warnings
          </span>
        )}
        {result && result.riskScore > 0 && verify !== "fail" && (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium ${
              result.riskScore > 40
                ? "bg-danger-soft text-danger"
                : result.riskScore > 15
                  ? "bg-warn-soft text-warn"
                  : "bg-primary-soft text-accent-text"
            }`}
          >
            risk {result.riskScore}/100
          </span>
        )}
      </div>

      {/* warnings */}
      {warnings.length > 0 && (
        <ul className="mx-auto mt-3 w-full max-w-[26rem] space-y-2">
          {warnings.map((w) => (
            <li
              key={w.code}
              className="flex items-start gap-2 rounded-md bg-warn-soft px-3 py-2 text-[13px] leading-snug text-warn"
            >
              <IconInfo size={15} className="mt-0.5 shrink-0" />
              <span>
                {w.message}
                {w.hint && <span className="block opacity-80">{w.hint}</span>}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
