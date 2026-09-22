import { PublicNav } from "@/components/studio-public/PublicNav";
import { HandUnderline } from "@/components/studio-public/HandUnderline";
import { PhotoSlot } from "@/components/studio-public/PhotoSlot";
import { MountainGround } from "@/components/studio-public/MountainGround";

// Shared-coordinate canvas for the philosophy field — same technique as the
// ecosystem/homepage nucleus orbit, sized to the approved maquette's own
// composition (1672-wide reference).
const CANVAS_W = 1672;
const CANVAS_H = 860;
const CENTER = { x: 840, y: 460 };

const PRINCIPLES: { title: string; note: string[]; x: number; y: number }[] = [
  { title: "No more spectators.", note: ["Participation creates", "a brighter tomorrow."], x: 560, y: 220 },
  { title: "Play before structure.", note: ["Curiosity", "Movement", "Belonging for life."], x: 1190, y: 230 },
  { title: "Sport should bring people together.", note: ["Different backgrounds", "Shared emotions", "Real connections."], x: 590, y: 610 },
  { title: "Build first. Learn from real use.", note: ["Ideas in motion", "Real feedback", "Stronger solutions."], x: 1220, y: 500 },
  { title: "Independent leaders. Shared growth.", note: ["Empower people", "Expand opportunity", "A brighter tomorrow."], x: 990, y: 720 },
];

const COLLAGE: { label: string; aspect: string; x: number; y: number; w: number }[] = [
  { label: "Athlete portrait", aspect: "3 / 4", x: 380, y: 40, w: 220 },
  { label: "Basketball court action", aspect: "3 / 4", x: 940, y: 20, w: 240 },
  { label: "Team huddle — Better together", aspect: "4 / 3", x: 340, y: 420, w: 260 },
  { label: "Crowd — game day", aspect: "4 / 3", x: 300, y: 660, w: 220 },
  { label: "Coach and athlete", aspect: "3 / 4", x: 1320, y: 610, w: 210 },
];

// `side: "r"` marks are anchored from the canvas's right edge (x = distance
// from that edge) and right-aligned, so their text grows inward instead of
// running off the viewport the way left-anchored positioning would.
const MARKS: { text: string; x: number; y: number; rotate: number; side?: "l" | "r" }[] = [
  { text: "Human movement\na brighter tomorrow.", x: 20, y: 0, rotate: -2 },
  { text: "Discipline\nCreativity\nCommunity\nFreedom.", x: 710, y: 40, rotate: 2 },
  { text: "Ideas\nPeople\nPlaces\nPossibilities.", x: 40, y: 60, rotate: -2, side: "r" },
  { text: "Kids\nAdults together.\nStronger.", x: 20, y: 260, rotate: 2, side: "r" },
  { text: "Process\nPeople\nProgress\nPossibilities.", x: 20, y: 460, rotate: -2, side: "r" },
  { text: "Lead\nListen\nLearn\nGrow together.", x: 20, y: 630, rotate: 2, side: "r" },
  { text: "Same\nHuman\nDifferent angles.", x: 20, y: 770, rotate: -2, side: "r" },
  { text: "More than\na game.", x: 20, y: 620, rotate: -2 },
  { text: "Ideas\nin motion.", x: 20, y: 800, rotate: 2 },
];

function pct(v: number, total: number) {
  return `${(v / total) * 100}%`;
}

