"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { Check, X, Calendar, Clock, MapPin, Heart, AlertCircle, Users } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DesignPreview } from "@/components/design-preview";
import { getEvent, addGuest, findGuestByName, updateGuestRSVP, type RSVPStatus } from "@/lib/guest-tracking";
import { getDesignById } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function RSVPPage() {
  const params = useParams();
  const orderId = params.orderId as string;

  const [event, setEvent] = React.useState<ReturnType<typeof getEvent>>(null);
  const [loaded, setLoaded] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [status, setStatus] = React.useState<RSVPStatus>("pending");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [plusOnes, setPlusOnes] = React.useState(0);
  const [dietaryNotes, setDietaryNotes] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    setEvent(getEvent(orderId));
    setLoaded(true);
  }, [orderId]);

  const design = event ? getDesignById(event.designId) : null;

  const formatDate = (d: string) => {
    if (!d) return "—";
    return new Date(d + "T00:00").toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Your name is required";
    if (status === "pending") errs.status = "Please select Attending or Declined";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const existing = findGuestByName(name);
    const now = new Date().toISOString();

    if (existing) {
      updateGuestRSVP(existing.id, {
        status,
        plusOnes: status === "attending" ? plusOnes : 0,
        dietaryNotes: status === "attending" ? dietaryNotes : "",
        message,
        respondedAt: now,
      });
    } else {
      addGuest({
        name,
        email: email || undefined,
        phone: phone || undefined,
        plusOnes: status === "attending" ? plusOnes : 0,
        status,
        dietaryNotes: status === "attending" ? dietaryNotes : undefined,
        message: message || undefined,
        respondedAt: now,
      });
    }

    setSubmitted(true);
  };

  if (!loaded) return null;

  if (loaded && !event) {
    return (
      <Container className="py-32 text-center">
        <AlertCircle className="mx-auto h-10 w-10 text-[color:var(--muted-foreground)]" />
        <h1 className="mt-6 font-[family-name:var(--font-display)] text-3xl tracking-tight">
          Invitation not found
        </h1>
        <p className="mt-4 text-[color:var(--muted-foreground)]">
          This RSVP link may have expired or is no longer active.
        </p>
        <Button href="/" variant="outline" className="mt-8">
          Go home
        </Button>
      </Container>
    );
  }

  if (submitted) {
    return (
      <Container className="py-20">
        <div className="mx-auto max-w-lg text-center">
          <div
            className={cn(
              "mx-auto grid h-16 w-16 place-items-center",
              status === "attending"
                ? "bg-[color:var(--primary)] text-[color:var(--primary-foreground)]"
                : "bg-[color:var(--foreground)] text-[color:var(--background)]"
            )}
          >
            {status === "attending" ? <Heart className="h-7 w-7" /> : <Check className="h-7 w-7" />}
          </div>
          <h1 className="mt-8 font-[family-name:var(--font-display)] text-4xl tracking-tight">
            {status === "attending" ? "See you there!" : "Thank you for letting us know"}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-[color:var(--muted-foreground)]">
            {status === "attending"
              ? `Your response has been recorded. We can't wait to celebrate with${name ? `, ${name.split(" ")[0]}` : " you"}.`
              : `Your response has been recorded. We'll miss you at the event.`}
          </p>
          {status === "attending" && plusOnes > 0 && (
            <p className="mt-2 text-sm text-[color:var(--muted-foreground)]">
              Including {plusOnes} {plusOnes === 1 ? "guest" : "guests"}.
            </p>
          )}
        </div>
      </Container>
    );
  }

  return (
    <>
      <Container className="pt-28 pb-16">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Invitation preview */}
          <div className="lg:col-span-5">
            {design && (
              <div className="border border-[color:var(--foreground)]">
                <div className="aspect-[4/5] overflow-hidden">
                  <DesignPreview design={design} />
                </div>
              </div>
            )}
          </div>

          {/* Event details + RSVP form */}
          <div className="lg:col-span-7">
            <p className="label-mono text-[color:var(--primary)]">You&apos;re invited to</p>
            <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl leading-tight tracking-tight sm:text-5xl">
              {event?.names}
            </h1>
            <p className="mt-2 text-lg text-[color:var(--muted-foreground)]">
              {event?.eventType}
            </p>

            {/* Event info */}
            <div className="mt-8 grid gap-4 border border-[color:var(--border)] p-6">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 shrink-0 text-[color:var(--primary)]" />
                <span className="text-sm">{formatDate(event?.eventDate ?? "")}</span>
              </div>
              {event?.eventTime && (
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 shrink-0 text-[color:var(--primary)]" />
                  <span className="text-sm">{event.eventTime}</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 shrink-0 text-[color:var(--primary)]" />
                <span className="text-sm">{event?.venue}</span>
              </div>
            </div>

            {event?.message && (
              <p className="mt-6 border-l-2 border-[color:var(--primary)] pl-4 font-[family-name:var(--font-display)] text-lg italic leading-relaxed text-[color:var(--muted-foreground)]">
                &ldquo;{event.message}&rdquo;
              </p>
            )}

            {/* RSVP form */}
            <form onSubmit={handleSubmit} className="mt-10 space-y-6">
              <p className="label-mono text-[color:var(--primary)]">RSVP</p>

              {/* Status selection */}
              <div>
                <Label>Will you attend? <span className="text-[color:var(--primary)]">*</span></Label>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setStatus("attending")}
                    className={cn(
                      "flex items-center justify-center gap-2 border p-4 text-sm font-medium transition-colors",
                      status === "attending"
                        ? "border-[color:var(--primary)] bg-[color:var(--primary)] text-[color:var(--primary-foreground)]"
                        : "border-[color:var(--border)] hover:border-[color:var(--foreground)]"
                    )}
                  >
                    <Check className="h-4 w-4" />
                    Joyfully attending
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus("declined")}
                    className={cn(
                      "flex items-center justify-center gap-2 border p-4 text-sm font-medium transition-colors",
                      status === "declined"
                        ? "border-[color:var(--foreground)] bg-[color:var(--foreground)] text-[color:var(--background)]"
                        : "border-[color:var(--border)] hover:border-[color:var(--foreground)]"
                    )}
                  >
                    <X className="h-4 w-4" />
                    Cannot attend
                  </button>
                </div>
                {errors.status && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[color:var(--primary)]">
                    <AlertCircle className="h-3 w-3" /> {errors.status}
                  </p>
                )}
              </div>

              {/* Name */}
              <div>
                <Label htmlFor="name">
                  Your name <span className="text-[color:var(--primary)]">*</span>
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className={cn("mt-2", errors.name && "border-[color:var(--primary)]")}
                />
                {errors.name && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[color:var(--primary)]">
                    <AlertCircle className="h-3 w-3" /> {errors.name}
                  </p>
                )}
              </div>

              {/* Contact */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Plus ones (only if attending) */}
              {status === "attending" && (
                <>
                  <div>
                    <Label htmlFor="plusOnes">
                      <span className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" /> Number of guests (including you)
                      </span>
                    </Label>
                    <div className="mt-3 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setPlusOnes((v) => Math.max(0, v - 1))}
                        className="grid h-10 w-10 place-items-center border border-[color:var(--border)] transition-colors hover:border-[color:var(--foreground)]"
                        aria-label="Decrease guest count"
                      >
                        –
                      </button>
                      <span className="w-12 text-center font-[family-name:var(--font-display)] text-2xl">
                        {plusOnes + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => setPlusOnes((v) => Math.min(10, v + 1))}
                        className="grid h-10 w-10 place-items-center border border-[color:var(--border)] transition-colors hover:border-[color:var(--foreground)]"
                        aria-label="Increase guest count"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="dietary">Dietary notes / allergies</Label>
                    <Input
                      id="dietary"
                      value={dietaryNotes}
                      onChange={(e) => setDietaryNotes(e.target.value)}
                      placeholder="e.g., Vegetarian, gluten-free, nut allergy"
                      className="mt-2"
                    />
                  </div>
                </>
              )}

              {/* Message */}
              <div>
                <Label htmlFor="message">Message to the host</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Send your warm wishes…"
                  className="mt-2 min-h-[100px]"
                />
              </div>

              <Button type="submit" size="lg" className="w-full">
                Submit RSVP
              </Button>
            </form>
          </div>
        </div>
      </Container>
    </>
  );
}
