import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  CalendarHeart,
  Send,
  Star,
  Sparkles,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { KineticText } from "@/components/ui/kinetic-text";
import { Parallax } from "@/components/ui/parallax";
import { Marquee } from "@/components/ui/marquee";
import { CATEGORIES, SITE_CONFIG } from "@/lib/config";
import { formatCurrency } from "@/lib/utils";

const STEPS = [
  {
    icon: CalendarHeart,
    title: "Pick a design",
    body: "Browse curated invitations by occasion, or request a fully custom design.",
  },
  {
    icon: CheckCircle2,
    title: "Share your details",
    body: "Tell us about your event. Pay securely with card or bank transfer.",
  },
  {
    icon: Send,
    title: "Send anywhere",
    body: "Get a private link, a QR code, and a share image for WhatsApp, email, or SMS.",
  },
];

const TESTIMONIALS = [
  {
    name: "Layla A.",
    role: "Wedding · Riyadh",
    body: "The digital link looked stunning on WhatsApp. Guests RSVP'd in seconds. No paper waste.",
  },
  {
    name: "Omar K.",
    role: "Corporate · Dubai",
    body: "Polished, fast, and trackable. The QR code on invites made check-in effortless.",
  },
  {
    name: "Sara M.",
    role: "Baby shower · Cairo",
    body: "Custom digital design team nailed our theme. Shared the link and watched RSVPs roll in.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ===== HERO — Magazine cover ===== */}
      <section className="bg-noise relative overflow-hidden border-b border-[color:var(--foreground)] pt-16">
        <Container className="py-16 md:py-24">
          {/* Top meta row */}
          <div className="flex items-center justify-between border-b border-[color:var(--border)] pb-4">
            <span className="label-mono text-[color:var(--muted-foreground)]">
              Vol. 01 — Digital Invitations
            </span>
            <span className="label-mono text-[color:var(--muted-foreground)]">
              {new Date().getFullYear()}
            </span>
          </div>

          {/* Asymmetric hero grid */}
          <div className="mt-12 grid gap-8 md:grid-cols-12 md:gap-12">
            {/* Left — oversized type */}
            <div className="md:col-span-8">
              <h1 className="font-[family-name:var(--font-display)] text-[clamp(3rem,9vw,8rem)] leading-[0.92] tracking-tight">
                <KineticText text="Send" delay={0.1} />
                <br />
                <KineticText text="invitations" delay={0.3} className="display-italic" />
                <br />
                <KineticText text="that live on" delay={0.5} />
                <br />
                <KineticText text="every screen." delay={0.7} className="text-[color:var(--primary)]" />
              </h1>
            </div>

            {/* Right — meta + CTA */}
            <div className="flex flex-col justify-end md:col-span-4">
              <div className="border-l border-[color:var(--foreground)] pl-6">
                <p className="text-sm leading-relaxed text-[color:var(--muted-foreground)]">
                  {SITE_CONFIG.description} No printing, no chasing replies — just a beautiful link, a QR code, and a clean RSVP.
                </p>
                <div className="mt-8 flex flex-col gap-3">
                  <Button href="/designs" size="lg" className="w-full">
                    Browse designs <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button
                    href="/custom"
                    size="lg"
                    variant="outline"
                    className="w-full"
                  >
                    Request custom design
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom stats row */}
          <div className="mt-16 grid grid-cols-2 gap-px border-y border-[color:var(--foreground)] bg-[color:var(--foreground)] sm:grid-cols-4">
            {[
              { label: "Designs", value: "120+" },
              { label: "Hosts", value: "2,000+" },
              { label: "Avg. delivery", value: "24h" },
              { label: "RSVP rate", value: "94%" },
            ].map((stat) => (
              <div key={stat.label} className="bg-[color:var(--background)] p-5">
                <p className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
                  {stat.value}
                </p>
                <p className="label-mono mt-1 text-[color:var(--muted-foreground)]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ===== MARQUEE ===== */}
      <section className="border-b border-[color:var(--foreground)] py-5">
        <Marquee speed={25}>
          {["Weddings", "Birthdays", "Baby Showers", "Corporate", "Engagements", "Anniversaries", "Graduations", "Save the Dates"].map((item) => (
            <span key={item} className="label-mono mx-6 flex items-center gap-6 text-[color:var(--foreground)]">
              {item}
              <span className="text-[color:var(--primary)]">✦</span>
            </span>
          ))}
        </Marquee>
      </section>

      {/* ===== CATEGORIES — Asymmetric grid ===== */}
      <section className="py-20 sm:py-28">
        <Container>
          <Reveal className="flex items-end justify-between gap-4 border-b border-[color:var(--foreground)] pb-6">
            <div>
              <span className="label-mono text-[color:var(--primary)]">
                <Sparkles className="mr-1.5 inline h-3 w-3" />
                Collections
              </span>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
                For every occasion
              </h2>
            </div>
            <Link
              href="/designs"
              className="label-mono hover-underline hidden shrink-0 text-[color:var(--foreground)] sm:inline-flex"
            >
              View all →
            </Link>
          </Reveal>

          <ul className="mt-10 grid grid-cols-2 gap-px bg-[color:var(--foreground)] sm:grid-cols-3 lg:grid-cols-4">
            {CATEGORIES.map(({ slug, name, description, icon: Icon, startingAt }, i) => (
              <li key={slug} className="bg-[color:var(--background)]">
                <Reveal variant="up" delay={i * 0.05} duration={0.6}>
                  <Link
                    href={`/categories/${slug}`}
                    className="group flex h-full flex-col p-6 transition-colors hover:bg-[color:var(--foreground)] hover:text-[color:var(--background)]"
                  >
                    <Icon className="h-6 w-6 transition-transform duration-200 group-hover:scale-110" />
                    <h3 className="mt-6 text-lg font-semibold tracking-tight">{name}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed opacity-60">
                      {description}
                    </p>
                    <span className="label-mono mt-5 opacity-70">
                      From {formatCurrency(startingAt)}
                    </span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ===== HOW IT WORKS — Editorial spread ===== */}
      <section className="border-y border-[color:var(--foreground)] bg-[color:var(--foreground)] py-20 text-[color:var(--background)] sm:py-28">
        <Container>
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="label-mono text-[color:var(--primary)]">
              How it works
            </span>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
              Three steps. <span className="display-italic">Zero friction.</span>
            </h2>
            <p className="mt-5 text-base leading-relaxed opacity-70 sm:text-lg">
              From idea to inbox in hours — not weeks.
            </p>
          </Reveal>

          <ol className="mt-14 grid gap-px bg-[color:var(--background)]/20 md:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, body }, i) => (
              <li key={title} className="bg-[color:var(--foreground)] p-8">
                <Reveal variant="up" delay={i * 0.1} duration={0.6}>
                  <div className="flex items-center justify-between">
                    <Icon className="h-7 w-7" />
                    <span className="font-[family-name:var(--font-display)] text-5xl italic opacity-30">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="mt-8 text-xl font-semibold tracking-tight">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed opacity-70">{body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* ===== TESTIMONIALS — Editorial quotes ===== */}
      <section className="py-20 sm:py-28">
        <Container>
          <Reveal className="border-b border-[color:var(--foreground)] pb-6">
            <span className="label-mono text-[color:var(--primary)]">
              <Star className="mr-1.5 inline h-3 w-3 fill-current" />
              Testimonials
            </span>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
              Hosts love <span className="display-italic">how it feels</span>
            </h2>
          </Reveal>

          <ul className="mt-10 grid gap-px bg-[color:var(--foreground)] md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <li key={t.name} className="bg-[color:var(--background)] p-8">
                <Reveal variant="up" delay={i * 0.1} duration={0.6}>
                  <div className="flex items-center gap-1 text-[color:var(--primary)]">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="mt-6 font-[family-name:var(--font-display)] text-lg leading-relaxed tracking-tight">
                    &ldquo;{t.body}&rdquo;
                  </p>
                  <div className="mt-8 border-t border-[color:var(--border)] pt-4">
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="label-mono mt-1 text-[color:var(--muted-foreground)]">
                      {t.role}
                    </p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ===== FINAL CTA — Full bleed ===== */}
      <section className="pb-24 pt-4">
        <Container>
          <Reveal variant="scale" duration={0.8}>
            <div className="relative overflow-hidden border-2 border-[color:var(--foreground)] bg-[color:var(--foreground)] p-10 text-[color:var(--background)] sm:p-16 md:p-20">
              <Parallax speed={0.15} className="absolute inset-0">
                <div className="absolute -right-10 -top-10 font-[family-name:var(--font-display)] text-[12rem] italic leading-none opacity-10">
                  invite
                </div>
              </Parallax>

              <div className="relative z-10 max-w-2xl">
                <h2 className="font-[family-name:var(--font-display)] text-4xl leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
                  Ready to invite <br />
                  <span className="display-italic text-[color:var(--primary)]">the world?</span>
                </h2>
                <p className="mt-5 text-base leading-relaxed opacity-80 sm:text-lg">
                  Pick a design, share your details, and we&apos;ll have your digital invitation ready to send today.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button
                    href="/designs"
                    size="lg"
                    className="w-full bg-[color:var(--background)] text-[color:var(--foreground)] hover:bg-[color:var(--primary)] hover:text-[color:var(--primary-foreground)] sm:w-auto"
                  >
                    Browse designs <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button
                    href="/custom"
                    size="lg"
                    variant="outline"
                    className="w-full border-[color:var(--background)] text-[color:var(--background)] hover:bg-[color:var(--background)] hover:text-[color:var(--foreground)] sm:w-auto"
                  >
                    Talk to a designer
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
