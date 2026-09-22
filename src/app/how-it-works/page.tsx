import type { Metadata } from "next";
import { HowItWorksView } from "@/components/landing/HowItWorksView";

export const metadata: Metadata = {
  title: "How It Works — Studio by Dominique Soucy",
  description: "From instinct to company: we build the first working version, independent leaders take it forward.",
};

export default function HowItWorksPage() {
  return <HowItWorksView />;
}
