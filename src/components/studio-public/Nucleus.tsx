/**
 * The Studio nucleus: the gravitational/conceptual source every company
 * radiates from. Built from the approved orbit-system.svg signal asset
 * (studio-kit/signals) plus a solid core disc and label — this is the
 * "SOURCE IGNITION" element referenced by the motion spec.
 */
export function Nucleus({
  size = 180,
  label = "Studio",
  sublabel,
  animate = true,
}: {
  size?: number;
  label?: string;
  sublabel?: string;
  animate?: boolean;
}) {
  return (
    <div
      className={`relative flex shrink-0 items-center justify-center ${animate ? "nucleus" : ""}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 1200 700" className="absolute inset-[-70%] h-[240%] w-[240%] opacity-80" aria-hidden="true">
        <defs>
          <filter id="nucleusGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g stroke="var(--studio-blue)" filter="url(#nucleusGlow)" fill="none">
          <ellipse cx="600" cy="350" rx="500" ry="210" opacity="0.18" />
          <ellipse cx="600" cy="350" rx="390" ry="154" opacity="0.28" transform="rotate(-8 600 350)" />
          <ellipse cx="600" cy="350" rx="275" ry="105" opacity="0.42" transform="rotate(10 600 350)" />
        </g>
      </svg>
      <div
        className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full border border-[var(--studio-blue-soft)]/40 text-center"
        style={{
          background: "radial-gradient(circle at 35% 28%, #1e2a38, #05070a 72%)",
          boxShadow: "0 0 56px 10px rgba(20,120,255,0.4), inset 0 0 34px rgba(140,200,255,0.18)",
        }}
      >
        {/* globe grid — sphere lines reading as a wireframe planet, not a flat disc */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full opacity-45" aria-hidden="true">
          <g stroke="var(--studio-blue-soft)" strokeWidth="0.5" fill="none">
            <ellipse cx="50" cy="50" rx="48" ry="18" />
            <ellipse cx="50" cy="50" rx="48" ry="34" />
            <ellipse cx="50" cy="50" rx="18" ry="48" />
            <ellipse cx="50" cy="50" rx="34" ry="48" />
          </g>
          <circle cx="50" cy="50" r="48.5" stroke="var(--studio-blue)" strokeWidth="1" opacity="0.7" />
        </svg>
        <div className="relative">
          <p className="font-studio-display text-[13px] leading-none sm:text-base">{label}</p>
          {sublabel && <p className="studio-eyebrow mt-1 !text-[7px] text-white/50 sm:!text-[8px]">{sublabel}</p>}
        </div>
      </div>
    </div>
  );
}
