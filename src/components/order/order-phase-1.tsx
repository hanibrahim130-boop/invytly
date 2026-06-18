"use client";

import * as React from "react";
import { ArrowRight, Check } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { DesignPreview } from "@/components/design-preview";
import { OrderStepper } from "@/components/order/order-stepper";
import { useOrder, TIERS, type TierId } from "@/lib/order-context";
import { DESIGNS, getDesignById } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function OrderPhase1() {
  const { state, update, setPhase } = useOrder();
  const design = state.designId ? getDesignById(state.designId) : null;

  const handleContinue = () => {
    if (state.designId && state.tier) {
      setPhase(2);
    }
  };

  return (
    <>
      <Container className="pt-28 pb-6">
        <OrderStepper />
      </Container>

      <Container className="py-10">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Design preview / picker */}
          <div className="lg:col-span-5">
            <p className="label-mono text-[color:var(--primary)]">Selected design</p>

            {design ? (
              <div className="mt-6 border border-[color:var(--foreground)]">
                <div className="aspect-[4/5] overflow-hidden">
                  <DesignPreview design={design} />
                </div>
                <div className="border-t border-[color:var(--foreground)] p-5">
                  <h3 className="font-[family-name:var(--font-display)] text-2xl tracking-tight">
                    {design.name}
                  </h3>
                  <p className="label-mono mt-1 text-[color:var(--muted-foreground)]">
                    {design.categoryLabel} · {design.style}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-[color:var(--muted-foreground)]">
                    {design.description}
                  </p>
                  <Button
                    href="/designs"
                    variant="outline"
                    size="sm"
                    className="mt-4"
                  >
                    Change design
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-6">
                <p className="text-sm text-[color:var(--muted-foreground)]">
                  Choose a design to get started.
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {DESIGNS.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => update({ designId: d.id, eventType: d.categoryLabel })}
                      className={cn(
                        "group relative border transition-colors",
                        state.designId === d.id
                          ? "border-[color:var(--foreground)]"
                          : "border-[color:var(--border)] hover:border-[color:var(--foreground)]"
                      )}
                    >
                      <div className="aspect-[4/5] overflow-hidden">
                        <DesignPreview design={d} />
                      </div>
                      {state.designId === d.id && (
                        <div className="absolute right-2 top-2 grid h-6 w-6 place-items-center bg-[color:var(--foreground)] text-[color:var(--background)]">
                          <Check className="h-3.5 w-3.5" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tier selection */}
          <div className="lg:col-span-7">
            <p className="label-mono text-[color:var(--primary)]">Choose your tier</p>
            <div className="mt-6 space-y-4">
              {TIERS.map((tier) => {
                const selected = state.tier === tier.id;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => update({ tier: tier.id as TierId })}
                    className={cn(
                      "block w-full border p-6 text-left transition-colors",
                      selected
                        ? "border-[color:var(--foreground)] bg-[color:var(--card)]"
                        : "border-[color:var(--border)] hover:border-[color:var(--foreground)]"
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <span
                            className={cn(
                              "grid h-5 w-5 place-items-center border transition-colors",
                              selected
                                ? "border-[color:var(--foreground)] bg-[color:var(--foreground)] text-[color:var(--background)]"
                                : "border-[color:var(--border)]"
                            )}
                          >
                            {selected && <Check className="h-3 w-3" />}
                          </span>
                          <h3 className="font-[family-name:var(--font-display)] text-2xl tracking-tight">
                            {tier.name}
                          </h3>
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-[color:var(--muted-foreground)]">
                          {tier.description}
                        </p>
                        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                          {tier.features.map((f) => (
                            <li key={f} className="flex items-center gap-2 text-xs text-[color:var(--muted-foreground)]">
                              <Check className="h-3 w-3 shrink-0 text-[color:var(--primary)]" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="shrink-0 text-right">
                        <div className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
                          {formatCurrency(tier.price)}
                        </div>
                        <p className="label-mono mt-1 text-[color:var(--muted-foreground)]">
                          per invite
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex items-center justify-between">
              <Button href="/designs" variant="ghost" size="sm">
                Cancel
              </Button>
              <Button
                onClick={handleContinue}
                disabled={!state.designId || !state.tier}
                size="lg"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
