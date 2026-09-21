"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { clientAuth, firebaseInitError } from "@/lib/firebase/client";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!clientAuth) {
    if (firebaseInitError) {
      console.error("Firebase client init failed:", firebaseInitError);
    }
    return (
      <main className="flex min-h-screen items-center justify-center bg-dot-grid" style={{ background: "var(--color-canvas)" }}>
        <div className="w-full max-w-sm rounded-[var(--radius-card)] border border-[var(--color-surface-border)] bg-[var(--color-surface)] p-6 text-center shadow-sm">
          <p className="font-display text-2xl font-black tracking-tight text-[var(--color-text)]">STUDIO</p>
          <p className="mt-4 text-sm text-[var(--color-text-2)]">
            L&apos;authentification est temporairement indisponible.
          </p>
          <p className="mt-2 text-xs text-[var(--color-text-3)]">
            Réessayez plus tard, ou contactez Dominique si le problème persiste.
          </p>
        </div>
      </main>
    );
  }

  const auth = clientAuth;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await credential.user.getIdToken();
      const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      if (!response.ok) {
        throw new Error("Session refusée");
      }
      router.push("/carte");
      router.refresh();
    } catch {
      setError("Identifiants invalides, ou compte non invité au Studio.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-dot-grid" style={{ background: "var(--color-canvas)" }}>
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="font-display text-2xl font-black tracking-tight text-[var(--color-text)]">STUDIO</p>
          <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--color-text-3)]">
            Dominique Soucy
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="rounded-[var(--radius-card)] border border-[var(--color-surface-border)] bg-[var(--color-surface)] p-6 shadow-sm"
        >
          <label htmlFor="login-email" className="mb-1 block text-xs font-medium uppercase tracking-wide text-[var(--color-text-2)]">
            Courriel
          </label>
          <input
            id="login-email"
            type="email"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4 w-full rounded border border-[var(--color-surface-border)] bg-white px-3 py-2 text-sm outline-none focus-visible:border-[var(--color-accent-green)]"
            placeholder="vous@studio.com"
          />
          <label htmlFor="login-password" className="mb-1 block text-xs font-medium uppercase tracking-wide text-[var(--color-text-2)]">
            Mot de passe
          </label>
          <input
            id="login-password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4 w-full rounded border border-[var(--color-surface-border)] bg-white px-3 py-2 text-sm outline-none focus-visible:border-[var(--color-accent-green)]"
            placeholder="••••••••"
          />
          {error && (
            <p role="alert" className="mb-4 text-sm text-[var(--color-danger)]">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-[var(--color-ink)] px-4 py-2 text-sm font-semibold text-[var(--color-cream)] transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Connexion…" : "Entrer"}
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-[var(--color-text-3)]">
          Espace privé sur invitation. Aucune inscription libre.
        </p>
      </div>
    </main>
  );
}
