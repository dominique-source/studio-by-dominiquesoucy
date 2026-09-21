"use client";

// A small "structure is being assembled" marker for IN_DEVELOPMENT
// projects — diagonal hazard-style hatching rendered at low opacity, never
// a fake completion percentage.
export function ConstructionSignal({ label = "In development" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden="true"
        className="block h-3 w-3 shrink-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, var(--studio-blue) 0, var(--studio-blue) 2px, transparent 2px, transparent 5px)",
          opacity: 0.8,
        }}
      />
      <span
        className="font-mono text-[10px] uppercase tracking-[0.16em]"
        style={{ color: "var(--studio-silver)" }}
      >
        {label}
      </span>
    </span>
  );
}
