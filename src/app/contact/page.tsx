"use client";

import * as React from "react";
import { Send, Check, Mail, MessageCircle, Clock } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Reveal } from "@/components/ui/reveal";

const CHANNELS = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@invytly.app",
    href: "mailto:hello@invytly.app",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+1 (555) 014-2278",
    href: "https://wa.me/15550142278",
  },
  {
    icon: Clock,
    label: "Response time",
    value: "Within 24 hours",
    href: null,
  },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = React.useState(false);

  if (submitted) {
    return (
      <Container className="py-24 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center bg-[color:var(--foreground)] text-[color:var(--background)]">
          <Check className="h-6 w-6" />
        </div>
        <h1 className="mt-6 font-[family-name:var(--font-display)] text-4xl tracking-tight">
          Message received.
        </h1>
        <p className="mt-4 text-[color:var(--muted-foreground)]">
          We&apos;ll get back to you within 24 hours.
        </p>
        <Button
          href="/designs"
          className="mt-8"
          onClick={() => setSubmitted(false)}
        >
          Browse designs
        </Button>
      </Container>
    );
  }

  return (
    <>
      {/* Hero */}
      <Container className="pt-32 pb-16">
        <Reveal>
          <p className="label-mono text-[color:var(--primary)]">Contact</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="mt-6 max-w-3xl font-[family-name:var(--font-display)] text-5xl leading-[1.02] tracking-tight sm:text-6xl">
            Let&apos;s talk about your event.
          </h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-[color:var(--muted-foreground)]">
            Questions about a design, a custom commission, or a bulk order? Send us a
            message — a real person reads every one.
          </p>
        </Reveal>
      </Container>

      <div className="rule" />

      {/* Channels + Form */}
      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Channels */}
          <div className="lg:col-span-4">
            <Reveal>
              <p className="label-mono text-[color:var(--primary)]">Reach us directly</p>
            </Reveal>
            <div className="mt-8 space-y-8">
              {CHANNELS.map((c, i) => (
                <Reveal key={c.label} delay={i * 0.1}>
                  <div className="flex items-start gap-4">
                    <div className="grid h-10 w-10 shrink-0 place-items-center border border-[color:var(--foreground)]">
                      <c.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="label-mono text-[color:var(--muted-foreground)]">
                        {c.label}
                      </p>
                      {c.href ? (
                        <a
                          href={c.href}
                          className="hover-underline mt-1 block font-[family-name:var(--font-display)] text-lg"
                        >
                          {c.value}
                        </a>
                      ) : (
                        <p className="mt-1 font-[family-name:var(--font-display)] text-lg">
                          {c.value}
                        </p>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-8">
            <Reveal delay={0.15}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
                className="border border-[color:var(--foreground)] bg-[color:var(--card)] p-8"
              >
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Your name</Label>
                    <Input id="name" name="name" required className="mt-2" placeholder="Jane Doe" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required className="mt-2" placeholder="jane@example.com" />
                  </div>
                </div>

                <div className="mt-6">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" name="subject" required className="mt-2" placeholder="Custom wedding invitation" />
                </div>

                <div className="mt-6">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    className="mt-2 min-h-[160px]"
                    placeholder="Tell us about your event, timeline, and what you're looking for."
                  />
                </div>

                <Button type="submit" size="lg" className="mt-8 w-full">
                  <Send className="mr-2 h-4 w-4" />
                  Send message
                </Button>
              </form>
            </Reveal>
          </div>
        </div>
      </Container>
    </>
  );
}
