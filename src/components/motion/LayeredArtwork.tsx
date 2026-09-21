"use client";

import type { Project } from "@/data/projects";
import { STATUS_LABEL } from "@/data/projects";
import { FilmFragment } from "./FilmFragment";
import { EditorialMark } from "./EditorialMark";
import { ConstructionSignal } from "./ConstructionSignal";

// The Living Portal's main composition: one project's presence, built as
// separate layers (texture, typography, status, data, sketches) that
// arrive with a short staggered delay instead of appearing all at once.
// Layer order and depth are controlled — no 3D rotation, just staggered
// opacity/translate via the shared `fragment` animation.
export function LayeredArtwork({ project }: { project: Project }) {
  return (
    <div className="relative">
      {/* Texture layer */}
      <div className="pointer-events-none absolute -left-6 -top-10 hidden opacity-40 sm:-left-10 sm:block">
        <div className="fragment" style={{ animationDelay: "80ms" }}>
          <FilmFragment variant="glassShard" width={160} height={140} rotate={-4} />
        </div>
      </div>

      {/* Status marker layer */}
      <div className="fragment relative z-10 flex items-center gap-2" style={{ animationDelay: "0ms" }}>
        <span
          aria-hidden="true"
          className="signal-node block h-2 w-2 rounded-full"
          style={{ background: "var(--studio-blue)" }}
        />
        <span className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: "var(--studio-silver)" }}>
          {STATUS_LABEL[project.status]}
        </span>
      </div>

      {/* Typography layer */}
      <h1
        className="fragment relative z-10 mt-3 font-display text-[13vw] font-black uppercase leading-[0.92] tracking-tight sm:text-6xl md:text-7xl"
        style={{ animationDelay: "140ms", color: "var(--studio-white)" }}
      >
        {project.title}
      </h1>

      {/* Data layer */}
      <p
        className="fragment relative z-10 mt-4 max-w-xl text-base sm:text-lg"
        style={{ animationDelay: "260ms", color: "var(--studio-silver)" }}
      >
        {project.summary}
      </p>

      {project.status === "IN_DEVELOPMENT" && (
        <div className="fragment relative z-10 mt-4" style={{ animationDelay: "340ms" }}>
          <ConstructionSignal />
        </div>
      )}

      {/* Sketches layer */}
      <div className="pointer-events-none absolute -right-4 top-0 hidden opacity-70 sm:-right-10 sm:block">
        <div className="fragment" style={{ animationDelay: "420ms" }}>
          <EditorialMark variant="circle" width={90} height={60} rotate={4} />
        </div>
      </div>
    </div>
  );
}
