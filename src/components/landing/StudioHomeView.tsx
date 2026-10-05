import Link from "next/link";
import Image from "next/image";
import { StudioMapNav } from "@/components/studio-public/StudioMapNav";
import { Nucleus } from "@/components/studio-public/Nucleus";
import { STUDIO_CORE, STUDIO_NODES, STATUS_LABEL_FR } from "@/data/studio-map";

// Shared-coordinate orbit: node position is computed from angleDeg + a fixed
// radius, not hand-placed — this is what "data-driven map" means in
// practice. Adding a node to studio-map.ts is enough; this component never
// needs to change for a new venture at the same orbit.
const MAP_SIZE = 760;
const CENTER = MAP_SIZE / 2;
const ORBIT_RADIUS: Record<string, number> = {
  core: 0,
  inner: 300,
  middle: 300,
  outer: 300,
  external: 300,
};

function orbitPosition(angleDeg: number, orbit: string) {
  const radius = ORBIT_RADIUS[orbit] ?? 300;
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.sin(rad),
    y: CENTER - radius * Math.cos(rad),
  };
}

function pct(v: number) {
  return `${(v / MAP_SIZE) * 100}%`;
}

export function StudioHomeView() {
  const innerOrbitNodes = STUDIO_NODES.filter((n) => n.orbit === "inner");

  return (
    <main className="studio-public studio-public--gold relative min-h-screen overflow-x-clip">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(217,164,65,0.12),transparent_55%)]" />

      <StudioMapNav />

      {/* hero */}
      <section className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 pb-20 pt-4 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:items-center lg:gap-10">
        <div>
          <p className="studio-eyebrow fragment mb-4 text-white/60" style={{ animationDelay: "80ms" }}>
            Studio de création, d&rsquo;innovation et d&rsquo;impact
          </p>
          <h1 className="font-studio-display fragment text-5xl leading-[0.92] sm:text-6xl xl:text-7xl" style={{ animationDelay: "140ms" }}>
            Créer de nouvelles
            <br />
            façons de vivre
            <br />
            <span className="bg-gradient-to-r from-white to-[var(--studio-gold-soft)] bg-clip-text text-transparent">le sport.</span>
          </h1>
          <p className="fragment mt-6 max-w-md text-sm leading-relaxed text-white/60" style={{ animationDelay: "220ms" }}>
            Un studio de création, d&rsquo;innovation et d&rsquo;impact qui transforme des idées en projets
            concrets pour les gens, les communautés et la prochaine génération.
          </p>

          <div className="fragment mt-8 flex flex-wrap items-center gap-4" style={{ animationDelay: "300ms" }}>
            <a
              href="#carte-du-studio"
              className="rounded-sm bg-[var(--studio-gold)] px-6 py-3 text-sm font-semibold uppercase tracking-wide text-black transition hover:brightness-110"
            >
              Explorer la carte →
            </a>
            <Link
              href="/purinstinct"
              className="rounded-sm border border-white/25 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white/85 transition hover:border-white/60"
            >
              Voir PürInstinct
            </Link>
          </div>

          <p className="fragment mt-10 text-xs font-semibold uppercase tracking-[0.2em] text-white/40" style={{ animationDelay: "380ms" }}>
            Sport · Humain · Culture · Communauté · Technologie · Impact
          </p>
        </div>

        <div className="fragment relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-sm border border-white/10" style={{ animationDelay: "200ms" }}>
          <Image
            src="/studio-map/core-portrait.png"
            alt="Dominique Soucy"
            fill
            sizes="(min-width: 1024px) 380px, 70vw"
            className="object-cover"
            priority
          />
        </div>
      </section>

      {/* La carte du Studio */}
      <section id="carte-du-studio" className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-8 sm:px-10">
        <div className="mb-10 max-w-xl">
          <p className="studio-eyebrow mb-3 text-white/60">La carte du Studio</p>
          <h2 className="font-studio-display text-3xl leading-[0.95] sm:text-4xl">Un écosystème vivant.</h2>
          <p className="mt-4 text-sm leading-relaxed text-white/55">
            Des projets qui gravitent autour d&rsquo;une vision commune et qui évoluent dans le temps. Un
            projet peut se rapprocher du cœur — un partenariat, un financement, une direction qui arrive —
            ou s&rsquo;en éloigner sans que ce soit un échec.
          </p>
        </div>

        {/* desktop orbit */}
        <div className="relative mx-auto hidden lg:block" style={{ width: MAP_SIZE, height: MAP_SIZE }}>
          <svg viewBox={`0 0 ${MAP_SIZE} ${MAP_SIZE}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
            <defs>
              <filter id="mapGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="4" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <circle cx={CENTER} cy={CENTER} r={ORBIT_RADIUS.inner} stroke="var(--studio-gold)" strokeWidth="1" fill="none" opacity="0.18" />
            {innerOrbitNodes.map((node, i) => {
              const p = orbitPosition(node.angleDeg, node.orbit);
              return (
                <path
                  key={node.slug}
                  pathLength="1"
                  d={`M${CENTER} ${CENTER} L ${p.x} ${p.y}`}
                  stroke="var(--studio-gold)"
                  strokeWidth={node.priority === 1 ? 2 : 1.4}
                  opacity={node.priority === 1 ? 0.8 : 0.5}
                  filter="url(#mapGlow)"
                  className="signal-path"
                  style={{ animationDelay: `${300 + i * 100}ms` }}
                />
              );
            })}
          </svg>

          <div className="absolute" style={{ left: pct(CENTER), top: pct(CENTER), transform: "translate(-50%,-50%)" }}>
            <Nucleus size={150} label="Studio" sublabel="Dominique Soucy" />
          </div>

          {innerOrbitNodes.map((node, i) => {
            const p = orbitPosition(node.angleDeg, node.orbit);
            const card = (
              <div
                className="fragment absolute w-[220px] -translate-x-1/2 -translate-y-1/2 text-center"
                style={{ left: pct(p.x), top: pct(p.y), animationDelay: `${420 + i * 100}ms` }}
              >
                {node.heroImage ? (
                  <div className="relative mb-2 aspect-[16/10] w-full overflow-hidden rounded-sm border border-white/10">
                    <Image src={node.heroImage} alt="" fill sizes="220px" className="object-cover" />
                  </div>
                ) : (
                  <div className="mb-2 flex aspect-[16/10] w-full flex-col items-center justify-center gap-1.5 rounded-sm border border-white/10 bg-white/[0.03]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--studio-gold)]" />
                    <p className="text-[9px] uppercase tracking-wide text-white/30">Visuel à venir</p>
                  </div>
                )}
                <p className="font-studio-display text-lg leading-tight">{node.name}</p>
                <p className="studio-eyebrow mt-0.5 !text-[9px] text-white/50">{STATUS_LABEL_FR[node.status]}</p>
                <p className="mt-1 text-[11px] leading-snug text-white/45">{node.shortDescription}</p>
              </div>
            );
            return node.href ? (
              <Link key={node.slug} href={node.href} className="contents">
                {card}
              </Link>
            ) : (
              <div key={node.slug}>{card}</div>
            );
          })}
        </div>

        {/* mobile/tablet: the orbit canvas above only reads correctly with
            room for four scattered nodes around a center — below lg it
            becomes a vertical stack of the same data instead. */}
        <div className="flex flex-col gap-6 lg:hidden">
          <div className="flex items-center gap-3 border-b border-white/10 pb-6">
            <Nucleus size={80} label="Studio" animate={false} />
            <div>
              <p className="font-studio-display text-lg leading-tight">{STUDIO_CORE.name}</p>
              <p className="mt-0.5 text-xs text-white/50">{STUDIO_CORE.tagline}</p>
            </div>
          </div>
          {innerOrbitNodes.map((node) => {
            const card = (
              <div className="flex gap-4 border-b border-white/10 pb-6">
                {node.heroImage ? (
                  <div className="relative aspect-[3/4] w-24 shrink-0 overflow-hidden rounded-sm border border-white/10">
                    <Image src={node.heroImage} alt="" fill sizes="96px" className="object-cover" />
                  </div>
                ) : (
                  <div className="flex aspect-[3/4] w-24 shrink-0 flex-col items-center justify-center gap-1 rounded-sm border border-white/10 bg-white/[0.03]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--studio-gold)]" />
                  </div>
                )}
                <div>
                  <p className="font-studio-display text-lg leading-tight">{node.name}</p>
                  <p className="studio-eyebrow mt-0.5 !text-[9px] text-white/50">{STATUS_LABEL_FR[node.status]}</p>
                  <p className="mt-1 text-[11px] leading-snug text-white/45">{node.shortDescription}</p>
                </div>
              </div>
            );
            return node.href ? (
              <Link key={node.slug} href={node.href}>
                {card}
              </Link>
            ) : (
              <div key={node.slug}>{card}</div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
