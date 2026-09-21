"use client";

// A small "you've already been here" trace, shown next to a project title
// wherever the current session's visit history (useMemoryTrace) says so.
// Stores nothing sensitive — just a slug in sessionStorage.
export function MemoryTrace({ visited }: { visited: boolean }) {
  if (!visited) return null;
  return (
    <span
      className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em]"
      style={{ color: "var(--studio-blue-soft)" }}
      title="Viewed earlier this session"
    >
      <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full" style={{ background: "var(--studio-blue-soft)" }} />
      Viewed
    </span>
  );
}
