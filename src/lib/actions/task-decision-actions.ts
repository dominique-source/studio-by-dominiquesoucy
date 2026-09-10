"use server";

import { revalidatePath } from "next/cache";
import { requireMember } from "@/lib/auth/session";
import { createTask, updateTaskStatus } from "@/lib/server/tasks";
import { adoptDecision } from "@/lib/server/decisions";
import type { Task } from "@/lib/types";
import type { ActionResult } from "@/lib/actions/entity-actions";

async function authed() {
  const ctx = await requireMember();
  if (!ctx) throw new Error("UNAUTHENTICATED");
  return ctx.member;
}

export async function createTaskAction(entityId: string, title: string, dueDate?: string | null): Promise<ActionResult<Task>> {
  try {
    const member = await authed();
    const task = await createTask(entityId, title, member, { dueDate: dueDate ?? null });
    revalidatePath("/carte");
    return { ok: true, data: task };
  } catch {
    return { ok: false, error: "UNKNOWN" };
  }
}

export async function updateTaskStatusAction(id: string, status: Task["status"], expectedVersion: number): Promise<ActionResult<Task>> {
  try {
    const member = await authed();
    const task = await updateTaskStatus(id, status, expectedVersion, member);
    revalidatePath("/carte");
    return { ok: true, data: task };
  } catch {
    return { ok: false, error: "UNKNOWN" };
  }
}

export async function adoptDecisionAction(
  entityId: string,
  question: string,
  choice: string,
  rationale: string | null
): Promise<ActionResult<null>> {
  try {
    const member = await authed();
    await adoptDecision(entityId, { question, choice, rationale, participantPersonIds: [] }, member);
    revalidatePath("/carte");
    revalidatePath("/decisions");
    return { ok: true, data: null };
  } catch {
    return { ok: false, error: "UNKNOWN" };
  }
}
