import { cn } from "@/lib/utils";
import { SITE_CONFIG } from "@/lib/config";

/**
 * Invytly mark — an invitation envelope monogram.
 * Sharp ink card with a terracotta flap that lifts on hover.
 * Single self-contained SVG; scales crisply at any size.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("h-7 w-7", className)}
      role="img"
      aria-label={`${SITE_CONFIG.name} mark`}
    >
      {/* Card body */}
      <rect x="3" y="4" width="26" height="24" fill="currentColor" />

      {/* Envelope flap — terracotta accent, lifts on hover */}
      <g className="origin-top transition-transform duration-300 ease-out group-hover/logo:-translate-y-[1.5px]">
        <path d="M3 4 L16 17 L29 4 Z" fill="var(--primary)" />
        <path
          d="M3 4 L16 17 L29 4"
          fill="none"
          stroke="var(--background)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </g>

      {/* Seal dot */}
      <circle cx="16" cy="22" r="2" fill="var(--background)" />
    </svg>
  );
}

export function Logo({
  className,
  markClassName,
  wordmarkClassName,
  showWordmark = true,
}: {
  className?: string;
  markClassName?: string;
  wordmarkClassName?: string;
  showWordmark?: boolean;
}) {
  return (
    <span
      className={cn(
        "group/logo inline-flex items-center gap-2.5 font-[family-name:var(--font-display)] text-lg font-medium tracking-tight",
        className
      )}
    >
      <LogoMark className={markClassName} />
      {showWordmark && (
        <span className={cn("leading-none", wordmarkClassName)}>
          {SITE_CONFIG.name}
        </span>
      )}
    </span>
  );
}
