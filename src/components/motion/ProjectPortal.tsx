"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import type { Project } from "@/data/projects";
import { getRelatedProjects } from "@/data/projects";
import { LayeredArtwork } from "./LayeredArtwork";
import { MagneticCTA } from "./MagneticCTA";
import { usePrefersReducedMotion } from "@/lib/motion/usePrefersReducedMotion";

// The Living Portal. Opens from the exact screen position of the node the
// visitor selected (via --portal-x/--portal-y, set by the caller before
// mount) using a clip-path circle expansion. Closing hands control back to
// the caller — the ecosystem behind it never unmounts, so spatial context
// (which nodes were near/far) survives the round trip.
export function ProjectPortal({
  project,
  originX,
  originY,
  onClose,
}: {
  project: Project;
  originX: number;
  originY: number;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduced = usePrefersReducedMotion();
  const related = getRelatedProjects(project);

  useEffect(() => {
    closeRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} presentation`}
      className={`fixed inset-0 z-50 overflow-y-auto ${reduced ? "" : "portal"}`}
      style={
        {
          background: "var(--studio-black)",
          "--portal-x": `${originX}%`,
          "--portal-y": `${originY}%`,
        } as React.CSSProperties
      }
    >
      <div className="mx-auto max-w-4xl px-6 py-10 sm:px-10 sm:py-16">
        <div className="flex items-center justify-between">
          <span className="font-display text-sm font-bold uppercase tracking-[0.16em]" style={{ color: "var(--studio-silver)" }}>
            Studio by Dominique Soucy
          </span>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="font-display text-sm font-bold uppercase tracking-[0.16em] transition-opacity hover:opacity-70"
            style={{ color: "var(--studio-white)" }}
          >
            Return to the ecosystem ×
          </button>
        </div>

        <div className="mt-12 sm:mt-16">
          <LayeredArtwork project={project} />
        </div>

        <dl className="fragment relative z-10 mt-10 grid grid-cols-2 gap-x-8 gap-y-4 border-t pt-6 text-sm sm:grid-cols-4" style={{ animationDelay: "480ms", borderColor: "var(--studio-line)" }}>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: "var(--studio-silver-dim)" }}>
              Category
            </dt>
            <dd className="mt-1 capitalize" style={{ color: "var(--studio-white)" }}>
              {project.category}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: "var(--studio-silver-dim)" }}>
              Current phase
            </dt>
            <dd className="mt-1 capitalize" style={{ color: "var(--studio-white)" }}>
              {project.maturity}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: "var(--studio-silver-dim)" }}>
              Relationship to the Studio
            </dt>
            <dd className="mt-1" style={{ color: "var(--studio-white)" }}>
              {project.featured ? "Flagship company" : "Studio-built project"}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: "var(--studio-silver-dim)" }}>
              Access
            </dt>
            <dd className="mt-1 capitalize" style={{ color: "var(--studio-white)" }}>
              {project.accessLevel === "preview" ? "By request" : project.accessLevel}
            </dd>
          </div>
        </dl>

        {related.length > 0 && (
          <div className="fragment relative z-10 mt-8" style={{ animationDelay: "560ms" }}>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: "var(--studio-silver-dim)" }}>
              Related projects
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {related.map((r) => (
                <span
                  key={r.slug}
                  className="rounded-full border px-3 py-1 text-xs"
                  style={{ borderColor: "var(--studio-line)", color: "var(--studio-silver)" }}
                >
                  {r.title}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="fragment relative z-10 mt-10 flex flex-wrap items-center gap-4" style={{ animationDelay: "640ms" }}>
          {project.officialUrl ? (
            <MagneticCTA href={project.officialUrl}>
              {project.ctaLabel} →
            </MagneticCTA>
          ) : project.accessLevel === "preview" ? (
            <MagneticCTA href="/private">{project.ctaLabel} →</MagneticCTA>
          ) : (
            <MagneticCTA href={`/projects/${project.slug}`}>{project.ctaLabel} →</MagneticCTA>
          )}
          <Link
            href={`/projects/${project.slug}`}
            className="font-mono text-xs uppercase tracking-[0.14em] underline underline-offset-4 transition-opacity hover:opacity-70"
            style={{ color: "var(--studio-silver)" }}
          >
            Open full presentation
          </Link>
        </div>
      </div>
    </div>
  );
}
