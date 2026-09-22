import Link from "next/link";
import { PublicNav } from "@/components/studio-public/PublicNav";
import { Nucleus } from "@/components/studio-public/Nucleus";
import { MountainGround } from "@/components/studio-public/MountainGround";
import { PhotoSlot } from "@/components/studio-public/PhotoSlot";
import { CORE_COMPANIES, STATUS_LABEL } from "@/data/studio-companies";

// Fixed composition canvas for the orbit of company nodes around the
// nucleus — drawn once so the SVG signal lines and the HTML node cards
// share exact coordinates instead of being eyeballed independently.
const CANVAS_W = 640;
const CANVAS_H = 620;
const NUCLEUS = { x: 430, y: 330 };
const NODE_POS = [
  { x: 150, y: 140 }, // PürInstinct
  { x: 470, y: 90 }, // 5D Athlete
  { x: 580, y: 360 }, // Ballers Only
  { x: 150, y: 440 }, // Instinct Studio
  { x: 420, y: 560 }, // In Five
];

export function PublicLanding() {
  return (
    <main className="studio-public relative min-h-screen overflow-x-clip">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_35%,rgba(20,120,255,0.10),transparent_55%)]" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-[0.12] mix-blend-screen"
        style={{ backgroundImage: "url(/studio-kit/raster/film-fragments-transparent.png)" }}
      />

      {/* scattered editorial marginalia — text only, no raster cropping */}
      <p className="fragment absolute left-3 top-24 hidden -rotate-3 text-[11px] font-semibold uppercase tracking-wide text-white/35 sm:block" style={{ animationDelay: "620ms" }}>
        Same human
        <br />
        different angles.
      </p>
      <p className="fragment absolute right-4 top-40 hidden rotate-2 text-[11px] font-semibold uppercase tracking-wide text-white/35 xl:block" style={{ animationDelay: "680ms" }}>
        Find the
        <br />
        right CEO.
      </p>
      <p className="fragment absolute bottom-28 right-6 hidden -rotate-1 text-[11px] font-semibold uppercase tracking-wide text-white/30 sm:block" style={{ animationDelay: "740ms" }}>
        A brighter tomorrow.
      </p>

      <PublicNav active="/" />

      <section className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-14 px-6 pb-24 pt-4 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-8">
        {/* left column — statement */}
        <div className="flex flex-col justify-center">
          <p className="studio-eyebrow mb-3 flex items-center gap-2 text-white/60">Sport is art.</p>
          <h1 className="font-studio-display fragment text-5xl sm:text-6xl xl:text-7xl">
            Studio by
            <br />
            <span className="bg-gradient-to-r from-white to-[var(--studio-blue-soft)] bg-clip-text text-transparent">
              Dominique Soucy
            </span>
          </h1>

          <p
            className="fragment mt-6 max-w-md text-base font-semibold uppercase tracking-wide text-white/85 sm:text-lg"
            style={{ animationDelay: "120ms" }}
          >
            We build sports, stories and companies from raw instinct.
          </p>
          <p className="fragment mt-4 max-w-md text-sm leading-relaxed text-white/55" style={{ animationDelay: "200ms" }}>
            A creative venture studio for original sports, products, stories and experiences.
          </p>

          <div className="fragment mt-8 flex flex-wrap items-center gap-4" style={{ animationDelay: "280ms" }}>
            <Link
              href="/ecosystem"
              className="rounded-sm bg-[var(--studio-blue)] px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:brightness-110"
            >
              Enter the Studio →
            </Link>
            <Link
              href="/ecosystem"
              className="rounded-sm border border-white/25 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white/85 transition hover:border-white/60"
            >
              View the Ecosystem
            </Link>
          </div>

          <div
            className="fragment mt-12 max-w-[220px] border border-white/15 bg-white/[0.03] p-4 text-xs uppercase tracking-wide text-white/50"
            style={{ animationDelay: "360ms" }}
          >
            Athletes
            <br />
            Ideas
            <br />
            Products
            <br />
            Stories
            <br />
            People
          </div>
        </div>

        {/* mobile/tablet: below `lg` the fixed 640×620 orbit canvas shrinks
            too far for five 150px-wide company cards to avoid overlapping —
            it becomes a hero image + plain company list instead. */}
        <div className="flex flex-col gap-6 lg:hidden">
          <PhotoSlot label="Athlete portrait — primary hero image" aspect="3 / 4" torn className="w-full max-w-xs" />
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {CORE_COMPANIES.map((company) => (
              <div key={company.slug} className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--studio-blue)]" />
                <p className="font-studio-display text-sm leading-tight">{company.name}</p>
                <span className="studio-eyebrow !text-[8px] text-white/50">{STATUS_LABEL[company.status]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* right column — nucleus + company orbit */}
        <div className="relative mx-auto hidden w-full lg:block" style={{ maxWidth: CANVAS_W, aspectRatio: `${CANVAS_W} / ${CANVAS_H}` }}>
          <PhotoSlot
            label="Athlete portrait — primary hero image"
            aspect="3 / 4"
            torn
            className="fragment absolute right-0 top-0 w-[46%] opacity-90"
          />

          <svg viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
            <defs>
              <filter id="homeGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {NODE_POS.map((p, i) => (
              <path
                key={i}
                pathLength="1"
                d={`M${NUCLEUS.x} ${NUCLEUS.y} Q ${(NUCLEUS.x + p.x) / 2} ${(NUCLEUS.y + p.y) / 2 - 20} ${p.x} ${p.y}`}
                stroke="var(--studio-blue)"
                strokeWidth="2"
                fill="none"
                opacity="0.75"
                filter="url(#homeGlow)"
                className="signal-path"
                style={{ animationDelay: `${420 + i * 90}ms` }}
              />
            ))}
          </svg>

          <div
            className="absolute"
            style={{ left: `${(NUCLEUS.x / CANVAS_W) * 100}%`, top: `${(NUCLEUS.y / CANVAS_H) * 100}%`, transform: "translate(-50%,-50%)" }}
          >
            <Nucleus size={110} label="Studio" />
          </div>

          {CORE_COMPANIES.map((company, i) => {
            const p = NODE_POS[i]!;
            return (
              <div
                key={company.slug}
                className="fragment absolute w-[150px] -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${(p.x / CANVAS_W) * 100}%`, top: `${(p.y / CANVAS_H) * 100}%`, animationDelay: `${500 + i * 90}ms` }}
              >
                <div className="signal-node mb-1.5 h-1.5 w-1.5 rounded-full bg-[var(--studio-blue)]" />
                <p className="font-studio-display text-sm leading-tight">{company.name}</p>
                <p className="studio-eyebrow mt-0.5 flex items-center gap-1 !text-[8px]">
                  <span className="h-1 w-1 rounded-full bg-[var(--studio-blue)]" />
                  {STATUS_LABEL[company.status]}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* bottom ecosystem strip */}
      <section className="relative z-10 border-t border-white/10 pb-10 pt-6">
        <MountainGround />
        <svg
          aria-hidden="true"
          viewBox="0 0 1600 60"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-x-6 top-14 h-8 opacity-40 sm:inset-x-10"
        >
          <ellipse cx="800" cy="30" rx="760" ry="16" fill="none" stroke="var(--studio-blue)" strokeWidth="1" />
        </svg>
        <div className="relative z-10 mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 sm:px-10">
          <p className="studio-eyebrow flex items-center gap-1 text-white/50">The Ecosystem ↓</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {CORE_COMPANIES.map((company, i) => (
              <span key={company.slug} className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-white/70">
                {i > 0 && <span aria-hidden="true" className="h-px w-6 bg-white/20" />}
                <span className="signal-node h-1.5 w-1.5 rounded-full bg-[var(--studio-blue)]" />
                {company.name}
              </span>
            ))}
          </div>
          <p className="studio-eyebrow text-white/40">One bigger game.</p>
        </div>
      </section>

      <div id="contact" className="sr-only" aria-hidden="true" />
    </main>
  );
}
