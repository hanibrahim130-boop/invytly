import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      "flex min-h-[80px] w-full border border-[color:var(--border)] bg-[color:var(--card)] px-4 py-3 text-sm transition-colors placeholder:text-[color:var(--muted-foreground)] focus-visible:border-[color:var(--foreground)] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    ref={ref}
    {...props}
  />
));
Textarea.displayName = "Textarea";
