"use client";

import { useEffect, useState, useCallback, useId, cloneElement } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useSelection, type ViewItemRef } from "@/components/shell/selection-context";
import { getEntityDetailAction, type EntityDetail } from "@/lib/actions/detail-actions";
import { updateEntityAction, archiveEntityAction, unarchiveEntityAction } from "@/lib/actions/entity-actions";
import { removeFromViewAction, connectEntitiesAction, removeRelationshipAction } from "@/lib/actions/view-actions";
import { createTaskAction, updateTaskStatusAction, adoptDecisionAction } from "@/lib/actions/task-decision-actions";
import { searchEntitiesAction } from "@/lib/actions/search-actions";
import {
  ENTITY_KIND_LABELS,
  RELATIONSHIP_LABELS,
  type EntityKind,
  type RelationshipType,
  type Entity,
} from "@/lib/types";
import { DomainBadge } from "@/components/canvas/domain-colors";

type Tab = "apercu" | "relations" | "historique";

export function FichePanel() {
  const { selectedEntityId, select, selectedViewItem } = useSelection();
  if (!selectedEntityId) return null;
  return (
    // La clé force un nouveau montage par objet sélectionné : l'onglet et le
    // formulaire repartent naturellement à leur état initial, sans effet de
    // réinitialisation (voir react.dev/learn/you-might-not-need-an-effect).
    <FicheBody key={selectedEntityId} entityId={selectedEntityId} viewItem={selectedViewItem} onClose={() => select(null)} />
  );
}

function FicheBody({ entityId, viewItem, onClose }: { entityId: string; viewItem: ViewItemRef | null; onClose: () => void }) {
  const [detail, setDetail] = useState<EntityDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<Tab>("apercu");
  const [conflict, setConflict] = useState(false);

  const reload = useCallback(() => {
    setLoading(true);
    getEntityDetailAction(entityId).then((d) => {
      setDetail(d);
      setLoading(false);
      setConflict(false);
    });
  }, [entityId]);

  useEffect(() => {
    // Chargement au montage (et à chaque nouvel objet, via la clé posée par
    // FichePanel) — le cas d'usage documenté de useEffect pour synchroniser
    // avec une source de données externe.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    reload();
  }, [reload]);

  return (
    <aside
      className="fixed inset-0 z-40 flex flex-col overflow-y-auto border-l md:static md:inset-auto md:z-auto md:h-full md:w-[380px] md:shrink-0"
      style={{ borderColor: "var(--color-surface-border)", background: "var(--color-surface)" }}
    >
      <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: "var(--color-surface-border)" }}>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--color-text-3)" }}>
          Fiche du domaine
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer la fiche"
          className="rounded p-1 text-lg leading-none hover:bg-[var(--color-surface-2)]"
        >
          ×
        </button>
      </div>

      {loading && !detail && <p className="px-4 py-6 text-sm text-[var(--color-text-3)]">Chargement…</p>}
      {!loading && !detail && (
        <p className="px-4 py-6 text-sm text-[var(--color-text-3)]">
          Accès refusé ou objet introuvable.
        </p>
      )}

      {detail && (
        <>
          <div className="px-5 pt-4">
            {detail.entity.domainAccent && <DomainBadge accent={detail.entity.domainAccent} label={ENTITY_KIND_LABELS[detail.entity.kind]} />}
            <h1 className="font-display mt-2 text-3xl font-bold leading-tight">{detail.entity.exactName}</h1>
            {detail.entity.lifecycleState === "archived" && (
              <p className="mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium" style={{ background: "var(--color-surface-2)", color: "var(--color-text-2)" }}>
                Archivé
              </p>
            )}
          </div>

          <div className="mt-4 flex gap-1 border-b px-5" style={{ borderColor: "var(--color-surface-border)" }}>
            {(["apercu", "relations", "historique"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="border-b-2 px-3 py-2 text-sm font-medium capitalize transition-colors"
                style={
                  tab === t
                    ? { borderColor: "var(--color-accent-green)", color: "var(--color-text)" }
                    : { borderColor: "transparent", color: "var(--color-text-3)" }
                }
              >
                {t === "apercu" ? "Aperçu" : t === "relations" ? "Relations" : "Historique"}
              </button>
            ))}
          </div>

          {conflict && (
            <div className="mx-5 mt-3 rounded border px-3 py-2 text-xs" style={{ borderColor: "var(--color-warn)", background: "#fbf4e2" }}>
              Cet objet a été modifié entretemps.{" "}
              <button className="underline" onClick={reload}>
                Recharger la version actuelle
              </button>
            </div>
          )}

          <div className="flex-1 px-5 py-4">
            {tab === "apercu" && (
              <ApercuTab
                key={`${detail.entity.id}-${detail.entity.version}`}
                detail={detail}
                onSaved={reload}
                onConflict={() => setConflict(true)}
                viewItem={viewItem}
                onClose={onClose}
              />
            )}
            {tab === "relations" && <RelationsTab detail={detail} onChanged={reload} />}
            {tab === "historique" && <HistoriqueTab detail={detail} />}
          </div>
        </>
      )}
    </aside>
  );
}

