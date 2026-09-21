import { notFound } from "next/navigation";
import Link from "next/link";
import { PROJECTS, getProjectBySlug, getRelatedProjects, STATUS_LABEL } from "@/data/projects";
import { LayeredArtwork } from "@/components/motion/LayeredArtwork";
import { PurinstinctPortal } from "@/components/public/PurinstinctPortal";
import { MagneticCTA } from "@/components/motion/MagneticCTA";

export function generateStaticParams() {
  return PROJECTS.filter((p) => p.visibility).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project not found — Studio by Dominique Soucy" };
  return {
    title: `${project.title} — Studio by Dominique Soucy`,
    description: project.summary,
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project || !project.visibility) notFound();

  const related = getRelatedProjects(project);
  const isPurinstinct = project.slug === "purinstinct";

  return (
    <main className="px-6 pb-24 pt-28 sm:px-10 sm:pt-32">
      <div className={isPurinstinct ? "mx-auto max-w-5xl" : "mx-auto max-w-3xl"}>
        <Link
          href="/ecosystem"
          className="font-mono text-xs uppercase tracking-[0.14em] underline underline-offset-4"
          style={{ color: "var(--studio-silver)" }}
        >
          ← Back to the ecosystem
        </Link>

        <div className="mt-8">
          {isPurinstinct ? <PurinstinctPortal /> : <LayeredArtwork project={project} />}
        </div>

        <dl
          className="mt-10 grid grid-cols-2 gap-x-8 gap-y-4 border-t pt-6 text-sm sm:grid-cols-4"
          style={{ borderColor: "var(--studio-line)", display: isPurinstinct ? "none" : undefined }}
        >
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
              Status
            </dt>
            <dd className="mt-1" style={{ color: "var(--studio-white)" }}>
              {STATUS_LABEL[project.status]}
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
              Access
            </dt>
            <dd className="mt-1 capitalize" style={{ color: "var(--studio-white)" }}>
              {project.accessLevel === "preview" ? "By request" : project.accessLevel}
            </dd>
          </div>
        </dl>

        <div className="mt-8 border-t pt-6" style={{ borderColor: "var(--studio-line)" }}>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: "var(--studio-silver-dim)" }}>
            Relationship to the Studio
          </p>
          <p className="mt-2 max-w-xl text-sm" style={{ color: "var(--studio-silver)" }}>
            {project.featured
              ? "One of the Studio's flagship companies — Dominique launched the concept, validated its direction and built the first working version before handing execution forward."
              : "A Studio-built project, developed under the same philosophy as every other company in the ecosystem."}
          </p>
        </div>

        {related.length > 0 && (
          <div className="mt-8 border-t pt-6" style={{ borderColor: "var(--studio-line)" }}>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: "var(--studio-silver-dim)" }}>
              Related projects
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/projects/${r.slug}`}
                  className="rounded-full border px-3 py-1 text-xs transition-colors hover:opacity-80"
                  style={{ borderColor: "var(--studio-line)", color: "var(--studio-silver)" }}
                >
                  {r.title}
                </Link>
              ))}
            </div>
          </div>
        )}

        {!isPurinstinct && (
          <div className="mt-10 flex flex-wrap items-center gap-4">
            {project.officialUrl ? (
              <MagneticCTA href={project.officialUrl}>{project.ctaLabel} →</MagneticCTA>
            ) : project.accessLevel === "preview" ? (
              <MagneticCTA href="/private">{project.ctaLabel} →</MagneticCTA>
            ) : (
              <MagneticCTA href="/ecosystem" variant="secondary">
                {project.ctaLabel} →
              </MagneticCTA>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
