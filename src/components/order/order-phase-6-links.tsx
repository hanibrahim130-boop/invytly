"use client";

import * as React from "react";
import { Check, Copy, CheckCheck, Users, ExternalLink, Share2, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { OrderStepper } from "@/components/order/order-stepper";
import { useOrder, TIERS } from "@/lib/order-context";
import { getDesignById } from "@/lib/mock-data";
import { saveEventToFirestore } from "@/lib/firestore";
import { useAuth } from "@/lib/auth-context";
import { formatCurrency } from "@/lib/utils";

export function OrderPhase6Links() {
  const { state, reset } = useOrder();
  const { user } = useAuth();
  const [published, setPublished] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const design = state.designId ? getDesignById(state.designId) : null;
  const tier = TIERS.find((t) => t.id === state.tier);

  // Persist event to Firestore on mount (order flow is auth-gated, so user exists)
  React.useEffect(() => {
    if (published || !state.orderNumber || !design || !user) return;

    saveEventToFirestore({
      orderId: state.orderNumber,
      designId: state.designId!,
      designName: design.name,
      eventType: state.eventType,
      names: state.names,
      eventDate: state.eventDate,
      eventTime: state.eventTime,
      venue: state.venue,
      message: state.message,
      contactName: state.contactName,
      contactEmail: state.contactEmail ?? "",
      tier: state.tier ?? "",
      price: tier?.price ?? 0,
      status: "active",
      createdAt: new Date().toISOString(),
      clientId: user.uid,
    }).catch((err) => {
      console.error("Failed to save event to Firestore:", err);
    });

    setPublished(true);
  }, [published, state.orderNumber, design, user, state.designId, state.eventType, state.names, state.eventDate, state.eventTime, state.venue, state.message, state.contactName, state.contactEmail, state.tier, tier]);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const rsvpLink = state.orderNumber ? `${origin}/rsvp/${state.orderNumber}` : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(rsvpLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const text = `You're invited to ${state.names}'s ${state.eventType}! View your invitation and RSVP here: ${rsvpLink}`;
    const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(waUrl, "_blank");
  };

  if (!design) return null;

  return (
    <>
      <Container className="pt-28 pb-6">
        <OrderStepper />
      </Container>

      <Container className="py-10">
        <div className="mx-auto max-w-2xl">
          {/* Success header */}
          <div className="text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center bg-[color:var(--foreground)] text-[color:var(--background)]">
              <Check className="h-7 w-7" />
            </div>
            <p className="label-mono mt-6 text-[color:var(--primary)]">Order complete</p>
            <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl tracking-tight sm:text-5xl">
              Your invitation is ready.
            </h1>
            <p className="mt-4 text-[color:var(--muted-foreground)]">
              Share the link with your guests on WhatsApp. Track who accepts and who declines from your dashboard.
            </p>
          </div>

          {/* Order number */}
          <div className="mt-8 flex items-center justify-center gap-3 border border-[color:var(--foreground)] px-6 py-3 mx-auto w-fit">
            <span className="label-mono text-[color:var(--muted-foreground)]">Order</span>
            <span className="font-[family-name:var(--font-mono)] text-sm font-bold tracking-wider">
              {state.orderNumber}
            </span>
            <span className="label-mono text-[color:var(--muted-foreground)]">·</span>
            <span className="label-mono text-[color:var(--primary)]">{formatCurrency(tier?.price ?? 0)}</span>
          </div>

          {/* Single RSVP link */}
          <div className="mt-10 border border-[color:var(--foreground)] p-6">
            <p className="label-mono text-[color:var(--primary)]">Your invitation link</p>
            <p className="mt-3 text-sm text-[color:var(--muted-foreground)]">
              One link for all guests. Share it on WhatsApp and track responses.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <input
                readOnly
                value={rsvpLink}
                className="flex h-11 w-full border border-[color:var(--border)] bg-[color:var(--card)] px-4 py-2 text-xs transition-colors focus-visible:border-[color:var(--foreground)] focus-visible:outline-none"
                onFocus={(e) => e.target.select()}
              />
              <Button onClick={handleCopy} size="sm" className="shrink-0">
                {copied ? <CheckCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button onClick={handleWhatsAppShare} size="md">
                <Share2 className="h-4 w-4" /> Share on WhatsApp
              </Button>
              <Button href={`/rsvp/${state.orderNumber}`} variant="outline" size="md">
                <ExternalLink className="h-3.5 w-3.5" /> Preview RSVP page
              </Button>
              <Button href="/dashboard" variant="outline" size="md">
                <Users className="h-3.5 w-3.5" /> Dashboard
              </Button>
            </div>
          </div>

          {/* What happens next */}
          <div className="mt-10 border border-[color:var(--border)] p-6">
            <p className="label-mono text-[color:var(--primary)]">What happens next</p>
            <ol className="mt-4 space-y-3">
              <li className="flex gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center border border-[color:var(--foreground)] text-xs font-bold">1</span>
                <p className="text-sm text-[color:var(--muted-foreground)]">
                  Share the link with your guests via WhatsApp.
                </p>
              </li>
              <li className="flex gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center border border-[color:var(--foreground)] text-xs font-bold">2</span>
                <p className="text-sm text-[color:var(--muted-foreground)]">
                  Guests open the link, see your invitation, and RSVP — <strong className="text-[color:var(--foreground)]">attending</strong> or <strong className="text-[color:var(--foreground)]">declined</strong>.
                </p>
              </li>
              <li className="flex gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center border border-[color:var(--foreground)] text-xs font-bold">3</span>
                <p className="text-sm text-[color:var(--muted-foreground)]">
                  Track all responses from your <a href="/dashboard" className="text-[color:var(--foreground)] underline">dashboard</a> — who accepted, who declined, and headcount.
                </p>
              </li>
            </ol>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/dashboard" size="lg" className="w-full">
              <Users className="h-4 w-4" /> Go to dashboard
            </Button>
            <Button href="/designs" variant="outline" size="lg" className="w-full" onClick={reset}>
              <Sparkles className="h-4 w-4" /> Create another
            </Button>
          </div>
        </div>
      </Container>
    </>
  );
}
