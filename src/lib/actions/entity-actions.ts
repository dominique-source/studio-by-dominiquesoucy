"use server";

import { revalidatePath } from "next/cache";
import { requireMember } from "@/lib/auth/session";
import {
  createEntity,
  updateEntity,
  archiveEntity,
  unarchiveEntity,
  VersionConflictError,
  ForbiddenError,
  type CreateEntityInput,
  type EntityPatch,
} from "@/lib/server/entities";
import { addViewItem } from "@/lib/server/views";
import type { Entity } from "@/lib/types";

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; conflict?: Entity };

async function authed() {
  const ctx = await requireMember();
  if (!ctx) throw new Error("UNAUTHENTICATED");
  return ctx.member;
}

export async function createEntityAction(
  input: CreateEntityInput,
  addToViewId?: string,
  position?: { x: number; y: number }
): Promise<ActionResult<Entity>> {
  try {
    const member = await authed();
    const entity = await createEntity(input, member);
    if (addToViewId) {
      await addViewItem(addToViewId, entity.id, position ?? { x: 120, y: 120 }, member);
    }
    revalidatePath("/carte");
    return { ok: true, data: entity };
  } catch (error) {
    return { ok: false, error: messageFor(error) };
  }
}

export async function updateEntityAction(
  id: string,
  patch: EntityPatch,
  expectedVersion: number
): Promise<ActionResult<Entity>> {
  try {
    const member = await authed();
    const updated = await updateEntity(id, patch, expectedVersion, member);
    revalidatePath("/carte");
    revalidatePath("/personnes");
    return { ok: true, data: updated };
  } catch (error) {
    if (error instanceof VersionConflictError) {
      return { ok: false, error: "CONFLICT", conflict: error.current as Entity };
    }
    return { ok: false, error: messageFor(error) };
  }
}

export async function archiveEntityAction(id: string, expectedVersion: number): Promise<ActionResult<Entity>> {
  try {
    const member = await authed();
    const updated = await archiveEntity(id, expectedVersion, member);
    revalidatePath("/carte");
    return { ok: true, data: updated };
  } catch (error) {
    if (error instanceof VersionConflictError) {
      return { ok: false, error: "CONFLICT", conflict: error.current as Entity };
    }
    return { ok: false, error: messageFor(error) };
  }
}

export async function unarchiveEntityAction(id: string, expectedVersion: number): Promise<ActionResult<Entity>> {
  try {
    const member = await authed();
    const updated = await unarchiveEntity(id, expectedVersion, member);
    revalidatePath("/carte");
    return { ok: true, data: updated };
  } catch (error) {
    return { ok: false, error: messageFor(error) };
  }
}

function messageFor(error: unknown): string {
  if (error instanceof ForbiddenError) return "FORBIDDEN";
  if (error instanceof Error && error.message === "UNAUTHENTICATED") return "UNAUTHENTICATED";
  return "UNKNOWN";
}
