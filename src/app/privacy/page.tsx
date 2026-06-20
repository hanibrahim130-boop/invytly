import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SITE_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Invyty collects, uses, and protects event and guest information.",
};

const PRIVACY_SECTIONS = [
  {
    title: "Information we collect",
    body: "We collect the details you share when browsing designs, requesting a custom invitation, or placing an order, including event details, contact information, and guest RSVP information.",
  },
  {
    title: "How we use information",
    body: "We use this information to prepare invitation designs, host RSVP pages, communicate order updates, provide support, and improve the reliability of our digital invitation service.",
  },
  {
    title: "Sharing and processors",
    body: "We only share information with service providers needed to operate the product, such as hosting, payments, email, analytics, and customer support tools. We do not sell personal information.",
  },
  {
    title: "Data retention",
    body: "We retain order and event information for as long as needed to deliver the service, support guests and hosts, meet legal obligations, and resolve disputes.",
  },
  {
    title: "Your choices",
    body: "You can request access, correction, or deletion of personal information by contacting us. Some records may be retained where required for security, legal, or accounting reasons.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <section className="border-b border-[color:var(--foreground)] pt-16">
        <Container className="py-14">
          <span className="label-mono text-[color:var(--primary)]">
            Legal
          </span>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl leading-[0.95] tracking-tight sm:text-6xl md:text-7xl">
            Privacy <span className="display-italic">policy</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-[color:var(--muted-foreground)]">
            A clear summary of how {SITE_CONFIG.name} handles host, event, and guest information.
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
                Contact
              </p>
              <p className="mt-4 text-sm leading-relaxed text-[color:var(--muted-foreground)]">
                For privacy requests, email us and include the event or order details that help us locate your record.
              </p>
              <Button href={`mailto:${SITE_CONFIG.supportEmail}`} variant="outline" className="mt-6">
                {SITE_CONFIG.supportEmail}
              </Button>
            </div>
          </aside>

          <div className="lg:col-span-8">
            <div className="grid gap-px bg-[color:var(--border)]">
              {PRIVACY_SECTIONS.map((section) => (
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
