"use client";

import type { CSSProperties } from "react";
import type { Project } from "@/data/projects";
import { STATUS_LABEL } from "@/data/projects";
import { DisplayText } from "./DisplayText";

// One project node inside the Gravity Interface. Visual weight (size,
// brightness, interactivity) comes from the project's own status —
// LIVE reads bright and stable, FUTURE reads as a faint, minimally
// interactive signal. Position is computed by the caller (percentage
// left/top) so this component stays purely presentational.
export function OrbitNode({
  project,
  style,
  dimmed,
  visited,
  onSelect,
}: {
  project: Project;
  style: CSSProperties;
  dimmed: boolean;
  visited: boolean;
  onSelect: (project: Project) => void;
}) {
  const brightness = BRIGHTNESS[project.status];
  const size = 10 + project.visualWeight * 6;
  // The full catalog reads as silver signals of the Studio, not blue —
  // blue stays reserved for Instinct Studio and for relationship lines.
  const color = project.accentColor === "var(--studio-blue)" ? "var(--studio-blue)" : "var(--studio-silver)";

  return (
    <button
      type="button"
      onClick={() => onSelect(project)}
      className="group absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 transition-[opacity,transform] duration-500"
      style={{
        ...style,
        opacity: dimmed ? 0.22 : brightness,
        transitionTimingFunction: "var(--ease-cinematic)",
      }}
      aria-label={`${project.title} — ${STATUS_LABEL[project.status]}${visited ? ", already viewed" : ""}`}
    >
      <span
        className="signal-node relative block rounded-full"
        style={{
          width: size,
          height: size,
          background: project.status === "FUTURE" ? "transparent" : color,
          border: project.status === "FUTURE" ? `1px solid ${color}` : undefined,
          boxShadow: `0 0 ${6 + project.visualWeight * 4}px ${color}66`,
        }}
      >
        {visited && (
          <span
            aria-hidden="true"
            className="absolute -right-0.5 -top-0.5 block h-1.5 w-1.5 rounded-full"
            style={{ background: "var(--studio-white)" }}
          />
        )}
      </span>
      <span
        className="max-w-[92px] text-center font-display text-[10px] leading-tight tracking-[0.1em] transition-opacity group-hover:opacity-100"
        style={{ color: "var(--studio-silver)", opacity: project.visualWeight >= 2 ? 0.9 : 0.55 }}
      >
        <DisplayText>{project.title.toUpperCase()}</DisplayText>
      </span>
    </button>
  );
}

const BRIGHTNESS: Record<Project["status"], number> = {
  LIVE: 1,
  ACTIVE: 0.92,
  PRIVATE_PREVIEW: 0.75,
  IN_DEVELOPMENT: 0.65,
  CONCEPT: 0.42,
  FUTURE: 0.22,
};
