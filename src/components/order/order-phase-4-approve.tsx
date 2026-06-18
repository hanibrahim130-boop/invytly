"use client";

import * as React from "react";
import { Check, RefreshCw, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { DesignPreview } from "@/components/design-preview";
import { OrderStepper } from "@/components/order/order-stepper";
import { useOrder, TIERS } from "@/lib/order-context";
import { getDesignById } from "@/lib/mock-data";
import { generateDesign } from "@/lib/ai-design-generator";

export function OrderPhase4Approve() {
  const { state, update, setPhase } = useOrder();

  const design = state.designId ? getDesignById(state.designId) : null;
  const tier = TIERS.find((t) => t.id === state.tier);

  const result = React.useMemo(() => {
    if (!design || !state.orderNumber) return null;
    return generateDesign(design.style, state.orderNumber, state.regenerationCount);
  }, [design, state.orderNumber, state.regenerationCount]);

  if (!design || !result) {
    return (
      <Container className="py-20 text-center">
        <Button onClick={() => setPhase(2)}>Back to details</Button>
      </Container>
    );
  }

  const maxRegens = tier?.id === "essential" ? 2 : Infinity;
  const regensLeft = maxRegens === Infinity ? Infinity : maxRegens - state.regenerationCount;
  const canRegenerate = regensLeft > 0;

  const handleRegenerate = () => {
    update({ regenerationCount: state.regenerationCount + 1 });
  };

  const handleApprove = () => {
    update({ aiApproved: true });
    setPhase(5);
  };

  return (
    <>
      <Container className="pt-28 pb-6">
        <OrderStepper />
      </Container>

      <Container className="py-10">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Preview */}
          <div className="lg:col-span-5">
            <p className="label-mono text-[color:var(--primary)]">Generated invitation</p>
            <div className="mt-6 border border-[color:var(--foreground)]">
              <div className="aspect-[4/5] overflow-hidden">
                <DesignPreview
                  design={design}
                  generatedPalette={result.palette}
                  generatedOrnament={result.ornament}
                  eventDetails={{
                    names: state.names,
                    eventDate: state.eventDate,
                    venue: state.venue,
                    eventType: state.eventType,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Details + Actions */}
          <div className="lg:col-span-7">
            <p className="label-mono text-[color:var(--primary)]">Review & approve</p>
            <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl tracking-tight sm:text-5xl">
              How does this look?
            </h1>
            <p className="mt-4 text-[color:var(--muted-foreground)]">
              The AI has populated your template with event details and generated custom ornaments.
              Approve to continue, or regenerate for a different variation.
            </p>

            {/* Generation details */}
            <div className="mt-8 grid gap-px bg-[color:var(--border)] sm:grid-cols-2">
              <div className="bg-[color:var(--background)] p-5">
                <p className="label-mono text-[color:var(--muted-foreground)]">Style</p>
                <p className="mt-1 font-[family-name:var(--font-display)] text-lg capitalize">
                  {design.style}
                </p>
              </div>
              <div className="bg-[color:var(--background)] p-5">
                <p className="label-mono text-[color:var(--muted-foreground)]">Palette</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="h-5 w-5 border border-[color:var(--border)]" style={{ background: result.palette.accent }} />
                  <span className="h-5 w-5 border border-[color:var(--border)]" style={{ background: result.palette.tint }} />
                  <span className="h-5 w-5 border border-[color:var(--border)]" style={{ background: result.palette.ink }} />
                </div>
              </div>
              <div className="bg-[color:var(--background)] p-5">
                <p className="label-mono text-[color:var(--muted-foreground)]">Variation</p>
                <p className="mt-1 text-sm">#{state.regenerationCount + 1}</p>
              </div>
              <div className="bg-[color:var(--background)] p-5">
                <p className="label-mono text-[color:var(--muted-foreground)]">Seed</p>
                <p className="mt-1 font-[family-name:var(--font-mono)] text-xs">
                  {result.seed.toString(16).slice(0, 8)}
                </p>
              </div>
            </div>

            {/* Event details recap */}
            <div className="mt-6 border border-[color:var(--border)] p-5">
              <p className="label-mono text-[color:var(--muted-foreground)]">Event details</p>
              <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <dt className="label-mono text-[color:var(--muted-foreground)]">Names</dt>
                  <dd className="mt-0.5 text-sm">{state.names || "—"}</dd>
                </div>
                <div>
                  <dt className="label-mono text-[color:var(--muted-foreground)]">Date</dt>
                  <dd className="mt-0.5 text-sm">{state.eventDate || "—"}</dd>
                </div>
                <div>
                  <dt className="label-mono text-[color:var(--muted-foreground)]">Venue</dt>
                  <dd className="mt-0.5 text-sm">{state.venue || "—"}</dd>
                </div>
                <div>
                  <dt className="label-mono text-[color:var(--muted-foreground)]">Type</dt>
                  <dd className="mt-0.5 text-sm">{state.eventType || "—"}</dd>
                </div>
              </dl>
              <Button onClick={() => setPhase(2)} variant="ghost" size="sm" className="mt-3">
                Edit details
              </Button>
            </div>

            {/* Regeneration info */}
            {tier?.id === "essential" && (
              <p className="mt-4 text-xs text-[color:var(--muted-foreground)]">
                {canRegenerate
                  ? `${regensLeft} regeneration${regensLeft === 1 ? "" : "s"} remaining (Essential tier)`
                  : "Regeneration limit reached. Upgrade to Premium for unlimited regenerations."}
              </p>
            )}
            {tier?.id !== "essential" && (
              <p className="mt-4 text-xs text-[color:var(--muted-foreground)]">
                Unlimited regenerations available ({state.regenerationCount} used)
              </p>
            )}

            {/* Actions */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <Button onClick={() => setPhase(3)} variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleRegenerate}
                  variant="outline"
                  size="md"
                  disabled={!canRegenerate}
                >
                  <RefreshCw className="h-4 w-4" />
                  Regenerate
                </Button>
                <Button onClick={handleApprove} size="lg">
                  <Check className="h-4 w-4" />
                  Approve & continue
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
