import { redirect } from "next/navigation";
import { listViews, createView } from "@/lib/server/views";
import { requireMember } from "@/lib/auth/session";

export default async function CartePage() {
  const views = await listViews();
  if (views.length > 0) {
    redirect(`/carte/${views[0]!.id}`);
  }
  const ctx = await requireMember();
  if (!ctx) redirect("/login");
  const view = await createView("Vue d'ensemble", ctx.member);
  redirect(`/carte/${view.id}`);
}
