import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VentureDetailView } from "@/components/studio-public/VentureDetailView";
import { STUDIO_NODES } from "@/data/studio-map";
import { VENTURE_DETAILS } from "@/data/venture-details";

const node = STUDIO_NODES.find((n) => n.slug === "ballers-only");
const detail = VENTURE_DETAILS["ballers-only"];

export const metadata: Metadata = {
  title: "Ballers Only — Studio Dominique Soucy",
  description: "Communauté, jeunesse, culture autour du basketball.",
};

export default function BallersOnlyPage() {
  if (!node || !detail) notFound();
  return <VentureDetailView node={node} detail={detail} />;
}
