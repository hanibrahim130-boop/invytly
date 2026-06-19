# Invyty — Digital Invitations Platform

Production-ready digital invitation platform. Customers browse invitation designs, submit event details, pay, and receive a hosted invitation link plus an image/PDF download. Guests open the link, view event details, and RSVP.

## Stack
- **Next.js 16** (App Router) + **TypeScript** + **React 19**
- **Tailwind CSS v4** with OKLCH design tokens
- **Supabase** Postgres, Auth (email + Google), Storage
- **Stripe** Checkout + manual bank-transfer fallback
- **Lucide** icons, **Inter** + **Fraunces** typography

## Architecture
```
src/
  app/                 # routes (presentation)
  components/
    ui/                # primitives (Button, Container, …)
    site/              # site-wide chrome (header, footer)
  features/            # use-cases per domain (orders, designs, rsvp) — added in later phases
  lib/                 # config, utils, framework-agnostic helpers
  db/                  # supabase client, schema, migrations — added in Phase 1
```
Dependency rule: inner layers (`lib`, `features`) must not import from `app` or `components`.

## Build status
- [x] **Phase 0** — Foundation: tooling, design tokens, mobile-first marketing shell
- [ ] Phase 1 — Domain & DB (Supabase schema, RLS, seed)
- [ ] Phase 2 — Public catalog (designs, categories, search, SEO)
- [ ] Phase 3 — Auth & customer order wizard
- [ ] Phase 4 — Payments (Stripe + manual)
- [ ] Phase 5 — Admin console
- [ ] Phase 6 — Hosted invitation page + RSVP
- [ ] Phase 7 — Custom design requests
- [ ] Phase 8 — Hardening, emails, analytics, deploy

## Local development
```bash
cp .env.example .env.local
npm install
npm run dev
```

Open http://localhost:3000.
