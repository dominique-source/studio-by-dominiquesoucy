"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createEntityAction } from "@/lib/actions/entity-actions";
import { ENTITY_KIND_LABELS, type EntityKind } from "@/lib/types";
import { useSelection } from "@/components/shell/selection-context";

const KIND_OPTIONS = Object.entries(ENTITY_KIND_LABELS) as [EntityKind, string][];

export function CreateEntityModal({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { select } = useSelection();
  const [kind, setKind] = useState<EntityKind>("unclassified");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const viewMatch = pathname.match(/^\/carte\/([^/]+)/);
  const currentViewId = viewMatch?.[1] ?? null;

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
    setError(null);
    const result = await createEntityAction(
      { kind, exactName: name, description: description || null },
      currentViewId ?? undefined,
      currentViewId ? { x: 200 + Math.random() * 200, y: 200 + Math.random() * 200 } : undefined
    );
    setSubmitting(false);
    if (!result.ok) {
      setError("La création a échoué. Réessayez.");
      return;
    }
    select(result.data.id);
    onClose();
    router.refresh();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-entity-title"
        className="w-full max-w-md rounded-md border bg-[var(--color-surface)] p-6 shadow-lg"
        style={{ borderColor: "var(--color-surface-border)" }}
      >
        <h2 id="create-entity-title" className="font-display mb-4 text-xl font-bold">
          Ajouter un objet
        </h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="create-entity-kind" className="mb-1 block text-xs font-medium uppercase tracking-wide text-[var(--color-text-2)]">
            Type
          </label>
          <select
            id="create-entity-kind"
            value={kind}
            onChange={(e) => setKind(e.target.value as EntityKind)}
            className="mb-4 w-full rounded border bg-white px-3 py-2 text-sm outline-none"
            style={{ borderColor: "var(--color-surface-border)" }}
          >
            {KIND_OPTIONS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <label htmlFor="create-entity-name" className="mb-1 block text-xs font-medium uppercase tracking-wide text-[var(--color-text-2)]">
            Nom exact
          </label>
          <input
            id="create-entity-name"
            autoFocus
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-4 w-full rounded border bg-white px-3 py-2 text-sm outline-none focus-visible:border-[var(--color-accent-green)]"
            style={{ borderColor: "var(--color-surface-border)" }}
          />

          <label htmlFor="create-entity-description" className="mb-1 block text-xs font-medium uppercase tracking-wide text-[var(--color-text-2)]">
            Description (facultatif)
          </label>
          <textarea
            id="create-entity-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mb-4 w-full rounded border bg-white px-3 py-2 text-sm outline-none focus-visible:border-[var(--color-accent-green)]"
            style={{ borderColor: "var(--color-surface-border)" }}
          />

          {currentViewId && (
            <p className="mb-4 text-xs" style={{ color: "var(--color-text-3)" }}>
              Sera ajouté à la vue courante.
            </p>
          )}

          {error && (
            <p role="alert" className="mb-4 text-sm text-[var(--color-danger)]">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded px-4 py-2 text-sm font-medium"
              style={{ color: "var(--color-text-2)" }}
            >
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
