import { redirect } from "next/navigation";
import { requireMember } from "@/lib/auth/session";

export default async function RootPage() {
  const ctx = await requireMember();
  redirect(ctx ? "/carte" : "/login");
}
