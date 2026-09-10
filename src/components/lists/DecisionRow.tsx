"use client";

import { useSelection } from "@/components/shell/selection-context";
import type { Decision, DecisionRevision } from "@/lib/types";

export function DecisionRow({
  decision,
  revision,
  entityName,
  entityId,
}: {
  decision: Decision;
  revision: DecisionRevision | null;
  entityName: string;
  entityId: string;
}) {
  const { select } = useSelection();
  return (
    <button
      onClick={() => select(entityId)}
      className="block w-full rounded border px-4 py-3 text-left"
      style={{ borderColor: "var(--color-surface-border)", background: "var(--color-surface)" }}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-3)" }}>
        {entityName} · {decision.status === "adopted" ? "Adoptée" : decision.status}
      </p>
      <p className="font-display text-lg font-semibold">{revision?.question ?? "—"}</p>
      <p style={{ color: "var(--color-text-2)" }}>{revision?.choice}</p>
      <p className="mt-1 text-xs italic" style={{ color: "var(--color-text-3)" }}>
        {revision?.rationale ?? "Le raisonnement n'a pas été consigné."}
      </p>
    </button>
  );
}
