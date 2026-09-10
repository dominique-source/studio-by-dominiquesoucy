"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createViewAction } from "@/lib/actions/view-actions";
import { ENTITY_KIND_LABELS, type EntityKind } from "@/lib/types";

const KIND_OPTIONS = Object.entries(ENTITY_KIND_LABELS) as [EntityKind, string][];

export function CreateViewModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [kinds, setKinds] = useState<Set<EntityKind>>(new Set());
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    const result = await createViewAction(name, "real", kinds.size > 0 ? [...kinds] : undefined);
    setSubmitting(false);
    if (result.ok) {
      router.push(`/carte/${result.data.id}`);
      router.refresh();
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-view-title"
        className="w-full max-w-md rounded-md border bg-[var(--color-surface)] p-6 shadow-lg"
        style={{ borderColor: "var(--color-surface-border)" }}
      >
        <h2 id="create-view-title" className="font-display mb-4 text-xl font-bold">
          Nouvelle vue
        </h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="view-name" className="mb-1 block text-xs font-medium uppercase tracking-wide text-[var(--color-text-2)]">
            Nom de la vue
          </label>
          <input
            id="view-name"
            autoFocus
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-4 w-full rounded border bg-white px-3 py-2 text-sm outline-none focus-visible:border-[var(--color-accent-green)]"
            style={{ borderColor: "var(--color-surface-border)" }}
            placeholder="Ex. Marques"
          />

          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[var(--color-text-2)]">
            Amorcer avec (facultatif)
          </p>
          <p className="mb-2 text-xs" style={{ color: "var(--color-text-3)" }}>
            Ajoute une fois tous les objets accessibles de ces types. La vue reste ensuite librement modifiable.
          </p>
          <div className="mb-4 grid grid-cols-2 gap-1">
            {KIND_OPTIONS.map(([value, label]) => (
              <label key={value} className="flex items-center gap-2 text-xs" style={{ color: "var(--color-text-2)" }}>
                <input
                  type="checkbox"
                  checked={kinds.has(value)}
                  onChange={(e) => {
                    setKinds((prev) => {
                      const next = new Set(prev);
                      if (e.target.checked) next.add(value);
                      else next.delete(value);
                      return next;
                    });
                  }}
                />
                {label}
              </label>
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="rounded px-4 py-2 text-sm font-medium" style={{ color: "var(--color-text-2)" }}>
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting || !name.trim()}
              className="rounded bg-[var(--color-ink)] px-4 py-2 text-sm font-semibold text-[var(--color-cream)] disabled:opacity-50"
            >
              {submitting ? "Création…" : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