function Field({ label, children }: { label: string; children: React.ReactElement<{ id?: string }> }) {
  const id = useId();
  return (
    <div className="mb-3">
      <label htmlFor={id} className="mb-1 block text-xs font-medium uppercase tracking-wide" style={{ color: "var(--color-text-3)" }}>
        {label}
      </label>
      {cloneElement(children, { id })}
    </div>
  );
}

const inputClass =
  "w-full rounded border bg-white px-2.5 py-1.5 text-sm outline-none focus-visible:border-[var(--color-accent-green)]";

function ApercuTab({
  detail,
  onSaved,
  onConflict,
  viewItem,
  onClose,
}: {
  detail: EntityDetail;
  onSaved: () => void;
  onConflict: () => void;
  viewItem: { viewId: string; itemId: string } | null;
  onClose: () => void;
}) {
  const { entity, tasks, decisions } = detail;
  // Initialisé une fois par montage : la clé posée par FicheBody (id+version)
  // force un remontage — donc une réinitialisation propre — à chaque
  // rechargement, sans effet de synchronisation.
  const [name, setName] = useState(entity.exactName);
  const [kind, setKind] = useState<EntityKind>(entity.kind);
  const [stage, setStage] = useState(entity.stage ?? "");
  const [nextAction, setNextAction] = useState(entity.nextAction ?? "");
  const [description, setDescription] = useState(entity.description ?? "");
  const [saving, setSaving] = useState(false);
  const [confirmArchive, setConfirmArchive] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");

  const dirty =
    name !== entity.exactName ||
    kind !== entity.kind ||
    stage !== (entity.stage ?? "") ||
    nextAction !== (entity.nextAction ?? "") ||
    description !== (entity.description ?? "");

  async function save() {
    setSaving(true);
    const result = await updateEntityAction(
      entity.id,
      { exactName: name, kind, stage: stage || null, nextAction: nextAction || null, description: description || null },
      entity.version
    );
    setSaving(false);
    if (!result.ok && result.error === "CONFLICT") {
      onConflict();
      return;
    }
    onSaved();
  }

  return (
    <div>
      <Field label="Type">
        <select value={kind} onChange={(e) => setKind(e.target.value as EntityKind)} className={inputClass}>
          {Object.entries(ENTITY_KIND_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Nom exact">
        <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
      </Field>
      <Field label="Stade">
        <input value={stage} onChange={(e) => setStage(e.target.value)} placeholder="À définir" className={inputClass} />
      </Field>
      <Field label="Responsable confirmé">
        <p className="text-sm" style={{ color: "var(--color-text-3)" }}>
          {entity.operatorPersonId ? entity.operatorPersonId : "À définir"}
        </p>
      </Field>
      <Field label="Prochaine action">
        <input value={nextAction} onChange={(e) => setNextAction(e.target.value)} placeholder="À définir" className={inputClass} />
      </Field>
      <Field label="Description">
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={inputClass} />
      </Field>

      {dirty && (
        <button
          onClick={save}
          disabled={saving}
          className="mb-4 w-full rounded bg-[var(--color-ink)] px-3 py-2 text-sm font-semibold text-[var(--color-cream)] disabled:opacity-50"
        >
          {saving ? "Enregistrement…" : "Enregistrer"}
        </button>
      )}

      <section className="mt-5 border-t pt-4" style={{ borderColor: "var(--color-surface-border)" }}>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-3)" }}>
          Tâches
        </p>
        <ul className="mb-2 space-y-1">
          {tasks.map((task) => (
            <li key={task.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={task.status === "done"}
                onChange={() => updateTaskStatusAction(task.id, task.status === "done" ? "open" : "done", task.version).then(onSaved)}
              />
              <span className={task.status === "done" ? "line-through opacity-60" : ""}>{task.title}</span>
            </li>
          ))}
          {tasks.length === 0 && <li className="text-sm" style={{ color: "var(--color-text-3)" }}>Aucune tâche</li>}
        </ul>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!taskTitle.trim()) return;
            createTaskAction(entity.id, taskTitle).then(() => {
              setTaskTitle("");
              onSaved();
            });
          }}
          className="flex gap-2"
        >
          <input
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="Nouvelle tâche…"
            className={inputClass}
          />
          <button type="submit" className="shrink-0 rounded border px-2 text-sm" style={{ borderColor: "var(--color-surface-border)" }}>
            +
          </button>
        </form>
      </section>

      <section className="mt-5 border-t pt-4" style={{ borderColor: "var(--color-surface-border)" }}>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-3)" }}>
          Décisions
        </p>
        <ul className="space-y-2">
          {decisions.map(({ decision, revision }) => (
            <li key={decision.id} className="rounded border px-2.5 py-2 text-sm" style={{ borderColor: "var(--color-surface-border)" }}>
              <p className="font-medium">{revision?.question ?? "—"}</p>
              <p style={{ color: "var(--color-text-2)" }}>{revision?.choice}</p>
              <p className="mt-1 text-xs italic" style={{ color: "var(--color-text-3)" }}>
                {revision?.rationale ?? "Le raisonnement n'a pas été consigné."}
              </p>
            </li>
          ))}
          {decisions.length === 0 && <li className="text-sm" style={{ color: "var(--color-text-3)" }}>Aucune décision</li>}
        </ul>
        <DecisionForm entityId={entity.id} onCreated={onSaved} />
      </section>

      <section className="mt-6 border-t pt-4" style={{ borderColor: "var(--color-surface-border)" }}>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-3)" }}>
          Documents
        </p>
        <p className="text-sm" style={{ color: "var(--color-text-3)" }}>
          À venir (étape 3 — capture et sources).
        </p>
      </section>

      <section className="mt-6 flex flex-col gap-2 border-t pt-4" style={{ borderColor: "var(--color-surface-border)" }}>
        {viewItem && (
          <button
            onClick={() => removeFromViewAction(viewItem.viewId, viewItem.itemId).then(onClose)}
            className="rounded border px-3 py-2 text-left text-sm"
            style={{ borderColor: "var(--color-surface-border)", color: "var(--color-text-2)" }}
          >
            Retirer de cette vue
          </button>
        )}
        {entity.lifecycleState === "active" ? (
          confirmArchive ? (
            <div className="flex gap-2">
              <button
                onClick={() => archiveEntityAction(entity.id, entity.version).then(onSaved)}
                className="flex-1 rounded px-3 py-2 text-sm font-semibold text-white"
                style={{ background: "var(--color-danger)" }}
                autoFocus
              >
                Confirmer l&apos;archivage
              </button>
              <button onClick={() => setConfirmArchive(false)} className="rounded border px-3 py-2 text-sm" style={{ borderColor: "var(--color-surface-border)" }}>
                Annuler
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmArchive(true)}
              className="rounded border px-3 py-2 text-left text-sm"
              style={{ borderColor: "var(--color-danger)", color: "var(--color-danger)" }}
            >
              Archiver l&apos;objet
            </button>
          )
        ) : (
          <button
            onClick={() => unarchiveEntityAction(entity.id, entity.version).then(onSaved)}
            className="rounded border px-3 py-2 text-left text-sm"
            style={{ borderColor: "var(--color-surface-border)" }}
          >
            Restaurer l&apos;objet
          </button>
        )}
      </section>
    </div>
  );
}

