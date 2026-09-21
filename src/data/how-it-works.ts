// The seven-step sequence from the approved reference (page2.png /
// "03-how-it-works-maquette.png") — not the six-stage abstraction used in
// the previous, unfaithful build. Copy follows the reference and the
// Studio brief exactly.

export interface Stage {
  id: string;
  number: string;
  title: string;
  description: string;
  /** Extra bullet points, used only by the CEO stage. */
  details?: string[];
}

export const STAGES: Stage[] = [
  { id: "idea", number: "01", title: "Idea", description: "Big questions. Real opportunities." },
  { id: "pitch", number: "02", title: "Pitch", description: "Sport can do more." },
  { id: "prototype", number: "03", title: "Prototype", description: "Learn from real use." },
  { id: "prove", number: "04", title: "Prove", description: "Real users. Real data." },
  { id: "monetize", number: "05", title: "Monetize", description: "Product. Users. Revenue. Impact." },
  {
    id: "ceo",
    number: "06",
    title: "Find the CEO",
    description: "Right person. Bigger possible.",
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
  { id: "grow", number: "07", title: "Grow Together", description: "A brighter tomorrow." },
];
