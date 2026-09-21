"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/ecosystem", label: "Ecosystem" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/philosophy", label: "Philosophy" },
];

// Minimal fixed navigation. No sound control: the kit shipped no audio
// assets, and the brief only asks for one "if sound files exist."
export function PublicNav() {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-4 py-5 sm:px-10">
      <Link href="/" className="shrink-0 font-display text-sm font-black uppercase tracking-[0.14em]" style={{ color: "var(--studio-white)" }}>
        Studio
        <span className="ml-2 hidden font-mono text-[10px] font-normal normal-case tracking-normal sm:inline" style={{ color: "var(--studio-silver-dim)" }}>
          by Dominique Soucy
        </span>
      </Link>
      <nav aria-label="Primary" className="flex items-center gap-3 sm:gap-8">
        {LINKS.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.08em] transition-opacity hover:opacity-100 sm:text-[11px] sm:tracking-[0.14em]"
              style={{ color: active ? "var(--studio-white)" : "var(--studio-silver)", opacity: active ? 1 : 0.75 }}
              aria-current={active ? "page" : undefined}
            >
              {link.label}
            </Link>
          );
        })}
        <Link
          href="/projects/purinstinct"
          className="hidden font-mono text-[11px] uppercase tracking-[0.14em] transition-opacity hover:opacity-100 sm:inline"
          style={{ color: "var(--studio-silver)", opacity: 0.75 }}
        >
          Projects
        </Link>
      </nav>
    </header>
  );
}
