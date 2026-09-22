import type { Metadata } from "next";
import { EcosystemView } from "@/components/landing/EcosystemView";

export const metadata: Metadata = {
  title: "The Ecosystem — Studio by Dominique Soucy",
  description: "One studio. Multiple companies, connected by one creative philosophy.",
};

export default function EcosystemPage() {
  return <EcosystemView />;
}
