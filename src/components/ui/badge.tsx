import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "secondary" | "outline" | "soft";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const variants: Record<string, string> = {
    default:
      "bg-[color:var(--foreground)] text-[color:var(--background)]",
    primary:
      "bg-[color:var(--primary)] text-[color:var(--primary-foreground)]",
    secondary:
      "bg-[color:var(--muted)] text-[color:var(--foreground)]",
    outline:
      "text-[color:var(--foreground)] border border-[color:var(--foreground)]",
    soft: "bg-[color:var(--primary)]/10 text-[color:var(--primary)]",
  };

  return (
    <span
      className={cn(
        "label-mono inline-flex items-center border px-2 py-0.5 transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
