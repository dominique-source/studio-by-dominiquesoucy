"use client";

import { useEffect } from "react";

// Filet de sécurité applicatif : si un segment sans error.tsx dédié plante
// (ex. requireMember() dans (app)/layout.tsx lève une exception inattendue
// côté Admin SDK), afficher un message contrôlé plutôt que l'écran
// générique Next.js. Ne jamais exposer la trace technique au visiteur.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled application error:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-dot-grid" style={{ background: "var(--color-canvas)" }}>
      <div className="w-full max-w-sm rounded-[var(--radius-card)] border border-[var(--color-surface-border)] bg-[var(--color-surface)] p-6 text-center shadow-sm">
        <p className="font-display text-2xl font-black tracking-tight text-[var(--color-text)]">STUDIO</p>
        <p className="mt-4 text-sm font-medium uppercase tracking-wide text-[var(--color-text)]">
          Accès temporairement indisponible
        </p>
        <p className="mt-2 text-xs text-[var(--color-text-3)]">
          Réessayez, ou revenez plus tard si le problème persiste.
        </p>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={reset}
            className="flex-1 rounded bg-[var(--color-ink)] px-4 py-2 text-sm font-semibold text-[var(--color-cream)] transition hover:opacity-90"
          >
            Réessayer
          </button>
          <a
            href="/login"
            className="flex-1 rounded border border-[var(--color-surface-border)] px-4 py-2 text-sm font-semibold text-[var(--color-text)] transition hover:bg-[var(--color-surface-2)]"
          >
            Connexion
          </a>
        </div>
      </div>
    </main>
  );
}
