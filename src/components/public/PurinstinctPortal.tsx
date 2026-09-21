"use client";

import { MagneticCTA } from "@/components/motion/MagneticCTA";
import { FilmFragment } from "@/components/motion/FilmFragment";
import { SignalPulse } from "@/components/motion/SignalPulse";
import { DisplayText } from "@/components/motion/DisplayText";

// Page 4 — the PürInstinct project portal, reproducing
// "05-purinstinct-portal-maquette.png". This is a deliberate, bespoke
// exception to the generic LayeredArtwork template: the brief calls this
// page the demonstration of how a company receives its own identity
// while remaining connected to the Studio. Rust/orange is PürInstinct's
// own accent (matching the private tool's existing domain color) — not
// the Studio's gold, not Instinct Studio's blue.
const ACCENT = "var(--studio-accent-purinstinct)";

const SKILLS = [
  { label: "Speed", x: 18, y: 18 },
  { label: "Hand Skills", x: 82, y: 20 },
  { label: "Foot Skills", x: 12, y: 62 },
  { label: "Evasion", x: 84, y: 66 },
  { label: "IQ", x: 50, y: 84 },
];

const STATS = [
  { value: "10,000+", label: "Participants" },
  { value: "150+", label: "Schools" },
  { value: "One", label: "Original Sport Property" },
];

export function PurinstinctPortal() {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-30">
        <FilmFragment variant="track" displayWidth={900} />
      </div>

      <p className="font-mono text-xs uppercase tracking-[0.24em]" style={{ color: ACCENT }}>
        Original Sport Property
      </p>
      <h1
        className="mt-6 font-display leading-[0.82] sm:mt-8"
        style={{
          color: "var(--studio-white)",
          textShadow: `0 0 60px ${ACCENT}55`,
          fontSize: "clamp(3rem, 11vw, 9rem)",
        }}
      >
        <DisplayText>PÜRINSTINCT</DisplayText>
        <span className="align-top text-[0.3em]">™</span>
      </h1>
      <p className="mt-4 max-w-lg text-base sm:text-lg" style={{ color: "var(--studio-silver)" }}>
        A new sport built to reveal the complete athlete.
      </p>

      {/* Skill constellation — the athletic dimensions PürInstinct measures. */}
      <div className="relative mt-10 hidden aspect-[16/7] w-full md:block">
        <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {SKILLS.map((s) => (
            <path
              key={s.label}
              d={`M 50 50 L ${s.x} ${s.y}`}
              pathLength={1}
              fill="none"
              stroke={ACCENT}
              strokeWidth={0.3}
              opacity={0.5}
              className="signal-path"
            />
          ))}
        </svg>
        {SKILLS.map((s) => (
          <div
            key={s.label}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 px-4 py-3"
            style={{ left: `${s.x}%`, top: `${s.y}%`, borderColor: ACCENT, background: "rgba(3,5,7,0.7)" }}
          >
            <span className="font-display text-sm uppercase" style={{ color: "var(--studio-white)" }}>
              {s.label}
            </span>
          </div>
        ))}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <SignalPulse size={14} color={ACCENT} colorSoft={ACCENT} />
        </div>
      </div>

      {/* Mobile: skills as a simple row of badges. */}
      <div className="mt-8 flex flex-wrap gap-2 md:hidden">
        {SKILLS.map((s) => (
          <span key={s.label} className="rounded-full border-2 px-3 py-1.5 font-display text-xs uppercase" style={{ borderColor: ACCENT, color: "var(--studio-white)" }}>
            {s.label}
          </span>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap items-center gap-6 border-t pt-8 sm:gap-10" style={{ borderColor: "var(--studio-line)" }}>
        {STATS.map((s) => (
          <div key={s.label}>
            <p className="font-display text-3xl sm:text-4xl" style={{ color: "var(--studio-white)" }}>
              {s.value}
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: "var(--studio-silver-dim)" }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-4">
        <MagneticCTA href="https://purinstinct.com">Enter PürInstinct →</MagneticCTA>
        <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em]" style={{ color: "var(--studio-silver)" }}>
          <SignalPulse size={7} color={ACCENT} colorSoft={ACCENT} />
          Live · purinstinct.com
        </span>
      </div>
    </div>
  );
}
