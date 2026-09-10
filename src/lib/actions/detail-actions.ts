"use server";

import { requireMember } from "@/lib/auth/session";
import { getEntity } from "@/lib/server/entities";
import { listRelationshipsForEntity } from "@/lib/server/relationships";
import { listTasksForEntity } from "@/lib/server/tasks";
import { listDecisionsForEntity, type DecisionWithRevision } from "@/lib/server/decisions";
import { listChangesForMember } from "@/lib/server/change-events";
import type { Entity, Relationship, Task, ChangeEvent } from "@/lib/types";

export interface RelationshipWithNeighbor {
  relationship: Relationship;
  neighbor: Entity;
  direction: "outgoing" | "incoming";
}

export interface EntityDetail {
  entity: Entity;
  relationships: RelationshipWithNeighbor[];
  tasks: Task[];
  decisions: DecisionWithRevision[];
  history: ChangeEvent[];
}

export async function getEntityDetailAction(id: string): Promise<EntityDetail | null> {
  const ctx = await requireMember();
  if (!ctx) return null;
  const entity = await getEntity(id, ctx.member);
  if (!entity) return null;

  const rels = await listRelationshipsForEntity(id, ctx.member);
  const relationships: RelationshipWithNeighbor[] = [];
  for (const relationship of rels) {
    const outgoing = relationship.fromId === id;
    const neighborId = outgoing ? relationship.toId : relationship.fromId;
    const neighbor = await getEntity(neighborId, ctx.member);
    if (neighbor) {
      relationships.push({ relationship, neighbor, direction: outgoing ? "outgoing" : "incoming" });
    }
  }

  const [tasks, decisions, allHistory] = await Promise.all([
    listTasksForEntity(id, ctx.member),
    listDecisionsForEntity(id, ctx.member),
    listChangesForMember(ctx.member, new Date(0).toISOString(), 500),
  ]);
  const history = allHistory.filter((event) => event.targetId === id || relationships.some((r) => r.relationship.id === event.targetId));

  return { entity, relationships, tasks, decisions, history };
}
