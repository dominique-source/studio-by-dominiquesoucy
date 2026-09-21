"use client";

import { useState } from "react";
import { getProjectBySlug, type Project } from "@/data/projects";
import { FilmFragment } from "@/components/motion/FilmFragment";
import { EditorialNote } from "@/components/motion/EditorialNote";
import { EditorialMark } from "@/components/motion/EditorialMark";
import { GroundTexture } from "@/components/motion/GroundTexture";
import { SignalPulse } from "@/components/motion/SignalPulse";
import { ProjectPortal } from "@/components/motion/ProjectPortal";
import { useMemoryTrace } from "@/lib/motion/useMemoryTrace";

// Page 1 — "ONE STUDIO. MULTIPLE COMPANIES." This is the binding
// composition from the approved reference: the Studio nucleus at the
// visual/gravitational center, five flagship companies arranged around
// it as real image tiles (not cards), connected by drawn signal lines,
// with handwritten annotations, film-fragment texture and a ground line
// anchoring the whole thing — reproduced region-by-region from
// page1.png, not redesigned from a text description of it.
const NUCLEUS = { x: 50, y: 46 };

const COMPANIES: {
  slug: string;
  x: number;
  y: number;
  width: number;
  fragment: Parameters<typeof FilmFragment>[0]["variant"];
  accent: string;
}[] = [
  { slug: "purinstinct", x: 26, y: 24, width: 250, fragment: "floodlights", accent: "var(--studio-accent-purinstinct)" },
  { slug: "5d-athlete", x: 69, y: 17, width: 220, fragment: "track", accent: "var(--studio-accent-5dathlete)" },
  { slug: "ballers-only", x: 81, y: 54, width: 240, fragment: "streaks", accent: "var(--studio-accent-ballers)" },
  { slug: "in-five", x: 64, y: 76, width: 200, fragment: "blueBeam", accent: "var(--studio-accent-infive)" },
  { slug: "instinct-studio", x: 30, y: 76, width: 220, fragment: "glassShard", accent: "var(--studio-accent-instinct-studio)" },
];

const NOTES: { text: string; x: number; y: number; rotate: number }[] = [
  { text: "Same human.\nDifferent angles.", x: 4, y: 8, rotate: -3 },
  { text: "Discipline creates freedom.", x: 84, y: 9, rotate: 2 },
  { text: "Stories move people.", x: 5, y: 58, rotate: -2 },
  { text: "Ideas in motion.", x: 86, y: 64, rotate: 3 },
  { text: "What's next?", x: 90, y: 42, rotate: -2 },
  { text: "Bigger human possibilities.", x: 82, y: 88, rotate: 1 },
];

function curve(from: { x: number; y: number }, to: { x: number; y: number }) {
  const midX = (from.x + to.x) / 2 + (to.y - from.y) * 0.12;
  const midY = (from.y + to.y) / 2 - (to.x - from.x) * 0.08;
  return `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`;
}

