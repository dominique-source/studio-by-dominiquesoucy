"use client";

import { STAGES } from "@/data/how-it-works";
import { FilmFragment } from "@/components/motion/FilmFragment";
import { StoryboardFragment } from "@/components/motion/StoryboardFragment";
import { EditorialNote } from "@/components/motion/EditorialNote";
import { useInView } from "@/lib/motion/useInView";
import { usePrefersReducedMotion } from "@/lib/motion/usePrefersReducedMotion";

// Page 2 — "FROM INSTINCT TO COMPANY." One connected cinematic journey,
// not a vertical list with horizontal separators. Each stage adds visual
// matter to a single continuous strip: idea adds a mark, pitch adds
// direction, prototype adds structure, prove adds real people, monetize
// adds movement, the CEO stage separates the company from the Studio,
// and Grow Together reconnects its value to the ecosystem. One signal
// line runs the full length, on desktop as a horizontal scroll-snap
// strip (matching the reference's single wide sequence), on mobile as
// vertical cinematic chapters in the same order.
const TEXTURE_BY_STAGE: Record<string, { kind: "film" | "storyboard"; variant: string }> = {
  idea: { kind: "storyboard", variant: "tacticsBoard" },
  pitch: { kind: "film", variant: "floodlights" },
  prototype: { kind: "storyboard", variant: "storyboardGrid" },
  prove: { kind: "storyboard", variant: "runningFigure" },
  monetize: { kind: "film", variant: "track" },
  ceo: { kind: "storyboard", variant: "diagonalStripe" },
  grow: { kind: "film", variant: "horizonStreak" },
};

function StageTexture({ id }: { id: string }) {
  const t = TEXTURE_BY_STAGE[id];
  if (!t) return null;
  if (t.kind === "storyboard") {
    return <StoryboardFragment variant={t.variant as never} displayWidth={260} />;
  }
  return <FilmFragment variant={t.variant as never} displayWidth={260} />;
}

function StageCard({ stage, index }: { stage: (typeof STAGES)[number]; index: number }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const reduced = usePrefersReducedMotion();
  const revealed = inView || reduced;
  const isCeo = stage.id === "ceo";

  return (
    <div
      ref={ref}
      className="fragment relative flex w-[280px] shrink-0 snap-start flex-col gap-4 sm:w-[320px]"
      style={{
        animationPlayState: revealed ? "running" : "paused",
        animationDelay: `${index * 40}ms`,
      }}
    >
      <div className="relative overflow-hidden border" style={{ borderColor: isCeo ? "var(--studio-gold)" : "var(--studio-line)" }}>
        <StageTexture id={stage.id} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 30%, rgba(3,5,7,0.9) 100%)" }} />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <span className="font-display text-4xl" style={{ color: isCeo ? "var(--studio-gold)" : "var(--studio-blue-soft)" }}>
            {stage.number}
          </span>
          <p className="font-display text-xl uppercase leading-none" style={{ color: "var(--studio-white)" }}>
            {stage.title}
          </p>
        </div>
      </div>
      <p className="max-w-xs text-sm" style={{ color: "var(--studio-silver)" }}>
        {stage.description}
      </p>
      {stage.details && (
        <ul className="grid grid-cols-1 gap-2 border-t pt-4" style={{ borderColor: "var(--studio-line)" }}>
          {stage.details.map((line) => (
            <li key={line} className="flex items-start gap-2 text-xs" style={{ color: "var(--studio-silver)" }}>
              <span aria-hidden="true" className="mt-1 block h-1 w-1 shrink-0 rounded-full" style={{ background: "var(--studio-gold-soft)" }} />
              {line}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function ProcessAssembly() {
  return (
    <div>
      <div className="relative">
        {/* The one continuous signal line running the full journey. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 right-0 top-[104px] hidden h-px sm:block"
          style={{ background: "linear-gradient(90deg, transparent, var(--studio-blue-soft) 6%, var(--studio-blue-soft) 94%, transparent)" }}
        />
        <div className="scrollbar-none flex snap-x gap-6 overflow-x-auto px-6 pb-6 sm:px-10">
          {STAGES.map((stage, i) => (
            <StageCard key={stage.id} stage={stage} index={i} />
          ))}
        </div>
      </div>

      <div className="relative mt-16 flex flex-col items-center gap-6 border-t pt-16 text-center sm:mt-20 sm:pt-20" style={{ borderColor: "var(--studio-line)" }}>
        <div className="absolute -top-6 left-1/2 -translate-x-1/2">
          <EditorialNote rotate={-1}>Why before how.</EditorialNote>
        </div>
        <p className="mx-auto max-w-2xl font-display text-2xl uppercase leading-tight sm:text-4xl" style={{ color: "var(--studio-white)" }}>
          The CEO owns the execution.
          <br />
          <span style={{ color: "var(--studio-blue-soft)" }}>The Studio protects the philosophy.</span>
        </p>
      </div>
    </div>
  );
}
