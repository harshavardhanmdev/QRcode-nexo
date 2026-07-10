import Link from "next/link";
import clsx from "clsx";

/**
 * The qrdock wordmark — lowercase JetBrains Mono with a scan-green cursor
 * block, echoing a terminal prompt. Pure text+CSS so it's crisp at any size.
 */
export function Wordmark({
  className,
  asLink = true,
}: {
  className?: string;
  asLink?: boolean;
}) {
  const inner = (
    <span
      className={clsx(
        "font-heading inline-flex items-baseline text-xl font-bold tracking-tight",
        className,
      )}
    >
      <span className="text-fg">qrdock</span>
      <span
        aria-hidden
        className="ml-0.5 inline-block h-[0.72em] w-[0.36em] translate-y-[0.04em] rounded-[2px] bg-primary"
      />
    </span>
  );

  if (!asLink) return inner;
  return (
    <Link href="/" aria-label="qrdock — home" className="shrink-0">
      {inner}
    </Link>
  );
}
