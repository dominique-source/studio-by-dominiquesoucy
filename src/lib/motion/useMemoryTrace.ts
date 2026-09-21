"use client";

import { useCallback, useState } from "react";

// "Memory Trace": the site remembers which projects were opened during the
// CURRENT browser session only. sessionStorage clears itself when the tab
// closes — nothing here persists, syncs, or leaves the browser.
const STORAGE_KEY = "studio.visitedProjects";

function readVisited(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

export function useMemoryTrace() {
  const [visited, setVisited] = useState<Set<string>>(() => readVisited());

  const markVisited = useCallback((slug: string) => {
    const current = readVisited();
    if (current.has(slug)) return;
    current.add(slug);
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...current]));
    } catch {
      // Private browsing or storage disabled — the trace simply doesn't persist.
    }
    setVisited(new Set(current));
  }, []);

  return { visited, markVisited };
}
