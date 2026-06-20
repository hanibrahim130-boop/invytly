"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal, Grid3X3, LayoutList } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { DesignCard } from "@/components/design-card";
import { DESIGNS, type DesignStyle } from "@/lib/mock-data";
import { CATEGORIES } from "@/lib/config";
import { cn } from "@/lib/utils";

type DesignsBrowserProps = {
  initialCategory: string;
};

const ALL_STYLES: DesignStyle[] = ["modern", "classic", "minimal", "floral", "glam"];
const CATEGORY_OPTIONS = CATEGORIES.filter((category) => category.slug !== "custom");

export function DesignsBrowser({ initialCategory }: DesignsBrowserProps) {
  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState(initialCategory);
  const [syncedCategory, setSyncedCategory] = React.useState(initialCategory);
  const [activeStyle, setActiveStyle] = React.useState<string>("all");
  const [view, setView] = React.useState<"grid" | "list">("grid");

  // Sync with the URL-driven prop (e.g. back/forward navigation) without an
  // effect — React's recommended pattern for adjusting state on prop change.
  if (initialCategory !== syncedCategory) {
    setSyncedCategory(initialCategory);
    setActiveCategory(initialCategory);
  }

  const activeCategoryLabel = CATEGORY_OPTIONS.find(
    (category) => category.slug === activeCategory
  )?.name;

  const updateCategory = (category: string) => {
    setActiveCategory(category);
    router.push(
      category === "all" ? "/designs" : `/designs?category=${encodeURIComponent(category)}`
    );
  };

  const filtered = React.useMemo(() => {
    return DESIGNS.filter((d) => {
      const matchesSearch =
        !search ||
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        activeCategory === "all" || d.category === activeCategory;
      const matchesStyle = activeStyle === "all" || d.style === activeStyle;
      return matchesSearch && matchesCategory && matchesStyle;
    });
  }, [search, activeCategory, activeStyle]);

  return (
    <>
      <section className="border-b border-[color:var(--foreground)] pt-16">
        <Container className="py-14">
          <span className="label-mono text-[color:var(--primary)]">
            Browse all
          </span>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl leading-[0.95] tracking-tight sm:text-6xl md:text-7xl">
            Invitation <span className="display-italic">designs</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-[color:var(--muted-foreground)]">
            Every design includes a hosted RSVP page, WhatsApp-optimized sharing, and a downloadable PDF.
          </p>
        </Container>
      </section>

      <Container className="py-10">
        {/* Search + filters */}
        <div className="flex flex-col gap-4 border-b border-[color:var(--border)] pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--muted-foreground)]" />
            <Input
              placeholder="Search designs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setView("grid")}
              className={cn(
                "grid h-9 w-9 place-items-center border transition-colors",
                view === "grid"
                  ? "border-[color:var(--foreground)] bg-[color:var(--foreground)] text-[color:var(--background)]"
                  : "border-[color:var(--border)] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)]"
              )}
              aria-label="Grid view"
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setView("list")}
              className={cn(
                "grid h-9 w-9 place-items-center border transition-colors",
                view === "list"
                  ? "border-[color:var(--foreground)] bg-[color:var(--foreground)] text-[color:var(--background)]"
                  : "border-[color:var(--border)] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)]"
              )}
              aria-label="List view"
            >
              <LayoutList className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Category pills */}
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => updateCategory("all")}
            aria-pressed={activeCategory === "all"}
            className={cn(
              "border px-3.5 py-1.5 text-sm transition-colors",
              activeCategory === "all"
                ? "border-[color:var(--foreground)] bg-[color:var(--foreground)] text-[color:var(--background)]"
                : "border-[color:var(--border)] text-[color:var(--muted-foreground)] hover:border-[color:var(--foreground)] hover:text-[color:var(--foreground)]"
            )}
          >
            All
          </button>
          {CATEGORY_OPTIONS.map((category) => (
            <button
              key={category.slug}
              type="button"
              onClick={() => updateCategory(category.slug)}
              aria-pressed={activeCategory === category.slug}
              className={cn(
                "border px-3.5 py-1.5 text-sm transition-colors",
                activeCategory === category.slug
                  ? "border-[color:var(--foreground)] bg-[color:var(--foreground)] text-[color:var(--background)]"
                  : "border-[color:var(--border)] text-[color:var(--muted-foreground)] hover:border-[color:var(--foreground)] hover:text-[color:var(--foreground)]"
              )}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Style pills */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="label-mono text-[color:var(--muted-foreground)]">
            <SlidersHorizontal className="mr-1 inline h-3 w-3" />
            Style:
          </span>
          <button
            type="button"
            onClick={() => setActiveStyle("all")}
            className={cn(
              "label-mono border px-2.5 py-1 transition-colors capitalize",
              activeStyle === "all"
                ? "border-[color:var(--foreground)] bg-[color:var(--foreground)] text-[color:var(--background)]"
                : "border-[color:var(--border)] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)]"
            )}
          >
            All
          </button>
          {ALL_STYLES.map((style) => (
            <button
              key={style}
              type="button"
              onClick={() => setActiveStyle(style)}
              className={cn(
                "label-mono border px-2.5 py-1 transition-colors capitalize",
                activeStyle === style
                  ? "border-[color:var(--foreground)] bg-[color:var(--foreground)] text-[color:var(--background)]"
                  : "border-[color:var(--border)] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)]"
              )}
            >
              {style}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="label-mono text-[color:var(--muted-foreground)]">
            {filtered.length} design{filtered.length !== 1 ? "s" : ""}
            {activeCategoryLabel ? ` in ${activeCategoryLabel}` : ""}
          </p>
          {activeCategoryLabel ? (
            <button
              type="button"
              onClick={() => updateCategory("all")}
              className="label-mono hover-underline w-fit text-[color:var(--foreground)]"
            >
              Clear category
            </button>
          ) : null}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-12 border border-[color:var(--border)] p-12 text-center">
            <p className="text-lg font-medium">No designs found</p>
            <p className="mt-1 text-sm text-[color:var(--muted-foreground)]">
              Try adjusting your filters or search query.
            </p>
          </div>
        ) : (
          <ul
            className={cn(
              "group/grid mt-6 grid gap-px bg-[color:var(--foreground)]",
              view === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            )}
          >
            {filtered.map((design) => (
              <li
                key={design.id}
                className="relative bg-[color:var(--background)] opacity-100 transition-opacity duration-300 hover:z-10 hover:!opacity-100 group-hover/grid:opacity-40"
              >
                <DesignCard design={design} className="border-0 hover:border-0" />
              </li>
            ))}
          </ul>
        )}
      </Container>
    </>
  );
}
