import Link from "next/link";
import { SourceComposition } from "@/components/public/SourceComposition";
import { MagneticCTA } from "@/components/motion/MagneticCTA";
import { EditorialMark } from "@/components/motion/EditorialMark";

export const metadata = {
  title: "Studio by Dominique Soucy",
  description: "A creative venture studio for original sports, products, stories and experiences.",
};

// The homepage IS the Source composition (page1.png) — not a text hero
// followed by cards. Below it, two short authored transitions carry the
// visitor toward the operating model and the philosophy, each linking to
// its own full page rather than repeating that page's content here.
export default function HomePage() {
  return (
    <main>
      <SourceComposition />

      <section className="relative overflow-hidden border-t px-6 py-20 sm:px-10 sm:py-28" style={{ borderColor: "var(--studio-line)" }}>
        <div className="pointer-events-none absolute -right-6 top-6 opacity-50" aria-hidden="true">
          <EditorialMark variant="arrowUpRight" displayWidth={90} />
        </div>
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-lg">
            <p className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: "var(--studio-gold-soft)" }}>
              The Studio model
            </p>
            <h2 className="mt-3 font-display text-3xl uppercase leading-tight sm:text-4xl" style={{ color: "var(--studio-white)" }}>
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

      <section className="relative border-t px-6 py-20 sm:px-10 sm:py-28" style={{ borderColor: "var(--studio-line)" }}>
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-lg">
            <p className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: "var(--studio-gold-soft)" }}>
              Philosophy
            </p>
            <h2 className="mt-3 font-display text-3xl uppercase leading-tight sm:text-4xl" style={{ color: "var(--studio-white)" }}>
              Sport is not the destination. It is the medium.
            </h2>
            <p className="mt-3 text-sm" style={{ color: "var(--studio-silver)" }}>
              Public does not mean fully accessible. Every company moves independently.
            </p>
          </div>
          <Link
            href="/philosophy"
            className="font-mono text-xs uppercase tracking-[0.14em] underline underline-offset-4"
            style={{ color: "var(--studio-silver)" }}
          >
            Read the philosophy →
          </Link>
        </div>
      </section>
    </main>
  );
}
