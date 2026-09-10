"use client";

import { useRouter } from "next/navigation";
import { useSelection } from "@/components/shell/selection-context";
import type { Task } from "@/lib/types";
import type { ActionResult } from "@/lib/actions/entity-actions";

export function TaskRow({
  task,
  entityName,
  updateStatus,
}: {
  task: Task;
  entityName: string;
  updateStatus: (id: string, status: Task["status"], expectedVersion: number) => Promise<ActionResult<Task>>;
}) {
  const router = useRouter();
  const { select } = useSelection();
  return (
    <div className="flex items-center gap-3 rounded border px-4 py-2.5" style={{ borderColor: "var(--color-surface-border)", background: "var(--color-surface)" }}>
      <input
        type="checkbox"
        checked={task.status === "done"}
        onChange={() => updateStatus(task.id, "done", task.version).then(() => router.refresh())}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm">{task.title}</p>
        <button onClick={() => select(task.entityId)} className="text-xs underline" style={{ color: "var(--color-text-3)" }}>
          {entityName}
        </button>
      </div>
      {task.dueDate && (
        <span className="shrink-0 text-xs" style={{ color: "var(--color-text-3)" }}>
          {task.dueDate}
        </span>
      )}
    </div>
  );
}
