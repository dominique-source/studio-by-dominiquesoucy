import "server-only";
import { adminDb } from "@/lib/firebase/admin";
import { WORKSPACE_ID } from "@/lib/workspace";
import type { Member, ObjectGrant } from "@/lib/types";

export type Permission = "read" | "edit";

function grantsCollection() {
  return adminDb().collection("workspaces").doc(WORKSPACE_ID).collection("objectGrants");
}

/**
 * Admin voit tout. Sinon, un droit explicite (édition implique lecture) est
 * requis sur la ressource précise — aucun héritage depuis la carte ou une
 * hiérarchie (spec §13).
 */
// Une seule égalité par requête (memberId) : le filtrage par ressource se
// fait ensuite en mémoire, pour ne dépendre d'aucun index composite Firestore
// à déployer séparément — l'échelle d'un petit espace privé le permet.
export async function can(
  member: Member,
  resourceType: ObjectGrant["resourceType"],
  resourceId: string,
  need: Permission
): Promise<boolean> {
  if (member.isAdmin) return true;
  const snap = await grantsCollection().where("memberId", "==", member.id).get();
  return snap.docs.some((doc) => {
    const grant = doc.data() as ObjectGrant;
    if (grant.resourceType !== resourceType || grant.resourceId !== resourceId) return false;
    return grant.permission === need || grant.permission === "edit";
  });
}

export async function grantedResourceIds(
  member: Member,
  resourceType: ObjectGrant["resourceType"]
): Promise<Set<string> | "all"> {
  if (member.isAdmin) return "all";
  const snap = await grantsCollection().where("memberId", "==", member.id).get();
  return new Set(
    snap.docs
      .map((doc) => doc.data() as ObjectGrant)
      .filter((grant) => grant.resourceType === resourceType)
      .map((grant) => grant.resourceId)
  );
}

export async function grantEdit(resourceType: ObjectGrant["resourceType"], resourceId: string, memberId: string) {
  const id = `${resourceType}_${resourceId}_${memberId}`;
  await grantsCollection().doc(id).set({
    id,
    workspaceId: WORKSPACE_ID,
    resourceType,
    resourceId,
    memberId,
    permission: "edit",
  } satisfies ObjectGrant);
}
