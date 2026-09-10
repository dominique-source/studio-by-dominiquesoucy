import { requireMember } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { listEntitiesForMember } from "@/lib/server/entities";
import { EntityListRow } from "@/components/lists/EntityListRow";

export default async function PersonnesPage() {
  const ctx = await requireMember();
  if (!ctx) redirect("/login");
  const entities = await listEntitiesForMember(ctx.member);
  const people = entities.filter((e) => e.kind === "person");

  return (
    <div className="h-full overflow-y-auto px-8 py-6">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--color-text-3)" }}>
        Studio
      </p>
      <h1 className="font-display mb-6 text-4xl font-black tracking-tight">Personnes</h1>
      <div className="max-w-2xl space-y-2">
        {people.map((p) => (
          <EntityListRow key={p.id} entity={p} />
        ))}
        {people.length === 0 && <p style={{ color: "var(--color-text-3)" }}>Aucune personne pour le moment.</p>}
      </div>
    </div>
  );
}
