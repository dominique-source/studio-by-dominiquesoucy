"use client";

// A single connecting line between two authored thoughts, drawn inside a
// full-bleed absolute SVG whose viewBox is percentage-based (0 0 100 100)
// so callers can pass plain percentage coordinates without measuring
// pixels themselves.
export function ThoughtConnection({
  from,
  to,
  active,
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
  active: boolean;
}) {
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2 - 6;
  const d = `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`;

  return (
    <path
      d={d}
      pathLength={1}
      fill="none"
      stroke="var(--studio-blue)"
      strokeWidth={0.25}
      vectorEffect="non-scaling-stroke"
      opacity={active ? 0.75 : 0}
      className={active ? "signal-path" : undefined}
      style={{
        transition: "opacity 600ms var(--ease-cinematic)",
        ...(active ? {} : { strokeDasharray: 1, strokeDashoffset: 1 }),
      }}
    />
  );
}
