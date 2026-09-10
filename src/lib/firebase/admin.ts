import "server-only";
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Ce module ne s'exécute jamais côté client. Les identifiants de service
// viennent uniquement des variables d'environnement — jamais codés en dur.
// Voir CLAUDE.md racine (règle héritée) et README.md pour la configuration requise.

let app: App;

function resolveCredential() {
  // Émulateurs locaux : aucune vraie créance nécessaire — l'omettre est la
  // méthode recommandée (une fausse clé PEM échouerait au décodage).
  if (process.env.FIRESTORE_EMULATOR_HOST || process.env.FIREBASE_AUTH_EMULATOR_HOST) {
    return undefined;
  }
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (raw) {
    return cert(JSON.parse(raw));
  }
  return undefined;
}

export function getAdminApp(): App {
  if (getApps().length) {
    return getApps()[0]!;
  }
  const credential = resolveCredential();
  // Ne pas inclure la clé "credential" du tout quand elle est absente : le
  // SDK Admin valide sa présence avant sa valeur et refuse `undefined`.
  app = initializeApp({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    ...(credential ? { credential } : {}),
  });
  return app;
}

export function adminAuth() {
  return getAuth(getAdminApp());
}

export function adminDb() {
  return getFirestore(getAdminApp());
}
