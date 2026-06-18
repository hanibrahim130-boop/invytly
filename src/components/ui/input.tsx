import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={cn(
      "flex h-12 w-full border border-[color:var(--border)] bg-[color:var(--card)] px-4 py-2 text-sm transition-colors placeholder:text-[color:var(--muted-foreground)] focus-visible:border-[color:var(--foreground)] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    ref={ref}
    {...props}
  />
));
Input.displayName = "Input";
