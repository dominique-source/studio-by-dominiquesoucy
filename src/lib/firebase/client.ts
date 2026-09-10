"use client";

import { initializeApp, getApps, type FirebaseOptions } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseApp = getApps().length
  ? getApps()[0]!
  : initializeApp(firebaseConfig);

export const clientAuth = getAuth(firebaseApp);

let emulatorConnected = false;
if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true" && !emulatorConnected) {
  emulatorConnected = true;
  connectAuthEmulator(clientAuth, "http://127.0.0.1:9099", { disableWarnings: true });
}
