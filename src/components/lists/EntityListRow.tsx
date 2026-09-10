"use client";

import { useSelection } from "@/components/shell/selection-context";
import { ENTITY_KIND_LABELS, type Entity } from "@/lib/types";
import { DomainBadge } from "@/components/canvas/domain-colors";

export function EntityListRow({ entity }: { entity: Entity }) {
  const { select, selectedEntityId } = useSelection();
  const active = selectedEntityId === entity.id;
  return (
    <button
      onClick={() => select(entity.id)}
      className="flex w-full items-center justify-between rounded border px-4 py-3 text-left transition-colors"
      style={{
        borderColor: active ? "var(--color-accent-green)" : "var(--color-surface-border)",
        background: "var(--color-surface)",
      }}
    >
      <div>
        {entity.domainAccent && <DomainBadge accent={entity.domainAccent} label={ENTITY_KIND_LABELS[entity.kind]} />}
        <p className="font-display text-lg font-semibold">{entity.exactName}</p>
        {entity.description && (
          <p className="text-sm" style={{ color: "var(--color-text-2)" }}>
            {entity.description}
          </p>
        )}
      </div>
      {entity.lifecycleState === "archived" && (
        <span className="rounded-full px-2 py-0.5 text-xs" style={{ background: "var(--color-surface-2)", color: "var(--color-text-2)" }}>
          Archivé
        </span>
      )}
    </button>
  );
}
