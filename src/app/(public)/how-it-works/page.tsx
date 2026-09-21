import { ProcessAssembly } from "@/components/public/ProcessAssembly";

export const metadata = {
  title: "How It Works — Studio by Dominique Soucy",
  description: "We build the first working version. Independent leaders take it forward.",
};

export default function HowItWorksPage() {
  return (
    <main className="pb-24 pt-28 sm:pt-32">
      <div className="mx-auto max-w-3xl px-6 sm:px-10">
        <p className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: "var(--studio-blue-soft)" }}>
          How it works
        </p>
        <h1 className="mt-3 font-display text-4xl uppercase leading-[0.88] sm:text-6xl md:text-7xl" style={{ color: "var(--studio-white)" }}>
          From instinct
          <br />
          to company.
        </h1>
        <p className="mt-4 max-w-xl text-sm sm:text-base" style={{ color: "var(--studio-silver)" }}>
          We build the first working version. Independent leaders take it forward.
        </p>
      </div>

      <div className="mt-14">
        <ProcessAssembly />
      </div>
    </main>
  );
}