export function SourceComposition() {
  const [active, setActive] = useState<{ project: Project; x: number; y: number } | null>(null);
  const { visited, markVisited } = useMemoryTrace();

  function open(slug: string, x: number, y: number) {
    const project = getProjectBySlug(slug);
    if (!project) return;
    setActive({ project, x, y });
    markVisited(slug);
  }

  return (
    <section className="relative overflow-hidden pt-24 sm:pt-28">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-8">
        {/* Headline — large, condensed, upper-left, exactly the reference's placement. */}
        <div className="relative z-20 max-w-xl">
          <h1 className="font-display text-[15vw] font-normal uppercase leading-[0.86] sm:text-6xl md:text-7xl" style={{ color: "var(--studio-white)" }}>
            One Studio.
            <br />
            <span style={{ color: "var(--studio-gold)" }}>Multiple</span>
            <br />
            Companies.
          </h1>
          <p className="mt-4 max-w-sm text-sm sm:text-base" style={{ color: "var(--studio-silver)" }}>
            Independent brands connected by one creative philosophy.
          </p>
        </div>

        {/* The collage field: nucleus, companies, signal lines, notes. */}
        <div className="relative mt-6 hidden aspect-[16/10] w-full overflow-hidden md:block">
          <svg className="pointer-events-none absolute inset-0 z-10 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {COMPANIES.map((c) => (
              <path
                key={c.slug}
                d={curve(NUCLEUS, { x: c.x, y: c.y })}
                pathLength={1}
                fill="none"
                stroke="var(--studio-blue-soft)"
                strokeWidth={0.4}
                opacity={0.85}
                className="signal-path"
              />
            ))}
          </svg>

          {/* Nucleus — the Studio's own source, gold, dominant. */}
          <div
            className="absolute z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3"
            style={{ left: `${NUCLEUS.x}%`, top: `${NUCLEUS.y}%` }}
          >
            <div
              className="flex h-28 w-28 items-center justify-center rounded-full sm:h-36 sm:w-36"
              style={{
                background: "radial-gradient(circle, var(--studio-gold-soft) 0%, var(--studio-gold) 55%, transparent 78%)",
                boxShadow: "0 0 60px 10px rgba(217,164,65,0.45)",
              }}
            >
              <SignalPulse size={14} color="var(--studio-gold)" colorSoft="var(--studio-gold-soft)" />
            </div>
            <p className="font-display text-center text-lg leading-none" style={{ color: "var(--studio-white)" }}>
              Studio
              <span className="mt-1 block font-mono text-[9px] normal-case tracking-[0.12em]" style={{ color: "var(--studio-silver-dim)" }}>
                by Dominique Soucy
              </span>
            </p>
          </div>

          {COMPANIES.map((c) => {
            const project = getProjectBySlug(c.slug);
            if (!project) return null;
            return (
              <button
                key={c.slug}
                type="button"
                onClick={() => open(c.slug, c.x, c.y)}
                className="group absolute z-20 -translate-x-1/2 -translate-y-1/2 text-left"
                style={{ left: `${c.x}%`, top: `${c.y}%` }}
                aria-label={`${project.title} — open presentation`}
              >
                <div
                  className="relative inline-block overflow-hidden border-2 shadow-2xl transition-transform duration-300 group-hover:scale-[1.03]"
                  style={{ borderColor: c.accent }}
                >
                  <FilmFragment variant={c.fragment} displayWidth={c.width} />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 40%, rgba(3,5,7,0.92) 100%)" }} />
                  <div className="absolute inset-x-0 bottom-0 p-3">
                    <span className="flex items-center gap-1.5">
                      <SignalPulse size={7} color={c.accent} colorSoft={c.accent} />
                      <span className="font-mono text-[9px] uppercase tracking-[0.14em]" style={{ color: "var(--studio-silver)" }}>
                        {project.status.replace("_", " ")}
                      </span>
                      {visited.has(c.slug) && (
                        <span className="font-mono text-[9px] uppercase tracking-[0.14em]" style={{ color: "var(--studio-gold-soft)" }}>
                          · viewed
                        </span>
                      )}
                    </span>
                    <p className="font-display text-lg leading-none" style={{ color: "var(--studio-white)" }}>
                      {project.title}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}

          {/* Handwritten annotations, scattered exactly as in the reference. */}
          {NOTES.map((n) => (
            <div key={n.text} className="absolute z-20 max-w-[160px]" style={{ left: `${n.x}%`, top: `${n.y}%` }}>
              <EditorialNote rotate={n.rotate}>
                {n.text.split("\n").map((line, i) => (
                  <span key={i} className="block">
                    {line}
                  </span>
                ))}
              </EditorialNote>
            </div>
          ))}

          <div className="absolute right-[2%] top-[6%] z-20 opacity-70">
            <EditorialMark variant="orbit" displayWidth={70} />
          </div>
        </div>

        {/* Mobile: vertical cinematic sequence, same content, no orbit math. */}
        <div className="relative z-20 mt-8 flex flex-col gap-4 md:hidden">
          {COMPANIES.map((c) => {
            const project = getProjectBySlug(c.slug);
            if (!project) return null;
            return (
              <button
                key={c.slug}
                type="button"
                onClick={() => open(c.slug, 50, 50)}
                className="relative block w-full overflow-hidden border-2 text-left"
                style={{ borderColor: c.accent }}
              >
                <FilmFragment variant={c.fragment} displayWidth={340} className="w-full" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 30%, rgba(3,5,7,0.92) 100%)" }} />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <span className="flex items-center gap-1.5">
                    <SignalPulse size={7} color={c.accent} colorSoft={c.accent} />
                    <span className="font-mono text-[9px] uppercase tracking-[0.14em]" style={{ color: "var(--studio-silver)" }}>
                      {project.status.replace("_", " ")}
                    </span>
                  </span>
                  <p className="font-display text-2xl leading-none" style={{ color: "var(--studio-white)" }}>
                    {project.title}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="relative z-20 mt-10 flex items-center justify-between gap-4 border-t pt-6 sm:mt-4" style={{ borderColor: "var(--studio-line)" }}>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: "var(--studio-silver-dim)" }}>
            Size = priority · Distance = maturity · Brightness = activity
          </p>
          <p className="hidden font-display text-sm sm:block" style={{ color: "var(--studio-white)" }}>
            Select a company ↓
          </p>
        </div>
      </div>

      <div className="relative mt-8 h-32 sm:h-44">
        <GroundTexture />
      </div>

      {active && (
        <ProjectPortal project={active.project} originX={active.x} originY={active.y} onClose={() => setActive(null)} />
      )}
    </section>
  );
}
