import "server-only";
import { randomUUID } from "crypto";
import { adminDb } from "@/lib/firebase/admin";
import { WORKSPACE_ID } from "@/lib/workspace";
import type { ChangeEvent, Member } from "@/lib/types";
import { grantedResourceIds } from "@/lib/server/permissions";

function col() {
  return adminDb().collection("workspaces").doc(WORKSPACE_ID).collection("changeEvents");
}

export async function recordChange(event: Omit<ChangeEvent, "id" | "workspaceId" | "recordedAt">) {
  const id = randomUUID();
  const doc: ChangeEvent = {
    ...event,
    id,
    workspaceId: WORKSPACE_ID,
    recordedAt: new Date().toISOString(),
  };
  await col().doc(id).set(doc);
  return doc;
}

/**
 * Liste filtrée par droits de lecture sur l'objet concerné — un journal ne
 * doit jamais révéler un changement sur un objet interdit (spec §12, §13).
 */
export async function listChangesForMember(member: Member, sinceIso: string, limit = 100): Promise<ChangeEvent[]> {
  const snap = await col()
    .where("recordedAt", ">=", sinceIso)
    .orderBy("recordedAt", "desc")
    .limit(500)
    .get();
  const allowedEntities = await grantedResourceIds(member, "entity");
  const events = snap.docs.map((d) => d.data() as ChangeEvent);
  const visible = events.filter((event) => {
    if (allowedEntities === "all") return true;
    if (event.targetKind !== "entity") return false;
    return allowedEntities.has(event.targetId);
  });
  return visible.slice(0, limit);
}
