"use client";

// A foundational ground/mountain silhouette anchoring the bottom of the
// Source composition. No photographic mountain asset was supplied in the
// animation kit (only abstract film/editorial/signal sprite sheets) — a
// real photo would mean sourcing unapproved stock imagery, which the
// brief explicitly forbids. This is a CSS/SVG silhouette instead,
// documented as a necessary substitution in VISUAL_FIDELITY_REPORT.md.
export function GroundTexture({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1600 220"
      preserveAspectRatio="none"
      className={className}
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <defs>
        <linearGradient id="ground-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--studio-black)" stopOpacity="0" />
          <stop offset="1" stopColor="var(--studio-black)" stopOpacity="1" />
        </linearGradient>
      </defs>
      <path
        d="M0,220 L0,140 L120,90 L260,150 L400,60 L520,130 L640,40 L780,120 L900,70 L1040,140 L1180,50 L1320,110 L1460,30 L1600,100 L1600,220 Z"
        fill="var(--studio-black-soft)"
      />
      <path
        d="M0,220 L0,180 L180,130 L340,190 L520,110 L680,170 L860,100 L1040,175 L1220,120 L1400,185 L1600,150 L1600,220 Z"
        fill="var(--studio-black)"
      />
      <rect x="0" y="0" width="1600" height="220" fill="url(#ground-fade)" opacity="0.4" />
    </svg>
  );
}
