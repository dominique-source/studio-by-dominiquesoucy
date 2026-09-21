import { ThoughtField } from "@/components/public/ThoughtField";

export const metadata = {
  title: "Philosophy — Studio by Dominique Soucy",
  description: "Sport is art. A more human way for a brighter tomorrow.",
};

export default function PhilosophyPage() {
  return (
    <main className="px-6 pb-24 pt-28 sm:px-10 sm:pt-32">
      <div className="mx-auto max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: "var(--studio-blue-soft)" }}>
          Philosophy
        </p>
        <h1 className="mt-3 font-display text-4xl font-black uppercase leading-[0.95] sm:text-6xl" style={{ color: "var(--studio-white)" }}>
          Sport is <span style={{ color: "var(--studio-blue-soft)" }}>art.</span>
        </h1>
        <p className="mt-4 max-w-xl text-sm sm:text-base" style={{ color: "var(--studio-silver)" }}>
          A canvas for people, ideas and possibilities. Different backgrounds. Same human potential.
        </p>
      </div>

      <div className="mx-auto mt-16 max-w-6xl">
        <ThoughtField />
      </div>
    </main>
  );
}
