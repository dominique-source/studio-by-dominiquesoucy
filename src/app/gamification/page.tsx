import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VentureDetailView } from "@/components/studio-public/VentureDetailView";
import { STUDIO_NODES } from "@/data/studio-map";
import { VENTURE_DETAILS } from "@/data/venture-details";

const node = STUDIO_NODES.find((n) => n.slug === "gamification");
const detail = VENTURE_DETAILS["gamification"];

export const metadata: Metadata = {
  title: "Gamification — Studio Dominique Soucy",
  description: "Rendre le sport physique aussi engageant qu'un bon jeu vidéo.",
};

export default function GamificationPage() {
  if (!node || !detail) notFound();
  return <VentureDetailView node={node} detail={detail} />;
}
