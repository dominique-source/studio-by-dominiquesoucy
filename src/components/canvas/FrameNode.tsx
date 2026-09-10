import { memo, useState } from "react";
import { NodeResizer } from "@xyflow/react";

export interface FrameNodeData {
  label: string;
  onRename: (label: string) => void;
  onRemove: () => void;
  [key: string]: unknown;
}

/**
 * Cadre visuel purement décoratif (spec §7) : regroupe des cartes à l'écran,
 * sans effet sur la détention, les rôles ou les droits d'accès.
 */
function FrameNodeImpl({ data, selected }: { data: FrameNodeData; selected: boolean }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(data.label);

  return (
    <div
      className="h-full w-full rounded-md border-2 border-dashed"
      style={{ borderColor: "var(--color-text-3)", background: "rgba(224, 216, 194, 0.18)" }}
    >
      <NodeResizer isVisible={selected} minWidth={160} minHeight={120} handleStyle={{ width: 8, height: 8 }} />
      <div className="flex items-center gap-2 p-2">
        {editing ? (
          <input
            autoFocus
            onFocus={(e) => e.currentTarget.select()}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={() => {
              setEditing(false);
              if (draft.trim() && draft !== data.label) data.onRename(draft);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
              if (e.key === "Escape") {
                setDraft(data.label);
                setEditing(false);
              }
            }}
            className="nodrag rounded border bg-white px-2 py-0.5 text-xs font-semibold uppercase tracking-wide"
            style={{ borderColor: "var(--color-surface-border)" }}
          />
        ) : (
          <button
            type="button"
            onDoubleClick={() => setEditing(true)}
            className="nodrag rounded bg-[var(--color-canvas)] px-2 py-0.5 text-xs font-semibold uppercase tracking-wide"
            style={{ color: "var(--color-text-2)", border: "1px solid var(--color-surface-border)" }}
            title="Double-cliquer pour renommer"
          >
            {data.label}
          </button>
        )}
        {selected && (
          <button
            type="button"
            onClick={data.onRemove}
            className="nodrag rounded px-1.5 py-0.5 text-xs"
            style={{ color: "var(--color-text-3)", border: "1px solid var(--color-surface-border)", background: "var(--color-canvas)" }}
            aria-label="Supprimer ce cadre"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

export const FrameNode = memo(FrameNodeImpl);
