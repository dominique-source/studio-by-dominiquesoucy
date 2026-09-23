import Link from "next/link";
import { HandUnderline } from "@/components/studio-public/HandUnderline";
import { PhotoSlot } from "@/components/studio-public/PhotoSlot";

// Shared-coordinate canvas for the hero action shot + the five skill-ring
// badges winding across it — same technique used on the other pages.
const HERO_W = 1672;
const HERO_H = 620;
const SKILLS: { label: string; x: number; y: number }[] = [
  { label: "Speed", x: 300, y: 230 },
  { label: "Foot skills", x: 260, y: 460 },
  { label: "Hand skills", x: 1240, y: 220 },
  { label: "IQ", x: 1090, y: 480 },
  { label: "Evasion", x: 1400, y: 380 },
];

// Positioned in the same HERO canvas coordinate space as the photo and skill
// rings (x near either edge) rather than outside it — an earlier version
// used negative percentage offsets to sit "outside" the hero box, which
// pushed the text past the page's own padding and off the visible viewport.
const MARKS_LEFT: { text: string; y: number }[] = [
  { text: "From instinct\nto company.", y: 20 },
  { text: "Athletic\nintelligence\nin action.", y: 110 },
  { text: "Real movement\nreal people.", y: 400 },
];

const MARKS_RIGHT: { text: string; y: number }[] = [
  { text: "More than\none skill.", y: 20 },
  { text: "Ideas\nmove people.", y: 110 },
  { text: "A brighter\ntomorrow.", y: 280 },
  { text: "Complete athletes\nbrighter people.", y: 460 },
  { text: "Same human\ndifferent angles.", y: 550 },
];

function pct(v: number, total: number) {
  return `${(v / total) * 100}%`;
}

