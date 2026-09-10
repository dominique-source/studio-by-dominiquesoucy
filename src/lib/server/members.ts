import "server-only";
import { adminDb } from "@/lib/firebase/admin";
import { WORKSPACE_ID } from "@/lib/workspace";
import type { Member } from "@/lib/types";

function col() {
  return adminDb().collection("workspaces").doc(WORKSPACE_ID).collection("members");
}

export async function listActiveMembers(): Promise<Member[]> {
  const snap = await col().where("status", "==", "active").get();
  return snap.docs.map((d) => d.data() as Member);
}
