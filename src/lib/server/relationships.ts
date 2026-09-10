import "server-only";
import { randomUUID } from "crypto";
import { adminDb } from "@/lib/firebase/admin";
import { WORKSPACE_ID } from "@/lib/workspace";
import type { Relationship, RelationshipType, Member } from "@/lib/types";
import { can } from "@/lib/server/permissions";
import { recordChange } from "@/lib/server/change-events";
import { ForbiddenError } from "@/lib/server/entities";

function col() {
  return adminDb().collection("workspaces").doc(WORKSPACE_ID).collection("relationships");
}

/** Relations visibles pour un objet : nécessite la lecture des deux extrémités
 * (spec §13 — les deux extrémités d'un lien doivent être visibles pour l'exposer). */
export async function listRelationshipsForEntity(entityId: string, member: Member): Promise<Relationship[]> {
  const [fromSnap, toSnap] = await Promise.all([
    col().where("fromId", "==", entityId).get(),
    col().where("toId", "==", entityId).get(),
  ]);
  const all = [...fromSnap.docs, ...toSnap.docs].map((d) => d.data() as Relationship);
  const unique = new Map(all.map((r) => [r.id, r]));
  const visible: Relationship[] = [];
  for (const rel of unique.values()) {
    const [readFrom, readTo] = await Promise.all([
      can(member, "entity", rel.fromId, "read"),
      can(member, "entity", rel.toId, "read"),
    ]);
    if (readFrom && readTo) visible.push(rel);
  }
  return visible;
}

export async function listRelationshipsForEntities(entityIds: string[], member: Member): Promise<Relationship[]> {
  if (entityIds.length === 0) return [];
  const results = await Promise.all(entityIds.map((id) => listRelationshipsForEntity(id, member)));
  const map = new Map<string, Relationship>();
  results.flat().forEach((r) => map.set(r.id, r));
  return [...map.values()];
}

export async function createRelationship(
  fromId: string,
  toId: string,
  type: RelationshipType,
  confirmationStatus: Relationship["confirmationStatus"],
  member: Member
): Promise<Relationship> {
  const [canFrom, canTo] = await Promise.all([
    can(member, "entity", fromId, "read"),
    can(member, "entity", toId, "read"),
  ]);
  if (!canFrom || !canTo) throw new ForbiddenError();
  const id = randomUUID();
  const now = new Date().toISOString();
  const relationship: Relationship = {
    id,
    workspaceId: WORKSPACE_ID,
    fromId,
    toId,
    type,
    confirmationStatus,
    validFrom: null,
    validTo: null,
    version: 1,
    createdAt: now,
    createdBy: member.id,
    updatedAt: now,
    updatedBy: member.id,
  };
  await col().doc(id).set(relationship);
  await recordChange({
    actorId: member.id,
    targetId: id,
    targetKind: "relationship",
    action: "relationship.created",
    summary: `Lien créé (${type}${confirmationStatus === "hypothesis" ? ", envisagé" : ""})`,
    effectiveAt: null,
    before: null,
    after: relationship,
  });
  return relationship;
}

export async function removeRelationship(id: string, member: Member): Promise<void> {
  const snap = await col().doc(id).get();
  if (!snap.exists) return;
  const rel = snap.data() as Relationship;
  const [canFrom, canTo] = await Promise.all([
    can(member, "entity", rel.fromId, "edit"),
    can(member, "entity", rel.toId, "edit"),
  ]);
  if (!canFrom && !canTo) throw new ForbiddenError();
  await col().doc(id).delete();
  await recordChange({
    actorId: member.id,
    targetId: id,
    targetKind: "relationship",
    action: "relationship.removed",
    summary: `Lien retiré (${rel.type})`,
    effectiveAt: null,
    before: rel,
    after: null,
  });
}
