import Link from "next/link";
import clsx from "clsx";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex cursor-pointer select-none items-center justify-center gap-2 rounded-md font-medium " +
  "transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-[var(--ease-out-expo)] " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.97] " +
  "disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-fg shadow-soft hover:bg-primary-hover",
  secondary:
    "border border-line-strong bg-surface text-fg hover:border-line-strong hover:bg-bg-elevated",
  ghost: "text-fg-muted hover:bg-primary-soft hover:text-fg",
  danger: "bg-danger-soft text-danger hover:bg-danger hover:text-white",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", className, ...rest } = props;
  const cls = clsx(base, variants[variant], sizes[size], className);

  if ("href" in rest && typeof rest.href === "string") {
    const { href, ...anchor } = rest as ButtonAsLink;
    return <Link href={href} {...anchor} className={cls} />;
  }
  return <button {...(rest as ButtonAsButton)} className={cls} />;
}
