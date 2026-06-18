import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/site/logo";
import { SITE_CONFIG } from "@/lib/config";

const COLS = [
  {
    title: "Product",
    links: [
      { href: "/designs", label: "All designs" },
      { href: "/custom", label: "Custom design" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "Occasions",
    links: [
      { href: "/categories/weddings", label: "Weddings" },
      { href: "/categories/birthdays", label: "Birthdays" },
      { href: "/categories/baby-showers", label: "Baby showers" },
      { href: "/categories/corporate", label: "Corporate" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t-2 border-[color:var(--foreground)] bg-[color:var(--background)]">
      <Container className="py-16">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link href="/" aria-label={`${SITE_CONFIG.name} home`}>
              <Logo />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-[color:var(--muted-foreground)]">
              {SITE_CONFIG.tagline}
            </p>
            <p className="label-mono mt-6 text-[color:var(--primary)]">
              Built for the digital age
            </p>
          </div>

          <div className="md:col-span-7">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              {COLS.map((col) => (
                <div key={col.title}>
                  <h4 className="label-mono text-[color:var(--foreground)]">
                    {col.title}
                  </h4>
                  <ul className="mt-4 space-y-2.5">
                    {col.links.map((l) => (
                      <li key={l.href}>
                        <Link
                          href={l.href}
                          className="text-sm text-[color:var(--muted-foreground)] transition-colors hover:text-[color:var(--primary)]"
                        >
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-[color:var(--border)] pt-8 sm:flex-row sm:items-center">
          <p className="label-mono text-[color:var(--muted-foreground)]">
            © {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.
          </p>
          <p className="label-mono text-[color:var(--muted-foreground)]">
            Share once. Reach everywhere.
          </p>
        </div>
      </Container>
    </footer>
  );
}
