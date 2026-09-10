"use client";

import { useState } from "react";

/**
 * Barre de capture flottante. La capture vocale/texte réelle (transcription,
 * propositions IA) arrive à l'étape 3 du contrat d'implémentation — ce
 * composant reste donc désactivé plutôt que de simuler un traitement.
 */
export function CaptureBar() {
  const [hint, setHint] = useState(false);

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center px-4">
      <div
        className="pointer-events-auto flex max-w-full items-center gap-2 rounded-full px-3 py-2 shadow-lg sm:gap-3"
        style={{ background: "var(--color-ink)", color: "var(--color-cream)" }}
      >
        <button
          type="button"
          onClick={() => setHint(true)}
          onBlur={() => setHint(false)}
          aria-describedby={hint ? "capture-hint" : undefined}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full opacity-60"
          title="Capture vocale — à venir (étape 3)"
        >
          <MicIcon />
        </button>
        <span className="hidden pr-1 text-sm sm:inline" style={{ color: "var(--color-sidebar-text-2)" }}>
          Capturer une idée
        </span>
        <button
          type="button"
          onClick={() => setHint(true)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20"
          title="Capture texte — à venir (étape 3)"
        >
          +
        </button>
        <button
          type="button"
          onClick={() => setHint(true)}
          className="flex h-8 w-8 items-center justify-center rounded-full opacity-60"
          title="Saisie clavier — à venir"
        >
          <KeyboardIcon />
        </button>
      </div>
      {hint && (
        <p
          id="capture-hint"
          role="status"
          className="pointer-events-none absolute -top-8 rounded-full px-3 py-1 text-xs shadow"
          style={{ background: "var(--color-surface)", border: "1px solid var(--color-surface-border)" }}
        >
          Capture vocale/texte — bientôt disponible.
        </p>
      )}
    </div>
  );
}

function MicIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="5.5" y="1.5" width="5" height="8" rx="2.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M3 8a5 5 0 0010 0M8 13v1.7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
function KeyboardIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="1.5" y="4" width="13" height="8" rx="1.3" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4 7h.01M6.5 7h.01M9 7h.01M11.5 7h.01M4.5 9.5h7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
