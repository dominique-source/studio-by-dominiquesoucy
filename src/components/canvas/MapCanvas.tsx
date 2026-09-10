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
  BackgroundVariant,
} from "@xyflow/react";
import type { Entity, Relationship, ViewItem, View, RelationshipType } from "@/lib/types";
import { ObjectNode, type ObjectNodeData } from "@/components/canvas/ObjectNode";
import { useSelection } from "@/components/shell/selection-context";
import { moveViewItemAction, connectEntitiesAction } from "@/lib/actions/view-actions";
import { ConnectionModal } from "@/components/canvas/ConnectionModal";

const nodeTypes = { objectCard: ObjectNode };

export function MapCanvas({
  view,
  items,
  entities,
  relationships,
}: {
  view: View;
  items: ViewItem[];
  entities: Entity[];
  relationships: Relationship[];
}) {
  const router = useRouter();
  const { selectedEntityId, select, mode } = useSelection();
  const entitiesById = useMemo(() => new Map(entities.map((e) => [e.id, e])), [entities]);
  const [pendingConnection, setPendingConnection] = useState<{ from: string; to: string } | null>(null);

  const initialNodes = useMemo<Node<ObjectNodeData>[]>(
    () =>
      items
        .filter((item) => entitiesById.has(item.entityId))
        .map((item) => ({
          id: item.id,
          type: "objectCard",
          position: { x: item.x, y: item.y },
          data: { entity: entitiesById.get(item.entityId)!, selected: item.entityId === selectedEntityId },
          draggable: true,
        })),
    [items, entitiesById, selectedEntityId]
  );

  // Mémoïsé : un nouveau tableau à chaque rendu ferait recalculer
  // initialEdges à chaque fois et boucler l'effet de synchronisation
  // ci-dessous (React error #185 — profondeur de mise à jour dépassée).
  const visibleRelationships = useMemo(
    () => (mode === "real" ? relationships.filter((r) => r.confirmationStatus === "confirmed") : relationships),
    [mode, relationships]
  );

  const itemByEntity = useMemo(() => new Map(items.map((i) => [i.entityId, i])), [items]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleRelationships, items]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => setNodes(initialNodes), [initialNodes, setNodes]);
  useEffect(() => setEdges(initialEdges), [initialEdges, setEdges]);

  const onNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      const item = items.find((i) => i.id === node.id);
      if (!item) return;
      select(item.entityId, { viewId: view.id, itemId: item.id });
    },
    [items, select, view.id]
  );

  const onNodeDragStop: OnNodeDrag<Node<ObjectNodeData>> = useCallback(
    (_, node) => {
      const item = items.find((i) => i.id === node.id);
      if (!item) return;
      moveViewItemAction(view.id, item.id, { x: node.position.x, y: node.position.y }, item.version).then((result) => {
        if (!result.ok) router.refresh();
      });
    },
    [items, view.id, router]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      const fromItem = items.find((i) => i.id === connection.source);
      const toItem = items.find((i) => i.id === connection.target);
      if (!fromItem || !toItem) return;
      setPendingConnection({ from: fromItem.entityId, to: toItem.entityId });
    },
    [items]
  );

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
