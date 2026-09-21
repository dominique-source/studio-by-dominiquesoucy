"use client";

import { useInView } from "@/lib/motion/useInView";
import { usePrefersReducedMotion } from "@/lib/motion/usePrefersReducedMotion";

// A single electric-blue signal path that draws itself once, the moment it
// enters the viewport. Uses the pathLength=1 normalization trick so any
// path length draws correctly with a plain stroke-dasharray of 1.
export function SignalLine({
  d,
  viewBox,
  className,
  opacity = 0.85,
  strokeWidth = 3,
}: {
  d: string;
  viewBox: string;
  className?: string;
  opacity?: number;
  strokeWidth?: number;
}) {
  const { ref, inView } = useInView<SVGSVGElement>(0.2);
  const reduced = usePrefersReducedMotion();
  const drawn = inView || reduced;

  return (
    <svg
      ref={ref}
      viewBox={viewBox}
      className={className}
      aria-hidden="true"
      focusable="false"
      style={{ overflow: "visible" }}
    >
      <path
        d={d}
        pathLength={1}
        fill="none"
        stroke="var(--studio-blue)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity={opacity}
        className={drawn ? "signal-path" : undefined}
        style={!drawn ? { strokeDasharray: 1, strokeDashoffset: 1 } : undefined}
      />
    </svg>
  );
}
