"use client";

import { useState } from "react";
import { THOUGHTS, type Thought } from "@/data/philosophy";
import { ThoughtConnection } from "@/components/motion/ThoughtConnection";
import { useInView } from "@/lib/motion/useInView";
import { usePrefersReducedMotion } from "@/lib/motion/usePrefersReducedMotion";

// Authored coordinates (not computed) placing each thought so the
// connection chain reads as one flowing path across the field.
const POSITIONS: Record<string, { x: number; y: number }> = {
  "sport-is-art": { x: 10, y: 10 },
  "played-not-watched": { x: 40, y: 6 },
  "participation-over-spectatorship": { x: 68, y: 16 },
  "communication-tool": { x: 88, y: 34 },
  "human-behavior": { x: 68, y: 52 },
  "build-first": { x: 40, y: 58 },
  "studio-gives-room": { x: 14, y: 66 },
  "protects-philosophy": { x: 12, y: 88 },
  "value-before-layers": { x: 44, y: 92 },
  "stronger-together": { x: 76, y: 84 },
};

function ThoughtCard({ thought, active, onHover }: { thought: Thought; active: boolean; onHover: (id: string | null) => void }) {
  const pos = POSITIONS[thought.id];
  return (
    <button
      type="button"
      onMouseEnter={() => onHover(thought.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(thought.id)}
      onBlur={() => onHover(null)}
      className="absolute max-w-[220px] -translate-x-1/2 -translate-y-1/2 text-left transition-opacity duration-300"
      style={{ left: `${pos.x}%`, top: `${pos.y}%`, opacity: active ? 1 : 0.72 }}
    >
      <p className="font-display text-base font-black uppercase leading-tight sm:text-lg" style={{ color: "var(--studio-white)" }}>
        {thought.phrase}
      </p>
      <p
        className="mt-1 text-xs transition-[max-height,opacity] duration-300"
        style={{
          color: "var(--studio-silver)",
          opacity: active ? 1 : 0,
          maxHeight: active ? 60 : 0,
          overflow: "hidden",
        }}
      >
        {thought.detail}
      </p>
    </button>
  );
}

export function ThoughtField() {
  const { ref, inView } = useInView<HTMLDivElement>(0.15);
  const reduced = usePrefersReducedMotion();
  const revealed = inView || reduced;
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div ref={ref}>
      {/* Desktop: the connected field. */}
      <div
        className="relative hidden aspect-[16/11] w-full transition-opacity duration-700 md:block"
        style={{ opacity: revealed ? 1 : 0 }}
      >
        <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {THOUGHTS.flatMap((t) =>
            t.connections.map((toId) => (
              <ThoughtConnection
                key={`${t.id}-${toId}`}
                from={POSITIONS[t.id]}
                to={POSITIONS[toId]}
                active={revealed}
              />
            ))
          )}
        </svg>
        {THOUGHTS.map((t) => (
          <ThoughtCard
            key={t.id}
            thought={t}
            active={hovered === null || hovered === t.id}
            onHover={setHovered}
          />
        ))}
      </div>

      {/* Mobile: a readable authored sequence, same content, no field. */}
      <ul className="flex flex-col gap-8 md:hidden">
        {THOUGHTS.map((t) => (
          <li key={t.id}>
            <p className="font-display text-xl font-black uppercase leading-tight" style={{ color: "var(--studio-white)" }}>
              {t.phrase}
            </p>
            <p className="mt-2 text-sm" style={{ color: "var(--studio-silver)" }}>
              {t.detail}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