export function PhilosophyView() {
  return (
    <main className="studio-public relative min-h-screen overflow-x-clip">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_60%_35%,rgba(20,120,255,0.14),transparent_60%)]" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-[0.16] mix-blend-screen"
        style={{ backgroundImage: "url(/studio-kit/raster/film-fragments-transparent.png)" }}
      />

      <PublicNav active="/philosophy" />

      {/* mobile/tablet: vertical stack instead of the fixed philosophy-field
          canvas, which only reads correctly with room for five scattered
          principles + collage photos. */}
      <div className="relative z-10 px-6 pb-10 sm:px-10 lg:hidden">
        <h1 className="font-studio-display fragment text-5xl leading-[0.88] sm:text-6xl">
          Sport is
          <br />
          <span className="text-[var(--studio-blue)]">Art.</span>
        </h1>
        <p className="fragment mt-6 text-sm font-semibold uppercase leading-snug tracking-wide text-white/80">
          A more human way for a brighter tomorrow.
        </p>
        <p className="fragment mt-4 max-w-[38ch] text-sm leading-relaxed text-white/55">
          Sport is a universal language. A canvas for people, ideas and possibilities. Different backgrounds. Same human potential.
        </p>

        <div className="mt-10 flex flex-col gap-6">
          {PRINCIPLES.map((p) => (
            <div key={p.title} className="flex gap-4 border-t border-white/10 pt-6">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--studio-blue)]" />
              <div>
                <p className="font-studio-display text-lg leading-tight sm:text-xl">{p.title}</p>
                <p className="mt-1.5 text-[11px] font-medium uppercase leading-snug tracking-wide text-white/45">
                  {p.note.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3">
          {COLLAGE.map((c) => (
            <PhotoSlot key={c.label} label={c.label} aspect={c.aspect} torn className="w-full" />
          ))}
        </div>
      </div>

      <div className="relative z-10 mx-auto hidden max-w-[1672px] px-6 sm:px-10 lg:block" style={{ aspectRatio: `${CANVAS_W} / ${CANVAS_H}` }}>
        {/* statement block */}
        <div className="absolute left-0 top-[13%] max-w-[24%] min-w-[240px]">
          <h1 className="font-studio-display fragment text-5xl leading-[0.88] sm:text-6xl xl:text-7xl" style={{ animationDelay: "80ms" }}>
            Sport is
            <br />
            <span className="text-[var(--studio-blue)]">Art.</span>
          </h1>
          <p className="fragment mt-6 text-sm font-semibold uppercase leading-snug tracking-wide text-white/80" style={{ animationDelay: "200ms" }}>
            A more human way for a brighter tomorrow.
          </p>
          <p className="fragment mt-4 max-w-[32ch] text-sm leading-relaxed text-white/55" style={{ animationDelay: "280ms" }}>
            Sport is a universal language. A canvas for people, ideas and possibilities. Different backgrounds. Same human potential.
          </p>
        </div>

        {/* editorial marginalia */}
        {MARKS.map((m, i) => (
          <div
            key={m.text}
            className={`fragment absolute hidden lg:block ${m.side === "r" ? "text-right" : ""}`}
            style={{
              ...(m.side === "r" ? { right: pct(m.x, CANVAS_W) } : { left: pct(m.x, CANVAS_W) }),
              top: pct(m.y, CANVAS_H),
              transform: `rotate(${m.rotate}deg)`,
              animationDelay: `${500 + i * 60}ms`,
            }}
          >
            <p className="whitespace-pre text-[11px] font-semibold uppercase tracking-wide text-white/35">{m.text}</p>
            <HandUnderline width={56} className={m.side === "r" ? "ml-auto mt-0.5" : "mt-0.5"} />
          </div>
        ))}

        {/* collage backdrop */}
        {COLLAGE.map((c, i) => (
          <div
            key={c.label}
            className="fragment absolute opacity-70"
            style={{ left: pct(c.x, CANVAS_W), top: pct(c.y, CANVAS_H), width: c.w, animationDelay: `${300 + i * 90}ms` }}
          >
            <PhotoSlot label={c.label} aspect={c.aspect} torn className="w-full" />
          </div>
        ))}

        {/* signal lines converging on the field center */}
        <svg viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
          <defs>
            <filter id="philGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {PRINCIPLES.map((p, i) => (
            <path
              key={p.title}
              pathLength="1"
              d={`M${CENTER.x} ${CENTER.y} Q ${(CENTER.x + p.x) / 2} ${(CENTER.y + p.y) / 2 - 30} ${p.x} ${p.y}`}
              stroke="var(--studio-blue)"
              strokeWidth="1.8"
              fill="none"
              opacity="0.55"
              filter="url(#philGlow)"
              className="signal-path"
              style={{ animationDelay: `${380 + i * 100}ms` }}
            />
          ))}
          <circle cx={CENTER.x} cy={CENTER.y} r="7" fill="var(--studio-blue-soft)" filter="url(#philGlow)" className="nucleus" />
        </svg>

        {/* principles */}
        {PRINCIPLES.map((p, i) => (
          <div
            key={p.title}
            className="fragment absolute max-w-[280px]"
            style={{ left: pct(p.x, CANVAS_W), top: pct(p.y, CANVAS_H), animationDelay: `${480 + i * 100}ms` }}
          >
            <div className="flex items-start gap-2">
              <span className="signal-node mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--studio-blue)]" />
              <p className="font-studio-display text-lg leading-tight sm:text-xl">{p.title}</p>
            </div>
            <p className="mt-1.5 pl-4 text-[11px] font-medium uppercase leading-snug tracking-wide text-white/45">
              {p.note.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
          </div>
        ))}
      </div>

      {/* manifesto CTAs — no manifesto document exists yet, so these render as
          honest disabled placeholders rather than linking anywhere invented. */}
      <div className="fragment relative z-10 mx-auto mt-10 flex max-w-4xl flex-wrap items-center justify-center gap-6 px-6 pb-10 text-center sm:px-10" style={{ animationDelay: "1200ms" }}>
        <button type="button" disabled className="studio-eyebrow flex cursor-not-allowed items-center gap-2 text-white/40">
          Read the Sports Art manifesto <span aria-hidden="true">→</span>
        </button>
        <span aria-hidden="true" className="hidden h-4 w-px bg-white/20 sm:block" />
        <button type="button" disabled className="studio-eyebrow flex cursor-not-allowed items-center gap-2 text-white/40">
          Read the Instinct manifesto <span aria-hidden="true">→</span>
        </button>
      </div>

      <div className="relative z-10">
        <MountainGround position="static" className="h-40 sm:h-56 opacity-90" />
      </div>
    </main>
  );
}
