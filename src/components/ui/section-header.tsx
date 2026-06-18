import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  label?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  label,
  title,
  description,
  align = "left",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {label && (
        <span className="label-mono text-[color:var(--primary)]">
          {label}
        </span>
      )}
      <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-base leading-relaxed text-[color:var(--muted-foreground)] sm:text-lg">{description}</p>
      )}
    </div>
  );
}
