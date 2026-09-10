import "server-only";
import { randomUUID } from "crypto";
import { adminDb } from "@/lib/firebase/admin";
import { WORKSPACE_ID } from "@/lib/workspace";
import type { Task, Member } from "@/lib/types";
import { can } from "@/lib/server/permissions";
import { recordChange } from "@/lib/server/change-events";
import { ForbiddenError, VersionConflictError } from "@/lib/server/entities";

function col() {
  return adminDb().collection("workspaces").doc(WORKSPACE_ID).collection("tasks");
}

/** Points ouverts : tâches non terminées en retard sur leur échéance — une
 * règle déterministe, jamais une priorité opaque (spec §6, §12). */
export async function listOverdueTasksForMember(member: Member): Promise<Task[]> {
  const todayIso = new Date().toISOString().slice(0, 10);
  const snap = await col().get();
  const tasks = snap.docs
    .map((d) => d.data() as Task)
    .filter((t) => (t.status === "open" || t.status === "doing") && t.dueDate && t.dueDate < todayIso);
  const visible: Task[] = [];
  for (const task of tasks) {
    if (await can(member, "entity", task.entityId, "read")) visible.push(task);
  }
  return visible;
}

export async function listOpenTasksForMember(member: Member): Promise<Task[]> {
  const snap = await col().get();
  const tasks = snap.docs
    .map((d) => d.data() as Task)
    .filter((t) => t.status === "open" || t.status === "doing")
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const visible: Task[] = [];
  for (const task of tasks) {
    if (await can(member, "entity", task.entityId, "read")) visible.push(task);
  }
  return visible;
}

export async function listTasksForEntity(entityId: string, member: Member): Promise<Task[]> {
  if (!(await can(member, "entity", entityId, "read"))) return [];
  const snap = await col().where("entityId", "==", entityId).get();
  return snap.docs.map((d) => d.data() as Task).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function createTask(
  entityId: string,
  title: string,
  member: Member,
  options: { dueDate?: string | null; assigneePersonId?: string | null } = {}
): Promise<Task> {
  if (!(await can(member, "entity", entityId, "edit"))) throw new ForbiddenError();
  const id = randomUUID();
  const now = new Date().toISOString();
  const task: Task = {
    id,
    workspaceId: WORKSPACE_ID,
    entityId,
    title: title.trim(),
    assigneePersonId: options.assigneePersonId ?? null,
    status: "open",
    dueDate: options.dueDate ?? null,
    priority: null,
    version: 1,
    createdAt: now,
    createdBy: member.id,
    updatedAt: now,
    updatedBy: member.id,
  };
  await col().doc(id).set(task);
  await recordChange({
    actorId: member.id,
    targetId: id,
    targetKind: "task",
    action: "task.created",
    summary: `Tâche créée : « ${task.title} »`,
    effectiveAt: null,
    before: null,
    after: task,
  });
  return task;
}

export async function updateTaskStatus(
  id: string,
  status: Task["status"],
  expectedVersion: number,
  member: Member
): Promise<Task> {
  const ref = col().doc(id);
  const updated = await adminDb().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) throw new ForbiddenError();
    const current = snap.data() as Task;
    if (!(await can(member, "entity", current.entityId, "edit"))) throw new ForbiddenError();
    if (current.version !== expectedVersion) throw new VersionConflictError<Task>(current);
    const next: Task = { ...current, status, version: current.version + 1, updatedAt: new Date().toISOString(), updatedBy: member.id };
    tx.set(ref, next);
    return next;
  });
  await recordChange({
    actorId: member.id,
    targetId: id,
    targetKind: "task",
    action: "task.updated",
    summary: `Tâche « ${updated.title} » → ${status}`,
    effectiveAt: null,
    before: { version: expectedVersion },
    after: updated,
  });
  return updated;
}
