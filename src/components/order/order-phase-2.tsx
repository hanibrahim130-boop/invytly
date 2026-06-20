"use client";

import * as React from "react";
import { ArrowRight, ArrowLeft, AlertCircle } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { OrderStepper } from "@/components/order/order-stepper";
import { useOrder } from "@/lib/order-context";
import { CATEGORIES } from "@/lib/config";
import { cn } from "@/lib/utils";

const MAX_MESSAGE = 500;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function OrderPhase2() {
  const { state, update, setPhase, generateOrderNumber } = useOrder();
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!state.names.trim()) e.names = "Names are required";
    if (!state.eventDate) e.eventDate = "Date is required";
    if (!state.venue.trim()) e.venue = "Venue is required";
    if (!state.contactName.trim()) e.contactName = "Contact name is required";
    if (!state.contactEmail.trim()) {
      e.contactEmail = "Contact email is required";
    } else if (!EMAIL_PATTERN.test(state.contactEmail.trim())) {
      e.contactEmail = "Enter a valid email";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleContinue = () => {
    if (validate()) {
      const contactName = state.contactName.trim();
      const contactEmail = state.contactEmail.trim();
      const contactPhone = state.contactPhone.trim();

      if (!state.orderNumber) {
        update({ contactName, contactEmail, contactPhone, orderNumber: generateOrderNumber() });
      } else {
        update({ contactName, contactEmail, contactPhone });
      }
      setPhase(3);
    }
  };

  const eventOptions = CATEGORIES.filter((c) => c.slug !== "custom").map((c) => ({
    label: c.name,
    value: c.name,
  }));

  return (
    <>
      <Container className="pt-28 pb-6">
        <OrderStepper />
      </Container>

      <Container className="py-10">
        <div className="mx-auto max-w-2xl">
          <p className="label-mono text-[color:var(--primary)]">Event details</p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl tracking-tight sm:text-5xl">
            Tell us about your event
          </h1>
          <p className="mt-4 text-[color:var(--muted-foreground)]">
            These details will appear on your invitation. You can edit them later.
          </p>

          <div className="mt-10 space-y-6">
            {/* Event type */}
            <div>
              <Label htmlFor="eventType">Event type</Label>
              <Select
                id="eventType"
                options={eventOptions}
                value={state.eventType}
                onChange={(e) => update({ eventType: e.target.value })}
                className="mt-2"
              />
            </div>

            {/* Names */}
            <div>
              <Label htmlFor="names">
                Names <span className="text-[color:var(--primary)]">*</span>
              </Label>
              <Input
                id="names"
                value={state.names}
                onChange={(e) => update({ names: e.target.value })}
                placeholder="e.g., Sarah & James"
                className={cn("mt-2", errors.names && "border-[color:var(--primary)]")}
              />
              {errors.names && (
                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[color:var(--primary)]">
                  <AlertCircle className="h-3 w-3" /> {errors.names}
                </p>
              )}
            </div>

            {/* Date + Time */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <Label htmlFor="eventDate">
                  Date <span className="text-[color:var(--primary)]">*</span>
                </Label>
                <Input
                  id="eventDate"
                  type="date"
                  value={state.eventDate}
                  onChange={(e) => update({ eventDate: e.target.value })}
                  className={cn("mt-2", errors.eventDate && "border-[color:var(--primary)]")}
                />
                {errors.eventDate && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[color:var(--primary)]">
                    <AlertCircle className="h-3 w-3" /> {errors.eventDate}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="eventTime">Time</Label>
                <Input
                  id="eventTime"
                  type="time"
                  value={state.eventTime}
                  onChange={(e) => update({ eventTime: e.target.value })}
                  className="mt-2"
                />
              </div>
            </div>

            {/* Venue */}
            <div>
              <Label htmlFor="venue">
                Venue / Location <span className="text-[color:var(--primary)]">*</span>
              </Label>
              <Input
                id="venue"
                value={state.venue}
                onChange={(e) => update({ venue: e.target.value })}
                placeholder="e.g., The Grand Hall, 123 Main St, New York"
                className={cn("mt-2", errors.venue && "border-[color:var(--primary)]")}
              />
              {errors.venue && (
                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[color:var(--primary)]">
                  <AlertCircle className="h-3 w-3" /> {errors.venue}
                </p>
              )}
            </div>

            {/* Message */}
            <div>
              <Label htmlFor="message">Personal message</Label>
              <Textarea
                id="message"
                value={state.message}
                onChange={(e) => {
                  const v = e.target.value.slice(0, MAX_MESSAGE);
                  update({ message: v });
                }}
                maxLength={MAX_MESSAGE}
                placeholder="A warm note for your guests…"
                className="mt-2 min-h-[120px]"
              />
              <p className="mt-1.5 text-right text-xs text-[color:var(--muted-foreground)]">
                {state.message.length} / {MAX_MESSAGE}
              </p>
            </div>

            {/* Contact details */}
            <div className="border-t border-[color:var(--border)] pt-6">
              <p className="label-mono text-[color:var(--primary)]">Order contact</p>
              <p className="mt-2 text-sm text-[color:var(--muted-foreground)]">
                We use this for your order confirmation and any follow-up questions.
              </p>
              <div className="mt-5 grid gap-6 sm:grid-cols-2">
                <div>
                  <Label htmlFor="contactName">
                    Contact name <span className="text-[color:var(--primary)]">*</span>
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
                    Contact email <span className="text-[color:var(--primary)]">*</span>
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
              </div>
              <div className="mt-6">
                <Label htmlFor="contactPhone">Contact phone</Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  value={state.contactPhone}
                  onChange={(e) => update({ contactPhone: e.target.value })}
                  placeholder="Optional"
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-10 flex items-center justify-between">
            <Button onClick={() => setPhase(1)} variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <Button onClick={handleContinue} size="lg">
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Container>
    </>
  );
}
