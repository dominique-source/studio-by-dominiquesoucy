import Link from "next/link";

/**
 * New nav for the rebuilt homepage, per the Oct 2026 IA plan — French,
 * gold-scoped. Separate from PublicNav (English, blue), which the four
 * pages built against the animation kit still use unchanged.
 *
 * Only "Accueil" and "Carte du Studio" have real destinations today.
 * Ventures/Labs/Partenaires/Réflexions/À propos are the planned IA but
 * have no pages yet — rendered as honest, non-interactive labels rather
 * than links to routes that don't exist, consistent with never inventing
 * a URL.
 */
const PLANNED_SECTIONS = ["Ventures", "Labs", "Partenaires", "Réflexions", "À propos"];

export function StudioMapNav() {
  return (
    <header className="relative z-20 flex flex-wrap items-center justify-between gap-4 px-6 py-6 sm:px-10">
      <Link href="/" className="shrink-0 leading-none">
        <p className="font-studio-display text-lg tracking-tight">Studio</p>
        <p className="studio-eyebrow mt-0.5 !text-[9px]">Dominique Soucy</p>
      </Link>

      <nav className="flex flex-wrap items-center gap-x-7 gap-y-2">
        <a href="#carte-du-studio" className="studio-eyebrow text-white/80 transition hover:text-white">
          Carte du Studio
        </a>
        {PLANNED_SECTIONS.map((label) => (
          <span key={label} className="studio-eyebrow cursor-not-allowed text-white/30" title="Section à venir">
            {label}
          </span>
        ))}
      </nav>
    </header>
  );
}
