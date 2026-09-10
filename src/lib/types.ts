// Modèle d'objets du Studio — voir MASTER BUILD SPEC §5, §19.
// Un objet métier (entity) est canonique. Une occurrence de carte (view_item)
// ne référence un objet que par id ; elle ne copie jamais ses données.

export type EntityKind =
  | "venture"
  | "company"
  | "brand"
  | "product"
  | "ip"
  | "project"
  | "event"
  | "community"
  | "person"
  | "idea"
  | "opportunity"
  | "unclassified"; // "À classifier"

export const ENTITY_KIND_LABELS: Record<EntityKind, string> = {
  venture: "Initiative",
  company: "Société",
  brand: "Marque",
  product: "Produit",
  ip: "Propriété intellectuelle",
  project: "Projet",
  event: "Événement",
  community: "Communauté",
  person: "Personne",
  idea: "Idée",
  opportunity: "Occasion",
  unclassified: "À classifier",
};

export type LifecycleState = "active" | "archived";

export type ConfirmationStatus = "confirmed" | "hypothesis";

export interface Entity {
  id: string;
  workspaceId: string;
  kind: EntityKind;
  exactName: string;
  description: string | null;
  stage: string | null; // stade / avancement, texte libre V1
  lifecycleState: LifecycleState;
  classificationStatus: "classified" | "unclassified";
  confirmationStatus: ConfirmationStatus;
  operatorPersonId: string | null; // responsable confirmé, si existant
  nextAction: string | null;
  domainAccent: DomainAccent | null; // accent visuel fonctionnel (pas juridique)
  archivedAt: string | null; // ISO
  version: number;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export type DomainAccent =
  | "purinstinct"
  | "ballers"
  | "infive"
  | "gamification"
  | "default";

export interface EntityAlias {
  id: string;
  entityId: string;
  alias: string;
  provenance: string | null;
}

export type RelationshipType =
  | "part_of" // fait partie de
  | "depends_on" // dépend de
  | "produced_by" // produit de
  | "brand_used_by" // marque utilisée par
  | "concerns" // concerne
  | "realized_by" // concrétisée par
  | "documents" // documente
  | "replaces"; // remplace

export const RELATIONSHIP_LABELS: Record<RelationshipType, string> = {
  part_of: "fait partie de",
  depends_on: "dépend de",
  produced_by: "produit de",
  brand_used_by: "marque utilisée par",
  concerns: "concerne",
  realized_by: "concrétisée par",
  documents: "documente",
  replaces: "remplace",
};

export interface Relationship {
  id: string;
  workspaceId: string;
  fromId: string;
  toId: string;
  type: RelationshipType;
  confirmationStatus: ConfirmationStatus; // envisagée vs confirmée
  validFrom: string | null;
  validTo: string | null;
  version: number;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export type RoleState = "envisaged" | "confirmed" | "ended";

export interface RoleAssignment {
  id: string;
  workspaceId: string;
  personId: string;
  targetId: string;
  role: string;
  status: RoleState;
  effectiveFrom: string | null;
  effectiveTo: string | null;
  sourceId: string | null;
  version: number;
  createdAt: string;
  createdBy: string;
}

export type TaskStatus = "open" | "doing" | "done" | "cancelled";

export interface Task {
  id: string;
  workspaceId: string;
  entityId: string; // objet concerné
  title: string;
  assigneePersonId: string | null;
  status: TaskStatus;
  dueDate: string | null; // date seule, jamais d'heure inventée
  priority: "normal" | "high" | null;
  version: number;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export type DecisionStatus = "draft" | "adopted" | "replaced" | "cancelled";

export interface Decision {
  id: string;
  workspaceId: string;
  entityId: string;
  status: DecisionStatus;
  currentRevisionId: string | null;
  version: number;
  createdAt: string;
  createdBy: string;
}

export type DecisionParticipationType = "decided" | "consulted" | "informed";

export interface DecisionRevision {
  id: string;
  decisionId: string;
  question: string;
  choice: string;
  rationale: string | null; // "Le raisonnement n'a pas été consigné" si absent
  effectiveAt: string;
  supersedesId: string | null;
  participantPersonIds: string[];
  createdAt: string;
  createdBy: string;
}

export interface ObjectGrant {
  id: string;
  workspaceId: string;
  resourceId: string; // entityId | viewId | documentId
  resourceType: "entity" | "view" | "document";
  memberId: string;
  permission: "read" | "edit";
}

export type ViewMode = "real" | "vision";

export interface View {
  id: string;
  workspaceId: string;
  ownerId: string;
  name: string;
  rootId: string | null;
  mode: ViewMode;
  layoutVersion: number;
  createdAt: string;
  createdBy: string;
}

export interface ViewItem {
  id: string;
  viewId: string;
  entityId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  pinned: boolean;
  version: number;
  updatedAt: string;
  updatedBy: string;
}

export interface ViewFrame {
  id: string;
  viewId: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export type ChangeAction =
  | "entity.created"
  | "entity.updated"
  | "entity.archived"
  | "entity.unarchived"
  | "relationship.created"
  | "relationship.updated"
  | "relationship.removed"
  | "task.created"
  | "task.updated"
  | "decision.adopted"
  | "decision.replaced"
  | "view_item.removed";

export interface ChangeEvent {
  id: string;
  workspaceId: string;
  actorId: string;
  targetId: string;
  targetKind: string;
  action: ChangeAction;
  summary: string;
  recordedAt: string; // horodatage d'enregistrement
  effectiveAt: string | null; // si différent de recordedAt
  before: unknown;
  after: unknown;
}

export interface Member {
  id: string; // = auth uid
  workspaceId: string;
  displayName: string;
  email: string;
  personId: string | null;
  isAdmin: boolean;
  status: "active" | "invited" | "revoked";
}
