"use client";

import * as React from "react";

export type RSVPStatus = "not_opened" | "opened" | "attending" | "declined";

export interface Guest {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  plusOnes: number;
  status: RSVPStatus;
  dietaryNotes?: string;
  message?: string;
  openedAt: string | null;
  respondedAt: string | null;
}

export interface EventData {
  orderId: string;
  designId: string;
  designName: string;
  eventType: string;
  names: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  message: string;
  contactName: string;
  contactEmail: string;
  createdAt: string;
}

interface GuestStore {
  event: EventData | null;
  guests: Guest[];
}

const STORAGE_KEY = "invytly-guests";

function loadStore(): GuestStore {
  if (typeof window === "undefined") return { event: null, guests: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { event: null, guests: [] };
  } catch {
    return { event: null, guests: [] };
  }
}

function saveStore(store: GuestStore) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    /* ignore */
  }
}

export function publishEvent(event: EventData) {
  const store = loadStore();
  store.event = event;
  saveStore(store);
}

export function getEvent(orderId: string): EventData | null {
  const store = loadStore();
  if (store.event && store.event.orderId === orderId) return store.event;
  return null;
}

export function getLatestEvent(): EventData | null {
  return loadStore().event;
}

export function addGuest(guest: Omit<Guest, "id">): Guest {
  const store = loadStore();
  const id = `g-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const newGuest: Guest = { ...guest, id };
  store.guests.push(newGuest);
  saveStore(store);
  return newGuest;
}

export function findGuestById(guestId: string): Guest | null {
  const store = loadStore();
  return store.guests.find((g) => g.id === guestId) ?? null;
}

export function markGuestOpened(guestId: string): Guest | null {
  const store = loadStore();
  const guest = store.guests.find((g) => g.id === guestId);
  if (!guest) return null;
  if (guest.status === "not_opened") {
    guest.status = "opened";
    guest.openedAt = new Date().toISOString();
    saveStore(store);
  }
  return guest;
}

export function updateGuestRSVP(
  guestId: string,
  patch: Partial<Pick<Guest, "status" | "plusOnes" | "dietaryNotes" | "message" | "respondedAt">>
): Guest | null {
  const store = loadStore();
  const guest = store.guests.find((g) => g.id === guestId);
  if (!guest) return null;
  Object.assign(guest, patch);
  saveStore(store);
  return guest;
}

export function findGuestByName(name: string): Guest | null {
  const store = loadStore();
  const normalized = name.trim().toLowerCase();
  return store.guests.find((g) => g.name.trim().toLowerCase() === normalized) ?? null;
}

export function getAllGuests(): Guest[] {
  return loadStore().guests;
}

export function getRSVPStats() {
  const guests = getAllGuests();
  const total = guests.length;
  const attending = guests.filter((g) => g.status === "attending").length;
  const declined = guests.filter((g) => g.status === "declined").length;
  const opened = guests.filter((g) => g.status === "opened" || g.status === "attending" || g.status === "declined").length;
  const notOpened = guests.filter((g) => g.status === "not_opened").length;
  const totalPlusOnes = guests
    .filter((g) => g.status === "attending")
    .reduce((sum, g) => sum + g.plusOnes, 0);
  return { total, attending, declined, opened, notOpened, openRate: total > 0 ? Math.round((opened / total) * 100) : 0, totalPlusOnes, totalHeadcount: attending + totalPlusOnes };
}

export function exportGuestsCSV(): string {
  const guests = getAllGuests();
  const headers = ["Name", "Email", "Phone", "Status", "Plus Ones", "Dietary Notes", "Message", "Opened At", "Responded At"];
  const rows = guests.map((g) => [
    g.name,
    g.email ?? "",
    g.phone ?? "",
    g.status,
    String(g.plusOnes),
    g.dietaryNotes ?? "",
    g.message ?? "",
    g.openedAt ?? "",
    g.respondedAt ?? "",
  ]);
  return [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
    .join("\n");
}
