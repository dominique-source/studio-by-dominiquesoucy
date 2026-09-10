import type { DomainAccent } from "@/lib/types";

export const DOMAIN_COLORS: Record<DomainAccent, string> = {
  purinstinct: "var(--color-domain-purinstinct)",
  ballers: "var(--color-domain-ballers)",
  infive: "var(--color-domain-infive)",
  gamification: "var(--color-domain-gamification)",
  default: "var(--color-domain-default)",
};

export function DomainBadge({ accent, label }: { accent: DomainAccent; label: string }) {
  const color = DOMAIN_COLORS[accent];
  return (
    <p className="text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color }}>
      {label}
    </p>
  );
}
