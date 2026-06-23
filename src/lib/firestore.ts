"use client";

import {
  collection,
  collectionGroup,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type RSVPStatus = "not_opened" | "opened" | "attending" | "declined";

export interface FirestoreEvent {
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
  contactPhone?: string;
  tier: string;
  price: number;
  status: "active" | "completed" | "draft";
  createdAt: string;
  clientId: string;
}

export interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface CustomDesignRequest {
  name: string;
  email: string;
  eventType: string;
  budget?: string;
  vision: string;
  references?: string;
  createdAt: string;
}

export interface FirestoreGuest {
  id: string;
  orderId: string;
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

export interface RSVPStats {
  total: number;
  attending: number;
  declined: number;
  opened: number;
  notOpened: number;
  openRate: number;
  totalPlusOnes: number;
  totalHeadcount: number;
}

/* ----------------------------- Events ----------------------------- */

export async function saveEventToFirestore(event: FirestoreEvent): Promise<void> {
  await setDoc(doc(db, "events", event.orderId), event, { merge: true });
}

export async function getEventFromFirestore(orderId: string): Promise<FirestoreEvent | null> {
  const snap = await getDoc(doc(db, "events", orderId));
  return snap.exists() ? (snap.data() as FirestoreEvent) : null;
}

export function subscribeToClientEvents(
  clientId: string,
  cb: (events: FirestoreEvent[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const q = query(collection(db, "events"), where("clientId", "==", clientId));
  return onSnapshot(q, (snap) => {
    const events = snap.docs.map((d) => d.data() as FirestoreEvent);
    events.sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
    cb(events);
  }, onError);
}

export function subscribeToAllEvents(
  cb: (events: FirestoreEvent[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const q = query(collection(db, "events"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => d.data() as FirestoreEvent));
  }, onError);
}

export async function updateEventStatus(
  orderId: string,
  status: FirestoreEvent["status"]
): Promise<void> {
  await updateDoc(doc(db, "events", orderId), { status });
}

/* ----------------------------- Requests ----------------------------- */

export async function saveContactRequestToFirestore(
  request: Omit<ContactRequest, "createdAt">
): Promise<void> {
  const ref = doc(collection(db, "contactRequests"));
  await setDoc(ref, { ...request, createdAt: new Date().toISOString() });
}

export async function saveCustomDesignRequestToFirestore(
  request: Omit<CustomDesignRequest, "createdAt">
): Promise<void> {
  const ref = doc(collection(db, "customDesignRequests"));
  await setDoc(ref, { ...request, createdAt: new Date().toISOString() });
}

/* ----------------------------- Guests ----------------------------- */

export async function addGuestToFirestore(
  guest: Omit<FirestoreGuest, "id">
): Promise<FirestoreGuest> {
  const id = `g-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const newGuest: FirestoreGuest = { ...guest, id };
  await setDoc(doc(db, "events", guest.orderId, "guests", id), newGuest);
  return newGuest;
}

export async function updateGuestRSVPInFirestore(
  orderId: string,
  guestId: string,
  patch: Partial<Pick<FirestoreGuest, "status" | "plusOnes" | "dietaryNotes" | "message" | "respondedAt" | "email" | "phone" | "openedAt">>
): Promise<void> {
  await updateDoc(doc(db, "events", orderId, "guests", guestId), patch);
}

export async function markGuestOpened(orderId: string, guestId: string): Promise<void> {
  const ref = doc(db, "events", orderId, "guests", guestId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const data = snap.data() as FirestoreGuest;
  if (data.status === "not_opened") {
    await updateDoc(ref, { status: "opened", openedAt: new Date().toISOString() });
  }
}

export async function getGuestFromFirestore(orderId: string, guestId: string): Promise<FirestoreGuest | null> {
  const snap = await getDoc(doc(db, "events", orderId, "guests", guestId));
  return snap.exists() ? (snap.data() as FirestoreGuest) : null;
}

export function subscribeToEventGuests(
  orderId: string,
  cb: (guests: FirestoreGuest[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const q = query(collection(db, "events", orderId, "guests"));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => d.data() as FirestoreGuest));
  }, onError);
}

// Admin: all guests across every event via collection group
export function subscribeToAllGuests(
  cb: (guests: FirestoreGuest[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const q = query(collectionGroup(db, "guests"));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => d.data() as FirestoreGuest));
  }, onError);
}

/* ----------------------------- Stats ----------------------------- */

export function computeStats(guests: FirestoreGuest[]): RSVPStats {
  const total = guests.length;
  const attending = guests.filter((g) => g.status === "attending").length;
  const declined = guests.filter((g) => g.status === "declined").length;
  const opened = guests.filter((g) => g.status === "opened" || g.status === "attending" || g.status === "declined").length;
  const notOpened = guests.filter((g) => g.status === "not_opened").length;
  const totalPlusOnes = guests
    .filter((g) => g.status === "attending")
    .reduce((sum, g) => sum + (g.plusOnes ?? 0), 0);
  return {
    total,
    attending,
    declined,
    opened,
    notOpened,
    openRate: total > 0 ? Math.round((opened / total) * 100) : 0,
    totalPlusOnes,
    totalHeadcount: attending + totalPlusOnes,
  };
}

export function emptyStats(): RSVPStats {
  return { total: 0, attending: 0, declined: 0, opened: 0, notOpened: 0, openRate: 0, totalPlusOnes: 0, totalHeadcount: 0 };
}

export function exportGuestsCSV(guests: FirestoreGuest[]): string {
  const headers = ["Name", "Email", "Phone", "Status", "Plus Ones", "Dietary Notes", "Message", "Opened At", "Responded At"];
  const rows = guests.map((g) => [
    g.name,
    g.email ?? "",
    g.phone ?? "",
    g.status,
    String(g.plusOnes ?? 0),
    g.dietaryNotes ?? "",
    g.message ?? "",
    g.openedAt ?? "",
    g.respondedAt ?? "",
  ]);
  return [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");
}
