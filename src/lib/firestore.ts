"use client";

import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

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
  tier: string;
  price: number;
  status: "active" | "completed" | "draft";
  createdAt: string;
  clientId?: string;
}

export async function saveEventToFirestore(
  event: Omit<FirestoreEvent, "createdAt"> & { createdAt?: string }
): Promise<void> {
  const data = { ...event, createdAt: event.createdAt ?? new Date().toISOString() };
  await setDoc(doc(db, "events", event.orderId), data, { merge: true });
}

export async function getEventFromFirestore(orderId: string): Promise<FirestoreEvent | null> {
  const snap = await getDoc(doc(db, "events", orderId));
  return snap.exists() ? (snap.data() as FirestoreEvent) : null;
}

export async function getClientEvents(clientId: string): Promise<FirestoreEvent[]> {
  const q = query(collection(db, "events"), where("clientId", "==", clientId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as FirestoreEvent);
}

export async function getAllEvents(): Promise<FirestoreEvent[]> {
  const q = query(collection(db, "events"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as FirestoreEvent);
}

export function subscribeToAllEvents(cb: (events: FirestoreEvent[]) => void): Unsubscribe {
  const q = query(collection(db, "events"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => d.data() as FirestoreEvent));
  });
}

export function subscribeToClientEvents(clientId: string, cb: (events: FirestoreEvent[]) => void): Unsubscribe {
  const q = query(collection(db, "events"), where("clientId", "==", clientId));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => d.data() as FirestoreEvent));
  });
}

export async function updateEventStatus(orderId: string, status: FirestoreEvent["status"]): Promise<void> {
  await setDoc(doc(db, "events", orderId), { status }, { merge: true });
}

// Guest subcollection
export interface FirestoreGuest {
  id: string;
  name: string;
  phone?: string;
  plusOnes: number;
  status: "attending" | "declined" | "pending";
  dietaryNotes?: string;
  message?: string;
  respondedAt: string | null;
}

export async function saveGuestsToFirestore(orderId: string, guests: FirestoreGuest[]): Promise<void> {
  const batch = guests.map((g) =>
    setDoc(doc(db, "events", orderId, "guests", g.id), g)
  );
  await Promise.all(batch);
}

export function subscribeToEventGuests(orderId: string, cb: (guests: FirestoreGuest[]) => void): Unsubscribe {
  const q = query(collection(db, "events", orderId, "guests"));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => d.data() as FirestoreGuest));
  });
}
