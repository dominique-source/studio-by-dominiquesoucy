import { GravityInterface } from "@/components/public/GravityInterface";

export const metadata = {
  title: "Ecosystem — Studio by Dominique Soucy",
  description: "One Studio. Multiple companies. Independent brands connected by one creative philosophy.",
};

export default function EcosystemPage() {
  return (
    <main className="px-6 pb-24 pt-28 sm:px-10 sm:pt-32">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: "var(--studio-blue-soft)" }}>
          The ecosystem
        </p>
        <h1 className="mt-3 max-w-2xl font-display text-4xl font-black uppercase leading-[0.95] sm:text-6xl" style={{ color: "var(--studio-white)" }}>
          One Studio.
          <br />
          Multiple companies.
        </h1>
        <p className="mt-4 max-w-md text-sm sm:text-base" style={{ color: "var(--studio-silver)" }}>
          Every project belongs to one connected ecosystem. Select a company to open its presentation.
        </p>
      </div>

      <div className="mx-auto mt-16 max-w-6xl">
        <GravityInterface />
      </div>
    </main>
  );
}
