"use server";

import { revalidatePath } from "next/cache";
import { requireMember } from "@/lib/auth/session";
import { addViewItem, removeViewItem, moveViewItem, createView } from "@/lib/server/views";
import { createRelationship, removeRelationship } from "@/lib/server/relationships";
import type { RelationshipType, View, ViewItem, Relationship } from "@/lib/types";
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

export async function createViewAction(name: string, mode: View["mode"] = "real"): Promise<ActionResult<View>> {
  try {
    const member = await authed();
    const view = await createView(name, member, mode);
    revalidatePath("/carte");
    return { ok: true, data: view };
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
