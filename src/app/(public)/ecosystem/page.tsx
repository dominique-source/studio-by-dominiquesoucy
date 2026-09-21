import { SourceComposition } from "@/components/public/SourceComposition";
import { GravityInterface } from "@/components/public/GravityInterface";

export const metadata = {
  title: "Ecosystem — Studio by Dominique Soucy",
  description: "One Studio. Multiple companies. Independent brands connected by one creative philosophy.",
};

export default function EcosystemPage() {
  return (
    <main className="pb-24">
      <SourceComposition />

      <div className="mx-auto mt-20 max-w-6xl px-6 sm:px-10">
        <p className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: "var(--studio-silver-dim)" }}>
          The full ecosystem
        </p>
        <h2 className="mt-2 font-display text-2xl uppercase sm:text-4xl" style={{ color: "var(--studio-white)" }}>
          Every project, one connected map.
        </h2>
      </div>
      <div className="mx-auto mt-10 max-w-6xl px-6 sm:px-10">
        <GravityInterface />
      </div>
    </main>
  );
}
