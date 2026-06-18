import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import type { Design } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { DesignPreview } from "@/components/design-preview";

export function DesignCard({ design, className }: { design: Design; className?: string }) {
  return (
    <Link
      href={`/designs/${design.id}`}
      className={cn(
        "group relative flex flex-col border border-[color:var(--border)] bg-[color:var(--card)] transition-colors duration-200 hover:border-[color:var(--foreground)]",
        className
      )}
    >
      {/* Preview */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[color:var(--muted)]">
        <DesignPreview
          design={design}
          className="transition-transform duration-500 group-hover:scale-[1.03]"
        />

        {/* Badges */}
        <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-1.5">
          {design.popular && <Badge variant="primary">Popular</Badge>}
          {design.new && <Badge variant="default">New</Badge>}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-base font-semibold leading-snug transition-colors group-hover:text-[color:var(--primary)]">
              {design.name}
            </h3>
            <p className="label-mono mt-1 text-[color:var(--muted-foreground)]">
              {design.categoryLabel} · {design.style}
            </p>
          </div>
          <span className="label-mono shrink-0 text-[color:var(--foreground)]">
            {formatCurrency(design.price)}
          </span>
        </div>

        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-[color:var(--muted-foreground)]">
          {design.description}
        </p>

        <div className="mt-4 flex items-center gap-2 label-mono text-[color:var(--foreground)] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          View details
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
