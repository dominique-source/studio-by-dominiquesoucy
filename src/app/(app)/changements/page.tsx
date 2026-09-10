import { redirect } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { requireMember } from "@/lib/auth/session";
import { listChangesForMember } from "@/lib/server/change-events";
import { listOverdueTasksForMember } from "@/lib/server/tasks";
import { getEntity } from "@/lib/server/entities";

const PERIODS: Record<string, { label: string; ms: number }> = {
  hier: { label: "Hier", ms: 1000 * 60 * 60 * 24 },
  semaine: { label: "7 jours", ms: 1000 * 60 * 60 * 24 * 7 },
  mois: { label: "1 mois", ms: 1000 * 60 * 60 * 24 * 30 },
};

// Extrait du corps du composant : un appel direct à Date.now() dans une
// fonction de page est traité comme une lecture impure par la règle
// react-hooks/purity (React 19).
function sinceIso(periodMs: number): string {
  return new Date(Date.now() - periodMs).toISOString();
}

export default async function ChangementsPage({ searchParams }: { searchParams: Promise<{ periode?: string }> }) {
  const ctx = await requireMember();
  if (!ctx) redirect("/login");
  const { periode } = await searchParams;
  const key = periode && PERIODS[periode] ? periode : "semaine";
  const period = PERIODS[key]!;

  const since = sinceIso(period.ms);
  const [changes, overdue] = await Promise.all([listChangesForMember(ctx.member, since), listOverdueTasksForMember(ctx.member)]);

  return (
    <div className="h-full overflow-y-auto px-8 py-6">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--color-text-3)" }}>
        Studio
      </p>
      <h1 className="font-display mb-4 text-4xl font-black tracking-tight">Changements</h1>

      <div className="mb-6 flex gap-1 text-sm">
        {Object.entries(PERIODS).map(([k, p]) => (
          <a
            key={k}
            href={`/changements?periode=${k}`}
            className="rounded-full border px-3 py-1"
            style={
              k === key
                ? { background: "var(--color-ink)", color: "var(--color-cream)", borderColor: "var(--color-ink)" }
                : { borderColor: "var(--color-surface-border)" }
            }
          >
            {p.label}
          </a>
        ))}
      </div>

      <section className="mb-8 max-w-2xl">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-3)" }}>
          Changements survenus pendant la période
        </h2>
        <ul className="space-y-2">
          {changes.map((event) => (
            <li key={event.id} className="rounded border px-4 py-2.5 text-sm" style={{ borderColor: "var(--color-surface-border)", background: "var(--color-surface)" }}>
              <p>{event.summary}</p>
              <p className="text-xs" style={{ color: "var(--color-text-3)" }}>
                {format(new Date(event.recordedAt), "d MMM yyyy, HH:mm", { locale: fr })}
              </p>
            </li>
          ))}
          {changes.length === 0 && <li style={{ color: "var(--color-text-3)" }}>Aucun changement sur cette période.</li>}
        </ul>
      </section>

      <section className="max-w-2xl">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-3)" }}>
          Points ouverts aujourd&apos;hui
        </h2>
        <ul className="space-y-2">
          {await Promise.all(
            overdue.map(async (task) => {
              const entity = await getEntity(task.entityId, ctx.member);
              return (
                <li key={task.id} className="rounded border px-4 py-2.5 text-sm" style={{ borderColor: "var(--color-warn)", background: "#fbf4e2" }}>
                  <p>{task.title}</p>
                  <p className="text-xs" style={{ color: "var(--color-text-2)" }}>
                    {entity?.exactName} · échéance dépassée ({task.dueDate})
                  </p>
                </li>
              );
            })
          )}
          {overdue.length === 0 && <li style={{ color: "var(--color-text-3)" }}>Aucune échéance dépassée.</li>}
        </ul>
      </section>
    </div>
  );
}
