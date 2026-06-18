"use client";

import * as React from "react";
import { Check, ArrowRight, Calendar, Clock, MapPin, Users, ExternalLink, Copy, CheckCheck } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { useOrder, TIERS } from "@/lib/order-context";
import { getDesignById } from "@/lib/mock-data";
import { publishEvent } from "@/lib/guest-tracking";
import { formatCurrency, cn } from "@/lib/utils";

export function OrderPhase4() {
  const { state, reset } = useOrder();
  const [copied, setCopied] = React.useState(false);

  const design = state.designId ? getDesignById(state.designId) : null;
  const tier = TIERS.find((t) => t.id === state.tier);

  React.useEffect(() => {
    if (state.orderNumber && state.designId && design) {
      publishEvent({
        orderId: state.orderNumber,
        designId: state.designId,
        designName: design.name,
        eventType: state.eventType,
        names: state.names,
        eventDate: state.eventDate,
        eventTime: state.eventTime,
        venue: state.venue,
        message: state.message,
        contactName: state.contactName,
        contactEmail: state.contactEmail,
        createdAt: new Date().toISOString(),
      });
    }
  }, [state.orderNumber]);

  const rsvpLink = state.orderNumber ? `${typeof window !== "undefined" ? window.location.origin : ""}/rsvp/${state.orderNumber}` : "";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(rsvpLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const deliveryText =
    tier?.id === "essential" ? "48 hours" :
    tier?.id === "premium" ? "24 hours" :
    "48–72 hours";

  const formatDate = (d: string) => {
    if (!d) return "—";
    return new Date(d + "T00:00").toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Container className="pt-32 pb-20">
      <div className="mx-auto max-w-2xl text-center">
        {/* Success icon */}
        <div className="mx-auto grid h-16 w-16 place-items-center bg-[color:var(--foreground)] text-[color:var(--background)]">
          <Check className="h-7 w-7" />
        </div>

        <p className="label-mono mt-8 text-[color:var(--primary)]">Order confirmed</p>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl tracking-tight sm:text-5xl">
          Thank you{state.contactName ? `, ${state.contactName.split(" ")[0]}` : ""}.
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-[color:var(--muted-foreground)]">
          Your order has been placed. We&apos;ll start designing your invitation right away.
        </p>

        {/* Order number */}
        <div className="mt-8 inline-flex items-center gap-3 border border-[color:var(--foreground)] px-6 py-3">
          <span className="label-mono text-[color:var(--muted-foreground)]">Order</span>
          <span className="font-[family-name:var(--font-mono)] text-sm font-bold tracking-wider">
            {state.orderNumber}
          </span>
        </div>
      </div>

      {/* Summary */}
      <div className="mx-auto mt-12 max-w-2xl border border-[color:var(--foreground)]">
        <div className="border-b border-[color:var(--border)] p-6">
          <p className="label-mono text-[color:var(--primary)]">Summary</p>
        </div>

        <dl className="divide-y divide-[color:var(--border)]">
          {design && (
            <div className="flex items-center justify-between p-6">
              <dt className="label-mono text-[color:var(--muted-foreground)]">Design</dt>
              <dd className="font-[family-name:var(--font-display)] text-lg">
                {design.name}
              </dd>
            </div>
          )}
          {tier && (
            <div className="flex items-center justify-between p-6">
              <dt className="label-mono text-[color:var(--muted-foreground)]">Tier</dt>
              <dd className="flex items-center gap-3">
                <span className="font-[family-name:var(--font-display)] text-lg">
                  {tier.name}
                </span>
                <span className="label-mono text-[color:var(--muted-foreground)]">
                  {formatCurrency(tier.price)}
                </span>
              </dd>
            </div>
          )}
          <div className="flex items-center gap-3 p-6">
            <Calendar className="h-4 w-4 shrink-0 text-[color:var(--muted-foreground)]" />
            <dt className="label-mono text-[color:var(--muted-foreground)]">Date</dt>
            <dd className="ml-auto text-sm">{formatDate(state.eventDate)}</dd>
          </div>
          {state.eventTime && (
            <div className="flex items-center gap-3 p-6">
              <Clock className="h-4 w-4 shrink-0 text-[color:var(--muted-foreground)]" />
              <dt className="label-mono text-[color:var(--muted-foreground)]">Time</dt>
              <dd className="ml-auto text-sm">{state.eventTime}</dd>
            </div>
          )}
          <div className="flex items-center gap-3 p-6">
            <MapPin className="h-4 w-4 shrink-0 text-[color:var(--muted-foreground)]" />
            <dt className="label-mono text-[color:var(--muted-foreground)]">Venue</dt>
            <dd className="ml-auto text-sm">{state.venue}</dd>
          </div>
        </dl>
      </div>

      {/* Automated timeline */}
      <div className="mx-auto mt-10 max-w-2xl">
        <p className="label-mono text-[color:var(--primary)]">What happens next</p>
        <p className="mt-3 text-sm text-[color:var(--muted-foreground)]">
          Everything from here is automated. Here&apos;s exactly what fires after you place your order:
        </p>

        <ol className="mt-6 space-y-px border border-[color:var(--foreground)]">
          {[
            {
              step: "1",
              title: "Order received",
              timing: "Instant",
              body: "Your order is logged and assigned a unique tracking number. A confirmation receipt is sent to your email.",
              done: true,
            },
            {
              step: "2",
              title: "Design preview generated",
              timing: tier?.id === "essential" ? "Within 48 hours" : tier?.id === "premium" ? "Within 24 hours" : "48–72 hours for first draft",
              body: "Our design system auto-populates your chosen template with your event details, names, date, venue, and message.",
              done: false,
            },
            {
              step: "3",
              title: "Preview link sent",
              timing: "Immediately after generation",
              body: `A private preview link is emailed to ${state.contactEmail || "your inbox"}. You can request revisions directly from the preview page.`,
              done: false,
            },
            {
              step: "4",
              title: "Approval & publishing",
              timing: "On your approval",
              body: "Once you approve the design, your invitation page is published instantly at a shareable URL with RSVP tracking enabled.",
              done: false,
            },
            {
              step: "5",
              title: "Share with guests",
              timing: "Immediately after publishing",
              body: "You receive a WhatsApp-optimized share link, a PDF download, and a high-res image (Premium/Custom) to send to your guests.",
              done: false,
            },
          ].map((s) => (
            <li key={s.step} className="flex gap-4 bg-[color:var(--card)] p-5">
              <span
                className={cn(
                  "grid h-8 w-8 shrink-0 place-items-center border text-xs font-bold transition-colors",
                  s.done
                    ? "border-[color:var(--primary)] bg-[color:var(--primary)] text-[color:var(--primary-foreground)]"
                    : "border-[color:var(--border)] text-[color:var(--muted-foreground)]"
                )}
              >
                {s.done ? <Check className="h-3.5 w-3.5" /> : s.step}
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-[family-name:var(--font-display)] text-base tracking-tight">
                    {s.title}
                  </h3>
                  <span className="label-mono shrink-0 text-[color:var(--primary)]">
                    {s.timing}
                  </span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-[color:var(--muted-foreground)]">
                  {s.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* RSVP share link */}
      <div className="mx-auto mt-10 max-w-2xl border border-[color:var(--foreground)] p-6">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-[color:var(--primary)]" />
          <p className="label-mono text-[color:var(--primary)]">Guest RSVP link</p>
        </div>
        <p className="mt-3 text-sm text-[color:var(--muted-foreground)]">
          Share this link with your guests so they can RSVP online. Track all responses from your dashboard.
        </p>
        <div className="mt-4 flex items-center gap-2">
          <input
            readOnly
            value={rsvpLink}
            className="flex h-11 w-full border border-[color:var(--border)] bg-[color:var(--card)] px-4 py-2 text-xs transition-colors focus-visible:border-[color:var(--foreground)] focus-visible:outline-none"
            onFocus={(e) => e.target.select()}
          />
          <Button onClick={handleCopyLink} size="sm" className="shrink-0">
            {copied ? <CheckCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button href={`/rsvp/${state.orderNumber}`} variant="outline" size="sm">
            <ExternalLink className="h-3.5 w-3.5" /> Preview RSVP page
          </Button>
          <Button href="/dashboard" variant="outline" size="sm">
            <Users className="h-3.5 w-3.5" /> Open dashboard
          </Button>
        </div>
      </div>

      {/* Actions */}
      <div className="mx-auto mt-12 flex max-w-2xl flex-col gap-3 sm:flex-row">
        <Button href="/designs" size="lg" className="w-full" onClick={reset}>
          Browse more designs
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button href="/" variant="outline" size="lg" className="w-full" onClick={reset}>
          Back to home
        </Button>
      </div>

      {/* Support */}
      <p className="mx-auto mt-10 max-w-2xl text-center text-xs text-[color:var(--muted-foreground)]">
        Questions? Email us at{" "}
        <a href="mailto:hello@invytly.app" className="hover-underline text-[color:var(--foreground)]">
          hello@invytly.app
        </a>
      </p>
    </Container>
  );
}
