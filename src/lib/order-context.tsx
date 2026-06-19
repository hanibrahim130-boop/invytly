"use client";

import * as React from "react";

export type OrderPhase = 1 | 2 | 3 | 4 | 5 | 6;
export type TierId = "essential" | "premium" | "custom";

export interface Tier {
  id: TierId;
  name: string;
  price: number;
  description: string;
  features: string[];
}

export const TIERS: Tier[] = [
  {
    id: "essential",
    name: "Essential",
    price: 9,
    description: "Perfect for intimate gatherings and quick turnarounds.",
    features: [
      "1 hosted invitation page",
      "WhatsApp-optimized sharing",
      "PDF download",
      "Guest RSVP tracking",
      "AI-generated design",
      "2 regeneration rounds",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: 19,
    description: "Our most popular choice for weddings and milestones.",
    features: [
      "1 hosted invitation page",
      "WhatsApp-optimized sharing",
      "PDF + high-res image download",
      "Guest RSVP tracking + export",
      "Music / video embed option",
      "AI-generated design",
      "Unlimited regenerations",
      "Priority support",
    ],
  },
  {
    id: "custom",
    name: "Custom",
    price: 39,
    description: "A one-of-a-kind design built from your vision.",
    features: [
      "Everything in Premium",
      "AI-generated bespoke ornaments",
      "Unlimited concept regenerations",
      "Source files on request",
      "Per-guest open tracking",
      "Priority support",
    ],
  },
];

export interface OrderState {
  phase: OrderPhase;
  designId: string | null;
  tier: TierId | null;
  eventType: string;
  names: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  message: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  orderNumber: string | null;
  regenerationCount: number;
  aiApproved: boolean;
  guests: GuestEntry[];
}

export interface GuestEntry {
  id: string;
  name: string;
  phone: string;
}

const INITIAL_STATE: OrderState = {
  phase: 1,
  designId: null,
  tier: null,
  eventType: "",
  names: "",
  eventDate: "",
  eventTime: "",
  venue: "",
  message: "",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  orderNumber: null,
  regenerationCount: 0,
  aiApproved: false,
  guests: [],
};

const STORAGE_KEY = "invyty-order";

interface OrderContextValue {
  state: OrderState;
  update: (patch: Partial<OrderState>) => void;
  setPhase: (phase: OrderPhase) => void;
  reset: () => void;
  generateOrderNumber: () => string;
}

const OrderContext = React.createContext<OrderContextValue | null>(null);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<OrderState>(() => {
    if (typeof window === "undefined") return INITIAL_STATE;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? { ...INITIAL_STATE, ...JSON.parse(raw) } : INITIAL_STATE;
    } catch {
      return INITIAL_STATE;
    }
  });

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  const update = React.useCallback((patch: Partial<OrderState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  const setPhase = React.useCallback((phase: OrderPhase) => {
    setState((prev) => ({ ...prev, phase }));
  }, []);

  const reset = React.useCallback(() => {
    setState(INITIAL_STATE);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const generateOrderNumber = React.useCallback(() => {
    const d = new Date();
    const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
    const rand = String(Math.floor(1000 + Math.random() * 9000));
    return `INV-${ymd}-${rand}`;
  }, []);

  const value = React.useMemo(
    () => ({ state, update, setPhase, reset, generateOrderNumber }),
    [state, update, setPhase, reset, generateOrderNumber]
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrder() {
  const ctx = React.useContext(OrderContext);
  if (!ctx) throw new Error("useOrder must be used within OrderProvider");
  return ctx;
}
