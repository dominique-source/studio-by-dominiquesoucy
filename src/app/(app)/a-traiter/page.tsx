import { redirect } from "next/navigation";
import { requireMember } from "@/lib/auth/session";
import { listOpenTasksForMember } from "@/lib/server/tasks";
import { getEntity } from "@/lib/server/entities";
import { updateTaskStatusAction } from "@/lib/actions/task-decision-actions";
import { TaskRow } from "@/components/lists/TaskRow";

export default async function ATraiterPage() {
  const ctx = await requireMember();
  if (!ctx) redirect("/login");
  const tasks = await listOpenTasksForMember(ctx.member);

  return (
    <div className="h-full overflow-y-auto px-8 py-6">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--color-text-3)" }}>
        Studio
      </p>
      <h1 className="font-display mb-1 text-4xl font-black tracking-tight">À traiter</h1>
      <p className="mb-6 max-w-xl text-sm" style={{ color: "var(--color-text-3)" }}>
        Tâches ouvertes. Les propositions issues d&apos;une capture vocale/texte arrivent à
        l&apos;étape 3 — aucune n&apos;est simulée ici.
      </p>
      <div className="max-w-2xl space-y-2">
        {await Promise.all(
          tasks.map(async (task) => {
            const entity = await getEntity(task.entityId, ctx.member);
            return <TaskRow key={task.id} task={task} entityName={entity?.exactName ?? "—"} updateStatus={updateTaskStatusAction} />;
          })
        )}
        {tasks.length === 0 && <p style={{ color: "var(--color-text-3)" }}>Rien à traiter pour le moment.</p>}
      </div>
    </div>
  );
}
