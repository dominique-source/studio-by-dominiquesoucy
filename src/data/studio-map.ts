/**
 * Studio Map registry — Milestone 1 of the Oct 2026 architecture plan
 * (see FINAL_REPORT.md history / chat for the full written plan).
 *
 * This is deliberately a structured TS file, not Firestore: there is no
 * real Firebase project in production yet (.env.local still points at the
 * local emulator). The shape here matches what the Entity schema would
 * look like once extended (src/lib/types.ts) so migrating this registry
 * into Firestore later is a data move, not a UI rewrite.
 *
 * Scope for this milestone: the Studio core plus the three Inner Orbit
 * pillars (PürInstinct, Ballers Only, Gamification) and Instinct Studio's
 * transversal position. The rest of the real project set (Quartier
 * Sportif, Inner Game, In Five, Alérions, Cadet, Éphèse, Espace Y,
 * Manipule le jeu, Manifeste Vol. 2, Conferences, Baller App, App Ludo,
 * 5D Athlete) is intentionally not in this file yet — adding a node here
 * should never require touching the map component.
 */

export type StudioOrbit = "core" | "inner" | "middle" | "outer" | "external";

export type StudioStatus =
  | "CORE"
  | "ACTIVE"
  | "BUILDING"
  | "INCUBATION"
  | "LABORATORY"
  | "PARTNER"
  | "LEGACY"
  | "PRIVATE"
  | "DORMANT"
  | "EXTERNAL_ORBIT"
  | "IN_DEVELOPMENT"
  | "TO_CLARIFY";

export type StudioCategory =
  | "venture"
  | "platform"
  | "engine"
  | "lab"
  | "partner"
  | "service"
  | "ip"
  | "content"
  | "collaboration"
  | "infrastructure";

export type RelationshipToStudio =
  | "owned"
  | "partner"
  | "client_partner"
  | "laboratory"
  | "personal_commitment"
  | "collaboration"
  | "legacy_ip"
  | "service";

export const STATUS_LABEL_FR: Record<StudioStatus, string> = {
  CORE: "Cœur",
  ACTIVE: "Actif",
  BUILDING: "En construction",
  INCUBATION: "Incubation",
  LABORATORY: "Laboratoire",
  PARTNER: "Partenaire",
  LEGACY: "Héritage",
  PRIVATE: "Privé",
  DORMANT: "En dormance",
  EXTERNAL_ORBIT: "Orbite externe",
  IN_DEVELOPMENT: "En développement",
  TO_CLARIFY: "À clarifier",
};

export interface StudioNode {
  slug: string;
  name: string;
  category: StudioCategory;
  status: StudioStatus;
  orbit: StudioOrbit;
  /** 1 = highest priority/maturity (bigger, closer, brighter on the map). */
  priority: 1 | 2 | 3;
  relationshipToStudio: RelationshipToStudio;
  shortDescription: string;
  /** Path under /public — one of the real venture graphics, or null for an
   * honest placeholder when no real art exists yet (never a stand-in from
   * another venture). */
  heroImage: string | null;
  /** Position on the desktop orbit, in degrees from the top (0 = 12 o'clock,
   * clockwise). Unused on the mobile vertical-stack rendering. */
  angleDeg: number;
  href: string | null;
}

export const STUDIO_CORE = {
  name: "Studio Dominique Soucy",
  tagline: "Créer de nouvelles façons de vivre le sport.",
  heroImage: "/studio-map/core.png",
};

export const STUDIO_NODES: StudioNode[] = [
  {
    slug: "purinstinct",
    name: "PürInstinct",
    category: "venture",
    status: "CORE",
    orbit: "inner",
    priority: 1,
    relationshipToStudio: "owned",
    shortDescription:
      "Un nouveau sport, une philosophie, une propriété sportive internationale en construction. Cliniques, Games et Instinct (télé) en sont les quatre branches.",
    heroImage: "/studio-map/purinstinct.png",
    angleDeg: 315,
    href: "/purinstinct",
  },
  {
    slug: "ballers-only",
    name: "Ballers Only",
    category: "venture",
    status: "CORE",
    orbit: "inner",
    priority: 1,
    relationshipToStudio: "owned",
    shortDescription:
      "Communauté, jeunesse, culture autour du basketball — pas une nouvelle discipline, une nouvelle façon d'appartenir au jeu.",
    heroImage: "/studio-map/ballers-only.png",
    angleDeg: 45,
    href: null,
  },
  {
    slug: "gamification",
    name: "Gamification",
    category: "venture",
    status: "CORE",
    orbit: "inner",
    priority: 1,
    relationshipToStudio: "owned",
    shortDescription:
      "Rendre le sport physique aussi engageant qu'un bon jeu vidéo — par la technologie qui fait bouger, pas par les écrans.",
    heroImage: null,
    angleDeg: 135,
    href: null,
  },
  {
    slug: "instinct-studio",
    name: "Instinct Studio",
    category: "engine",
    status: "BUILDING",
    orbit: "inner",
    priority: 2,
    relationshipToStudio: "owned",
    shortDescription:
      "Le moteur média et contenu du Studio — transversal, au service de PürInstinct, de Ballers Only et des partenaires.",
    heroImage: "/studio-map/instinct-studio.png",
    angleDeg: 225,
    href: null,
  },
];
