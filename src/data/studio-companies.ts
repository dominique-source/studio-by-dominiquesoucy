/**
 * Real company roster for the public ecosystem pages, from the approved
 * maquettes and the corrective brief — replaces the old placeholder list
 * in domains.ts (kept for the private app's seed data, untouched here).
 *
 * `href` stays null unless a URL is explicitly confirmed. purinstinct.com
 * is taken directly from page4.png (an approved, binding reference asset),
 * not invented. No other URL has been confirmed, so none is filled in —
 * per instruction, official URLs are never guessed.
 */
export type CompanyStatus = "live" | "pilot" | "development" | "construction";

export interface StudioCompany {
  slug: string;
  name: string;
  status: CompanyStatus;
  tagline: string[];
  href: string | null;
  /** 1 = highest priority/maturity (bigger, closer, brighter on the map). */
  weight: 1 | 2 | 3;
}

export const CORE_COMPANIES: StudioCompany[] = [
  {
    slug: "purinstinct",
    name: "PürInstinct",
    status: "live",
    tagline: ["Athletes", "Ideas", "A brighter tomorrow."],
    href: "https://purinstinct.com",
    weight: 1,
  },
  {
    slug: "5d-athlete",
    name: "5D Athlete",
    status: "live",
    tagline: ["Training", "Performance", "Human potential."],
    href: null,
    weight: 1,
  },
  {
    slug: "ballers-only",
    name: "Ballers Only",
    status: "live",
    tagline: ["Community", "Culture", "Opportunity."],
    href: null,
    weight: 1,
  },
  {
    slug: "instinct-studio",
    name: "Instinct Studio",
    status: "pilot",
    tagline: ["Film", "Branded content", "Originals."],
    href: null,
    weight: 2,
  },
  {
    slug: "in-five",
    name: "In Five",
    status: "development",
    tagline: ["Platform", "Products", "Next-gen experiences."],
    href: null,
    weight: 2,
  },
];

export const LAB_PROJECTS: { name: string }[] = [
  { name: "PürInstinct Games" },
  { name: "Inner Game by Dominique Soucy" },
  { name: "Ballers XII" },
  { name: "5D Squash" },
  { name: "5D Chess" },
  { name: "5D PürInstinct" },
  { name: "The Gamification of Sports" },
  { name: "Instinct clothing brand" },
  { name: "Instinct nonprofit" },
  { name: "Instinct sports bottle & drink" },
  { name: "Sports District" },
];

export const STATUS_LABEL: Record<CompanyStatus, string> = {
  live: "Live",
  pilot: "Pilot",
  development: "Development",
  construction: "In construction",
};
