"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { Container } from "@/components/ui/container";

// Legacy per-guest route. The platform now uses a single RSVP link per event,
// so we transparently redirect to the canonical single-link RSVP page.
export default function GuestRSVPRedirect() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;

  React.useEffect(() => {
    if (orderId) router.replace(`/rsvp/${orderId}`);
  }, [orderId, router]);

  return (
    <Container className="py-32 text-center">
      <p className="text-sm text-[color:var(--muted-foreground)]">Redirecting…</p>
    </Container>
  );
}
