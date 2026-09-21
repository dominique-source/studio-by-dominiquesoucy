// Authored relationship map for the Philosophy page's "Thought Field".
// Every phrase and connection here is explicit and hand-written — nothing
// is generated at runtime. Connections are intentionally sparse: a thought
// only links to another when the idea genuinely continues it.

export interface Thought {
  id: string;
  phrase: string;
  detail: string;
  connections: string[];
}

export const THOUGHTS: Thought[] = [
  {
    id: "sport-is-art",
    phrase: "Sport is art.",
    detail: "A canvas for people, ideas and possibility.",
    connections: ["played-not-watched", "human-behavior"],
  },
  {
    id: "played-not-watched",
    phrase: "Sport is meant to be played.",
    detail: "Participation creates a brighter tomorrow than spectating ever will.",
    connections: ["participation-over-spectatorship"],
  },
  {
    id: "participation-over-spectatorship",
    phrase: "Participation matters more than spectatorship.",
    detail: "No more spectators. Everyone belongs on the floor.",
    connections: ["communication-tool"],
  },
  {
    id: "communication-tool",
    phrase: "Sport is a tool for communication and community.",
    detail: "Different backgrounds. Shared emotions. Real connections.",
    connections: ["human-behavior"],
  },
  {
    id: "human-behavior",
    phrase: "Projects begin from human behavior.",
    detail: "Curiosity, movement and belonging come before structure.",
    connections: ["build-first"],
  },
  {
    id: "build-first",
    phrase: "Build first. Learn from real use.",
    detail: "Ideas in motion produce real feedback and stronger solutions.",
    connections: ["studio-gives-room"],
  },
  {
    id: "studio-gives-room",
    phrase: "The Studio creates companies, then gives them room to grow.",
    detail: "Independent leaders. Shared growth.",
    connections: ["protects-philosophy"],
  },
  {
    id: "protects-philosophy",
    phrase: "The Studio protects the original philosophy while CEOs lead execution.",
    detail: "Two different jobs, held by two different people, on purpose.",
    connections: ["value-before-layers"],
  },
  {
    id: "value-before-layers",
    phrase: "Existing products must generate value before teams add new layers.",
    detail: "One useful adjustment at a time, never expansion for its own sake.",
    connections: ["stronger-together"],
  },
  {
    id: "stronger-together",
    phrase: "A stronger company strengthens the whole Studio.",
    detail: "Every success expands what every other company can draw on.",
    connections: [],
  },
];