function DecisionForm({ entityId, onCreated }: { entityId: string; onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [choice, setChoice] = useState("");
  const [rationale, setRationale] = useState("");
  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="mt-2 text-xs underline" style={{ color: "var(--color-text-2)" }}>
        + Adopter une décision
      </button>
    );
  }
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!question.trim() || !choice.trim()) return;
        adoptDecisionAction(entityId, question, choice, rationale || null).then(() => {
          setQuestion("");
          setChoice("");
          setRationale("");
          setOpen(false);
          onCreated();
        });
      }}
      className="mt-2 space-y-2"
    >
      <input aria-label="Question" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Question" className={inputClass} />
      <input aria-label="Choix" value={choice} onChange={(e) => setChoice(e.target.value)} placeholder="Choix" className={inputClass} />
      <input
        aria-label="Raisonnement"
        value={rationale}
        onChange={(e) => setRationale(e.target.value)}
        placeholder="Raisonnement (facultatif)"
        className={inputClass}
      />
      <div className="flex gap-2">
        <button type="submit" className="rounded bg-[var(--color-ink)] px-3 py-1.5 text-xs font-semibold text-[var(--color-cream)]">
          Adopter
        </button>
        <button type="button" onClick={() => setOpen(false)} className="text-xs" style={{ color: "var(--color-text-3)" }}>
          Annuler
        </button>
      </div>
    </form>
  );
}

