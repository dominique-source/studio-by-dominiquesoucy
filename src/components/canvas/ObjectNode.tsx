import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { ENTITY_KIND_LABELS, type Entity } from "@/lib/types";
import { DOMAIN_COLORS } from "@/components/canvas/domain-colors";

export interface ObjectNodeData {
  entity: Entity;
  selected: boolean;
  [key: string]: unknown;
}

function ObjectNodeImpl({ data }: { data: ObjectNodeData }) {
  const { entity, selected } = data;
  const accentColor = entity.domainAccent ? DOMAIN_COLORS[entity.domainAccent] : "var(--color-domain-default)";
  const isCenter = entity.kind === "person";
  const archived = entity.lifecycleState === "archived";

  const dark = selected || isCenter;

  return (
    <div
      className="rounded-[4px] border px-4 py-3 shadow-sm transition-shadow"
      style={{
        width: 220,
        borderColor: dark ? "transparent" : "var(--color-surface-border)",
        background: dark ? (isCenter ? "var(--color-ink)" : "var(--color-accent-green)") : "var(--color-surface)",
        color: dark ? "var(--color-cream)" : "var(--color-text)",
        opacity: archived ? 0.55 : 1,
        boxShadow: selected ? "0 0 0 2px var(--color-accent-green)" : undefined,
      }}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      {!isCenter && (
        <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.16em]" style={{ color: dark ? "rgba(247,243,230,0.75)" : accentColor }}>
          {ENTITY_KIND_LABELS[entity.kind]}
        </p>
      )}
      <p className="font-display text-lg font-bold leading-snug">{entity.exactName}</p>
      {isCenter && entity.description && (
        <p className="mt-0.5 text-xs" style={{ color: "rgba(247,243,230,0.7)" }}>
          {entity.description}
        </p>
      )}
      {!isCenter && entity.description && (
        <p className="mt-1 text-xs" style={{ color: dark ? "rgba(247,243,230,0.85)" : "var(--color-text-2)" }}>
          {entity.description}
        </p>
      )}
      {archived && (
        <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide" style={{ color: dark ? "rgba(247,243,230,0.8)" : "var(--color-text-3)" }}>
          Archivé
        </p>
      )}
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  );
}

export const ObjectNode = memo(ObjectNodeImpl);
