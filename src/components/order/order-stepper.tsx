"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useOrder, type OrderPhase } from "@/lib/order-context";

const STEPS: { phase: OrderPhase; label: string }[] = [
  { phase: 1, label: "Design" },
  { phase: 2, label: "Details" },
  { phase: 3, label: "AI Generate" },
  { phase: 4, label: "Approve" },
  { phase: 5, label: "Guests" },
  { phase: 6, label: "Share" },
];

export function OrderStepper() {
  const { state, setPhase } = useOrder();

  return (
    <nav aria-label="Order progress" className="flex items-center">
      {STEPS.map((step, i) => {
        const isCurrent = state.phase === step.phase;
        const isComplete = state.phase > step.phase;
        const isClickable = state.phase > step.phase;

        return (
          <div key={step.phase} className="flex items-center">
            <button
              type="button"
              disabled={!isClickable}
              onClick={() => isClickable && setPhase(step.phase)}
              aria-current={isCurrent ? "step" : undefined}
              aria-label={`Step ${step.phase}: ${step.label}${isCurrent ? " (current)" : isComplete ? " (complete)" : ""}`}
              className={cn(
                "flex items-center gap-2.5 transition-opacity",
                isClickable ? "cursor-pointer hover:opacity-80" : "cursor-default"
              )}
            >
              <span
                className={cn(
                  "grid h-8 w-8 place-items-center border text-xs font-bold transition-colors",
                  isCurrent && "border-[color:var(--foreground)] bg-[color:var(--foreground)] text-[color:var(--background)]",
                  isComplete && "border-[color:var(--primary)] bg-[color:var(--primary)] text-[color:var(--primary-foreground)]",
                  !isCurrent && !isComplete && "border-[color:var(--border)] text-[color:var(--muted-foreground)]"
                )}
              >
                {isComplete ? <Check className="h-3.5 w-3.5" /> : step.phase}
              </span>
              <span
                className={cn(
                  "label-mono hidden sm:inline",
                  isCurrent ? "text-[color:var(--foreground)]" : "text-[color:var(--muted-foreground)]"
                )}
              >
                {step.label}
              </span>
            </button>
            {i < STEPS.length - 1 && (
              <span
                className={cn(
                  "mx-3 h-px w-8 transition-colors sm:w-12",
                  state.phase > step.phase ? "bg-[color:var(--primary)]" : "bg-[color:var(--border)]"
                )}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
