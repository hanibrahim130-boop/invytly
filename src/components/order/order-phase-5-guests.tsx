"use client";

import * as React from "react";
import { ArrowLeft, ArrowRight, Plus, Trash2, Users, AlertCircle } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OrderStepper } from "@/components/order/order-stepper";
import { useOrder, type GuestEntry } from "@/lib/order-context";
import { cn } from "@/lib/utils";

export function OrderPhase5Guests() {
  const { state, update, setPhase } = useOrder();
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const addGuest = () => {
    const newGuest: GuestEntry = {
      id: `g-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: "",
      phone: "",
    };
    update({ guests: [...state.guests, newGuest] });
  };

  const updateGuest = (id: string, field: "name" | "phone", value: string) => {
    update({
      guests: state.guests.map((g) => (g.id === id ? { ...g, [field]: value } : g)),
    });
  };

  const removeGuest = (id: string) => {
    update({ guests: state.guests.filter((g) => g.id !== id) });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    let hasError = false;
    const seen = new Set<string>();

    state.guests.forEach((g) => {
      if (!g.name.trim()) {
        e[`${g.id}-name`] = "Name required";
        hasError = true;
      }
      if (!g.phone.trim()) {
        e[`${g.id}-phone`] = "Phone required";
        hasError = true;
      }
      const key = g.name.trim().toLowerCase();
      if (seen.has(key)) {
        e[`${g.id}-name`] = "Duplicate name";
        hasError = true;
      }
      seen.add(key);
    });

    setErrors(e);
    return !hasError;
  };

  const handleContinue = () => {
    if (state.guests.length === 0) return;
    if (validate()) {
      setPhase(6);
    }
  };

  return (
    <>
      <Container className="pt-28 pb-6">
        <OrderStepper />
      </Container>

      <Container className="py-10">
        <div className="mx-auto max-w-2xl">
          <p className="label-mono text-[color:var(--primary)]">Guest list</p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl tracking-tight sm:text-5xl">
            Who are you inviting?
          </h1>
          <p className="mt-4 text-[color:var(--muted-foreground)]">
            Add your guests&apos; names and phone numbers. We&apos;ll generate a unique tracked link for each person
            so you can see who opened, accepted, or declined.
          </p>

          {/* Guest rows */}
          <div className="mt-10 space-y-3">
            {state.guests.length === 0 && (
              <div className="border border-dashed border-[color:var(--border)] p-12 text-center">
                <Users className="mx-auto h-8 w-8 text-[color:var(--muted-foreground)]" />
                <p className="mt-4 text-sm text-[color:var(--muted-foreground)]">
                  No guests yet. Add your first guest to get started.
                </p>
              </div>
            )}

            {state.guests.map((guest, i) => (
              <div key={guest.id} className="border border-[color:var(--border)] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="label-mono text-[color:var(--muted-foreground)]">
                    Guest {i + 1}
                  </span>
                  <button
                    onClick={() => removeGuest(guest.id)}
                    className="text-[color:var(--muted-foreground)] transition-colors hover:text-[color:var(--primary)]"
                    aria-label="Remove guest"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label htmlFor={`${guest.id}-name`}>Name</Label>
                    <Input
                      id={`${guest.id}-name`}
                      value={guest.name}
                      onChange={(e) => updateGuest(guest.id, "name", e.target.value)}
                      placeholder="Jane Doe"
                      className={cn("mt-1.5", errors[`${guest.id}-name`] && "border-[color:var(--primary)]")}
                    />
                    {errors[`${guest.id}-name`] && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-[color:var(--primary)]">
                        <AlertCircle className="h-3 w-3" /> {errors[`${guest.id}-name`]}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor={`${guest.id}-phone`}>Phone</Label>
                    <Input
                      id={`${guest.id}-phone`}
                      type="tel"
                      value={guest.phone}
                      onChange={(e) => updateGuest(guest.id, "phone", e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className={cn("mt-1.5", errors[`${guest.id}-phone`] && "border-[color:var(--primary)]")}
                    />
                    {errors[`${guest.id}-phone`] && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-[color:var(--primary)]">
                        <AlertCircle className="h-3 w-3" /> {errors[`${guest.id}-phone`]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add guest button */}
          <Button onClick={addGuest} variant="outline" className="mt-4 w-full">
            <Plus className="h-4 w-4" /> Add guest
          </Button>

          {/* Summary */}
          {state.guests.length > 0 && (
            <p className="mt-6 text-center text-sm text-[color:var(--muted-foreground)]">
              {state.guests.length} {state.guests.length === 1 ? "guest" : "guests"} on the list
            </p>
          )}

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between">
            <Button onClick={() => setPhase(4)} variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <Button
              onClick={handleContinue}
              size="lg"
              disabled={state.guests.length === 0}
            >
              Generate links
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Container>
    </>
  );
}
