"use client";

import * as React from "react";
import { Wand2, Camera, MessageSquare, Palette, Send, Check } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { CATEGORIES } from "@/lib/config";

const STEPS = [
  { icon: MessageSquare, title: "Tell us your vision", body: "Describe your theme, mood, colors, and any references." },
  { icon: Palette, title: "Designer assigned", body: "A dedicated designer reviews your brief and sketches concepts within 24 hours." },
  { icon: Camera, title: "Iterate & approve", body: "Request unlimited revisions until it feels exactly right." },
  { icon: Send, title: "Deliver & share", body: "We publish your invitation page, generate the PDF, and send you the link." },
];

const EVENT_OPTIONS = CATEGORIES
  .filter((c) => c.slug !== "custom")
  .map((c) => ({ label: c.name, value: c.slug }));

export default function CustomPage() {
  const [submitted, setSubmitted] = React.useState(false);

  if (submitted) {
    return (
      <Container className="py-24 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center bg-[color:var(--foreground)] text-[color:var(--background)]">
          <Check className="h-6 w-6" />
        </div>
        <h1 className="mt-6 font-[family-name:var(--font-display)] text-4xl tracking-tight">
          Brief <span className="display-italic">received</span>
        </h1>
        <p className="mx-auto mt-3 max-w-md text-[color:var(--muted-foreground)]">
          Our design team will review your request and email you a concept within 24 hours.
        </p>
        <Button href="/designs" className="mt-8">
          Browse designs while you wait
        </Button>
      </Container>
    );
  }

  return (
    <>
      <section className="border-b border-[color:var(--foreground)] pt-16">
        <Container className="py-14">
          <span className="label-mono text-[color:var(--primary)]">
            Custom design
          </span>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl leading-[0.95] tracking-tight sm:text-6xl md:text-7xl">
            We design <span className="display-italic">from scratch</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-[color:var(--muted-foreground)]">
            Describe your vision, and our design team will craft a one-of-a-kind invitation tailored to your event.
          </p>
        </Container>
      </section>

      <Container className="py-10">
        <div className="mx-auto max-w-xl">
          <div className="border border-[color:var(--foreground)] p-7 sm:p-8">
            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
            >
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" placeholder="Your name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="you@example.com" required />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="event-type">Event type</Label>
                  <Select
                    id="event-type"
                    options={EVENT_OPTIONS}
                    defaultValue=""
                    required
                  >
                    <option value="" disabled>
                      Select event type
                    </option>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget (USD)</Label>
                  <Input id="budget" type="number" placeholder="99" min={29} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vision">Describe your vision</Label>
                <Textarea
                  id="vision"
                  placeholder="Theme, colors, mood, style references, anything that inspires you..."
                  rows={5}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="references">Reference links (optional)</Label>
                <Textarea
                  id="references"
                  placeholder="Pinterest links, mood boards, or image URLs..."
                  rows={2}
                />
              </div>

              <Button type="submit" size="lg" className="w-full">
                <Wand2 className="h-4 w-4" /> Submit brief
              </Button>
              <p className="label-mono text-center text-[color:var(--muted-foreground)]">
                Typical response time: under 24 hours. No payment required to start the conversation.
              </p>
            </form>
          </div>
        </div>

        {/* Process */}
        <div className="mt-20 border-t border-[color:var(--foreground)] pt-14">
          <span className="label-mono text-[color:var(--primary)]">
            How custom works
          </span>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl leading-[1.05] tracking-tight sm:text-5xl">
            A simple, <span className="display-italic">collaborative</span> process
          </h2>
          <ol className="mt-10 grid gap-px bg-[color:var(--foreground)] md:grid-cols-4">
            {STEPS.map(({ icon: Icon, title, body }, i) => (
              <li key={title} className="bg-[color:var(--background)] p-6">
                <div className="flex items-center justify-between">
                  <Icon className="h-6 w-6 text-[color:var(--primary)]" />
                  <span className="font-[family-name:var(--font-display)] text-4xl italic text-[color:var(--foreground)]/20">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-6 text-base font-semibold tracking-tight">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--muted-foreground)]">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </>
  );
}
