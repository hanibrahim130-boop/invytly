import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { initializeFirestore, type Firestore } from "firebase/firestore";

// Firebase web config. Reads from NEXT_PUBLIC_* env vars when present, with the
// project's public web values as fallback so production deploys work even if the
// env vars aren't configured. (Firebase web keys are public client-side values;
// real access control is enforced in firestore.rules.)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "AIzaSyAEL_wjUGJuVOnPbJbrWAvMrjMXSTjITLw",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "invitea-64288.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "invitea-64288",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "invitea-64288.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "198599348885",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "1:198599348885:web:fcf95c5edeb77872c9019c",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? "G-VKWVBZCQGY",
};

// Admin identity for client-side role gating. Authoritative enforcement lives in
// firestore.rules; this only drives UI. Prefer a custom auth claim in production.
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "admin@invyty.com";

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (typeof window !== "undefined") {
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    // Surface misconfiguration early instead of failing deep inside the SDK.
    console.error(
      "Firebase is not configured. Set NEXT_PUBLIC_FIREBASE_* env vars (see .env.example)."
    );
  }
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = initializeFirestore(app, { ignoreUndefinedProperties: true });
}

export { app, auth, db, ADMIN_EMAIL };
