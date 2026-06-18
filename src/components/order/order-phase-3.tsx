"use client";

import * as React from "react";
import { ArrowLeft, ArrowRight, AlertCircle, Check, Lock } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OrderStepper } from "@/components/order/order-stepper";
import { useOrder, TIERS } from "@/lib/order-context";
import { getDesignById } from "@/lib/mock-data";
import { formatCurrency, cn } from "@/lib/utils";

export function OrderPhase3() {
  const { state, update, setPhase, generateOrderNumber } = useOrder();
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const design = state.designId ? getDesignById(state.designId) : null;
  const tier = TIERS.find((t) => t.id === state.tier);

  const emailValid = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!state.contactName.trim()) e.contactName = "Name is required";
    if (!state.contactEmail.trim()) e.contactEmail = "Email is required";
    else if (!emailValid(state.contactEmail)) e.contactEmail = "Enter a valid email";
    if (!state.contactPhone.trim()) e.contactPhone = "Phone is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePlaceOrder = () => {
    if (validate()) {
      const orderNumber = generateOrderNumber();
      update({ orderNumber, phase: 4 });
    }
  };

  const formatDate = (d: string) => {
    if (!d) return "—";
    return new Date(d + "T00:00").toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <Container className="pt-28 pb-6">
        <OrderStepper />
      </Container>

      <Container className="py-10">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Order summary */}
          <div className="lg:col-span-7">
            <p className="label-mono text-[color:var(--primary)]">Order summary</p>

            <div className="mt-6 border border-[color:var(--foreground)]">
              {/* Design */}
              {design && (
                <div className="border-b border-[color:var(--border)] p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="label-mono text-[color:var(--muted-foreground)]">Design</p>
                      <h3 className="mt-1 font-[family-name:var(--font-display)] text-xl tracking-tight">
                        {design.name}
                      </h3>
                      <p className="text-xs text-[color:var(--muted-foreground)]">
                        {design.categoryLabel} · {design.style}
                      </p>
                    </div>
                    <Button onClick={() => setPhase(1)} variant="ghost" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              )}

              {/* Tier */}
              {tier && (
                <div className="border-b border-[color:var(--border)] p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="label-mono text-[color:var(--muted-foreground)]">Tier</p>
                      <h3 className="mt-1 font-[family-name:var(--font-display)] text-xl tracking-tight">
                        {tier.name}
                      </h3>
                      <p className="text-xs text-[color:var(--muted-foreground)]">
                        {formatCurrency(tier.price)} per invitation
                      </p>
                    </div>
                    <Button onClick={() => setPhase(1)} variant="ghost" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              )}

              {/* Event details */}
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <p className="label-mono text-[color:var(--muted-foreground)]">Event details</p>
                  <Button onClick={() => setPhase(2)} variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
                <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="label-mono text-[color:var(--muted-foreground)]">Type</dt>
                    <dd className="mt-1 text-sm">{state.eventType || "—"}</dd>
                  </div>
                  <div>
                    <dt className="label-mono text-[color:var(--muted-foreground)]">Names</dt>
                    <dd className="mt-1 text-sm">{state.names || "—"}</dd>
                  </div>
                  <div>
                    <dt className="label-mono text-[color:var(--muted-foreground)]">Date</dt>
                    <dd className="mt-1 text-sm">{formatDate(state.eventDate)}</dd>
                  </div>
                  <div>
                    <dt className="label-mono text-[color:var(--muted-foreground)]">Time</dt>
                    <dd className="mt-1 text-sm">{state.eventTime || "—"}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="label-mono text-[color:var(--muted-foreground)]">Venue</dt>
                    <dd className="mt-1 text-sm">{state.venue || "—"}</dd>
                  </div>
                  {state.message && (
                    <div className="sm:col-span-2">
                      <dt className="label-mono text-[color:var(--muted-foreground)]">Message</dt>
                      <dd className="mt-1 text-sm italic text-[color:var(--muted-foreground)]">
                        &ldquo;{state.message}&rdquo;
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>

            {/* Total */}
            <div className="mt-6 flex items-center justify-between border-y-2 border-[color:var(--foreground)] py-5">
              <span className="font-[family-name:var(--font-display)] text-2xl tracking-tight">
                Total
              </span>
              <span className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
                {formatCurrency(tier?.price ?? 0)}
              </span>
            </div>
          </div>

          {/* Checkout form */}
          <div className="lg:col-span-5">
            <p className="label-mono text-[color:var(--primary)]">Checkout</p>

            <div className="mt-6 space-y-6">
              {/* Contact */}
              <div>
                <Label htmlFor="contactName">
                  Full name <span className="text-[color:var(--primary)]">*</span>
                </Label>
                <Input
                  id="contactName"
                  value={state.contactName}
                  onChange={(e) => update({ contactName: e.target.value })}
                  placeholder="Jane Doe"
                  className={cn("mt-2", errors.contactName && "border-[color:var(--primary)]")}
                />
                {errors.contactName && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[color:var(--primary)]">
                    <AlertCircle className="h-3 w-3" /> {errors.contactName}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="contactEmail">
                  Email <span className="text-[color:var(--primary)]">*</span>
                </Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={state.contactEmail}
                  onChange={(e) => update({ contactEmail: e.target.value })}
                  placeholder="jane@example.com"
                  className={cn("mt-2", errors.contactEmail && "border-[color:var(--primary)]")}
                />
                {errors.contactEmail && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[color:var(--primary)]">
                    <AlertCircle className="h-3 w-3" /> {errors.contactEmail}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="contactPhone">
                  Phone <span className="text-[color:var(--primary)]">*</span>
                </Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  value={state.contactPhone}
                  onChange={(e) => update({ contactPhone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className={cn("mt-2", errors.contactPhone && "border-[color:var(--primary)]")}
                />
                {errors.contactPhone && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[color:var(--primary)]">
                    <AlertCircle className="h-3 w-3" /> {errors.contactPhone}
                  </p>
                )}
              </div>

              {/* Payment mock */}
              <div className="border border-[color:var(--border)] p-5">
                <div className="flex items-center gap-2">
                  <Lock className="h-3.5 w-3.5 text-[color:var(--muted-foreground)]" />
                  <p className="label-mono text-[color:var(--muted-foreground)]">
                    Payment (demo)
                  </p>
                </div>
                <div className="mt-4 space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="4242 4242 4242 4242"
                      className="mt-2"
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, "").slice(0, 16);
                        const formatted = digits.replace(/(.{4})/g, "$1 ").trim();
                        e.target.value = formatted;
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cardExpiry">Expiry</Label>
                      <Input
                        id="cardExpiry"
                        placeholder="MM / YY"
                        className="mt-2"
                        onChange={(e) => {
                          const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
                          const formatted = digits.length >= 2 ? `${digits.slice(0, 2)} / ${digits.slice(2)}` : digits;
                          e.target.value = formatted;
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardCvc">CVC</Label>
                      <Input
                        id="cardCvc"
                        placeholder="123"
                        maxLength={4}
                        className="mt-2"
                        onChange={(e) => {
                          e.target.value = e.target.value.replace(/\D/g, "").slice(0, 4);
                        }}
                      />
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-xs text-[color:var(--muted-foreground)]">
                  This is a demo. No real payment will be processed.
                </p>
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between">
              <Button onClick={() => setPhase(2)} variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
              <Button onClick={handlePlaceOrder} size="lg">
                <Check className="h-4 w-4" />
                Place order
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
