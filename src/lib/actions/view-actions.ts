"use server";

import { revalidatePath } from "next/cache";
import { requireMember } from "@/lib/auth/session";
import {
  addViewItem,
  removeViewItem,
  moveViewItem,
  createView,
  createViewFrame,
  updateViewFrame,
  removeViewFrame,
} from "@/lib/server/views";
import { listEntitiesForMember } from "@/lib/server/entities";
import { createRelationship, removeRelationship } from "@/lib/server/relationships";
import type { RelationshipType, View, ViewItem, ViewFrame, Relationship, EntityKind } from "@/lib/types";
import type { ActionResult } from "@/lib/actions/entity-actions";

async function authed() {
  const ctx = await requireMember();
  if (!ctx) throw new Error("UNAUTHENTICATED");
  return ctx.member;
}

export async function addExistingEntityToViewAction(
  viewId: string,
  entityId: string,
  position: { x: number; y: number }
): Promise<ActionResult<ViewItem>> {
  try {
    const member = await authed();
    const item = await addViewItem(viewId, entityId, position, member);
    revalidatePath("/carte");
    return { ok: true, data: item };
  } catch {
    return { ok: false, error: "UNKNOWN" };
  }
}

/** « Retirer de cette vue » — action distincte de l'archivage. */
export async function removeFromViewAction(viewId: string, itemId: string): Promise<ActionResult<null>> {
  try {
    await authed();
    await removeViewItem(viewId, itemId);
    revalidatePath("/carte");
    return { ok: true, data: null };
  } catch {
    return { ok: false, error: "UNKNOWN" };
  }
}

export async function moveViewItemAction(
  viewId: string,
  itemId: string,
  position: { x: number; y: number; width?: number; height?: number },
  expectedVersion: number
): Promise<ActionResult<ViewItem>> {
  try {
    const member = await authed();
    const item = await moveViewItem(viewId, itemId, position, expectedVersion, member);
    return { ok: true, data: item };
  } catch {
    return { ok: false, error: "CONFLICT" };
  }
}

/**
 * Crée une vue. Si `filterKinds` est fourni, l'amorce en une fois avec tous
 * les objets accessibles de ces types (disposition en grille simple) — un
 * instantané curé, pas une requête vivante : une donnée nouvelle n'apparaît
 * pas automatiquement (spec §7 : ne pas bouleverser la mémoire spatiale).
 */
export async function createViewAction(
  name: string,
  mode: View["mode"] = "real",
  filterKinds?: EntityKind[]
): Promise<ActionResult<View>> {
  try {
    const member = await authed();
    const view = await createView(name, member, mode);
    if (filterKinds && filterKinds.length > 0) {
      const entities = (await listEntitiesForMember(member)).filter(
        (e) => e.lifecycleState === "active" && filterKinds.includes(e.kind)
      );
      const perRow = Math.max(1, Math.ceil(Math.sqrt(entities.length)));
      await Promise.all(
        entities.map((entity, i) =>
          addViewItem(
            view.id,
            entity.id,
            { x: (i % perRow) * 260, y: Math.floor(i / perRow) * 160 },
            member
          )
        )
      );
    }
    revalidatePath("/carte");
    return { ok: true, data: view };
  } catch {
    return { ok: false, error: "UNKNOWN" };
  }
}

export async function createViewFrameAction(
  viewId: string,
  label: string,
  rect: { x: number; y: number; width: number; height: number }
): Promise<ActionResult<ViewFrame>> {
  try {
    const member = await authed();
    const frame = await createViewFrame(viewId, label, rect, member);
    revalidatePath("/carte");
    return { ok: true, data: frame };
  } catch {
    return { ok: false, error: "UNKNOWN" };
  }
}

export async function updateViewFrameAction(
  viewId: string,
  frameId: string,
  patch: Partial<Pick<ViewFrame, "label" | "x" | "y" | "width" | "height">>,
  expectedVersion: number
): Promise<ActionResult<ViewFrame>> {
  try {
    const member = await authed();
    const frame = await updateViewFrame(viewId, frameId, patch, expectedVersion, member);
    return { ok: true, data: frame };
  } catch {
    return { ok: false, error: "CONFLICT" };
  }
}

export async function removeViewFrameAction(viewId: string, frameId: string): Promise<ActionResult<null>> {
  try {
    await authed();
    await removeViewFrame(viewId, frameId);
    revalidatePath("/carte");
    return { ok: true, data: null };
  } catch {
    return { ok: false, error: "UNKNOWN" };
  }
}

export async function connectEntitiesAction(
  fromId: string,
  toId: string,
  type: RelationshipType,
  confirmationStatus: Relationship["confirmationStatus"]
): Promise<ActionResult<Relationship>> {
  try {
    const member = await authed();
    const relationship = await createRelationship(fromId, toId, type, confirmationStatus, member);
    revalidatePath("/carte");
    return { ok: true, data: relationship };
  } catch {
    return { ok: false, error: "UNKNOWN" };
  }
}

export async function removeRelationshipAction(id: string): Promise<ActionResult<null>> {
  try {
    const member = await authed();
    await removeRelationship(id, member);
    revalidatePath("/carte");
    return { ok: true, data: null };
  } catch {
    return { ok: false, error: "UNKNOWN" };
  }
}
