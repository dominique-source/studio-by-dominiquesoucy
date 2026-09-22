import Link from "next/link";

const LINKS = [
  { href: "/ecosystem", label: "Ecosystem" },
  { href: "/how-it-works", label: "Stories" },
  { href: "/philosophy", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export function PublicNav({ active }: { active?: string }) {
  return (
    <header className="relative z-20 flex items-center justify-between gap-6 px-6 py-6 sm:px-10">
      <Link href="/" className="shrink-0 leading-none">
        <p className="font-studio-display text-lg tracking-tight">Studio</p>
        <p className="studio-eyebrow mt-0.5 !text-[9px]">By Dominique Soucy</p>
      </Link>

      <nav className="hidden gap-8 md:flex">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="studio-eyebrow relative pb-1 text-white/70 transition hover:text-white"
          >
            {link.label}
            {active === link.href && (
              <span className="absolute -bottom-0.5 left-0 h-[2px] w-full bg-[var(--studio-blue)]" />
            )}
          </Link>
        ))}
      </nav>

      <p className="studio-eyebrow hidden text-right !text-[9px] text-white/40 lg:block">
        People × Ideas × Sports × A brighter tomorrow
      </p>
    </header>
  );
}
