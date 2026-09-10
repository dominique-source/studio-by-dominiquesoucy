"use client";

import { useState, useEffect } from "react";
import { RELATIONSHIP_LABELS, type RelationshipType } from "@/lib/types";

export function ConnectionModal({
  fromName,
  toName,
  onConfirm,
  onCancel,
}: {
  fromName: string;
  toName: string;
  onConfirm: (type: RelationshipType, confirmed: boolean) => void;
  onCancel: () => void;
}) {
  const [type, setType] = useState<RelationshipType>("concerns");
  const [envisaged, setEnvisaged] = useState(true);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onMouseDown={(e) => e.target === e.currentTarget && onCancel()}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="connection-modal-title"
        className="w-full max-w-sm rounded-md border bg-[var(--color-surface)] p-5 shadow-lg"
        style={{ borderColor: "var(--color-surface-border)" }}
      >
        <h2 id="connection-modal-title" className="font-display mb-1 text-lg font-bold">
          Nouveau lien
        </h2>
        <p className="mb-4 text-sm" style={{ color: "var(--color-text-2)" }}>
          <strong>{fromName}</strong> … <strong>{toName}</strong>
        </p>
        <select
          aria-label="Type de relation"
          value={type}
          onChange={(e) => setType(e.target.value as RelationshipType)}
          className="mb-3 w-full rounded border bg-white px-2.5 py-1.5 text-sm"
          style={{ borderColor: "var(--color-surface-border)" }}
        >
          {Object.entries(RELATIONSHIP_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <label className="mb-4 flex items-center gap-2 text-xs" style={{ color: "var(--color-text-2)" }}>
          <input type="checkbox" checked={envisaged} onChange={(e) => setEnvisaged(e.target.checked)} />
          Relation envisagée (non confirmée)
        </label>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="rounded px-3 py-1.5 text-sm" style={{ color: "var(--color-text-2)" }}>
            Annuler
          </button>
          <button
            onClick={() => onConfirm(type, !envisaged)}
            className="rounded bg-[var(--color-ink)] px-3 py-1.5 text-sm font-semibold text-[var(--color-cream)]"
          >
            Créer le lien
          </button>
        </div>
      </div>
    </div>
  );
}
