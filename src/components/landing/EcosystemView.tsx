import Link from "next/link";
import { PublicNav } from "@/components/studio-public/PublicNav";
import { HandUnderline } from "@/components/studio-public/HandUnderline";
import { Nucleus } from "@/components/studio-public/Nucleus";
import { MountainGround } from "@/components/studio-public/MountainGround";
import { PhotoSlot } from "@/components/studio-public/PhotoSlot";
import { CORE_COMPANIES, STATUS_LABEL, type StudioCompany } from "@/data/studio-companies";

// Same technique as the homepage: one shared coordinate system for the SVG
// signal lines and the HTML node cards, at the reference maquette's own
// proportions (1672×941), so both scale together and never drift apart.
const CANVAS_W = 1672;
const CANVAS_H = 900;
const NUCLEUS = { x: 845, y: 430 };

const THE_LAB: StudioCompany = {
  slug: "the-lab",
  name: "The Lab",
  status: "development",
  tagline: ["Future IP", "Independent"],
  href: null,
  weight: 3,
};

const NODES: { company: StudioCompany; x: number; y: number; photo: "portrait" | "landscape" }[] = [
  { company: CORE_COMPANIES[0]!, x: 560, y: 220, photo: "portrait" }, // PürInstinct
  { company: CORE_COMPANIES[1]!, x: 1150, y: 210, photo: "portrait" }, // 5D Athlete
  { company: CORE_COMPANIES[2]!, x: 1345, y: 480, photo: "landscape" }, // Ballers Only
  { company: CORE_COMPANIES[4]!, x: 1055, y: 640, photo: "landscape" }, // In Five
  { company: CORE_COMPANIES[3]!, x: 590, y: 660, photo: "landscape" }, // Instinct Studio
  { company: THE_LAB, x: 1560, y: 690, photo: "portrait" },
];

const MARKS: { text: string; x: number; y: number; rotate: number }[] = [
  { text: "Same human\ndifferent angles.", x: 30, y: 90, rotate: -3 },
  { text: "Discipline\ncreates freedom.", x: 1470, y: 100, rotate: 2 },
  { text: "Stories\nmove people.", x: 40, y: 540, rotate: -2 },
  { text: "Ideas\nin motion.", x: 1220, y: 590, rotate: 2 },
  { text: "More than\na game.", x: 1590, y: 330, rotate: -2 },
  { text: "What's\nnext?", x: 1590, y: 470, rotate: 2 },
];

function pct(v: number, total: number) {
  return `${(v / total) * 100}%`;
}

