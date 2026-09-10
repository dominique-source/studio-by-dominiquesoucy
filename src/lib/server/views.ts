import "server-only";
import { randomUUID } from "crypto";
import { adminDb } from "@/lib/firebase/admin";
import { WORKSPACE_ID } from "@/lib/workspace";
import type { View, ViewItem, ViewFrame, Member } from "@/lib/types";
import { can } from "@/lib/server/permissions";
import { ForbiddenError, VersionConflictError } from "@/lib/server/entities";

// Les vues sont des arrangements visuels partagés dans ce petit espace privé ;
// elles ne portent aucun droit. L'accès aux objets qu'elles référencent reste
// gouverné par les droits sur chaque entité (spec §7, §13).

function viewsCol() {
  return adminDb().collection("workspaces").doc(WORKSPACE_ID).collection("views");
}

function itemsCol(viewId: string) {
  return viewsCol().doc(viewId).collection("items");
}

function framesCol(viewId: string) {
  return viewsCol().doc(viewId).collection("frames");
}

export async function listViews(): Promise<View[]> {
  const snap = await viewsCol().orderBy("createdAt", "asc").get();
  return snap.docs.map((d) => d.data() as View);
}

export async function getView(viewId: string): Promise<View | null> {
  const snap = await viewsCol().doc(viewId).get();
  return snap.exists ? (snap.data() as View) : null;
}

export async function createView(name: string, member: Member, mode: View["mode"] = "real", rootId: string | null = null): Promise<View> {
  const id = randomUUID();
  const view: View = {
    id,
    workspaceId: WORKSPACE_ID,
    ownerId: member.id,
    name: name.trim(),
    rootId,
    mode,
    layoutVersion: 1,
    createdAt: new Date().toISOString(),
    createdBy: member.id,
  };
  await viewsCol().doc(id).set(view);
  return view;
}

/** Occurrences visibles : seules celles référençant un objet lisible par le
 * membre sont retournées — un déplacement ou un regroupement ne doit jamais
 * exposer un objet interdit (spec §7, critère d'acceptation « regroupement »). */
export async function listViewItems(viewId: string, member: Member): Promise<ViewItem[]> {
  const snap = await itemsCol(viewId).get();
  const items = snap.docs.map((d) => d.data() as ViewItem);
  const visible: ViewItem[] = [];
  for (const item of items) {
    if (await can(member, "entity", item.entityId, "read")) visible.push(item);
  }
  return visible;
}

export async function addViewItem(
  viewId: string,
  entityId: string,
  position: { x: number; y: number },
  member: Member
): Promise<ViewItem> {
  if (!(await can(member, "entity", entityId, "read"))) throw new ForbiddenError();
  const existing = await itemsCol(viewId).where("entityId", "==", entityId).limit(1).get();
  if (!existing.empty) return existing.docs[0]!.data() as ViewItem;
  const id = randomUUID();
  const item: ViewItem = {
    id,
    viewId,
    entityId,
    x: position.x,
    y: position.y,
    width: 220,
    height: 120,
    pinned: false,
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: member.id,
  };
  await itemsCol(viewId).doc(id).set(item);
  return item;
}

/** « Retirer de cette vue » — supprime uniquement l'occurrence. L'objet et
 * ses autres occurrences dans d'autres vues ne sont pas affectés. */
export async function removeViewItem(viewId: string, itemId: string): Promise<void> {
  await itemsCol(viewId).doc(itemId).delete();
}

export async function moveViewItem(
  viewId: string,
  itemId: string,
  position: { x: number; y: number; width?: number; height?: number },
  expectedVersion: number,
  member: Member
): Promise<ViewItem> {
  const ref = itemsCol(viewId).doc(itemId);
  return adminDb().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) throw new ForbiddenError();
    const current = snap.data() as ViewItem;
    if (current.version !== expectedVersion) {
      throw new VersionConflictError<ViewItem>(current);
    }
    const updated: ViewItem = {
      ...current,
      x: position.x,
      y: position.y,
      width: position.width ?? current.width,
      height: position.height ?? current.height,
      version: current.version + 1,
      updatedAt: new Date().toISOString(),
      updatedBy: member.id,
    };
    tx.set(ref, updated);
    return updated;
  });
}

// --- Cadres visuels (regroupements décoratifs, spec §7) ------------------
// Purement spatial : aucun droit, aucune donnée métier. Visible à tout membre
// pouvant voir la vue elle-même.

export async function listViewFrames(viewId: string): Promise<ViewFrame[]> {
  const snap = await framesCol(viewId).get();
  return snap.docs.map((d) => d.data() as ViewFrame);
}

export async function createViewFrame(
  viewId: string,
  label: string,
  rect: { x: number; y: number; width: number; height: number },
  member: Member
): Promise<ViewFrame> {
  const id = randomUUID();
  const frame: ViewFrame = {
    id,
    viewId,
    label: label.trim() || "Regroupement",
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: member.id,
  };
  await framesCol(viewId).doc(id).set(frame);
  return frame;
}

export async function updateViewFrame(
  viewId: string,
  frameId: string,
  patch: Partial<Pick<ViewFrame, "label" | "x" | "y" | "width" | "height">>,
  expectedVersion: number,
  member: Member
): Promise<ViewFrame> {
  const ref = framesCol(viewId).doc(frameId);
  return adminDb().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) throw new ForbiddenError();
    const current = snap.data() as ViewFrame;
    if (current.version !== expectedVersion) throw new VersionConflictError<ViewFrame>(current);
    const updated: ViewFrame = {
      ...current,
      ...patch,
      label: patch.label?.trim() || current.label,
      version: current.version + 1,
      updatedAt: new Date().toISOString(),
      updatedBy: member.id,
    };
    tx.set(ref, updated);
    return updated;
  });
}

export async function removeViewFrame(viewId: string, frameId: string): Promise<void> {
  await framesCol(viewId).doc(frameId).delete();
}
