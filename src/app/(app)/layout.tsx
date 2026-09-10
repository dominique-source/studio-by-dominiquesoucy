import { redirect } from "next/navigation";
import { requireMember } from "@/lib/auth/session";
import { listViews } from "@/lib/server/views";
import { AppShellClient } from "@/components/shell/AppShellClient";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const ctx = await requireMember();
  if (!ctx) {
    redirect("/login");
  }
  const views = await listViews();

  return (
    <AppShellClient
      member={{ displayName: ctx.member.displayName, email: ctx.member.email, isAdmin: ctx.member.isAdmin }}
      views={views.map((v) => ({ id: v.id, name: v.name }))}
    >
      {children}
    </AppShellClient>
  );
}
