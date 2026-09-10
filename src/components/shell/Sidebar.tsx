"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { logoutAction } from "@/lib/actions/auth-actions";

const primaryNav = [
  { href: "/carte", label: "Carte", icon: GridIcon },
  { href: "/a-traiter", label: "À traiter", icon: CheckIcon },
  { href: "/personnes", label: "Personnes", icon: PeopleIcon },
  { href: "/decisions", label: "Décisions", icon: DocIcon },
  { href: "/changements", label: "Changements", icon: TrendIcon },
];

export function Sidebar({
  member,
  views,
  onNavigate,
}: {
  member: { displayName: string; email: string; isAdmin: boolean };
  views: { id: string; name: string }[];
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const initials = member.displayName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside
      className="flex h-full w-[230px] shrink-0 flex-col justify-between overflow-y-auto px-4 py-5"
      style={{ background: "var(--color-sidebar)", color: "var(--color-sidebar-text)" }}
    >
      <div>
        <div className="mb-8 px-2">
          <p className="font-display text-lg font-black tracking-tight">STUDIO</p>
          <p className="text-[10px] font-medium uppercase tracking-[0.18em]" style={{ color: "var(--color-sidebar-text-2)" }}>
            Dominique Soucy
          </p>
        </div>

        <nav className="space-y-0.5">
          {primaryNav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={clsx(
                  "flex items-center gap-2.5 rounded px-3 py-2 text-sm font-medium transition-colors",
                  active ? "text-white" : "hover:bg-white/5"
                )}
                style={active ? { background: "var(--color-sidebar-active)" } : { color: "var(--color-sidebar-text-2)" }}
              >
                <item.icon />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-7">
          <p
            className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: "var(--color-sidebar-text-2)" }}
          >
            Vues
          </p>
          <nav className="space-y-0.5">
            {views.map((view) => {
              const href = `/carte/${view.id}`;
              const active = pathname === href;
              return (
                <Link
                  key={view.id}
                  href={href}
                  onClick={onNavigate}
                  className={clsx(
                    "flex items-center gap-2.5 rounded px-3 py-2 text-sm transition-colors",
                    active ? "text-white" : "hover:bg-white/5"
                  )}
                  style={active ? { background: "var(--color-sidebar-active)" } : { color: "var(--color-sidebar-text-2)" }}
                >
                  <MapIcon />
                  <span className="truncate">{view.name}</span>
                </Link>
              );
            })}
            {views.length === 0 && (
              <p className="px-3 text-xs" style={{ color: "var(--color-sidebar-text-2)" }}>
                Aucune vue enregistrée
              </p>
            )}
          </nav>
        </div>
      </div>

      <div className="border-t px-2 pt-3" style={{ borderColor: "var(--color-sidebar-line)" }}>
        <div className="mb-2 flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold"
            style={{ background: "var(--color-sidebar-active)", color: "var(--color-sidebar-text)" }}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">{member.displayName}</p>
            <p className="truncate text-[11px]" style={{ color: "var(--color-sidebar-text-2)" }}>
              {member.isAdmin ? "Administrateur" : "Membre"}
            </p>
          </div>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full rounded px-3 py-1.5 text-left text-xs transition-colors hover:bg-white/5"
            style={{ color: "var(--color-sidebar-text-2)" }}
          >
            Se déconnecter
          </button>
        </form>
      </div>
    </aside>
  );
}

function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="9" y="1.5" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="1.5" y="9" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="9" y="9" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="1.5" y="1.5" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M4.5 8l2.2 2.2L11.5 5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function PeopleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="6" cy="5" r="2.3" stroke="currentColor" strokeWidth="1.3" />
      <path d="M1.8 14c.4-2.6 2.1-4 4.2-4s3.8 1.4 4.2 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="11.5" cy="5.5" r="1.8" stroke="currentColor" strokeWidth="1.2" />
      <path d="M10.3 9.7c1.7.2 3 1.5 3.3 3.6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
function DocIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M3.5 1.8h6l3 3v8.9a.6.6 0 01-.6.6H3.5a.6.6 0 01-.6-.6V2.4a.6.6 0 01.6-.6z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M5.3 8h5.4M5.3 10.4h5.4M5.3 5.6h2.2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}
function TrendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M1.8 12.5L6 7.8l2.8 2.5 5.4-6.3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.6 3.6h3.6v3.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function MapIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M5.5 2.5L1.8 3.8v9.7l3.7-1.3 4 1.3 4.7-1.6V2.1l-4.7 1.6-4-1.2z" stroke="currentColor" strokeWidth="1.15" strokeLinejoin="round" />
      <path d="M5.5 2.5v9.7M9.5 3.7v9.8" stroke="currentColor" strokeWidth="1.15" />
    </svg>
  );
}