export function EcosystemView() {
  return (
    <main className="studio-public relative min-h-screen overflow-x-clip">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_55%_45%,rgba(20,120,255,0.14),transparent_60%)]" />

      <PublicNav active="/ecosystem" />

      {/* mobile/tablet: the desktop version below relies on a fixed-canvas
          absolute layout that only reads correctly once there's enough
          width for six scattered orbit cards — below `lg` it collapses into
          a vertical stack of the same content instead of shrinking in place. */}
      <div className="relative z-10 px-6 pb-16 sm:px-10 lg:hidden">
        <h1 className="font-studio-display fragment text-4xl leading-[0.9] sm:text-5xl">
          One studio.
          <br />
          Multiple
          <br />
          companies.
        </h1>
        <p className="fragment mt-6 text-sm font-semibold uppercase leading-snug tracking-wide text-white/80">
          Independent brands connected by one creative philosophy.
        </p>
        <p className="fragment mt-4 max-w-[36ch] text-sm leading-relaxed text-white/50">
          Different playgrounds. A shared instinct to build a brighter tomorrow through sport.
        </p>

        <div className="mt-10 flex items-center gap-3">
          <Nucleus size={90} label="Studio" animate={false} />
          <p className="studio-eyebrow text-white/50">The Studio, at the center of every brand below</p>
        </div>

        <div className="mt-8 flex flex-col gap-6">
          {NODES.map((n) => {
            const isPortal = n.company.slug === "purinstinct";
            const card = (
              <div className="flex gap-4 border-t border-white/10 pt-6">
                <PhotoSlot
                  label={`${n.company.name} — imagery`}
                  aspect={n.photo === "portrait" ? "3 / 4" : "16 / 10"}
                  torn
                  className="w-28 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--studio-blue)]" />
                    <p className="font-studio-display text-lg leading-tight">{n.company.name}</p>
                  </div>
                  <p className="studio-eyebrow mt-0.5 !text-[9px] text-white/50">{STATUS_LABEL[n.company.status]}</p>
                  <p className="mt-1 text-xs leading-snug text-white/45">
                    {n.company.tagline.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            );
            return isPortal ? (
              <Link key={n.company.slug} href="/purinstinct">
                {card}
              </Link>
            ) : (
              <div key={n.company.slug}>{card}</div>
            );
          })}
        </div>

        <p className="mt-10 text-[10px] uppercase leading-relaxed tracking-wide text-white/40">
          Size = priority · Distance = maturity · Opacity = activity
        </p>
      </div>

      <div className="relative z-10 mx-auto hidden max-w-[1672px] lg:block" style={{ aspectRatio: `${CANVAS_W} / ${CANVAS_H}` }}>
        {/* statement block */}
        <div className="absolute left-[2%] top-[13%] max-w-[26%] min-w-[260px]">
          <h1 className="font-studio-display fragment text-4xl leading-[0.9] sm:text-5xl xl:text-6xl" style={{ animationDelay: "80ms" }}>
            One studio.
            <br />
            Multiple
            <br />
            companies.
          </h1>
          <p className="fragment mt-6 text-sm font-semibold uppercase leading-snug tracking-wide text-white/80" style={{ animationDelay: "220ms" }}>
            Independent brands connected by one creative philosophy.
          </p>
          <p className="fragment mt-4 max-w-[30ch] text-sm leading-relaxed text-white/50" style={{ animationDelay: "300ms" }}>
            Different playgrounds. A shared instinct to build a brighter tomorrow through sport.
          </p>
        </div>

        {/* editorial marginalia */}
        {MARKS.map((m, i) => (
          <div
            key={m.text}
            className="fragment absolute hidden lg:block"
            style={{
              left: pct(m.x, CANVAS_W),
              top: pct(m.y, CANVAS_H),
              transform: `rotate(${m.rotate}deg)`,
              animationDelay: `${600 + i * 60}ms`,
            }}
          >
            <p className="whitespace-pre text-[11px] font-semibold uppercase tracking-wide text-white/35">{m.text}</p>
            <HandUnderline width={56} className="mt-0.5" />
          </div>
        ))}

        {/* signal lines */}
        <svg viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
          <defs>
            <filter id="ecoGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {NODES.map((n, i) => {
            const midX = (NUCLEUS.x + n.x) / 2;
            const midY = (NUCLEUS.y + n.y) / 2 - 30;
            // point at t=0.5 on the quadratic bezier — a waypoint pulse riding the line,
            // echoing the satellite-node markers on the approved ecosystem maquette.
            const wx = 0.25 * NUCLEUS.x + 0.5 * midX + 0.25 * n.x;
            const wy = 0.25 * NUCLEUS.y + 0.5 * midY + 0.25 * n.y;
            return (
              <g key={n.company.slug}>
                <path
                  pathLength="1"
                  d={`M${NUCLEUS.x} ${NUCLEUS.y} Q ${midX} ${midY} ${n.x} ${n.y}`}
                  stroke="var(--studio-blue)"
                  strokeWidth={n.company.weight === 1 ? 2.4 : 1.6}
                  fill="none"
                  opacity={n.company.weight === 1 ? 0.85 : 0.5}
                  filter="url(#ecoGlow)"
                  className="signal-path"
                  style={{ animationDelay: `${380 + i * 100}ms` }}
                />
                <circle
                  cx={wx}
                  cy={wy}
                  r={3}
                  fill="var(--studio-blue-soft)"
                  filter="url(#ecoGlow)"
                  className="signal-node"
                  style={{ animationDelay: `${900 + i * 120}ms` }}
                />
              </g>
            );
          })}
        </svg>

        {/* nucleus */}
        <div
          className="absolute"
          style={{ left: pct(NUCLEUS.x, CANVAS_W), top: pct(NUCLEUS.y, CANVAS_H), transform: "translate(-50%,-50%)" }}
        >
          <Nucleus size={150} label="Studio" sublabel="By Dominique Soucy" />
        </div>

        {/* company nodes */}
        {NODES.map((n, i) => {
          const dimmed = n.company.weight > 1;
          // Only PürInstinct has a built portal page so far (page4.png) —
          // the rest stay static cards rather than link to a URL that
          // doesn't exist yet.
          const isPortal = n.company.slug === "purinstinct";
          const cardClassName = `fragment absolute w-[190px] -translate-x-1/2 -translate-y-1/2 ${isPortal ? "cursor-pointer transition hover:opacity-100" : ""}`;
          const cardStyle = {
            left: pct(n.x, CANVAS_W),
            top: pct(n.y, CANVAS_H),
            animationDelay: `${480 + i * 100}ms`,
            opacity: dimmed ? 0.85 : 1,
          };
          const cardContent = (
            <>
              <PhotoSlot
                label={`${n.company.name} — imagery`}
                aspect={n.photo === "portrait" ? "3 / 4" : "16 / 10"}
                torn
                className="mb-2 w-full"
              />
              <div className="flex items-center gap-1.5">
                <span className="signal-node h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--studio-blue)]" />
                <p className="font-studio-display text-base leading-tight">{n.company.name}</p>
              </div>
              <p className="studio-eyebrow mt-0.5 !text-[9px] text-white/50">{STATUS_LABEL[n.company.status]}</p>
              <p className="mt-1 text-[11px] leading-snug text-white/45">
                {n.company.tagline.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
            </>
          );
          return isPortal ? (
            <Link key={n.company.slug} href="/purinstinct" className={cardClassName} style={cardStyle}>
              {cardContent}
            </Link>
          ) : (
            <div key={n.company.slug} className={cardClassName} style={cardStyle}>
              {cardContent}
            </div>
          );
        })}

        {/* legend */}
        <div className="fragment absolute bottom-[6%] left-[2%] flex items-center gap-3 text-[10px] uppercase tracking-wide text-white/40" style={{ animationDelay: "1000ms" }}>
          <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
            <circle cx="17" cy="17" r="15" stroke="var(--studio-blue)" strokeWidth="1" fill="none" opacity="0.6" />
            <circle cx="17" cy="6" r="3" fill="var(--studio-blue)" />
          </svg>
          <div className="leading-relaxed">
            <p>Size = priority</p>
            <p>Distance = maturity</p>
            <p>Opacity = activity</p>
          </div>
        </div>

        {/* select a company prompt */}
        <div className="fragment absolute bottom-[3%] left-1/2 -translate-x-1/2 text-center" style={{ animationDelay: "1100ms" }}>
          <p className="studio-eyebrow text-white/50">Select a company</p>
          <p className="mt-1 animate-bounce text-white/30">↓</p>
        </div>
      </div>

      <div className="relative z-10 mt-6">
        <MountainGround position="static" className="h-40 sm:h-56 opacity-90" />
      </div>
    </main>
  );
}
