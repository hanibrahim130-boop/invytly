"use client";

import * as React from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db, ADMIN_EMAIL } from "@/lib/firebase";

export type UserRole = "admin" | "client";

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
}

interface AuthContextValue {
  user: AppUser | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  logIn: (email: string, password: string) => Promise<void>;
  logInWithGoogle: () => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AppUser | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!auth) return;
    const unsub = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (!fbUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      const role: UserRole = fbUser.email === ADMIN_EMAIL ? "admin" : "client";

      // Try to fetch client profile from Firestore
      let displayName = fbUser.displayName;
      if (!displayName) {
        const snap = await getDoc(doc(db, "clients", fbUser.uid));
        if (snap.exists()) {
          displayName = snap.data().name ?? null;
        }
      }

      setUser({
        uid: fbUser.uid,
        email: fbUser.email,
        displayName,
        role,
      });
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    await setDoc(doc(db, "clients", cred.user.uid), {
      name,
      email,
      createdAt: new Date().toISOString(),
    });
    setUser({
      uid: cred.user.uid,
      email: cred.user.email,
      displayName: name,
      role: email === ADMIN_EMAIL ? "admin" : "client",
    });
  };

  const logIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    const fbUser = cred.user;
    const role: UserRole = fbUser.email === ADMIN_EMAIL ? "admin" : "client";
    const snap = await getDoc(doc(db, "clients", fbUser.uid));
    if (!snap.exists()) {
      await setDoc(doc(db, "clients", fbUser.uid), {
        name: fbUser.displayName ?? fbUser.email ?? "User",
        email: fbUser.email,
        createdAt: new Date().toISOString(),
      });
    }
    setUser({
      uid: fbUser.uid,
      email: fbUser.email,
      displayName: fbUser.displayName,
      role,
    });
  };

  const logOut = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, logIn, logInWithGoogle, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
