"use client";

import { initializeApp, getApps, type FirebaseOptions } from "firebase/app";
import { getAuth, connectAuthEmulator, type Auth } from "firebase/auth";

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// `getAuth` throws synchronously (e.g. auth/invalid-api-key) when the
// NEXT_PUBLIC_FIREBASE_* variables are missing or invalid. That throw used
// to happen at module-evaluation time, during SSR of /login, with nothing
// to catch it — crashing the whole page instead of just disabling the
// login form. Contain it here so a misconfigured environment degrades to a
// controlled message instead of a page crash.
export let clientAuth: Auth | null = null;
export let firebaseInitError: unknown = null;

try {
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId || !firebaseConfig.appId) {
    throw new Error("Configuration Firebase absente (variables NEXT_PUBLIC_FIREBASE_* manquantes).");
  }
  const firebaseApp = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);
  clientAuth = getAuth(firebaseApp);
  if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true") {
    connectAuthEmulator(clientAuth, "http://127.0.0.1:9099", { disableWarnings: true });
  }
} catch (err) {
  clientAuth = null;
  firebaseInitError = err;
}