function RelationsTab({ detail, onChanged }: { detail: EntityDetail; onChanged: () => void }) {
  const [query, setQuery] = useState("");
  const [candidates, setCandidates] = useState<Entity[]>([]);
  const [target, setTarget] = useState<Entity | null>(null);
  const [type, setType] = useState<RelationshipType>("concerns");
  const [envisaged, setEnvisaged] = useState(true);

  useEffect(() => {
    if (!query.trim()) return;
    const handle = setTimeout(() => searchEntitiesAction(query).then(setCandidates), 180);
    return () => clearTimeout(handle);
  }, [query]);

  const visibleCandidates = query.trim() ? candidates : [];

  return (
    <div>
      <ul className="space-y-2">
        {detail.relationships.map(({ relationship, neighbor, direction }) => (
          <li
            key={relationship.id}
            className="flex items-center justify-between rounded border px-2.5 py-2 text-sm"
            style={{ borderColor: "var(--color-surface-border)" }}
          >
            <div>
              <p>
                {direction === "outgoing" ? RELATIONSHIP_LABELS[relationship.type] : `est ${RELATIONSHIP_LABELS[relationship.type]}`}{" "}
                <strong>{neighbor.exactName}</strong>
              </p>
              {relationship.confirmationStatus === "hypothesis" && (
                <span className="text-xs" style={{ color: "var(--color-warn)" }}>
                  envisagée
                </span>
              )}
            </div>
            <button
              onClick={() => removeRelationshipAction(relationship.id).then(onChanged)}
              className="text-xs"
              style={{ color: "var(--color-text-3)" }}
              aria-label="Retirer ce lien"
            >
              ✕
            </button>
          </li>
        ))}
        {detail.relationships.length === 0 && (
          <li className="text-sm" style={{ color: "var(--color-text-3)" }}>
            Aucune relation
          </li>
        )}
      </ul>

      <div className="mt-5 border-t pt-4" style={{ borderColor: "var(--color-surface-border)" }}>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-3)" }}>
          Ajouter un lien
        </p>
        <input
          aria-label="Rechercher un objet à lier"
          value={target ? target.exactName : query}
          onChange={(e) => {
            setTarget(null);
            setQuery(e.target.value);
          }}
          placeholder="Rechercher un objet…"
          className={inputClass}
        />
        {visibleCandidates.length > 0 && !target && (
          <ul className="mt-1 max-h-40 overflow-y-auto rounded border" style={{ borderColor: "var(--color-surface-border)" }}>
            {visibleCandidates
              .filter((c) => c.id !== detail.entity.id)
              .map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    className="block w-full px-2.5 py-1.5 text-left text-sm hover:bg-[var(--color-surface-2)]"
                    onClick={() => {
                      setTarget(c);
                      setCandidates([]);
                    }}
                  >
                    {c.exactName}
                  </button>
                </li>
              ))}
          </ul>
        )}
        <select
          aria-label="Type de relation"
          value={type}
          onChange={(e) => setType(e.target.value as RelationshipType)}
          className={`${inputClass} mt-2`}
        >
          {Object.entries(RELATIONSHIP_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <label className="mt-2 flex items-center gap-2 text-xs" style={{ color: "var(--color-text-2)" }}>
          <input type="checkbox" checked={envisaged} onChange={(e) => setEnvisaged(e.target.checked)} />
          Relation envisagée (non confirmée)
        </label>
        <button
          disabled={!target}
          onClick={() => {
            if (!target) return;
            connectEntitiesAction(detail.entity.id, target.id, type, envisaged ? "hypothesis" : "confirmed").then(() => {
              setTarget(null);
              setQuery("");
              onChanged();
            });
          }}
          className="mt-2 w-full rounded bg-[var(--color-ink)] px-3 py-1.5 text-sm font-semibold text-[var(--color-cream)] disabled:opacity-40"
        >
          Lier
        </button>
      </div>
    </div>
  );
}

function HistoriqueTab({ detail }: { detail: EntityDetail }) {
  return (
    <ul className="space-y-3">
      {detail.history.map((event) => (
        <li key={event.id} className="border-l-2 pl-3" style={{ borderColor: "var(--color-surface-border)" }}>
          <p className="text-sm">{event.summary}</p>
          <p className="text-xs" style={{ color: "var(--color-text-3)" }}>
            {format(new Date(event.recordedAt), "d MMM yyyy, HH:mm", { locale: fr })}
          </p>
        </li>
      ))}
      {detail.history.length === 0 && <li className="text-sm" style={{ color: "var(--color-text-3)" }}>Aucun changement enregistré</li>}
    </ul>
  );
}
