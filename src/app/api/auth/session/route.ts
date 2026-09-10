import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/admin";
import { SESSION_COOKIE } from "@/lib/auth/session";

// Un jeton d'identité valide devient un cookie httpOnly côté serveur.
// Le client ne pose jamais lui-même de données métier : ce jeton sert
// uniquement à prouver l'identité pour les commandes et lectures serveur.
export async function POST(request: Request) {
  const { idToken } = await request.json();
  if (!idToken || typeof idToken !== "string") {
    return NextResponse.json({ error: "idToken manquant" }, { status: 400 });
  }
  try {
    await adminAuth().verifyIdToken(idToken);
  } catch {
    return NextResponse.json({ error: "Jeton invalide" }, { status: 401 });
  }
  const store = await cookies();
  store.set(SESSION_COOKIE, idToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 55, // rafraîchi par le client avant expiration du jeton (1h)
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  return NextResponse.json({ ok: true });
}
