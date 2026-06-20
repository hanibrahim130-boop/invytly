"use client";

import { Check, ArrowRight, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Tilt3D } from "@/components/ui/tilt-3d";
import { cn } from "@/lib/utils";

const TIERS = [
  {
    name: "Essential",
    price: 9,
    description: "Perfect for intimate gatherings and quick turnarounds.",
    features: [
      "1 hosted invitation page",
      "WhatsApp-optimized sharing",
      "PDF download",
      "Guest RSVP tracking",
      "48-hour delivery",
      "2 revision rounds",
    ],
    cta: "Get started",
    href: "/designs",
    highlighted: false,
  },
  {
    name: "Premium",
    price: 19,
    description: "Our most popular choice for weddings and milestones.",
    features: [
      "1 hosted invitation page",
      "WhatsApp-optimized sharing",
      "PDF + high-res image download",
      "Guest RSVP tracking + export",
      "Music / video embed option",
      "24-hour delivery",
      "Unlimited revisions",
      "Priority support",
    ],
    cta: "Order now",
    href: "/designs",
    highlighted: true,
  },
  {
    name: "Custom",
    price: 39,
    description: "A one-of-a-kind design built from your vision.",
    features: [
      "Everything in Premium",
      "1-on-1 designer collaboration",
      "Bespoke illustration & layout",
      "Unlimited concept rounds",
      "Source files on request",
      "Dedicated project manager",
      "48–72 hour first draft",
    ],
    cta: "Request custom",
    href: "/custom",
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <>
      <section className="border-b border-[color:var(--foreground)] pt-16">
        <Container className="py-14">
          <span className="label-mono text-[color:var(--primary)]">
            Simple pricing
          </span>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl leading-[0.95] tracking-tight sm:text-6xl md:text-7xl">
            One flat fee. <span className="display-italic">No surprises.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-[color:var(--muted-foreground)]">
            Every tier includes a hosted RSVP page, WhatsApp sharing, and a beautiful PDF download.
          </p>
        </Container>
      </section>

      <Container className="py-14">
        <div className="grid gap-px bg-[color:var(--foreground)] md:grid-cols-3">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                "flex flex-col p-8 transition-colors",
                tier.highlighted
                  ? "bg-[color:var(--foreground)] text-[color:var(--background)]"
                  : "bg-[color:var(--background)]"
              )}
            >
              {tier.highlighted && (
                <span className="label-mono mb-4 text-[color:var(--primary)]">
                  ✦ Most popular
                </span>
              )}

              <h3 className="text-xl font-semibold tracking-tight">{tier.name}</h3>
              <p className={cn(
                "mt-2 text-sm leading-relaxed",
                tier.highlighted ? "opacity-70" : "text-[color:var(--muted-foreground)]"
              )}>
                {tier.description}
              </p>
              <div className="mt-6 flex items-baseline gap-1 border-y border-current/20 py-4">
                <span className="font-[family-name:var(--font-display)] text-5xl tracking-tight">
                  ${tier.price}
                </span>
                <span className={cn(
                  "label-mono",
                  tier.highlighted ? "opacity-60" : "text-[color:var(--muted-foreground)]"
                )}>
                  /invitation
                </span>
              </div>

              <ul className="mt-6 flex-1 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <Check className={cn(
                      "mt-0.5 h-4 w-4 shrink-0",
                      tier.highlighted ? "text-[color:var(--primary)]" : "text-[color:var(--primary)]"
                    )} />
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                href={tier.href}
                size="lg"
                variant={tier.highlighted ? "primary" : "outline"}
                className={cn(
                  "mt-8 w-full",
                  tier.highlighted && "bg-[color:var(--primary)] text-[color:var(--primary-foreground)] hover:bg-[color:var(--background)] hover:text-[color:var(--foreground)]"
                )}
              >
                {tier.cta} <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* FAQ teaser */}
        <Tilt3D max={5} scale={1.01} glare={false} className="mt-16">
          <div className="border-2 border-[color:var(--foreground)] p-8 text-center sm:p-12">
            <Sparkles className="mx-auto h-6 w-6 text-[color:var(--primary)]" />
            <h3 className="mt-4 font-[family-name:var(--font-display)] text-3xl tracking-tight sm:text-4xl">
              Need a custom quote for <span className="display-italic">bulk events?</span>
            </h3>
            <p className="mx-auto mt-3 max-w-lg text-[color:var(--muted-foreground)]">
              Planning a season of corporate events or a wedding series? We offer volume discounts and retainer packages.
            </p>
            <Button href="/contact" variant="outline" className="mt-6">
              Contact sales
            </Button>
          </div>
        </Tilt3D>
      </Container>
    </>
  );
}
