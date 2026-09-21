"use client";

import { STAGES } from "@/data/how-it-works";
import { useInView } from "@/lib/motion/useInView";
import { usePrefersReducedMotion } from "@/lib/motion/usePrefersReducedMotion";

function StageBlock({ stage, index }: { stage: (typeof STAGES)[number]; index: number }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.35);
  const reduced = usePrefersReducedMotion();
  const revealed = inView || reduced;

  return (
    <div
      ref={ref}
      className="relative border-t py-10 transition-[opacity,transform] duration-700 sm:py-14"
      style={{
        borderColor: "var(--studio-line)",
        opacity: revealed ? 1 : 0,
        transform: revealed ? "none" : "translateY(24px)",
        transitionTimingFunction: "var(--ease-cinematic)",
        transitionDelay: `${index * 60}ms`,
      }}
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-[120px_1fr]">
        <div className="flex items-start gap-3 sm:flex-col sm:gap-2">
          <span className="font-display text-4xl font-black" style={{ color: "var(--studio-blue-soft)" }}>
            {stage.number}
          </span>
          <span
            aria-hidden="true"
            className="signal-node mt-2 hidden h-2 w-2 rounded-full sm:block"
            style={{ background: "var(--studio-blue)" }}
          />
        </div>
        <div>
          <h3 className="font-display text-2xl font-black uppercase tracking-tight sm:text-4xl" style={{ color: "var(--studio-white)" }}>
            {stage.title}
          </h3>
          <p className="mt-3 max-w-xl text-sm sm:text-base" style={{ color: "var(--studio-silver)" }}>
            {stage.description}
          </p>
          {stage.details && (
            <ul className="mt-5 grid max-w-xl grid-cols-1 gap-2 sm:grid-cols-2">
              {stage.details.map((line) => (
                <li key={line} className="flex items-start gap-2 text-sm" style={{ color: "var(--studio-silver)" }}>
                  <span aria-hidden="true" className="mt-1.5 block h-1 w-1 shrink-0 rounded-full" style={{ background: "var(--studio-blue-soft)" }} />
                  {line}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export function DecisionMachine() {
  return (
    <div>
      {STAGES.map((stage, i) => (
        <StageBlock key={stage.id} stage={stage} index={i} />
      ))}
      <div className="border-t py-14 text-center sm:py-20" style={{ borderColor: "var(--studio-line)" }}>
        <p className="mx-auto max-w-2xl font-display text-2xl font-black uppercase leading-tight sm:text-4xl" style={{ color: "var(--studio-white)" }}>
          The CEO owns the execution.
          <br />
          <span style={{ color: "var(--studio-blue-soft)" }}>The Studio protects the philosophy.</span>
        </p>
      </div>
    </div>
  );
}
