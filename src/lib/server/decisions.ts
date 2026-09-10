import "server-only";
import { randomUUID } from "crypto";
import { adminDb } from "@/lib/firebase/admin";
import { WORKSPACE_ID } from "@/lib/workspace";
import type { Decision, DecisionRevision, Member } from "@/lib/types";
import { can } from "@/lib/server/permissions";
import { recordChange } from "@/lib/server/change-events";
import { ForbiddenError } from "@/lib/server/entities";

function decisionsCol() {
  return adminDb().collection("workspaces").doc(WORKSPACE_ID).collection("decisions");
}
function revisionsCol(decisionId: string) {
  return decisionsCol().doc(decisionId).collection("revisions");
}

export interface DecisionWithRevision {
  decision: Decision;
  revision: DecisionRevision | null;
}

export async function listAllDecisionsForMember(member: Member): Promise<(DecisionWithRevision & { entityId: string })[]> {
  const snap = await decisionsCol().orderBy("createdAt", "desc").get();
  const decisions = snap.docs.map((d) => d.data() as Decision);
  const results: (DecisionWithRevision & { entityId: string })[] = [];
  for (const decision of decisions) {
    if (!(await can(member, "entity", decision.entityId, "read"))) continue;
    const revSnap = decision.currentRevisionId
      ? await revisionsCol(decision.id).doc(decision.currentRevisionId).get()
      : null;
    results.push({
      decision,
      entityId: decision.entityId,
      revision: revSnap?.exists ? (revSnap.data() as DecisionRevision) : null,
    });
  }
  return results;
}

export async function listDecisionsForEntity(entityId: string, member: Member): Promise<DecisionWithRevision[]> {
  if (!(await can(member, "entity", entityId, "read"))) return [];
  const snap = await decisionsCol().where("entityId", "==", entityId).get();
  const decisions = snap.docs.map((d) => d.data() as Decision).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return Promise.all(
    decisions.map(async (decision) => {
      if (!decision.currentRevisionId) return { decision, revision: null };
      const revSnap = await revisionsCol(decision.id).doc(decision.currentRevisionId).get();
      return { decision, revision: revSnap.exists ? (revSnap.data() as DecisionRevision) : null };
    })
  );
}

/**
 * Adopte une décision (nouvelle décision + révision immuable). Le
 * raisonnement reste `null` s'il n'est pas fourni — jamais inventé (spec §11).
 */
export async function adoptDecision(
  entityId: string,
  input: { question: string; choice: string; rationale: string | null; participantPersonIds: string[] },
  member: Member
): Promise<DecisionWithRevision> {
  if (!(await can(member, "entity", entityId, "edit"))) throw new ForbiddenError();
  const decisionId = randomUUID();
  const revisionId = randomUUID();
  const now = new Date().toISOString();
  const decision: Decision = {
    id: decisionId,
    workspaceId: WORKSPACE_ID,
    entityId,
    status: "adopted",
    currentRevisionId: revisionId,
    version: 1,
    createdAt: now,
    createdBy: member.id,
  };
  const revision: DecisionRevision = {
    id: revisionId,
    decisionId,
    question: input.question.trim(),
    choice: input.choice.trim(),
    rationale: input.rationale?.trim() || null,
    effectiveAt: now,
    supersedesId: null,
    participantPersonIds: input.participantPersonIds,
    createdAt: now,
    createdBy: member.id,
  };
  await decisionsCol().doc(decisionId).set(decision);
  await revisionsCol(decisionId).doc(revisionId).set(revision);
  await recordChange({
    actorId: member.id,
    targetId: decisionId,
    targetKind: "decision",
    action: "decision.adopted",
    summary: `Décision adoptée : « ${revision.question} »`,
    effectiveAt: null,
    before: null,
    after: { decision, revision },
  });
  return { decision, revision };
}
