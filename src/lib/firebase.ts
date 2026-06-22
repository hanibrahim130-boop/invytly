import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { initializeFirestore, getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const requiredFirebaseEnv: Array<[string, string | undefined]> = [
  ["NEXT_PUBLIC_FIREBASE_API_KEY", firebaseConfig.apiKey],
  ["NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", firebaseConfig.authDomain],
  ["NEXT_PUBLIC_FIREBASE_PROJECT_ID", firebaseConfig.projectId],
  ["NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET", firebaseConfig.storageBucket],
  ["NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID", firebaseConfig.messagingSenderId],
  ["NEXT_PUBLIC_FIREBASE_APP_ID", firebaseConfig.appId],
];

function getMissingFirebaseEnv(): string[] {
  return requiredFirebaseEnv.flatMap(([key, value]) => (value ? [] : [key]));
}

// Admin identity for client-side role gating. Authoritative enforcement lives in
// firestore.rules; this only drives UI. Prefer a custom auth claim in production.
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "admin@invyty.com";

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

if (typeof window !== "undefined") {
  const missingFirebaseEnv = getMissingFirebaseEnv();

  if (missingFirebaseEnv.length > 0) {
    // Log a warning but do not throw — a module-level throw crashes the JS
    // bundle before React mounts, producing a blank page. Components that
    // need Firebase must check for undefined auth/db and surface errors in UI.
    console.error(
      `[Firebase] Missing required env vars: ${missingFirebaseEnv.join(", ")}. ` +
        "Set NEXT_PUBLIC_FIREBASE_* in your Vercel project settings."
    );
  } else {
    app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    auth = getAuth(app);
    // initializeFirestore throws if called a second time on the same app
    // (e.g. hot-reload). Fall back to getFirestore when already started.
    try {
      db = initializeFirestore(app, { ignoreUndefinedProperties: true });
    } catch {
      db = getFirestore(app);
    }
  }
}

export { app, auth, db, ADMIN_EMAIL };
