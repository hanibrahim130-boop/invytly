"use client";

import * as React from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { OrderProvider, useOrder } from "@/lib/order-context";
import { useAuth } from "@/lib/auth-context";
import { getDesignById } from "@/lib/mock-data";
import { Container } from "@/components/ui/container";
import { OrderPhase1 } from "@/components/order/order-phase-1";
import { OrderPhase2 } from "@/components/order/order-phase-2";
import { OrderPhase3AI } from "@/components/order/order-phase-3-ai";
import { OrderPhase4Approve } from "@/components/order/order-phase-4-approve";
import { OrderPhase5Guests } from "@/components/order/order-phase-5-guests";
import { OrderPhase6Links } from "@/components/order/order-phase-6-links";

function OrderContent() {
  const { state, update } = useOrder();
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    if (!loading && !user) {
      const query = searchParams.toString();
      const redirect = encodeURIComponent(query ? `${pathname}?${query}` : pathname);
      router.replace(`/login?redirect=${redirect}`);
    }
  }, [loading, user, router, pathname, searchParams]);

  React.useEffect(() => {
    const designId = searchParams.get("design");
    if (designId && getDesignById(designId) && !state.designId) {
      const design = getDesignById(designId);
      update({ designId, eventType: design?.categoryLabel ?? "" });
    }
  }, [searchParams, state.designId, update]);

  if (loading || !user) {
    return (
      <Container className="py-32 text-center">
        <p className="text-sm text-[color:var(--muted-foreground)]">Loading…</p>
      </Container>
    );
  }

  if (state.phase === 6) return <OrderPhase6Links />;
  if (state.phase === 5) return <OrderPhase5Guests />;
  if (state.phase === 4) return <OrderPhase4Approve />;
  if (state.phase === 3) return <OrderPhase3AI />;
  if (state.phase === 2) return <OrderPhase2 />;
  return <OrderPhase1 />;
}

export default function OrderPage() {
  return (
    <OrderProvider>
      <React.Suspense fallback={null}>
        <OrderContent />
      </React.Suspense>
    </OrderProvider>
  );
}