export function PurinstinctPortalView() {
  return (
    <main className="studio-public relative min-h-screen overflow-x-clip">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(20,120,255,0.16),transparent_60%)]" />

      {/* portal chrome — this page reads as an overlay opened from the
          ecosystem map, not a top-level nav destination */}
      <header className="relative z-20 flex items-center justify-between gap-6 px-6 py-6 sm:px-10">
        <Link href="/" className="shrink-0 leading-none">
          <p className="font-studio-display text-lg tracking-tight">Studio</p>
          <p className="studio-eyebrow mt-0.5 !text-[9px]">By Dominique Soucy</p>
        </Link>
        <p className="studio-eyebrow hidden !text-[11px] text-white/60 sm:block">Original sport property</p>
        <div className="flex items-center gap-4">
          <Link href="/ecosystem" className="studio-eyebrow !text-[10px] text-white/70 transition hover:text-white">
            Return to the ecosystem
          </Link>
          <Link
            href="/ecosystem"
            aria-label="Close and return to the ecosystem"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white/70 transition hover:border-white/50 hover:text-white"
          >
            ×
          </Link>
        </div>
      </header>

      {/* headline */}
      <div className="fragment relative z-10 mx-auto max-w-4xl px-6 pt-2 text-center sm:px-10" style={{ animationDelay: "80ms" }}>
        <h1 className="font-studio-display text-6xl leading-none tracking-tight sm:text-7xl xl:text-8xl">
          Pürinstinct<sup className="text-lg align-super">™</sup>
        </h1>
        <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-white/75 sm:text-base">
          A new sport built to reveal the complete athlete.
        </p>
      </div>

      {/* mobile/tablet: the fixed hero canvas below only has room for five
          96px skill rings once it's wide — below `lg` it collapses to a
          plain hero image with the skills as a simple chip row. */}
      <div className="relative z-10 mx-auto mt-8 max-w-2xl px-6 sm:px-10 lg:hidden">
        <PhotoSlot label="Pürinstinct match action — hero" aspect="4 / 3" className="w-full" />
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {SKILLS.map((s) => (
            <span
              key={s.label}
              className="studio-eyebrow rounded-full border border-[var(--studio-blue)] px-4 py-2 !text-[10px] text-white/80"
            >
              {s.label}
            </span>
          ))}
        </div>
      </div>

      {/* hero action composition */}
      <div className="relative z-10 mx-auto mt-8 hidden max-w-[1672px] px-6 sm:px-10 lg:block">
        <div className="relative w-full" style={{ aspectRatio: `${HERO_W} / ${HERO_H}` }}>
          <PhotoSlot label="Pürinstinct match action — hero" aspect={`${HERO_W} / ${HERO_H}`} className="absolute inset-0 h-full w-full" />

          <svg viewBox={`0 0 ${HERO_W} ${HERO_H}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
            <defs>
              <filter id="skillGlow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="5" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              pathLength="1"
              d={`M${SKILLS.map((s) => `${s.x} ${s.y}`).join(" L ")}`}
              stroke="var(--studio-blue)"
              strokeWidth="2.4"
              fill="none"
              opacity="0.85"
              filter="url(#skillGlow)"
              className="signal-path"
              style={{ animationDelay: "300ms" }}
            />
          </svg>

          {SKILLS.map((s, i) => (
            <div
              key={s.label}
              className="fragment absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[var(--studio-blue)] text-center"
              style={{
                left: pct(s.x, HERO_W),
                top: pct(s.y, HERO_H),
                width: 96,
                height: 96,
                boxShadow: "0 0 30px 4px rgba(20,120,255,0.45)",
                background: "radial-gradient(circle, rgba(10,15,22,0.7), rgba(5,7,10,0.9))",
                animationDelay: `${500 + i * 110}ms`,
              }}
            >
              <p className="font-studio-display text-sm leading-tight">{s.label}</p>
            </div>
          ))}

          {MARKS_LEFT.map((m, i) => (
            <div
              key={m.text}
              className="fragment absolute hidden -rotate-2 xl:block"
              style={{ left: pct(20, HERO_W), top: pct(m.y, HERO_H), animationDelay: `${700 + i * 80}ms` }}
            >
              <p className="whitespace-pre text-[11px] font-semibold uppercase tracking-wide text-white/60">{m.text}</p>
              <HandUnderline width={56} className="mt-0.5" />
            </div>
          ))}
          {MARKS_RIGHT.map((m, i) => (
            <div
              key={m.text}
              className="fragment absolute hidden rotate-2 text-right xl:block"
              style={{ right: pct(20, HERO_W), top: pct(m.y, HERO_H), animationDelay: `${760 + i * 80}ms` }}
            >
              <p className="whitespace-pre text-[11px] font-semibold uppercase tracking-wide text-white/60">{m.text}</p>
              <HandUnderline width={56} className="ml-auto mt-0.5" />
            </div>
          ))}
        </div>
      </div>

      {/* real stats */}
      <div className="fragment relative z-10 mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-6 text-center sm:px-10" style={{ animationDelay: "1000ms" }}>
        <div>
          <p className="font-studio-display text-3xl leading-none sm:text-4xl">10,000+</p>
          <p className="studio-eyebrow mt-1 !text-[10px] text-white/50">Participants</p>
        </div>
        <span aria-hidden="true" className="hidden h-8 w-px bg-white/20 sm:block" />
        <div>
          <p className="font-studio-display text-3xl leading-none sm:text-4xl">150+</p>
          <p className="studio-eyebrow mt-1 !text-[10px] text-white/50">Schools</p>
        </div>
        <span aria-hidden="true" className="hidden h-8 w-px bg-white/20 sm:block" />
        <div>
          <p className="font-studio-display text-3xl leading-none sm:text-4xl">One</p>
          <p className="studio-eyebrow mt-1 !text-[10px] text-white/50">Original sport property</p>
        </div>
      </div>

      {/* CTA — real, verified URL from the approved reference (page4.png) */}
      <div className="fragment relative z-10 mx-auto mt-8 flex max-w-md flex-col items-center gap-3 px-6 pb-16 text-center sm:px-10" style={{ animationDelay: "1100ms" }}>
        <a
          href="https://purinstinct.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 border-2 border-[var(--studio-blue)] px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-[var(--studio-blue)]/10"
          style={{ boxShadow: "0 0 24px 2px rgba(20,120,255,0.35)" }}
        >
          Enter Pürinstinct <span aria-hidden="true">→</span>
        </a>
        <p className="text-xs text-white/50">purinstinct.com</p>
        <p className="studio-eyebrow flex items-center gap-1.5 !text-[10px] text-white/60">
          <span className="signal-node h-1.5 w-1.5 rounded-full bg-[var(--studio-blue)]" />
          Live
        </p>
      </div>
    </main>
  );
}
