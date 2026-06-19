import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { initializeFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAEL_wjUGJuVOnPbJbrWAvMrjMXSTjITLw",
  authDomain: "invitea-64288.firebaseapp.com",
  projectId: "invitea-64288",
  storageBucket: "invitea-64288.firebasestorage.app",
  messagingSenderId: "198599348885",
  appId: "1:198599348885:web:fcf95c5edeb77872c9019c",
  measurementId: "G-VKWVBZCQGY",
};

const ADMIN_EMAIL = "admin@invytly.com";

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (typeof window !== "undefined") {
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = initializeFirestore(app, { ignoreUndefinedProperties: true });
}

export { app, auth, db, ADMIN_EMAIL };
