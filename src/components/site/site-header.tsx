"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/site/logo";
import { SITE_CONFIG } from "@/lib/config";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/designs", label: "Designs" },
  { href: "/custom", label: "Custom" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const { user, logOut } = useAuth();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-200",
        scrolled
          ? "border-b border-[color:var(--foreground)] bg-[color:var(--background)]"
          : "border-b border-transparent bg-[color:var(--background)]"
      )}
    >
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" aria-label={`${SITE_CONFIG.name} home`}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="label-mono hover-underline text-[color:var(--muted-foreground)] transition-colors hover:text-[color:var(--foreground)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Button href={user.role === "admin" ? "/admin" : "/dashboard"} variant="outline" size="sm">
                <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard
              </Button>
              <Button onClick={() => logOut()} variant="ghost" size="sm">
                <LogOut className="h-3.5 w-3.5" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Button href="/login" variant="ghost" size="sm">
                Log in
              </Button>
              <Button href="/designs" size="sm">
                Get started
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="grid h-9 w-9 place-items-center border border-[color:var(--foreground)] text-[color:var(--foreground)] transition-colors hover:bg-[color:var(--foreground)] hover:text-[color:var(--background)] md:hidden"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </Container>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden overflow-hidden border-t border-[color:var(--foreground)] bg-[color:var(--background)] transition-[max-height] duration-300 ease-out",
          open ? "max-h-[28rem]" : "max-h-0"
        )}
      >
        <Container className="flex flex-col py-4">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="border-b border-[color:var(--border)] px-0 py-4 font-[family-name:var(--font-display)] text-2xl tracking-tight text-[color:var(--foreground)] transition-colors hover:text-[color:var(--primary)]"
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-5 space-y-3">
            {user ? (
              <>
                <Button href={user.role === "admin" ? "/admin" : "/dashboard"} size="lg" className="w-full">
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </Button>
                <Button onClick={() => logOut()} variant="outline" size="lg" className="w-full">
                  <LogOut className="h-4 w-4" /> Logout
                </Button>
              </>
            ) : (
              <>
                <Button href="/login" variant="outline" size="lg" className="w-full">
                  Log in
                </Button>
                <Button href="/designs" size="lg" className="w-full">
                  Get started
                </Button>
              </>
            )}
          </div>
        </Container>
      </div>
    </header>
  );
}
