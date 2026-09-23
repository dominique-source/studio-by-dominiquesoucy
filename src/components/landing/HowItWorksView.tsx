import { PublicNav } from "@/components/studio-public/PublicNav";
import { PhotoSlot } from "@/components/studio-public/PhotoSlot";
import { MountainGround } from "@/components/studio-public/MountainGround";

// Small header-cluster canvas (photo collage next to the headline) — same
// shared-coordinate technique as the homepage/ecosystem nucleus orbit.
const HEAD_W = 560;
const HEAD_H = 460;

// The seven-stage process line. x/y are positions on STAGE canvas below;
// `emphasis` mirrors the maquette's two enlarged waypoints (03 Prototype,
// 06 Find the CEO) that visually pop above the rest of the signal line.
const STAGE_W = 1672;
// Tall enough to fit the emphasized stages' bigger photo + 4-line caption
// stack without spilling into the closing-statement section below —
// the box's height comes purely from this aspect ratio, so it must already
// account for the tallest content, not just the wave line near the top.
const STAGE_H = 700;
const STAGES: { num: string; title: string; x: number; y: number; note: string[]; emphasis?: boolean; photoW: number }[] = [
  { num: "01", title: "Idea", x: 70, y: 130, note: ["Big questions", "Real opportunities"], photoW: 150 },
  { num: "02", title: "Pitch", x: 320, y: 165, note: ["Sport can do", "more"], photoW: 150 },
  { num: "03", title: "Prototype", x: 590, y: 70, note: ["Learn from", "real use"], emphasis: true, photoW: 230 },
  { num: "04", title: "Prove", x: 870, y: 155, note: ["Real users", "Real data"], photoW: 150 },
  { num: "05", title: "Monetize", x: 1110, y: 130, note: ["Product", "Users", "Revenue", "Impact"], photoW: 170 },
  { num: "06", title: "Find the CEO", x: 1360, y: 70, note: ["Leadership", "Integrity", "Execution", "Shared belief"], emphasis: true, photoW: 230 },
  { num: "07", title: "Grow together", x: 1600, y: 145, note: ["A brighter", "tomorrow"], photoW: 150 },
];
const PHOTO_TOP = 260;

function pct(v: number, total: number) {
  return `${(v / total) * 100}%`;
}

