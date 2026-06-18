import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-all duration-200 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-[color:var(--background)] disabled:pointer-events-none disabled:opacity-50 " +
  "active:scale-[0.98]";

const variants: Record<Variant, string> = {
  primary:
    "bg-[color:var(--foreground)] text-[color:var(--background)] hover:bg-[color:var(--primary)] hover:text-[color:var(--primary-foreground)]",
  secondary:
    "bg-[color:var(--muted)] text-[color:var(--foreground)] hover:bg-[color:var(--foreground)] hover:text-[color:var(--background)]",
  ghost: "hover:bg-[color:var(--muted)] text-[color:var(--foreground)]",
  outline:
    "border border-[color:var(--foreground)] bg-transparent text-[color:var(--foreground)] hover:bg-[color:var(--foreground)] hover:text-[color:var(--background)]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children?: React.ReactNode;
};

type ButtonProps = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type LinkProps = CommonProps &
  Omit<React.ComponentProps<typeof Link>, "className"> & { href: string };

export function Button(props: ButtonProps | LinkProps) {
  const { variant = "primary", size = "md", className, children } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if ("href" in props && props.href) {
    const { href, variant: _v, size: _s, className: _c, children: _ch, ...rest } = props;
    void _v; void _s; void _c; void _ch;
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  const {
    variant: _v,
    size: _s,
    className: _c,
    children: _ch,
    ...rest
  } = props as ButtonProps;
  void _v; void _s; void _c; void _ch;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
