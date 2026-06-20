"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Calendar,
  Users,
  FileDown,
  ArrowRight,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DesignCard } from "@/components/design-card";
import { DesignPreview } from "@/components/design-preview";
import { getDesignById, getRelatedDesigns } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export default function DesignDetailPage() {
  const params = useParams();
  const reduce = useReducedMotion() ?? false;
  const id = typeof params.id === "string" ? params.id : "";
  const design = getDesignById(id);
  const related = design ? getRelatedDesigns(design, 3) : [];

  if (!design) {
    return (
      <Container className="py-24 text-center">
        <p className="text-lg font-medium">Design not found</p>
        <Button href="/designs" className="mt-6">
          Browse all designs
        </Button>
      </Container>
    );
  }

  return (
    <>
      {/* Breadcrumb */}
      <Container className="pt-20 pb-2">
        <Link
          href="/designs"
          className="label-mono hover-underline inline-flex items-center gap-2 text-[color:var(--muted-foreground)] transition-colors hover:text-[color:var(--foreground)]"
        >
          <ArrowLeft className="h-3 w-3" /> All designs
        </Link>
      </Container>

      <Container className="pb-10">
        <div className="grid items-center gap-8 lg:min-h-[calc(100svh-8rem)] lg:grid-cols-12 lg:gap-10">
          {/* Image */}
          <div className="flex justify-center lg:col-span-7">
            <motion.div
              initial={reduce ? { opacity: 0 } : { opacity: 0, rotateY: -90, scale: 0.92 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, rotateY: 0, scale: 1 }}
              transition={{ duration: reduce ? 0.01 : 0.85, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformPerspective: 1400, transformOrigin: "left center" }}
              className="relative mx-auto aspect-[4/5] h-[58svh] w-auto max-h-[calc(100svh-9rem)] max-w-full overflow-hidden border border-[color:var(--foreground)] bg-[color:var(--muted)] lg:h-[calc(100svh-9rem)]"
            >
              <DesignPreview design={design} />

              <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2">
                {design.popular && <Badge variant="primary">Popular</Badge>}
                {design.new && <Badge variant="default">New</Badge>}
              </div>
            </motion.div>
          </div>

          {/* Details */}
          <div className="lg:col-span-5">
            <div className="border-l border-[color:var(--foreground)] pl-6">
              <p className="label-mono text-[color:var(--primary)]">
                {design.categoryLabel}
              </p>
              <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl leading-[1.05] tracking-tight sm:text-5xl">
                {design.name}
              </h1>
              <p className="mt-5 leading-relaxed text-[color:var(--muted-foreground)]">
                {design.description}
              </p>

              <div className="mt-6 flex items-baseline gap-2 border-y border-[color:var(--border)] py-4">
                <span className="font-[family-name:var(--font-display)] text-4xl tracking-tight">
                  {formatCurrency(design.price)}
                </span>
                <span className="label-mono text-[color:var(--muted-foreground)]">
                  per invitation
                </span>
              </div>

              <ul className="mt-6 space-y-3">
                {design.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm">
                    <Check className="h-4 w-4 shrink-0 text-[color:var(--primary)]" />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col gap-3">
                <Button
                  href={`/order?design=${design.id}`}
                  size="lg"
                  className="w-full"
                >
                  Order this design <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  href="/custom"
                  size="lg"
                  variant="outline"
                  className="w-full"
                >
                  Request customization
                </Button>
              </div>

              <div className="mt-6 flex items-center gap-4 label-mono text-[color:var(--muted-foreground)]">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3 w-3" /> 24h delivery
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="h-3 w-3" /> RSVP included
                </span>
                <span className="flex items-center gap-1.5">
                  <FileDown className="h-3 w-3" /> PDF download
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-20 border-t border-[color:var(--foreground)] pt-14">
            <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-tight sm:text-4xl">
              You may also <span className="display-italic">like</span>
            </h2>
            <ul className="mt-8 grid grid-cols-1 gap-px bg-[color:var(--foreground)] sm:grid-cols-2 lg:grid-cols-3">
              {related.map((d) => (
                <li key={d.id} className="bg-[color:var(--background)]">
                  <DesignCard design={d} className="border-0 hover:border-0" />
                </li>
              ))}
            </ul>
          </div>
        )}
      </Container>
    </>
  );
}
