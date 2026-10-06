import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { StudioMapNav } from "@/components/studio-public/StudioMapNav";
import { STATUS_LABEL_FR, STUDIO_NODES, type StudioNode } from "@/data/studio-map";
import type { VentureDetail } from "@/data/venture-details";

/**
 * Shared template for every venture detail page — one component, driven by
 * studio-map.ts (position/status) + venture-details.ts (long-form content).
 * Per the migration plan: "every subsequent venture/lab/partner page is
 * the same pattern repeated, not new architecture." Adding a venture means
 * adding data in those two files and one thin page.tsx, not a new
 * hand-built layout.
 */
export function VentureDetailView({ node, detail }: { node: StudioNode; detail: VentureDetail }) {
  const related = detail.relatedSlugs
    .map((slug) => STUDIO_NODES.find((n) => n.slug === slug))
    .filter((n): n is StudioNode => Boolean(n));

  return (
    <main className="studio-public studio-public--gold relative min-h-screen overflow-x-clip">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(217,164,65,0.12),transparent_55%)]" />

      <StudioMapNav />

      <div className="relative z-10 mx-auto max-w-5xl px-6 pb-24 pt-4 sm:px-10">
        <Link href="/#carte-du-studio" className="studio-eyebrow text-white/50 transition hover:text-white">
          ← Retour à la carte du Studio
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <h1 className="font-studio-display text-5xl leading-[0.92] sm:text-6xl">{node.name}</h1>
          <span className="studio-eyebrow rounded-full border border-[var(--studio-gold)]/50 px-3 py-1 !text-[10px] text-[var(--studio-gold-soft)]">
            {STATUS_LABEL_FR[node.status]}
          </span>
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/60">{node.shortDescription}</p>

        {node.heroImage ? (
          <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-sm border border-white/10">
            <Image src={node.heroImage} alt="" fill sizes="(min-width: 1024px) 896px, 100vw" className="object-cover" priority />
          </div>
        ) : (
          <div className="mt-10 flex aspect-[16/9] w-full flex-col items-center justify-center gap-2 rounded-sm border border-white/10 bg-white/[0.03]">
            <span className="h-2 w-2 rounded-full bg-[var(--studio-gold)]" />
            <p className="text-xs uppercase tracking-wide text-white/30">Visuel à venir</p>
          </div>
        )}

        <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2">
          <Section heading="Qu'est-ce que c'est">{detail.whatIsIt}</Section>
          <Section heading="Pourquoi ça existe">{detail.whyExists}</Section>
          <Section heading="Lien avec le Studio">{detail.howConnects}</Section>
          <Section heading="En ce moment">
            <ul className="space-y-1.5">
              {detail.rightNow.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--studio-gold)]" />
                  {item}
                </li>
              ))}
            </ul>
          </Section>
          <Section heading="Possibilité à long terme">{detail.longTerm}</Section>
          <Section heading="Qui pilote">{detail.whoRuns}</Section>
        </div>

        {detail.seekingRoles && detail.seekingRoles.length > 0 && (
          <div className="mt-10 border-t border-white/10 pt-6">
            <p className="studio-eyebrow mb-2 text-white/60">Ce qu&rsquo;on cherche</p>
            <p className="text-sm text-white/70">{detail.seekingRoles.join(" · ")}</p>
          </div>
        )}

        {related.length > 0 && (
          <div className="mt-14 border-t border-white/10 pt-8">
            <p className="studio-eyebrow mb-4 text-white/60">Projets liés</p>
            <div className="flex flex-wrap gap-4">
              {related.map((r) =>
                r.href ? (
                  <Link
                    key={r.slug}
                    href={r.href}
                    className="font-studio-display text-lg text-white/80 transition hover:text-[var(--studio-gold-soft)]"
                  >
                    {r.name} →
                  </Link>
                ) : (
                  <span key={r.slug} className="font-studio-display text-lg text-white/40">
                    {r.name}
                  </span>
                ),
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function Section({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <div>
      <p className="studio-eyebrow mb-2 text-white/60">{heading}</p>
      <div className="text-sm leading-relaxed text-white/70">{children}</div>
    </div>
  );
}
