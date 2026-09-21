import Link from "next/link";
import { getFeaturedProjects, PROJECTS, STATUS_LABEL } from "@/data/projects";
import { LivingSignalField } from "@/components/public/LivingSignalField";
import { MagneticCTA } from "@/components/motion/MagneticCTA";
import { SignalLine } from "@/components/motion/SignalLine";
import { ConstructionSignal } from "@/components/motion/ConstructionSignal";
import { EditorialMark } from "@/components/motion/EditorialMark";

export const metadata = {
  title: "Studio by Dominique Soucy",
  description: "A creative venture studio for original sports, products, stories and experiences.",
};

export default function HomePage() {
  const featured = getFeaturedProjects();
  const inConstruction = PROJECTS.filter(
    (p) => (p.status === "IN_DEVELOPMENT" || p.status === "PRIVATE_PREVIEW") && p.visibility
  ).slice(0, 4);

  return (
    <main>
      <LivingSignalField>
        <section className="relative z-10 flex min-h-screen flex-col justify-center px-6 pt-24 sm:px-10">
          <p className="font-mono text-xs uppercase tracking-[0.24em]" style={{ color: "var(--studio-blue-soft)" }}>
            People × Ideas × Sports × A brighter tomorrow
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-[13vw] font-black uppercase leading-[0.92] tracking-tight sm:text-7xl md:text-8xl">
            <span className="block" style={{ color: "var(--studio-white)" }}>
              Studio by
            </span>
            <span className="block" style={{ color: "var(--studio-blue-soft)" }}>
              Dominique Soucy
            </span>
          </h1>
          <p className="mt-6 max-w-xl font-display text-lg font-bold uppercase tracking-wide sm:text-xl" style={{ color: "var(--studio-white)" }}>
            We build sports, stories and companies from raw instinct.
          </p>
          <p className="mt-3 max-w-md text-sm sm:text-base" style={{ color: "var(--studio-silver)" }}>
            A creative venture studio for original sports, products, stories and experiences.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <MagneticCTA href="/ecosystem">Enter the Studio →</MagneticCTA>
            <MagneticCTA href="/ecosystem" variant="secondary">
              View the ecosystem
            </MagneticCTA>
          </div>

          <div className="absolute bottom-8 left-6 flex items-center gap-2 sm:left-10" aria-hidden="true">
            <span className="block h-8 w-px animate-pulse" style={{ background: "var(--studio-line)" }} />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--studio-silver-dim)" }}>
              Scroll
            </span>
          </div>
        </section>
      </LivingSignalField>

      <section className="relative border-t px-6 py-20 sm:px-10 sm:py-28" style={{ borderColor: "var(--studio-line)" }}>
        <div className="mx-auto max-w-5xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: "var(--studio-blue-soft)" }}>
            What the Studio creates
          </p>
          <h2 className="mt-4 max-w-2xl font-display text-3xl font-black uppercase leading-tight sm:text-5xl" style={{ color: "var(--studio-white)" }}>
            Sport is not the destination. It is the medium.
          </h2>
          <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
            {["Athletes", "Ideas", "Products", "Stories", "People"].map((word) => (
              <p key={word} className="font-display text-sm font-bold uppercase tracking-[0.1em]" style={{ color: "var(--studio-silver)" }}>
                {word}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="relative border-t px-6 py-20 sm:px-10 sm:py-28" style={{ borderColor: "var(--studio-line)" }}>
        <div className="mx-auto max-w-6xl">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-display text-2xl font-black uppercase sm:text-4xl" style={{ color: "var(--studio-white)" }}>
              Selected active companies
            </h2>
            <Link href="/ecosystem" className="hidden font-mono text-xs uppercase tracking-[0.14em] underline underline-offset-4 sm:inline" style={{ color: "var(--studio-silver)" }}>
              View the full ecosystem
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((project) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="group relative overflow-hidden border p-6 transition-colors duration-300"
                style={{ borderColor: "var(--studio-line)" }}
              >
                <span className="signal-node inline-block h-2 w-2 rounded-full" style={{ background: "var(--studio-blue)" }} aria-hidden="true" />
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: "var(--studio-silver-dim)" }}>
                  {STATUS_LABEL[project.status]}
                </p>
                <h3 className="mt-2 font-display text-2xl font-black uppercase tracking-tight transition-colors group-hover:opacity-80" style={{ color: "var(--studio-white)" }}>
                  {project.title}
                </h3>
                <p className="mt-2 text-sm" style={{ color: "var(--studio-silver)" }}>
                  {project.summary}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative border-t px-6 py-20 sm:px-10 sm:py-28" style={{ borderColor: "var(--studio-line)" }}>
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-2xl font-black uppercase sm:text-4xl" style={{ color: "var(--studio-white)" }}>
            Selected projects in construction
          </h2>
          <p className="mt-2 max-w-md text-sm" style={{ color: "var(--studio-silver)" }}>
            Public does not mean fully accessible. Every company moves independently.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {inConstruction.map((project) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="border p-5 opacity-90 transition-opacity hover:opacity-100"
                style={{ borderColor: "var(--studio-line)" }}
              >
                <h3 className="font-display text-lg font-black uppercase tracking-tight" style={{ color: "var(--studio-white)" }}>
                  {project.title}
                </h3>
                <p className="mt-2 text-xs" style={{ color: "var(--studio-silver)" }}>
                  {project.summary}
                </p>
                <div className="mt-4">
                  <ConstructionSignal label={STATUS_LABEL[project.status]} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative border-t px-6 py-20 sm:px-10 sm:py-28" style={{ borderColor: "var(--studio-line)" }}>
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-lg">
            <p className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: "var(--studio-blue-soft)" }}>
              The Studio model
            </p>
            <h2 className="mt-3 font-display text-3xl font-black uppercase leading-tight sm:text-4xl" style={{ color: "var(--studio-white)" }}>
              We invent the concept. We prove it in the real world.
            </h2>
            <p className="mt-3 text-sm" style={{ color: "var(--studio-silver)" }}>
              We build the company around it. Then a CEO takes it forward.
            </p>
          </div>
          <MagneticCTA href="/how-it-works" variant="secondary">
            See how it works
          </MagneticCTA>
        </div>
      </section>

      <section className="relative overflow-hidden border-t px-6 py-24 sm:px-10 sm:py-32" style={{ borderColor: "var(--studio-line)" }}>
        <div className="pointer-events-none absolute -right-10 top-10 opacity-60" aria-hidden="true">
          <EditorialMark variant="orbit" width={160} height={110} />
        </div>
        <SignalLine
          d="M40 60 C 220 20, 420 100, 640 40"
          viewBox="0 0 680 120"
          className="pointer-events-none absolute left-1/2 top-6 hidden w-[600px] -translate-x-1/2 sm:block"
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <h2 className="font-display text-4xl font-black uppercase leading-tight sm:text-6xl" style={{ color: "var(--studio-white)" }}>
            One Studio.
            <br />
            Multiple companies.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm sm:text-base" style={{ color: "var(--studio-silver)" }}>
            Independent brands connected by one creative philosophy.
          </p>
          <div className="mt-8 flex justify-center">
            <MagneticCTA href="/ecosystem">Enter the ecosystem →</MagneticCTA>
          </div>
        </div>
      </section>
    </main>
  );
}
