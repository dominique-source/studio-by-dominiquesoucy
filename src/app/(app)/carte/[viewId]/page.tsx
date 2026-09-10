import { notFound } from "next/navigation";
import { getView, listViewItems, listViewFrames } from "@/lib/server/views";
import { getEntity } from "@/lib/server/entities";
import { listRelationshipsForEntities } from "@/lib/server/relationships";
import { requireMember } from "@/lib/auth/session";
import { MapCanvas } from "@/components/canvas/MapCanvas";
import { AddExistingToView } from "@/components/canvas/AddExistingToView";

export default async function CarteViewPage({ params }: { params: Promise<{ viewId: string }> }) {
  const { viewId } = await params;
  const ctx = await requireMember();
  if (!ctx) notFound();

  const view = await getView(viewId);
  if (!view) notFound();

  const items = await listViewItems(viewId, ctx.member);
  const entities = (
    await Promise.all(items.map((item) => getEntity(item.entityId, ctx.member)))
  ).filter((e) => e !== null);
  const relationships = await listRelationshipsForEntities(entities.map((e) => e.id), ctx.member);
  const frames = await listViewFrames(viewId);

  return (
    <div className="relative h-full w-full">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-wrap items-start justify-between gap-3 p-4 sm:p-5">
        <div className="pointer-events-auto min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--color-text-3)" }}>
            Carte du Studio
          </p>
          <h1 className="font-display truncate text-2xl font-black tracking-tight sm:text-4xl">{view.name}</h1>
        </div>
        <div className="pointer-events-auto shrink-0">
          <AddExistingToView viewId={view.id} />
        </div>
      </div>
      <MapCanvas view={view} items={items} entities={entities} relationships={relationships} frames={frames} />
    </div>
  );
}
