import { DesignsBrowser } from "@/components/designs/designs-browser";
import { CATEGORIES } from "@/lib/config";

type DesignsPageProps = {
  searchParams: Promise<{
    category?: string | string[];
  }>;
};

const FILTERABLE_CATEGORIES = new Set(
  CATEGORIES.filter((category) => category.slug !== "custom").map(
    (category) => category.slug
  )
);

function getInitialCategory(category: string | string[] | undefined) {
  const slug = Array.isArray(category) ? category[0] : category;
  return slug && FILTERABLE_CATEGORIES.has(slug) ? slug : "all";
}

export default async function DesignsPage({ searchParams }: DesignsPageProps) {
  const params = await searchParams;

  return <DesignsBrowser initialCategory={getInitialCategory(params.category)} />;
}
