"use client";

import { useState } from "react";
import { THOUGHTS, type Thought } from "@/data/philosophy";
import { ThoughtConnection } from "@/components/motion/ThoughtConnection";
import { FilmFragment } from "@/components/motion/FilmFragment";
import { EditorialMark } from "@/components/motion/EditorialMark";
import { useInView } from "@/lib/motion/useInView";
import { usePrefersReducedMotion } from "@/lib/motion/usePrefersReducedMotion";

// Two thoughts carry supporting texture, so the field reads as authored
// and physical rather than independent text blocks.
const TEXTURE_BY_ID: Record<string, "floodlights" | "glassShard"> = {
  "sport-is-art": "floodlights",
  "build-first": "glassShard",
};

// Authored coordinates (not computed) placing each thought so the
// connection chain reads as one flowing path across the field.
const POSITIONS: Record<string, { x: number; y: number }> = {
  "sport-is-art": { x: 9, y: 8 },
  "played-not-watched": { x: 40, y: 4 },
  "participation-over-spectatorship": { x: 71, y: 10 },
  "communication-tool": { x: 90, y: 32 },
  "human-behavior": { x: 62, y: 40 },
  "build-first": { x: 33, y: 68 },
  "studio-gives-room": { x: 9, y: 78 },
  "protects-philosophy": { x: 9, y: 96 },
  "value-before-layers": { x: 46, y: 100 },
  "stronger-together": { x: 80, y: 78 },
};

function ThoughtCard({ thought, active, onHover }: { thought: Thought; active: boolean; onHover: (id: string | null) => void }) {
  const pos = POSITIONS[thought.id];
  const texture = TEXTURE_BY_ID[thought.id];
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
      {texture && (
        <div className="mb-2 overflow-hidden border" style={{ borderColor: "var(--studio-line)" }}>
          <FilmFragment variant={texture} displayWidth={180} />
        </div>
      )}
      <p className="font-display text-base uppercase leading-tight sm:text-lg" style={{ color: "var(--studio-white)" }}>
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
        className="relative hidden aspect-[16/14] w-full pb-16 transition-opacity duration-700 md:block"
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

        {/* The field's central physical anchor — every principle radiates
            from one object, echoing the reference's centered ball. */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
          <div
            className="h-24 w-24 rounded-full"
            style={{
              background: "radial-gradient(circle at 35% 30%, var(--studio-gold-soft), var(--studio-gold) 45%, #4a3210 100%)",
              boxShadow: "0 0 50px rgba(217,164,65,0.35)",
            }}
          />
        </div>
        <div className="absolute left-[54%] top-[46%] opacity-60" aria-hidden="true">
          <EditorialMark variant="orbit" displayWidth={90} />
        </div>
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
