"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type Connection,
  type NodeMouseHandler,
  type OnNodeDrag,
  type NodeChange,
  BackgroundVariant,
} from "@xyflow/react";
import type { Entity, Relationship, ViewItem, ViewFrame, View, RelationshipType, EntityKind } from "@/lib/types";
import { ENTITY_KIND_LABELS } from "@/lib/types";
import { ObjectNode, type ObjectNodeData } from "@/components/canvas/ObjectNode";
import { FrameNode, type FrameNodeData } from "@/components/canvas/FrameNode";
import { useSelection } from "@/components/shell/selection-context";
import { moveViewItemAction, connectEntitiesAction, createViewFrameAction, updateViewFrameAction, removeViewFrameAction } from "@/lib/actions/view-actions";
import { ConnectionModal } from "@/components/canvas/ConnectionModal";

const nodeTypes = { objectCard: ObjectNode, frameNode: FrameNode };
const FRAME_PREFIX = "frame:";

type AppNode = Node<ObjectNodeData> | Node<FrameNodeData>;

export function MapCanvas({
  view,
  items,
  entities,
  relationships,
  frames,
}: {
  view: View;
  items: ViewItem[];
  entities: Entity[];
  relationships: Relationship[];
  frames: ViewFrame[];
}) {
  const router = useRouter();
  const { selectedEntityId, select, mode } = useSelection();
  const entitiesById = useMemo(() => new Map(entities.map((e) => [e.id, e])), [entities]);
  const [pendingConnection, setPendingConnection] = useState<{ from: string; to: string } | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [kindFilter, setKindFilter] = useState<Set<EntityKind> | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  const availableKinds = useMemo(() => {
    const kinds = new Set<EntityKind>();
    items.forEach((item) => {
      const entity = entitiesById.get(item.entityId);
      if (entity) kinds.add(entity.kind);
    });
    return [...kinds];
  }, [items, entitiesById]);

  const visibleItems = useMemo(
    () =>
      items.filter((item) => {
        const entity = entitiesById.get(item.entityId);
        if (!entity) return false;
        if (!showArchived && entity.lifecycleState === "archived") return false;
        if (kindFilter && !kindFilter.has(entity.kind)) return false;
        return true;
      }),
    [items, entitiesById, kindFilter, showArchived]
  );

  const initialItemNodes = useMemo<Node<ObjectNodeData>[]>(
    () =>
      visibleItems.map((item) => {
        const entity = entitiesById.get(item.entityId)!;
        return {
          id: item.id,
          type: "objectCard",
          position: { x: item.x, y: item.y },
          data: { entity, selected: item.entityId === selectedEntityId },
          draggable: true,
          ariaLabel: `${entity.exactName} — ${ENTITY_KIND_LABELS[entity.kind]}${entity.lifecycleState === "archived" ? ", archivé" : ""}`,
        };
      }),
    [visibleItems, entitiesById, selectedEntityId]
  );

  const removeFrame = useCallback(
    (frameId: string) => {
      removeViewFrameAction(view.id, frameId).then(() => router.refresh());
    },
    [view.id, router]
  );

  const renameFrame = useCallback(
    (frame: ViewFrame) => (label: string) => {
      updateViewFrameAction(view.id, frame.id, { label }, frame.version).then((result) => {
        if (!result.ok) router.refresh();
      });
    },
    [view.id, router]
  );

  const initialFrameNodes = useMemo<Node<FrameNodeData>[]>(
    () =>
      frames.map((frame) => ({
        id: FRAME_PREFIX + frame.id,
        type: "frameNode",
        position: { x: frame.x, y: frame.y },
        style: { width: frame.width, height: frame.height },
        zIndex: -1,
        selectable: true,
        ariaLabel: `Cadre : ${frame.label}`,
        data: { label: frame.label, onRename: renameFrame(frame), onRemove: () => removeFrame(frame.id) },
      })),
    [frames, renameFrame, removeFrame]
  );

  const initialNodes = useMemo<AppNode[]>(() => [...initialFrameNodes, ...initialItemNodes], [initialFrameNodes, initialItemNodes]);

  // Mémoïsé : un nouveau tableau à chaque rendu ferait recalculer
  // initialEdges à chaque fois et boucler l'effet de synchronisation
  // ci-dessous (React error #185 — profondeur de mise à jour dépassée).
  const visibleRelationships = useMemo(
    () => (mode === "real" ? relationships.filter((r) => r.confirmationStatus === "confirmed") : relationships),
    [mode, relationships]
  );

  const itemByEntity = useMemo(() => new Map(visibleItems.map((i) => [i.entityId, i])), [visibleItems]);

  const initialEdges = useMemo<Edge[]>(() => {
    const edges: Edge[] = [];
    for (const rel of visibleRelationships) {
      const fromItem = itemByEntity.get(rel.fromId);
      const toItem = itemByEntity.get(rel.toId);
      if (!fromItem || !toItem) continue;
      const hypothesis = rel.confirmationStatus === "hypothesis";
      edges.push({
        id: rel.id,
        source: fromItem.id,
        target: toItem.id,
        label: hypothesis ? `${rel.type} · envisagé` : rel.type,
        style: { stroke: hypothesis ? "var(--color-text-3)" : "var(--color-accent-green)", strokeDasharray: hypothesis ? "4 3" : undefined },
        labelStyle: { fontSize: 10, fill: "var(--color-text-2)" },
      });
    }
    return edges;
  }, [visibleRelationships, itemByEntity]);

  const [nodes, setNodes, onNodesChangeBase] = useNodesState<AppNode>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => setNodes(initialNodes), [initialNodes, setNodes]);
  useEffect(() => setEdges(initialEdges), [initialEdges, setEdges]);

  // Persiste la fin de redimensionnement d'un cadre (React Flow signale les
  // changements de dimensions via onNodesChange, pas un callback dédié).
  const onNodesChange = useCallback(
    (changes: NodeChange<AppNode>[]) => {
      onNodesChangeBase(changes);
      for (const change of changes) {
        if (change.type === "dimensions" && change.resizing === false && change.id.startsWith(FRAME_PREFIX)) {
          const frameId = change.id.slice(FRAME_PREFIX.length);
          const frame = frames.find((f) => f.id === frameId);
          const node = nodes.find((n) => n.id === change.id);
          if (!frame || !change.dimensions) continue;
          updateViewFrameAction(
            view.id,
            frameId,
            { width: change.dimensions.width, height: change.dimensions.height, x: node?.position.x, y: node?.position.y },
            frame.version
          ).then((result) => {
            if (!result.ok) router.refresh();
          });
        }
      }
    },
    [onNodesChangeBase, frames, nodes, view.id, router]
  );

  const onNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      if (node.id.startsWith(FRAME_PREFIX)) return;
      const item = visibleItems.find((i) => i.id === node.id);
      if (!item) return;
      select(item.entityId, { viewId: view.id, itemId: item.id });
    },
    [visibleItems, select, view.id]
  );

  const onNodeDragStop: OnNodeDrag<AppNode> = useCallback(
    (_, node) => {
      if (node.id.startsWith(FRAME_PREFIX)) {
        const frameId = node.id.slice(FRAME_PREFIX.length);
        const frame = frames.find((f) => f.id === frameId);
        if (!frame) return;
        updateViewFrameAction(view.id, frameId, { x: node.position.x, y: node.position.y }, frame.version).then((result) => {
          if (!result.ok) router.refresh();
        });
        return;
      }
      const item = visibleItems.find((i) => i.id === node.id);
      if (!item) return;
      moveViewItemAction(view.id, item.id, { x: node.position.x, y: node.position.y }, item.version).then((result) => {
        if (!result.ok) router.refresh();
      });
    },
    [visibleItems, frames, view.id, router]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      const fromItem = visibleItems.find((i) => i.id === connection.source);
      const toItem = visibleItems.find((i) => i.id === connection.target);
      if (!fromItem || !toItem) return;
      setPendingConnection({ from: fromItem.entityId, to: toItem.entityId });
    },
    [visibleItems]
  );

  function addFrame() {
    createViewFrameAction(view.id, "Regroupement", { x: 80, y: 80, width: 320, height: 220 }).then((result) => {
      if (result.ok) router.refresh();
    });
  }

  const activeFilterCount = (kindFilter ? kindFilter.size : 0) + (showArchived ? 1 : 0);

  return (
    <div className="relative h-full w-full bg-dot-grid" style={{ background: "var(--color-canvas)" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onNodeDragStop={onNodeDragStop}
        onConnect={onConnect}
        onPaneClick={() => select(null)}
        fitView
        minZoom={0.2}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={22} size={0} color="transparent" />
        <Controls showInteractive={false} position="bottom-right" />
      </ReactFlow>

      <div className="absolute right-6 top-20 z-10 flex flex-col items-end gap-2">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={addFrame}
            className="rounded-full border px-3 py-1 text-xs font-medium"
            style={{ borderColor: "var(--color-surface-border)", background: "var(--color-surface)" }}
          >
            + Cadre
          </button>
          <button
            type="button"
            onClick={() => setFilterOpen((v) => !v)}
            className="rounded-full border px-3 py-1 text-xs font-medium"
            style={{ borderColor: "var(--color-surface-border)", background: "var(--color-surface)" }}
          >
            Filtrer{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
          </button>
        </div>
        {filterOpen && (
          <div
            className="w-56 rounded-md border p-3 text-sm shadow-sm"
            style={{ borderColor: "var(--color-surface-border)", background: "var(--color-surface)" }}
          >
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-3)" }}>
              Type d&apos;objet
            </p>
            <div className="mb-3 space-y-1">
              {availableKinds.map((kind) => (
                <label key={kind} className="flex items-center gap-2 text-xs" style={{ color: "var(--color-text-2)" }}>
                  <input
                    type="checkbox"
                    checked={kindFilter?.has(kind) ?? false}
                    onChange={(e) => {
                      setKindFilter((prev) => {
                        const next = new Set(prev ?? []);
                        if (e.target.checked) next.add(kind);
                        else next.delete(kind);
                        return next.size > 0 ? next : null;
                      });
                    }}
                  />
                  {ENTITY_KIND_LABELS[kind]}
                </label>
              ))}
              {availableKinds.length === 0 && (
                <p className="text-xs" style={{ color: "var(--color-text-3)" }}>
                  Aucun objet dans cette vue
                </p>
              )}
            </div>
            <label className="mb-2 flex items-center gap-2 text-xs" style={{ color: "var(--color-text-2)" }}>
              <input type="checkbox" checked={showArchived} onChange={(e) => setShowArchived(e.target.checked)} />
              Afficher les archivés
            </label>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  setKindFilter(null);
                  setShowArchived(false);
                }}
                className="text-xs underline"
                style={{ color: "var(--color-text-3)" }}
              >
                Réinitialiser
              </button>
            )}
          </div>
        )}
      </div>

      <div
        className="absolute bottom-6 left-6 hidden rounded border px-3 py-2 text-xs shadow-sm sm:block"
        style={{ borderColor: "var(--color-surface-border)", background: "var(--color-surface)" }}
      >
        <p className="mb-1 flex items-center gap-2">
          <span className="inline-block h-0 w-5 border-t-2" style={{ borderColor: "var(--color-accent-green)" }} /> Relation confirmée
        </p>
        <p className="flex items-center gap-2">
          <span className="inline-block h-0 w-5 border-t-2 border-dashed" style={{ borderColor: "var(--color-text-3)" }} /> Relation envisagée
        </p>
      </div>

      {mode === "vision" && (
        <div
          className="absolute top-4 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-semibold shadow-sm"
          style={{ background: "var(--color-ink)", color: "var(--color-cream)" }}
        >
          Mode Vision — hypothèses affichées
        </div>
      )}

      {pendingConnection && (
        <ConnectionModal
          fromName={entitiesById.get(pendingConnection.from)?.exactName ?? ""}
          toName={entitiesById.get(pendingConnection.to)?.exactName ?? ""}
          onCancel={() => setPendingConnection(null)}
          onConfirm={(type: RelationshipType, confirmed: boolean) => {
            connectEntitiesAction(pendingConnection.from, pendingConnection.to, type, confirmed ? "confirmed" : "hypothesis").then(() => {
              setPendingConnection(null);
              router.refresh();
            });
          }}
        />
      )}
    </div>
  );
}
