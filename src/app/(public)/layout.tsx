import "@/styles/studio-public.css";
import { PublicNav } from "@/components/public/PublicNav";

// Wraps every public route (/, /ecosystem, /how-it-works, /philosophy,
// /projects/[slug], /private) in the dark Studio theme. Scoped to this
// route group only — the private tool under (app)/ and /login keeps its
// own ivory theme from the root layout untouched.
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="studio-public">
      <PublicNav />
      {children}
    </div>
  );
}
