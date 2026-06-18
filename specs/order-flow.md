# Spec: Multi-Phase Ordering Flow

| Field | Value |
|-------|-------|
| **Author** | Cascade |
| **Date** | 2025-06-19 |
| **Status** | Approved |
| **Reviewers** | User |

---

## 1. Context

The Invytly website currently has design browsing, a detail page with an "Order this design" CTA that links to `/order?design={id}`, and a pricing page with three tiers. However, the `/order` route does not exist — users hit a 404. We need a complete multi-phase ordering flow that takes a user from design selection through event details, tier selection, review, and confirmation.

This is a client-side-only flow (no backend). State is managed via React context + localStorage. Payment is mocked (no real Stripe integration). The goal is a production-quality UX that can later be wired to a real backend.

---

## 2. Functional Requirements

**FR-1** The system MUST provide a multi-step ordering flow at `/order` with 4 phases: Design & Tier, Event Details, Review & Checkout, Confirmation.

**FR-2** The system MUST accept a `?design={id}` query parameter and pre-select that design in Phase 1.

**FR-3** Phase 1 (Design & Tier) MUST display:
- The selected design preview (or a design picker if no `?design` param)
- Three pricing tiers (Essential $29, Premium $59, Custom $99) as selectable cards
- A "Continue" button that advances to Phase 2

**FR-4** Phase 2 (Event Details) MUST collect:
- Event type (auto-filled from design category, editable)
- Primary names (e.g., couple names, birthday person)
- Event date (date picker)
- Event time (text input)
- Venue / location (text input)
- Personal message (textarea, max 500 chars)
- A "Back" button and a "Continue" button

**FR-5** Phase 3 (Review & Checkout) MUST display:
- Full order summary (design name, tier, all event details)
- Contact information form (name, email, phone)
- Payment mock (card number, expiry, CVC — non-functional, formatted only)
- Total price calculation (tier price, no tax/shipping)
- "Place order" button

**FR-6** Phase 4 (Confirmation) MUST display:
- Order number (generated client-side, e.g., `INV-YYYYMMDD-XXXX`)
- Summary of what was ordered
- Next steps (delivery timeline, what to expect)
- Link back to designs and home

**FR-7** The system MUST persist order state across page navigation using React context + localStorage so a user can resume if they navigate away.

**FR-8** The system MUST show a progress indicator (stepper) showing the current phase out of 3 (Design & Tier, Event Details, Checkout — confirmation is not a step).

**FR-9** Each phase MUST validate required fields before allowing advancement. Invalid fields MUST show inline error messages.

**FR-10** The system MUST allow backward navigation to any completed phase via the stepper.

**FR-11** The "Place order" button MUST be disabled until all required fields in all phases are valid.

---

## 3. Non-Functional Requirements

**NFR-1** Each phase MUST render in < 200ms (client-side, no network calls).

**NFR-2** The flow MUST be fully keyboard-accessible (tab navigation, Enter to submit, no keyboard traps).

**NFR-3** The flow MUST match the existing editorial design system (sharp corners, Fraunces/Inter/JetBrains Mono, warm neutral palette, terracotta accent).

**NFR-4** The flow MUST be responsive (mobile-first, single column on mobile, multi-column on desktop).

**NFR-5** Form inputs MUST use existing UI components (Input, Textarea, Label, Button, Select).

**NFR-6** The stepper MUST be accessible with ARIA labels indicating current step.

---

## 4. Acceptance Criteria

**AC-1** (FR-1): Given a user clicks "Order this design" on a design detail page, when the `/order?design=w1` page loads, then Phase 1 is displayed showing the design preview and tier selection.

**AC-2** (FR-2): Given a user navigates to `/order` without a `?design` param, when Phase 1 loads, then a design picker grid is shown instead of a single preview.

**AC-3** (FR-3): Given the user is on Phase 1, when they select a tier and click "Continue", then Phase 2 (Event Details) is displayed.

**AC-4** (FR-4): Given the user is on Phase 2, when they fill all required fields and click "Continue", then Phase 3 (Review & Checkout) is displayed.

**AC-5** (FR-4): Given the user is on Phase 2, when a required field is empty and they click "Continue", then an inline error is shown on that field and the phase does not advance.

**AC-6** (FR-5): Given the user is on Phase 3, when all fields are valid and they click "Place order", then Phase 4 (Confirmation) is displayed with a generated order number.

**AC-7** (FR-6): Given the confirmation page is displayed, then the order number, design name, tier name, and delivery timeline are all visible.

**AC-8** (FR-7): Given the user has completed Phase 2 and navigates to another page, when they return to `/order`, then their previously entered data is restored.

**AC-9** (FR-8): Given any phase is active, then a stepper showing "1. Design & Tier → 2. Event Details → 3. Checkout" is visible with the current step highlighted.

**AC-10** (FR-9): Given the user is on Phase 2 with an empty date field, when they click "Continue", then an error message appears on the date field.

**AC-11** (FR-10): Given the user is on Phase 3, when they click the "Event Details" step in the stepper, then Phase 2 is displayed with previously entered values intact.

**AC-12** (FR-11): Given the user is on Phase 3 with an invalid email, when they view the form, then the "Place order" button is disabled.

---

## 5. Edge Cases

**EC-1** User navigates directly to `/order` with an invalid design ID → show design picker, ignore the invalid param.

**EC-2** User navigates directly to `/order/confirmation` without completing checkout → redirect to `/order` Phase 1.

**EC-3** User refreshes the page mid-flow → state is restored from localStorage, current phase is preserved.

**EC-4** User enters a date in the past → show a warning but allow continuation (soft validation).

**EC-5** Personal message exceeds 500 chars → show character counter and prevent further typing.

---

## 6. API Contracts

N/A — This is a client-side-only flow. No API endpoints are created. All state is managed in React context + localStorage.

---

## 7. Data Models

### OrderState

| Field | Type | Constraints |
|-------|------|-------------|
| `phase` | `1 \| 2 \| 3 \| 4` | Current active phase |
| `designId` | `string \| null` | Selected design ID |
| `tier` | `"essential" \| "premium" \| "custom" \| null` | Selected pricing tier |
| `eventType` | `string` | Event category label |
| `names` | `string` | Primary names |
| `eventDate` | `string` | ISO date string |
| `eventTime` | `string` | Time string |
| `venue` | `string` | Venue/location |
| `message` | `string` | Max 500 chars |
| `contactName` | `string` | Checkout contact name |
| `contactEmail` | `string` | Valid email |
| `contactPhone` | `string` | Phone number |
| `orderNumber` | `string \| null` | Generated on placement |

### Tier

| Field | Type | Constraints |
|-------|------|-------------|
| `id` | `"essential" \| "premium" \| "custom"` | Unique |
| `name` | `string` | Display name |
| `price` | `number` | USD |
| `features` | `string[]` | Feature list |
| `description` | `string` | Short description |

---

## 8. Out of Scope

- **Real payment processing** — Payment fields are mocked, no Stripe or card processing.
- **Backend persistence** — No server-side order storage. localStorage only.
- **User accounts/authentication** — No login required to order.
- **Email notifications** — No confirmation emails sent.
- **Order history/dashboard** — No way to view past orders.
- **Multi-item cart** — One design per order only.
- **Tax/shipping calculation** — Total = tier price only.
