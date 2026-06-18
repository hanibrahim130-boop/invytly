"use client";

import * as React from "react";
import { Sparkles, Wand2, Palette, Check } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { DesignPreview } from "@/components/design-preview";
import { OrderStepper } from "@/components/order/order-stepper";
import { useOrder, TIERS } from "@/lib/order-context";
import { getDesignById } from "@/lib/mock-data";
import { generateDesign } from "@/lib/ai-design-generator";

const STEPS = [
  { icon: Palette, label: "Analyzing your event details", duration: 1200 },
  { icon: Wand2, label: "Generating custom ornaments", duration: 1500 },
  { icon: Sparkles, label: "Selecting color palette", duration: 1000 },
  { icon: Check, label: "Finalizing your invitation", duration: 800 },
];

export function OrderPhase3AI() {
  const { state, setPhase } = useOrder();
  const [currentStep, setCurrentStep] = React.useState(0);
  const [done, setDone] = React.useState(false);

  const design = state.designId ? getDesignById(state.designId) : null;
  const tier = TIERS.find((t) => t.id === state.tier);

  const result = React.useMemo(() => {
    if (!design || !state.orderNumber) return null;
    return generateDesign(design.style, state.orderNumber, state.regenerationCount);
  }, [design, state.orderNumber, state.regenerationCount]);

  React.useEffect(() => {
    if (!result) return;
    let elapsed = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 0; i < STEPS.length; i++) {
      elapsed += STEPS[i].duration;
      timers.push(
        setTimeout(() => {
          setCurrentStep(i + 1);
          if (i === STEPS.length - 1) {
            setTimeout(() => setDone(true), 400);
          }
        }, elapsed)
      );
    }
    return () => timers.forEach(clearTimeout);
  }, [result]);

  if (!design || !result) {
    return (
      <Container className="py-20 text-center">
        <p className="text-[color:var(--muted-foreground)]">Something went wrong. Please go back.</p>
        <Button onClick={() => setPhase(2)} className="mt-4">Back to details</Button>
      </Container>
    );
  }

  if (done) {
    return (
      <>
        <Container className="pt-28 pb-6">
          <OrderStepper />
        </Container>

        <Container className="py-10">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center bg-[color:var(--primary)] text-[color:var(--primary-foreground)]">
              <Check className="h-6 w-6" />
            </div>
            <p className="label-mono mt-6 text-[color:var(--primary)]">Generation complete</p>
            <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl tracking-tight">
              Your invitation is ready.
            </h1>
            <p className="mt-4 text-[color:var(--muted-foreground)]">
              The AI has generated a unique design with custom ornaments and colors. Review it in the next step.
            </p>
            <Button onClick={() => setPhase(4)} size="lg" className="mt-8">
              Review design
            </Button>
          </div>
        </Container>
      </>
    );
  }

  return (
    <>
      <Container className="pt-28 pb-6">
        <OrderStepper />
      </Container>

      <Container className="py-10">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center border border-[color:var(--foreground)]">
            <Sparkles className="h-6 w-6 animate-pulse text-[color:var(--primary)]" />
          </div>
          <p className="label-mono mt-6 text-[color:var(--primary)]">AI generation in progress</p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl tracking-tight sm:text-4xl">
            Designing your invitation…
          </h1>
          <p className="mt-4 text-sm text-[color:var(--muted-foreground)]">
            Our AI is crafting a unique design based on your {design.style} template and event details.
          </p>

          {/* Progress steps */}
          <div className="mx-auto mt-10 max-w-md space-y-4">
            {STEPS.map((step, i) => {
              const isDone = i < currentStep;
              const isActive = i === currentStep;
              return (
                <div
                  key={step.label}
                  className={`flex items-center gap-3 transition-opacity ${
                    isDone || isActive ? "opacity-100" : "opacity-30"
                  }`}
                >
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center border transition-colors ${
                      isDone
                        ? "border-[color:var(--primary)] bg-[color:var(--primary)] text-[color:var(--primary-foreground)]"
                        : isActive
                        ? "border-[color:var(--foreground)] bg-[color:var(--foreground)] text-[color:var(--background)]"
                        : "border-[color:var(--border)]"
                    }`}
                  >
                    {isDone ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <step.icon className={`h-3.5 w-3.5 ${isActive ? "animate-pulse" : ""}`} />
                    )}
                  </span>
                  <span
                    className={`text-sm ${
                      isDone || isActive ? "text-[color:var(--foreground)]" : "text-[color:var(--muted-foreground)]"
                    }`}
                  >
                    {step.label}
                  </span>
                  {isActive && (
                    <span className="ml-auto h-1 w-16 overflow-hidden bg-[color:var(--muted)]">
                      <span className="block h-full animate-[shimmer_1s_ease-in-out_infinite] bg-[color:var(--primary)]" />
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Preview hint */}
          <div className="mx-auto mt-12 max-w-[200px]">
            <div className="aspect-[4/5] overflow-hidden border border-[color:var(--border)] opacity-40">
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
      </Container>
    </>
  );
}
