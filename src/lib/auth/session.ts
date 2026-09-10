import "server-only";
import { cookies } from "next/headers";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { WORKSPACE_ID } from "@/lib/workspace";
import type { Member } from "@/lib/types";

export const SESSION_COOKIE = "studio_session";

export interface AuthedSession {
  uid: string;
  email: string | null;
}

/** Vérifie le jeton d'identité (jamais une simple affirmation client). */
export async function getSession(): Promise<AuthedSession | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const decoded = await adminAuth().verifyIdToken(token, true);
    return { uid: decoded.uid, email: decoded.email ?? null };
  } catch {
    return null;
  }
}

/**
 * Charge le membre actif de l'espace de travail. Retourne null si
 * l'utilisateur n'est pas authentifié ou n'a pas (ou plus) accès —
 * une révocation retire donc immédiatement l'accès aux nouvelles requêtes.
 */
export async function requireMember(): Promise<{ session: AuthedSession; member: Member } | null> {
  const session = await getSession();
  if (!session) return null;
  const snap = await adminDb()
    .collection("workspaces")
    .doc(WORKSPACE_ID)
    .collection("members")
    .doc(session.uid)
    .get();
  if (!snap.exists) return null;
  const member = snap.data() as Member;
  if (member.status !== "active") return null;
  return { session, member };
}
