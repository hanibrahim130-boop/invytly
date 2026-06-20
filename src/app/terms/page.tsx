import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SITE_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The basic terms for using Invyty digital invitation services.",
};

const TERMS_SECTIONS = [
  {
    title: "Service overview",
    body: "Invyty provides digital invitation designs, hosted RSVP pages, share assets, and related support for personal, social, and business events.",
  },
  {
    title: "Orders and content",
    body: "You are responsible for providing accurate event details, guest information, copy, images, and usage rights for any materials you ask us to include in an invitation.",
  },
  {
    title: "Revisions and delivery",
    body: "Delivery timelines and revision rounds depend on the package selected. We may request clarifications before a project can move forward.",
  },
  {
    title: "Acceptable use",
    body: "You may not use the service for unlawful, misleading, abusive, infringing, or harmful content, or for activity that interferes with the security or availability of the platform.",
  },
  {
    title: "Availability and changes",
    body: "We aim to keep invitation pages available, but we may update, suspend, or modify the service when needed for maintenance, security, or product improvements.",
  },
  {
    title: "Questions",
    body: "If you have questions about these terms or need help with an order, contact our support team before placing or sharing an invitation.",
  },
];

export default function TermsPage() {
  return (
    <>
      <section className="border-b border-[color:var(--foreground)] pt-16">
        <Container className="py-14">
          <span className="label-mono text-[color:var(--primary)]">
            Legal
          </span>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl leading-[0.95] tracking-tight sm:text-6xl md:text-7xl">
            Terms of <span className="display-italic">service</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-[color:var(--muted-foreground)]">
            The basic terms for ordering, sharing, and using {SITE_CONFIG.name} digital invitations.
          </p>
          <p className="label-mono mt-6 text-[color:var(--muted-foreground)]">
            Last updated: June 20, 2026
          </p>
        </Container>
      </section>

      <Container className="py-14">
        <div className="grid gap-10 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <div className="border border-[color:var(--foreground)] p-6">
              <p className="label-mono text-[color:var(--primary)]">
                Support
              </p>
              <p className="mt-4 text-sm leading-relaxed text-[color:var(--muted-foreground)]">
                Need help with a package, delivery timeline, or order detail? Contact us before submitting your brief.
              </p>
              <Button href="/contact" variant="outline" className="mt-6">
                Contact support
              </Button>
            </div>
          </aside>

          <div className="lg:col-span-8">
            <div className="grid gap-px bg-[color:var(--border)]">
              {TERMS_SECTIONS.map((section) => (
                <section key={section.title} className="bg-[color:var(--background)] p-7 sm:p-8">
                  <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-tight">
                    {section.title}
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-[color:var(--muted-foreground)]">
                    {section.body}
                  </p>
                </section>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
