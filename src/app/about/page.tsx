import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

const VALUES = [
  {
    label: "Craft",
    title: "Every pixel, every letterform",
    body: "We treat each invitation as a piece of editorial design — not a template. Typography, spacing, and composition are deliberate.",
  },
  {
    label: "Speed",
    title: "Hours, not weeks",
    body: "Most designs are delivered within 48 hours. Custom commissions ship in days, not the industry-standard months.",
  },
  {
    label: "Hospitality",
    title: "Guests first, always",
    body: "Every invitation is optimized for WhatsApp, email, and SMS. Your guests get a beautiful experience on any device.",
  },
];

const STATS = [
  { value: "12K+", label: "Invitations delivered" },
  { value: "98%", label: "On-time delivery" },
  { value: "4.9", label: "Average rating" },
  { value: "48hr", label: "Typical turnaround" },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <Container className="pt-32 pb-16">
        <Reveal>
          <p className="label-mono text-[color:var(--primary)]">About Invyty</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="mt-6 max-w-4xl font-[family-name:var(--font-display)] text-5xl leading-[1.02] tracking-tight sm:text-6xl md:text-7xl">
            We design invitations that people actually want to open.
          </h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[color:var(--muted-foreground)]">
            Invyty was born from a simple frustration: digital invitations had become
            generic, forgettable, and impersonal. We set out to bring the craft of
            editorial design to the way people celebrate life&apos;s milestones.
          </p>
        </Reveal>
      </Container>

      <div className="rule" />

      {/* Stats */}
      <Container className="py-16">
        <div className="grid grid-cols-2 gap-px bg-[color:var(--border)] md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="bg-[color:var(--background)] p-8 text-center">
              <div className="font-[family-name:var(--font-display)] text-4xl tracking-tight">
                {s.value}
              </div>
              <p className="label-mono mt-2 text-[color:var(--muted-foreground)]">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </Container>

      <div className="rule" />

      {/* Values */}
      <Container className="py-20">
        <Reveal>
          <p className="label-mono text-[color:var(--primary)]">What we believe</p>
        </Reveal>
        <div className="mt-12 grid gap-px bg-[color:var(--border)] md:grid-cols-3">
          {VALUES.map((v, i) => (
            <Reveal key={v.label} delay={i * 0.1}>
              <div className="h-full bg-[color:var(--background)] p-8">
                <p className="label-mono text-[color:var(--primary)]">{v.label}</p>
                <h3 className="mt-4 font-[family-name:var(--font-display)] text-2xl leading-snug">
                  {v.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-[color:var(--muted-foreground)]">
                  {v.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>

      <div className="rule" />

      {/* Story */}
      <Container className="py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal>
              <p className="label-mono text-[color:var(--primary)]">Our story</p>
            </Reveal>
          </div>
          <div className="lg:col-span-8">
            <Reveal delay={0.1}>
              <p className="font-[family-name:var(--font-display)] text-2xl leading-relaxed">
                Invyty started in 2023 with a single wedding invitation — a custom
                piece that took three weeks and cost a fortune. We knew there had to be
                a better way.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-6 text-base leading-relaxed text-[color:var(--muted-foreground)]">
                Today, we&apos;ve delivered over 12,000 invitations across weddings,
                corporate events, birthdays, and private dinners. Our designers work
                remotely from three continents, united by a single standard: every
                invitation should feel like it was made for one person — because it was.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="mt-6 text-base leading-relaxed text-[color:var(--muted-foreground)]">
                We&apos;re not a template marketplace. We&apos;re a design studio that
                happens to ship digitally.
              </p>
            </Reveal>
          </div>
        </div>
      </Container>

      <div className="rule" />

      {/* CTA */}
      <Container className="py-24 text-center">
        <Reveal>
          <h2 className="font-[family-name:var(--font-display)] text-4xl leading-tight tracking-tight sm:text-5xl">
            Ready to send something worth opening?
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button href="/designs" size="lg">Browse designs</Button>
            <Button href="/custom" variant="outline" size="lg">Commission custom</Button>
          </div>
        </Reveal>
      </Container>
    </>
  );
}
