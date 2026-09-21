"use client";

import { useMemo, useState } from "react";
import type { Project } from "@/data/projects";
import { PROJECTS } from "@/data/projects";
import { OrbitNode } from "@/components/motion/OrbitNode";
import { SignalPulse } from "@/components/motion/SignalPulse";
import { ProjectPortal } from "@/components/motion/ProjectPortal";
import { MemoryTrace } from "@/components/motion/MemoryTrace";
import { DisplayText } from "@/components/motion/DisplayText";
import { useMemoryTrace } from "@/lib/motion/useMemoryTrace";
import { STATUS_LABEL } from "@/data/projects";

const RADIUS_BY_ORBIT: Record<Project["orbit"], number> = { 1: 17, 2: 28, 3: 38, 4: 47 };

function layout(projects: Project[]) {
  const byOrbit = new Map<number, Project[]>();
  for (const p of projects) {
    if (!byOrbit.has(p.orbit)) byOrbit.set(p.orbit, []);
    byOrbit.get(p.orbit)!.push(p);
  }
  const positions = new Map<string, { x: number; y: number }>();
  for (const [orbit, group] of byOrbit) {
    const radius = RADIUS_BY_ORBIT[orbit as Project["orbit"]];
    const offset = (orbit * 27) % 360;
    group.forEach((p, i) => {
      const angle = ((360 / group.length) * i + offset) * (Math.PI / 180);
      const x = 50 + radius * Math.cos(angle) * 1.35;
      const y = 50 + radius * Math.sin(angle);
      positions.set(p.slug, { x: Math.max(4, Math.min(96, x)), y: Math.max(6, Math.min(94, y)) });
    });
  }
  return positions;
}

export function GravityInterface() {
  const positions = useMemo(() => layout(PROJECTS.filter((p) => p.visibility)), []);
  const [active, setActive] = useState<{ project: Project; x: number; y: number } | null>(null);
  const { visited, markVisited } = useMemoryTrace();

  const relatedSlugs = useMemo(() => {
    if (!active) return new Set<string>();
    return new Set([active.project.slug, ...active.project.relationships]);
  }, [active]);

  function handleSelect(project: Project) {
    const pos = positions.get(project.slug) ?? { x: 50, y: 50 };
    setActive({ project, x: pos.x, y: pos.y });
    markVisited(project.slug);
  }

  return (
    <div className="relative">
      {/* Desktop / tablet: the orbital field. */}
      <div className="relative mx-auto hidden aspect-[16/10] w-full max-w-6xl overflow-hidden md:block">
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-40" aria-hidden="true">
          {([1, 2, 3, 4] as const).map((orbit) => (
            <ellipse
              key={orbit}
              cx="50%"
              cy="50%"
              rx={`${RADIUS_BY_ORBIT[orbit] * 1.35}%`}
              ry={`${RADIUS_BY_ORBIT[orbit]}%`}
              fill="none"
              stroke="var(--studio-line)"
              strokeWidth={1}
            />
          ))}
        </svg>

        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2">
          <span
            className="signal-node flex h-16 w-16 items-center justify-center rounded-full border"
            style={{ borderColor: "var(--studio-blue)", background: "var(--studio-black-soft)" }}
            aria-hidden="true"
          >
            <SignalPulse size={10} />
          </span>
          <p className="font-display text-xs font-black uppercase tracking-[0.14em]" style={{ color: "var(--studio-white)" }}>
            Studio
          </p>
        </div>

        {PROJECTS.filter((p) => p.visibility).map((project) => {
          const pos = positions.get(project.slug)!;
          const dimmed = Boolean(active) && !relatedSlugs.has(project.slug);
          return (
            <OrbitNode
              key={project.slug}
              project={project}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              dimmed={dimmed}
              visited={visited.has(project.slug)}
              onSelect={handleSelect}
            />
          );
        })}
      </div>

      {/* Mobile: a focused vertical narrative instead of a tiny orbit. */}
      <ul className="flex flex-col gap-3 md:hidden">
        {PROJECTS.filter((p) => p.visibility).map((project) => (
          <li key={project.slug}>
            <button
              type="button"
              onClick={() => handleSelect(project)}
              className="flex w-full items-center justify-between border px-4 py-4 text-left"
              style={{ borderColor: "var(--studio-line)" }}
            >
              <span>
                <span className="flex items-center gap-2">
                  <span className="font-display text-base font-black tracking-tight" style={{ color: "var(--studio-white)" }}>
                    <DisplayText>{project.title.toUpperCase()}</DisplayText>
                  </span>
                  <MemoryTrace visited={visited.has(project.slug)} />
                </span>
                <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: "var(--studio-silver-dim)" }}>
                  {STATUS_LABEL[project.status]}
                </span>
              </span>
              <span aria-hidden="true" style={{ color: "var(--studio-blue-soft)" }}>
                →
              </span>
            </button>
          </li>
        ))}
      </ul>

      <p className="mx-auto mt-8 hidden max-w-md text-center font-mono text-[11px] uppercase tracking-[0.14em] md:block" style={{ color: "var(--studio-silver-dim)" }}>
        Size = priority · Distance = maturity · Brightness = activity
      </p>

      {active && (
        <ProjectPortal
          project={active.project}
          originX={active.x}
          originY={active.y}
          onClose={() => setActive(null)}
        />
      )}
    </div>
  );
}
