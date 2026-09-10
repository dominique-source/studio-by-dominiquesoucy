"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { searchEntitiesAction } from "@/lib/actions/search-actions";
import { addExistingEntityToViewAction } from "@/lib/actions/view-actions";
import type { Entity } from "@/lib/types";

export function AddExistingToView({ viewId }: { viewId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Entity[]>([]);

  useEffect(() => {
    if (!query.trim()) return;
    const handle = setTimeout(() => searchEntitiesAction(query).then(setResults), 180);
    return () => clearTimeout(handle);
  }, [query]);

  const visibleResults = query.trim() ? results : [];

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-full border px-3 py-1 text-xs font-medium"
        style={{ borderColor: "var(--color-surface-border)", background: "var(--color-surface)" }}
      >
        <span className="sm:hidden">+ Objet existant</span>
        <span className="hidden sm:inline">Ajouter un objet existant à cette vue</span>
      </button>
    );
  }

  return (
    <div className="relative w-64 rounded border px-2 py-2 shadow-sm" style={{ borderColor: "var(--color-surface-border)", background: "var(--color-surface)" }}>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-medium" style={{ color: "var(--color-text-2)" }}>
          Ajouter à cette vue
        </span>
        <button onClick={() => setOpen(false)} aria-label="Fermer" className="text-sm leading-none">
          ×
        </button>
      </div>
      <input
        aria-label="Rechercher un objet à ajouter"
        autoFocus
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Rechercher un objet…"
        className="w-full rounded border bg-white px-2 py-1 text-sm outline-none"
        style={{ borderColor: "var(--color-surface-border)" }}
      />
      {visibleResults.length > 0 && (
        <ul className="mt-1 max-h-48 overflow-y-auto">
          {visibleResults.map((entity) => (
            <li key={entity.id}>
              <button
                className="block w-full px-1.5 py-1 text-left text-sm hover:bg-[var(--color-surface-2)]"
                onClick={() => {
                  addExistingEntityToViewAction(viewId, entity.id, { x: 160 + Math.random() * 240, y: 160 + Math.random() * 240 }).then(() => {
                    setOpen(false);
                    setQuery("");
                    router.refresh();
                  });
                }}
              >
                {entity.exactName}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
