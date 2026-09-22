import type { Metadata } from "next";
import { PhilosophyView } from "@/components/landing/PhilosophyView";

export const metadata: Metadata = {
  title: "Philosophy — Studio by Dominique Soucy",
  description: "Sport is art. A more human way for a brighter tomorrow.",
};

export default function PhilosophyPage() {
  return <PhilosophyView />;
}
