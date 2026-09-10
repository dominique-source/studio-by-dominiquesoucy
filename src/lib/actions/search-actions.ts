"use server";

import { requireMember } from "@/lib/auth/session";
import { listEntitiesForMember } from "@/lib/server/entities";
import type { Entity } from "@/lib/types";

/** Recherche V1 : nom + texte intégral simple, sur les seuls objets autorisés
 * (listEntitiesForMember filtre déjà par droits — spec §8, §13). */
export async function searchEntitiesAction(query: string): Promise<Entity[]> {
  const ctx = await requireMember();
  if (!ctx) return [];
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const all = await listEntitiesForMember(ctx.member);
  return all
    .filter((e) => e.lifecycleState === "active")
    .filter((e) => e.exactName.toLowerCase().includes(q) || (e.description ?? "").toLowerCase().includes(q))
    .slice(0, 20);
}
