import type { Metadata } from "next";
import { PurinstinctPortalView } from "@/components/landing/PurinstinctPortalView";

export const metadata: Metadata = {
  title: "Pürinstinct — Studio by Dominique Soucy",
  description: "A new sport built to reveal the complete athlete.",
};

export default function PurinstinctPortalPage() {
  return <PurinstinctPortalView />;
}
