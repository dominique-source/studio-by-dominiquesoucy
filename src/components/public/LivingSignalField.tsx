"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/motion/usePrefersReducedMotion";
import { FilmFragment } from "@/components/motion/FilmFragment";
import { EditorialMark } from "@/components/motion/EditorialMark";
import { SignalPulse } from "@/components/motion/SignalPulse";

const SLOW_THRESHOLD_PX_PER_MS = 0.35;
const SLOW_HOLD_MS = 220;

// The homepage's signature interaction: pointer movement reveals cinematic
// fragments hidden under the black surface through a soft radial mask that
// follows the cursor, and when the pointer slows down, a signal line
// connects the nucleus to wherever the visitor is looking. On touch, the
// same reveal follows drag position (Pointer Events cover touch natively —
// no device-orientation permission dance is requested, keeping this
// interaction fast and permission-prompt-free). Under reduced motion, the
// mask is removed entirely and every fragment is shown at rest — a
// deliberate static composition, not a broken animation.
export function LivingSignalField({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const lineElRef = useRef<SVGLineElement>(null);
  const reduced = usePrefersReducedMotion();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const container = containerRef.current;
    const reveal = revealRef.current;
    if (!container || !reveal) return;

    let last = { x: 0, y: 0, t: 0 };
    let slowSince: number | null = null;
    let raf = 0;
    let pendingEvent: PointerEvent | null = null;

    function apply() {
      raf = 0;
      const event = pendingEvent;
      if (!event || !container || !reveal) return;
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const now = performance.now();

      reveal.style.setProperty("--px", `${x}px`);
      reveal.style.setProperty("--py", `${y}px`);
      if (lineElRef.current) {
        lineElRef.current.setAttribute("x2", String(x));
        lineElRef.current.setAttribute("y2", String(y));
      }

      const dt = now - last.t;
      if (dt > 0) {
        const dist = Math.hypot(x - last.x, y - last.y);
        const speed = dist / dt;
        if (speed < SLOW_THRESHOLD_PX_PER_MS) {
          if (slowSince === null) slowSince = now;
          if (now - slowSince > SLOW_HOLD_MS) setConnected(true);
        } else {
          slowSince = null;
          setConnected(false);
        }
      }
      last = { x, y, t: now };
    }

    function onMove(event: PointerEvent) {
      pendingEvent = event;
      if (!raf) raf = requestAnimationFrame(apply);
    }

    function onLeave() {
      setConnected(false);
    }

    container.addEventListener("pointermove", onMove, { passive: true });
    container.addEventListener("pointerleave", onLeave);
    return () => {
      container.removeEventListener("pointermove", onMove);
      container.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <div ref={containerRef} className="relative isolate overflow-hidden">
      {/* Always-visible content: title, statement, CTAs — legible immediately. */}
      {children}

      {/* Reveal layer: fragments hidden under the surface, uncovered by a
          soft light that follows the pointer. Static (no mask) under
          reduced motion, so the composition is simply visible at rest. */}
      <div
        ref={revealRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-700"
        style={
          reduced
            ? { opacity: 0.5 }
            : ({
                WebkitMaskImage: "radial-gradient(circle 240px at var(--px, 50%) var(--py, 30%), black 0%, transparent 100%)",
                maskImage: "radial-gradient(circle 240px at var(--px, 50%) var(--py, 30%), black 0%, transparent 100%)",
              } as React.CSSProperties)
        }
      >
        <FilmFragment variant="floodlights" width={220} height={160} rotate={-3} className="absolute left-[6%] top-[10%]" />
        <FilmFragment variant="streaks" width={200} height={150} rotate={2} className="absolute right-[10%] top-[6%]" />
        <FilmFragment variant="filmstrip" width={140} height={220} rotate={-2} className="absolute left-[22%] top-[42%]" />
        <FilmFragment variant="track" width={240} height={160} rotate={1} className="absolute right-[4%] top-[46%]" />
        <FilmFragment variant="blueBeam" width={140} height={200} rotate={3} className="absolute left-[48%] top-[18%]" />
        <EditorialMark variant="swoosh" width={140} height={90} rotate={-2} className="absolute left-[12%] top-[68%]" />
        <EditorialMark variant="circle" width={110} height={80} rotate={4} className="absolute right-[18%] top-[70%]" />
        <EditorialMark variant="arrowUpRight" width={90} height={70} className="absolute left-[62%] top-[62%]" />
      </div>

      {/* Signal connection: draws only once the pointer settles. */}
      {!reduced && (
        <svg className="pointer-events-none absolute inset-0 z-[1] h-full w-full" aria-hidden="true">
          <line
            ref={lineElRef}
            x1="8%"
            y1="92%"
            x2="8%"
            y2="92%"
            stroke="var(--studio-blue)"
            strokeWidth={1.5}
            opacity={connected ? 0.6 : 0}
            style={{ transition: "opacity 320ms var(--ease-cinematic)" }}
          />
        </svg>
      )}
      {!reduced && connected && (
        <div className="pointer-events-none absolute left-[8%] top-[92%] z-[1] -translate-x-1/2 -translate-y-1/2">
          <SignalPulse size={8} />
        </div>
      )}
    </div>
  );
}
