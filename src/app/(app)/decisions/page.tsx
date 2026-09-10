import { redirect } from "next/navigation";
import { requireMember } from "@/lib/auth/session";
import { listAllDecisionsForMember } from "@/lib/server/decisions";
import { getEntity } from "@/lib/server/entities";
import { DecisionRow } from "@/components/lists/DecisionRow";

export default async function DecisionsPage() {
  const ctx = await requireMember();
  if (!ctx) redirect("/login");
  const decisions = await listAllDecisionsForMember(ctx.member);

  return (
    <div className="h-full overflow-y-auto px-8 py-6">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--color-text-3)" }}>
        Studio
      </p>
      <h1 className="font-display mb-6 text-4xl font-black tracking-tight">Décisions</h1>
      <div className="max-w-2xl space-y-2">
        {await Promise.all(
          decisions.map(async ({ decision, revision, entityId }) => {
            const entity = await getEntity(entityId, ctx.member);
            return (
              <DecisionRow
                key={decision.id}
                decision={decision}
                revision={revision}
                entityId={entityId}
                entityName={entity?.exactName ?? "—"}
              />
            );
          })
        )}
        {decisions.length === 0 && (
          <p style={{ color: "var(--color-text-3)" }}>
            Aucune décision sourcée pour le moment. Adoptez-en une depuis la fiche d&apos;un objet.
          </p>
        )}
      </div>
    </div>
  );
}
