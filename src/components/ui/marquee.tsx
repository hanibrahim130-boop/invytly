"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  speed?: number;
}

export function Marquee({ children, speed = 30, className, ...props }: MarqueeProps) {
  return (
    <div className={cn("relative w-full overflow-hidden", className)} {...props}>
      <div
        className="marquee-track"
        style={{ animationDuration: `${speed}s` }}
      >
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden="true">{children}</div>
      </div>
    </div>
  );
}
