import "server-only";
import { randomUUID } from "crypto";
import { adminDb } from "@/lib/firebase/admin";
import { WORKSPACE_ID } from "@/lib/workspace";
import type { Entity, Member } from "@/lib/types";
import { can, grantEdit, grantedResourceIds } from "@/lib/server/permissions";
import { recordChange } from "@/lib/server/change-events";

export class VersionConflictError<T = unknown> extends Error {
  constructor(public readonly current: T) {
    super("La ressource a été modifiée entretemps.");
    this.name = "VersionConflictError";
  }
}

export class ForbiddenError extends Error {
  constructor() {
    super("Accès refusé.");
    this.name = "ForbiddenError";
  }
}

function col() {
  return adminDb().collection("workspaces").doc(WORKSPACE_ID).collection("entities");
}

export async function listEntitiesForMember(member: Member): Promise<Entity[]> {
  const allowed = await grantedResourceIds(member, "entity");
  const snap = await col().get();
  const all = snap.docs.map((d) => d.data() as Entity);
  if (allowed === "all") return all;
  return all.filter((e) => allowed.has(e.id));
}

/** Retourne null si l'objet n'existe pas OU si l'accès est refusé — même
 * réponse dans les deux cas pour ne pas révéler l'existence d'un objet interdit. */
export async function getEntity(id: string, member: Member): Promise<Entity | null> {
  const snap = await col().doc(id).get();
  if (!snap.exists) return null;
  if (!(await can(member, "entity", id, "read"))) return null;
  return snap.data() as Entity;
}

export interface CreateEntityInput {
  kind: Entity["kind"];
  exactName: string;
  description?: string | null;
  domainAccent?: Entity["domainAccent"];
}

export async function createEntity(input: CreateEntityInput, member: Member): Promise<Entity> {
  const id = randomUUID();
  const now = new Date().toISOString();
  const entity: Entity = {
    id,
    workspaceId: WORKSPACE_ID,
    kind: input.kind,
    exactName: input.exactName.trim(),
    description: input.description?.trim() || null,
    stage: null,
    lifecycleState: "active",
    classificationStatus: input.kind === "unclassified" ? "unclassified" : "classified",
    confirmationStatus: "confirmed",
    operatorPersonId: null,
    nextAction: null,
    domainAccent: input.domainAccent ?? null,
    archivedAt: null,
    version: 1,
    createdAt: now,
    createdBy: member.id,
    updatedAt: now,
    updatedBy: member.id,
  };
  await col().doc(id).set(entity);
  await grantEdit("entity", id, member.id); // toute création reçoit une règle d'accès explicite
  await recordChange({
    actorId: member.id,
    targetId: id,
    targetKind: "entity",
    action: "entity.created",
    summary: `Création de « ${entity.exactName} »`,
    effectiveAt: null,
    before: null,
    after: entity,
  });
  return entity;
}

export type EntityPatch = Partial<
  Pick<Entity, "exactName" | "description" | "stage" | "nextAction" | "kind" | "operatorPersonId" | "confirmationStatus">
>;

export async function updateEntity(
  id: string,
  patch: EntityPatch,
  expectedVersion: number,
  member: Member
): Promise<Entity> {
  if (!(await can(member, "entity", id, "edit"))) throw new ForbiddenError();
  const ref = col().doc(id);
  return adminDb().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) throw new ForbiddenError();
    const current = snap.data() as Entity;
    if (current.version !== expectedVersion) {
      throw new VersionConflictError(current);
    }
    const updated: Entity = {
      ...current,
      ...patch,
      exactName: patch.exactName?.trim() ?? current.exactName,
      version: current.version + 1,
      updatedAt: new Date().toISOString(),
      updatedBy: member.id,
    };
    tx.set(ref, updated);
    return updated;
  }).then(async (updated) => {
    // Le nom exact de l'ancien état est repris hors transaction pour le journal.
    await recordChange({
      actorId: member.id,
      targetId: id,
      targetKind: "entity",
      action: "entity.updated",
      summary: `Modification de « ${updated.exactName} »`,
      effectiveAt: null,
      before: { version: expectedVersion },
      after: updated,
    });
    return updated;
  });
}

export async function archiveEntity(id: string, expectedVersion: number, member: Member): Promise<Entity> {
  if (!(await can(member, "entity", id, "edit"))) throw new ForbiddenError();
  const ref = col().doc(id);
  const updated = await adminDb().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) throw new ForbiddenError();
    const current = snap.data() as Entity;
    if (current.version !== expectedVersion) throw new VersionConflictError(current);
    const next: Entity = {
      ...current,
      lifecycleState: "archived",
      archivedAt: new Date().toISOString(),
      version: current.version + 1,
      updatedAt: new Date().toISOString(),
      updatedBy: member.id,
    };
    tx.set(ref, next);
    return next;
  });
  await recordChange({
    actorId: member.id,
    targetId: id,
    targetKind: "entity",
    action: "entity.archived",
    summary: `Archivage de « ${updated.exactName} » — retiré de toutes les vues`,
    effectiveAt: null,
    before: { version: expectedVersion },
    after: updated,
  });
  return updated;
}

export async function unarchiveEntity(id: string, expectedVersion: number, member: Member): Promise<Entity> {
  if (!(await can(member, "entity", id, "edit"))) throw new ForbiddenError();
  const ref = col().doc(id);
  const updated = await adminDb().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) throw new ForbiddenError();
    const current = snap.data() as Entity;
    if (current.version !== expectedVersion) throw new VersionConflictError(current);
    const next: Entity = {
      ...current,
      lifecycleState: "active",
      archivedAt: null,
      version: current.version + 1,
      updatedAt: new Date().toISOString(),
      updatedBy: member.id,
    };
    tx.set(ref, next);
    return next;
  });
  await recordChange({
    actorId: member.id,
    targetId: id,
    targetKind: "entity",
    action: "entity.unarchived",
    summary: `« ${updated.exactName} » restauré`,
    effectiveAt: null,
    before: { version: expectedVersion },
    after: updated,
  });
  return updated;
}
