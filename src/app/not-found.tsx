import Link from "next/link";
import "@/styles/studio-public.css";

export default function NotFound() {
  return (
    <div className="studio-public flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: "var(--studio-blue-soft)" }}>
        404
      </p>
      <h1 className="mt-3 font-display text-4xl font-black uppercase leading-tight sm:text-5xl" style={{ color: "var(--studio-white)" }}>
        This signal doesn&apos;t exist.
      </h1>
      <p className="mt-3 max-w-sm text-sm" style={{ color: "var(--studio-silver)" }}>
        The page you&apos;re looking for isn&apos;t part of the Studio&apos;s ecosystem.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-sm px-6 py-3 font-display text-sm font-bold uppercase tracking-[0.08em]"
        style={{ background: "var(--studio-blue)", color: "var(--studio-black)" }}
      >
        Return to the Studio →
      </Link>
    </div>
  );
}
