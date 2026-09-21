import type { DomainAccent } from "@/lib/types";

export interface PublicDomain {
  name: string;
  accent: DomainAccent;
  /** TODO: replace with real one-line copy. */
  tagline: string;
  /** TODO: set the real public URL once live; leave null to show "In development". */
  href: string | null;
}

// TODO: confirm names/copy/links with Dominique — these are placeholders so
// the public page has something to render, not final content.
export const PUBLIC_DOMAINS: PublicDomain[] = [
  {
    name: "PürInstinct",
    accent: "purinstinct",
    tagline: "TODO: one-line description of PürInstinct.",
    href: null,
  },
  {
    name: "Ballers Only",
    accent: "ballers",
    tagline: "TODO: one-line description of Ballers Only.",
    href: null,
  },
  {
    name: "In Five",
    accent: "infive",
    tagline: "TODO: one-line description of In Five.",
    href: null,
  },
  {
    name: "Gamification",
    accent: "gamification",
    tagline: "TODO: one-line description of Gamification.",
    href: null,
  },
  {
    name: "Manipule le jeu",
    accent: "default",
    tagline: "TODO: one-line description of Manipule le jeu.",
    href: null,
  },
  {
    name: "Events & Community",
    accent: "default",
    tagline: "TODO: one-line description of Events & Community.",
    href: null,
  },
];
