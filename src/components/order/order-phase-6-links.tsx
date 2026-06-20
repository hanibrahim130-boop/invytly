"use client";

import * as React from "react";
import { Check, Copy, CheckCheck, Users, ExternalLink, Share2, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { OrderStepper } from "@/components/order/order-stepper";
import { useOrder, TIERS, type GuestEntry } from "@/lib/order-context";
import { getDesignById } from "@/lib/mock-data";
import { saveEventToFirestore, addGuestToFirestore } from "@/lib/firestore";
import { useAuth } from "@/lib/auth-context";
import { formatCurrency } from "@/lib/utils";

interface PublishedGuest extends GuestEntry {
  firestoreId: string;
}

export function OrderPhase6Links() {
  const { state, reset } = useOrder();
  const { user } = useAuth();
  const [published, setPublished] = React.useState(false);
  const [publishError, setPublishError] = React.useState<string | null>(null);
  const [publishedGuests, setPublishedGuests] = React.useState<PublishedGuest[]>([]);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [copiedAll, setCopiedAll] = React.useState(false);
  // Guards against double-publishing (re-renders, React StrictMode double-invoke).
  const publishStartedRef = React.useRef(false);

  const design = state.designId ? getDesignById(state.designId) : null;
  const tier = TIERS.find((t) => t.id === state.tier);
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const publish = React.useCallback(async () => {
    if (publishStartedRef.current) return;
    if (!state.orderNumber || !design || !user) return;
    publishStartedRef.current = true;

    const orderId = state.orderNumber;
    // No synchronous setState here: the first state update only happens after an
    // await, keeping this clear of the set-state-in-effect rule.
    try {
      await saveEventToFirestore({
        orderId: orderId,
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
      });

      const saved: PublishedGuest[] = [];
      for (const g of state.guests) {
        const created = await addGuestToFirestore({
          orderId: orderId,
          name: g.name,
          phone: g.phone || undefined,
          plusOnes: 0,
          status: "not_opened",
          openedAt: null,
          respondedAt: null,
        });
        saved.push({ ...g, firestoreId: created.id });
      }
      setPublishedGuests(saved);
      setPublished(true);
    } catch (err) {
      console.error("Failed to publish event/guests:", err);
      setPublishError("We couldn't publish your invitation. Please try again.");
      // Allow the user to retry.
      publishStartedRef.current = false;
    }
  }, [
    state.orderNumber,
    design,
    user,
    state.designId,
    state.eventType,
    state.names,
    state.eventDate,
    state.eventTime,
    state.venue,
    state.message,
    state.contactName,
    state.contactEmail,
    state.tier,
    tier,
    state.guests,
  ]);

  React.useEffect(() => {
    // Publishing writes to Firestore (an external system) and only updates React
    // state after those async writes resolve — the pattern this rule endorses.
    // The static analysis can't see across the await, so we scope a disable here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void publish();
  }, [publish]);

  const handleRetry = () => {
    setPublishError(null);
    void publish();
  };

  // Derived view state — avoids a synchronous "publishing" setState in the effect.
  const isPublishing = !published && !publishError;

  const guestLink = (g: PublishedGuest) =>
    `${origin}/rsvp/${state.orderNumber}/${g.firestoreId}`;

  const handleCopyGuest = (g: PublishedGuest) => {
    navigator.clipboard.writeText(guestLink(g));
    setCopiedId(g.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleWhatsAppGuest = (g: PublishedGuest) => {
    const text = `Hi ${g.name}, you're invited to ${state.names}'s ${state.eventType}! View your invitation and RSVP here: ${guestLink(g)}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleCopyAllLinks = () => {
    const text = publishedGuests
      .map((g) => `${g.name}: ${guestLink(g)}`)
      .join("\n");
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  if (!design) return null;

  if (publishError && !published) {
    return (
      <>
        <Container className="pt-28 pb-6">
          <OrderStepper />
        </Container>
        <Container className="py-20 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center border border-[color:var(--foreground)]">
            <span className="text-2xl leading-none text-[color:var(--primary)]">!</span>
          </div>
          <p className="label-mono mt-6 text-[color:var(--primary)]">Publish failed</p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl tracking-tight">
            Something went wrong.
          </h1>
          <p className="mt-4 text-sm text-[color:var(--muted-foreground)]">{publishError}</p>
          <Button onClick={handleRetry} size="lg" className="mt-8">
            Try again
          </Button>
        </Container>
      </>
    );
  }

  if (isPublishing) {
    return (
      <>
        <Container className="pt-28 pb-6">
          <OrderStepper />
        </Container>
        <Container className="py-20 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center border border-[color:var(--foreground)]">
            <Sparkles className="h-6 w-6 animate-pulse text-[color:var(--primary)]" />
          </div>
          <p className="label-mono mt-6 text-[color:var(--primary)]">Publishing</p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl tracking-tight">
            Generating your guest links…
          </h1>
          <p className="mt-4 text-sm text-[color:var(--muted-foreground)]">
            Creating unique tracked links for {state.guests.length} {state.guests.length === 1 ? "guest" : "guests"}.
          </p>
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
        <div className="mx-auto max-w-3xl">
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
              Share each guest&apos;s unique link via WhatsApp. Track opens, accepts, and declines from your dashboard.
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

          {/* Per-guest links */}
          <div className="mt-10 border border-[color:var(--foreground)] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="label-mono text-[color:var(--primary)]">Per-guest tracked links</p>
                <p className="mt-2 text-sm text-[color:var(--muted-foreground)]">
                  {publishedGuests.length} {publishedGuests.length === 1 ? "link" : "links"} generated. Each guest gets a unique URL — you&apos;ll see who opened and who responded.
                </p>
              </div>
              {publishedGuests.length > 1 && (
                <Button onClick={handleCopyAllLinks} variant="outline" size="sm" className="shrink-0">
                  {copiedAll ? <CheckCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  Copy all
                </Button>
              )}
            </div>

            {/* Guest link list */}
            <div className="mt-6 max-h-[400px] space-y-2 overflow-y-auto">
              {publishedGuests.map((g) => (
                <div key={g.id} className="flex items-center gap-2 border border-[color:var(--border)] p-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{g.name}</p>
                    <p className="truncate font-[family-name:var(--font-mono)] text-[10px] text-[color:var(--muted-foreground)]">
                      {guestLink(g)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopyGuest(g)}
                    className="grid h-8 w-8 shrink-0 place-items-center border border-[color:var(--border)] transition-colors hover:border-[color:var(--foreground)]"
                    aria-label={`Copy link for ${g.name}`}
                  >
                    {copiedId === g.id ? (
                      <CheckCheck className="h-3.5 w-3.5 text-[color:var(--primary)]" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                  <button
                    onClick={() => handleWhatsAppGuest(g)}
                    className="grid h-8 w-8 shrink-0 place-items-center border border-[color:var(--border)] transition-colors hover:border-[color:var(--foreground)]"
                    aria-label={`Share link for ${g.name} on WhatsApp`}
                  >
                    <Share2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div className="mt-4 flex flex-wrap gap-3">
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
                  Share each guest&apos;s unique link via WhatsApp using the buttons above.
                </p>
              </li>
              <li className="flex gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center border border-[color:var(--foreground)] text-xs font-bold">2</span>
                <p className="text-sm text-[color:var(--muted-foreground)]">
                  When a guest opens their link, their status changes from <strong className="text-[color:var(--foreground)]">not opened</strong> to <strong className="text-[color:var(--foreground)]">opened</strong> automatically.
                </p>
              </li>
              <li className="flex gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center border border-[color:var(--foreground)] text-xs font-bold">3</span>
                <p className="text-sm text-[color:var(--muted-foreground)]">
                  Guests RSVP — <strong className="text-[color:var(--foreground)]">attending</strong> or <strong className="text-[color:var(--foreground)]">declined</strong>. Track everything from your <a href="/dashboard" className="text-[color:var(--foreground)] underline">dashboard</a>.
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
