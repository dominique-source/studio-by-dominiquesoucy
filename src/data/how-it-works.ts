// The Decision Machine — six authored stages. Copy follows the Studio
// brief exactly; nothing here is generated.

export interface Stage {
  id: string;
  number: string;
  title: string;
  description: string;
  /** Extra bullet points, used only by the CEO stage. */
  details?: string[];
}

export const STAGES: Stage[] = [
  {
    id: "instinct",
    number: "01",
    title: "Instinct",
    description: "Creates vibration. A raw reaction to something in sport that isn't working, or isn't there yet.",
  },
  {
    id: "idea",
    number: "02",
    title: "Idea",
    description: "Creates direction. The instinct becomes a specific, arguable point of view.",
  },
  {
    id: "prototype",
    number: "03",
    title: "Prototype",
    description: "Creates form. We build the first working version — not a deck, a real thing people can use.",
  },
  {
    id: "company",
    number: "04",
    title: "Company",
    description: "Creates a working structure. The prototype earns the operations, roles and discipline of a company.",
  },
  {
    id: "ceo",
    number: "05",
    title: "CEO",
    description: "Gives the project autonomous movement.",
    details: [
      "Each company has its own CEO.",
      "The CEO runs their company freely.",
      "Dominique protects the philosophical direction.",
      "The CEO explains why a decision matters.",
      "The company monetizes what already exists before expanding.",
      "Improvements happen one useful adjustment at a time.",
      "Studio companies help each other with expertise, relationships and resources.",
    ],
  },
  {
    id: "growth",
    number: "06",
    title: "Growth",
    description: "Reconnects the project's value to the Studio ecosystem. A stronger company strengthens the whole Studio.",
  },
];
