"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { searchEntitiesAction } from "@/lib/actions/search-actions";
import { useSelection } from "@/components/shell/selection-context";
import { ENTITY_KIND_LABELS, type Entity } from "@/lib/types";
import { CreateEntityModal } from "@/components/shell/CreateEntityModal";

const CRUMBS: Record<string, string> = {
  "/carte": "Vue d'ensemble",
  "/a-traiter": "À traiter",
  "/personnes": "Personnes",
  "/decisions": "Décisions",
  "/changements": "Changements",
};

export function TopBar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const pathname = usePathname();
  const { select, mode, setMode } = useSelection();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Entity[]>([]);
  const [open, setOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [, startTransition] = useTransition();
  const boxRef = useRef<HTMLDivElement>(null);

  const section = pathname.startsWith("/carte") ? "Carte" : CRUMBS[pathname] ?? "";

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    if (!query.trim()) return;
    const handle = setTimeout(() => {
      startTransition(() => {
        searchEntitiesAction(query).then(setResults);
      });
    }, 180);
    return () => clearTimeout(handle);
  }, [query]);

  const visibleResults = query.trim() ? results : [];

  return (
    <header
      className="flex h-14 shrink-0 items-center gap-2 border-b px-3 sm:gap-4 sm:px-5"
      style={{ borderColor: "var(--color-surface-border)", background: "var(--color-canvas)" }}
    >
      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="Ouvrir la navigation"
        className="shrink-0 rounded p-1.5 md:hidden"
      >
        <MenuIcon />
      </button>

      <nav className="hidden min-w-0 shrink-0 text-sm sm:block" aria-label="Fil d'ariane">
        <span style={{ color: "var(--color-text-3)" }}>Studio</span>
        <span className="mx-1.5" style={{ color: "var(--color-text-3)" }}>
          /
        </span>
        <span className="font-medium">{section}</span>
      </nav>

      <div ref={boxRef} className="relative ml-auto w-full min-w-0 sm:max-w-sm">
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Rechercher"
          aria-label="Recherche"
          className="w-full rounded-full border px-4 py-1.5 text-sm outline-none focus-visible:border-[var(--color-accent-green)]"
          style={{ borderColor: "var(--color-surface-border)", background: "var(--color-surface)" }}
        />
        {open && visibleResults.length > 0 && (
          <ul
            role="listbox"
            className="absolute z-20 mt-1 w-full overflow-hidden rounded-md border shadow-md"
            style={{ borderColor: "var(--color-surface-border)", background: "var(--color-surface)" }}
          >
            {visibleResults.map((entity) => (
              <li key={entity.id}>
                <button
                  type="button"
                  onClick={() => {
                    select(entity.id);
                    setOpen(false);
                    setQuery("");
                  }}
                  className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-[var(--color-surface-2)]"
                >
                  <span className="truncate">{entity.exactName}</span>
                  <span className="ml-2 shrink-0 text-xs" style={{ color: "var(--color-text-3)" }}>
                    {ENTITY_KIND_LABELS[entity.kind]}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
        {open && query.trim() && visibleResults.length === 0 && (
          <div
            className="absolute z-20 mt-1 w-full rounded-md border px-3 py-2 text-sm shadow-md"
            style={{ borderColor: "var(--color-surface-border)", background: "var(--color-surface)", color: "var(--color-text-3)" }}
          >
            Aucun résultat
          </div>
        )}
      </div>

      <div
        className="hidden shrink-0 overflow-hidden rounded-full border text-xs font-medium sm:flex"
        style={{ borderColor: "var(--color-surface-border)" }}
      >
        <button
          type="button"
          onClick={() => setMode("real")}
          className={clsx("px-3 py-1.5 transition-colors")}
          style={mode === "real" ? { background: "var(--color-ink)", color: "var(--color-cream)" } : { color: "var(--color-text-2)" }}
        >
          Réalité
        </button>
        <button
          type="button"
          onClick={() => setMode("vision")}
          className={clsx("px-3 py-1.5 transition-colors")}
          style={mode === "vision" ? { background: "var(--color-ink)", color: "var(--color-cream)" } : { color: "var(--color-text-2)" }}
        >
          Vision
        </button>
      </div>

      <button
        type="button"
        onClick={() => setCreateOpen(true)}
        aria-label="Ajouter"
        className="shrink-0 rounded-full bg-[var(--color-ink)] px-3 py-1.5 text-xs font-semibold text-[var(--color-cream)] transition hover:opacity-90 sm:px-4"
      >
        <span aria-hidden className="sm:hidden">
          +
        </span>
        <span className="hidden sm:inline">+ Ajouter</span>
      </button>

      {createOpen && <CreateEntityModal onClose={() => setCreateOpen(false)} />}
    </header>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M3.5 6h13M3.5 10h13M3.5 14h13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
