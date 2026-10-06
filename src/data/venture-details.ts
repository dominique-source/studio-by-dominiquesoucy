/**
 * Venture detail content — companion to studio-map.ts, keyed by the same
 * `slug`. Split into its own file because a StudioNode (map position,
 * status, orbit) and a venture's long-form page content are different
 * concerns with different update cadences: moving a node on the map
 * shouldn't require touching its "why it exists" paragraph.
 *
 * Every field here is written from the Oct 2026 architecture brief only.
 * Where the brief didn't specify something (an operator, a metric, a
 * launch date), the field says "À clarifier" rather than inventing one —
 * same rule as everywhere else on this site.
 */

export interface VentureDetail {
  slug: string;
  whatIsIt: string;
  whyExists: string;
  howConnects: string;
  rightNow: string[];
  longTerm: string;
  whoRuns: string;
  relatedSlugs: string[];
  seekingRoles?: string[];
}

export const VENTURE_DETAILS: Record<string, VentureDetail> = {
  "ballers-only": {
    slug: "ballers-only",
    whatIsIt:
      "Une communauté et un véhicule jeunesse construits autour du basketball — pas une nouvelle discipline à inventer, le basketball existe déjà. L'occasion est de réinventer la culture, l'appartenance et l'accès autour de ce sport.",
    whyExists:
      "Créer des parcours, des événements et des comportements qui donnent envie aux jeunes de rester dans le sport — la culture, la communauté et l'accès avant la performance.",
    howConnects:
      "Ballers Only est l'un des trois piliers les plus proches du cœur du Studio, aux côtés de PürInstinct et de la Gamification. Le Baller App le relie directement à l'initiative Gamification.",
    rightNow: [
      "Open Runs",
      "Événements Ballers Only",
      "Balleuse Only",
      "Vêtements / t-shirts",
      "Activités jeunesse et communautaires",
      "Compétitions gamifiées",
      "Baller App",
    ],
    longTerm:
      "Une structure de type organisme à but non lucratif (OSBL) est envisagée pour porter la mission communautaire. Ballers Only peut devenir un locataire ou un participant majeur d'un futur Quartier Sportif, sans en dépendre.",
    whoRuns: "À clarifier.",
    relatedSlugs: ["purinstinct", "gamification"],
  },
  gamification: {
    slug: "gamification",
    whatIsIt:
      "Rendre le sport physique aussi engageant et intuitif qu'un bon jeu vidéo — pas en transformant le sport en écrans, mais en utilisant la technologie pour faire bouger les gens.",
    whyExists:
      "Un enfant qui participe à une journée sportive ou un tournoi, avec un bracelet technologique, qui accumule des points, des réalisations et des résultats à travers plusieurs activités — l'expérience devient communauté, mouvement, jeu, défis individuels et énergie sociale, plutôt qu'une simple opposition « équipe A contre équipe B » toute la journée.",
    howConnects:
      "Briques existantes ou en émergence : bracelets technologiques (RFID), systèmes de pointage, l'app PürInstinct Games, une app basketball, une app squash, des concepts soccer et football américain, des événements jeunesse multi-activités.",
    rightNow: ["Bracelets technologiques et systèmes de pointage (prototypes)", "App PürInstinct Games"],
    longTerm:
      "Un moteur de gamification applicable à plusieurs sports, avec sa propre technologie et, à terme, sa propre équipe — capable de devenir autonome, au-delà de PürInstinct.",
    whoRuns: "Dominique Soucy, pour l'instant — avec l'intention explicite de rendre l'initiative autonome.",
    relatedSlugs: ["purinstinct", "ballers-only"],
  },
};