export function HowItWorksView() {
  return (
    <main className="studio-public relative min-h-screen overflow-x-clip">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_20%,rgba(20,120,255,0.14),transparent_55%)]" />

      <PublicNav active="/how-it-works" />

      {/* header: statement + photo collage */}
      <section className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 pt-4 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-8">
        <div className="flex flex-col justify-center">
          <p className="studio-eyebrow fragment mb-3 text-white/60">How it works</p>
          <h1 className="font-studio-display fragment text-5xl leading-[0.92] sm:text-6xl xl:text-7xl" style={{ animationDelay: "80ms" }}>
            From instinct
            <br />
            to company.
          </h1>
          <p className="fragment mt-6 max-w-md text-sm font-semibold uppercase leading-relaxed tracking-wide text-white/80" style={{ animationDelay: "200ms" }}>
            We build the first working version. Independent leaders take it forward.
          </p>
        </div>

        {/* mobile/tablet: the absolute collage below relies on fixed-size
            caption text staying proportionally small against a large box —
            shrunk to phone width the same captions no longer fit the gaps,
            so this becomes a simple photo grid instead. */}
        <div className="grid grid-cols-2 gap-3 lg:hidden">
          <PhotoSlot label="Athlete portrait — process hero" aspect="3 / 4" torn className="col-span-2 w-full" />
          <div>
            <PhotoSlot label="Mountain climb — assist" aspect="4 / 3" torn className="w-full" />
            <p className="studio-eyebrow mt-1 !text-[9px] text-white/45">Why before how</p>
          </div>
          <div>
            <PhotoSlot label="Training session" aspect="4 / 3" torn className="w-full" />
            <p className="studio-eyebrow mt-1 !text-[9px] text-white/45">Build first</p>
          </div>
          <div className="col-span-2">
            <PhotoSlot label="Community moment" aspect="16 / 10" torn className="w-full" />
            <p className="studio-eyebrow mt-1 !text-[9px] text-white/45">Ideas move people</p>
          </div>
        </div>

        <div className="relative mx-auto hidden w-full lg:block" style={{ maxWidth: HEAD_W, aspectRatio: `${HEAD_W} / ${HEAD_H}` }}>
          <div className="fragment absolute right-0 top-0 w-[58%]" style={{ animationDelay: "160ms" }}>
            <PhotoSlot label="Athlete portrait — process hero" aspect="3 / 4" torn className="w-full" />
          </div>
          <div className="fragment absolute right-[2%] top-[-4%] w-[26%]" style={{ animationDelay: "260ms" }}>
            <PhotoSlot label="Mountain climb — assist" aspect="3 / 4" torn className="w-full" />
            <p className="studio-eyebrow mt-1 !text-[9px] text-white/45">Why before how</p>
          </div>
          <div className="fragment absolute bottom-[42%] left-0 w-[32%]" style={{ animationDelay: "340ms" }}>
            <PhotoSlot label="Training session" aspect="16 / 10" torn className="w-full" />
            <p className="studio-eyebrow mt-1 !text-[9px] text-white/45">Build first</p>
          </div>
          <div className="fragment absolute bottom-0 left-[4%] w-[32%]" style={{ animationDelay: "420ms" }}>
            <PhotoSlot label="Community moment" aspect="16 / 10" torn className="w-full" />
            <p className="studio-eyebrow mt-1 !text-[9px] text-white/45">Ideas move people</p>
          </div>
        </div>
      </section>

      {/* mobile/tablet: the wave canvas below needs full width for seven
          waypoints to read; below `lg` it becomes a numbered vertical list
          instead of seven cramped, overlapping labels. */}
      <section className="relative z-10 mx-auto mt-16 max-w-2xl px-6 sm:px-10 lg:hidden">
        <div className="flex flex-col gap-8">
          {STAGES.map((s) => (
            <div key={s.num} className="flex gap-4 border-t border-white/10 pt-8 first:border-t-0 first:pt-0">
              <PhotoSlot label={`${s.title} — imagery`} aspect="3 / 4" torn className="w-24 shrink-0" />
              <div>
                <p className={`font-studio-display leading-none ${s.emphasis ? "text-2xl" : "text-lg text-white/85"}`}>
                  {s.num} {s.title}
                </p>
                <p className="mt-2 text-[11px] font-medium uppercase leading-snug tracking-wide text-white/45">
                  {s.note.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* seven-stage process line — PROCESS ASSEMBLY */}
      <section className="relative z-10 mx-auto mt-16 hidden max-w-[1672px] px-6 sm:px-10 lg:block">
        <div className="relative w-full" style={{ aspectRatio: `${STAGE_W} / ${STAGE_H}` }}>
          <svg viewBox={`0 0 ${STAGE_W} ${STAGE_H}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
            <defs>
              <filter id="stageGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="4" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              pathLength="1"
              d={`M${STAGES.map((s) => `${s.x} ${s.y}`).join(" L ")}`}
              stroke="var(--studio-blue)"
              strokeWidth="2"
              fill="none"
              opacity="0.8"
              filter="url(#stageGlow)"
              className="signal-path"
              style={{ animationDelay: "200ms" }}
            />
            {STAGES.map((s, i) => (
              <circle
                key={s.num}
                cx={s.x}
                cy={s.y}
                r={s.emphasis ? 5 : 3.5}
                fill="var(--studio-blue-soft)"
                filter="url(#stageGlow)"
                className="signal-node"
                style={{ animationDelay: `${400 + i * 90}ms` }}
              />
            ))}
            {/* arrow terminus after stage 07, matching the maquette's closing arrow */}
            <path
              d={`M${STAGES[6]!.x + 14} ${STAGES[6]!.y - 4} l 22 -22 m -20 2 l 20 -2 l 2 20`}
              stroke="var(--studio-blue-soft)"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.85"
            />
          </svg>

          {STAGES.map((s, i) => (
            <div key={s.num}>
              <div
                className="fragment absolute -translate-x-1/2 -translate-y-full text-center"
                style={{ left: pct(s.x, STAGE_W), top: pct(s.y, STAGE_H), animationDelay: `${420 + i * 90}ms` }}
              >
                <p className={`font-studio-display leading-none ${s.emphasis ? "text-3xl sm:text-4xl" : "text-lg sm:text-xl text-white/80"}`}>
                  {s.num}
                </p>
                <p className={`font-studio-display leading-none ${s.emphasis ? "text-3xl sm:text-4xl" : "text-base sm:text-lg text-white/70"}`}>
                  {s.title}
                </p>
              </div>

              <div
                className="fragment absolute -translate-x-1/2"
                style={{ left: pct(s.x, STAGE_W), top: pct(PHOTO_TOP, STAGE_H), width: s.photoW, animationDelay: `${520 + i * 90}ms` }}
              >
                <PhotoSlot label={`${s.title} — imagery`} aspect="3 / 4" torn className="w-full" />
                <p className="mt-2 text-center text-[10px] font-medium uppercase leading-snug tracking-wide text-white/45">
                  {s.note.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* closing statement */}
      <section className="fragment relative z-10 mx-auto mt-16 max-w-4xl px-6 pb-16 text-center sm:px-10" style={{ animationDelay: "1300ms" }}>
        <p className="font-studio-display text-2xl leading-tight sm:text-3xl xl:text-4xl">
          The CEO owns the <span className="text-[var(--studio-blue-soft)]">execution</span>.
          <br />
          The Studio protects the <span className="text-[var(--studio-blue-soft)]">philosophy</span>.
        </p>
      </section>

      {/* marginalia */}
      <p className="fragment absolute bottom-[16%] left-3 hidden text-[11px] font-semibold uppercase leading-snug tracking-wide text-white/30 sm:block" style={{ animationDelay: "1000ms" }}>
        Athletes
        <br />
        Ideas
        <br />
        Products
        <br />
        Stories
        <br />
        People
      </p>
      <p className="fragment absolute bottom-[16%] right-3 hidden rotate-1 text-right text-[11px] font-semibold uppercase leading-snug tracking-wide text-white/30 sm:block" style={{ animationDelay: "1060ms" }}>
        Same human
        <br />
        different angles.
      </p>

      <div className="relative z-10 mt-10">
        <MountainGround position="static" className="h-40 sm:h-56 opacity-90" />
      </div>
    </main>
  );
}
