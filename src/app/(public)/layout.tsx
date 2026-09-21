import { Anton, Caveat } from "next/font/google";
import "@/styles/studio-public.css";
import { PublicNav } from "@/components/public/PublicNav";

// Typography correction: the approved references use a bold, condensed,
// athletic sans-serif for every headline — never a serif. Anton replaces
// the private tool's Fraunces (which stays serif, untouched, for the
// private tool only). Caveat is used only for the small handwritten
// editorial annotations scattered through the collage — never for a
// dominant title.
//
// "latin-ext" is required, not just "latin": PürInstinct's Ü is outside
// Google Fonts' base "latin" subset, so with "latin" alone the character
// rendered as a broken/empty glyph in the monumental portal title
// instead of falling back cleanly — a real bug, not a font limitation.
const anton = Anton({
  variable: "--font-display-condensed",
  subsets: ["latin", "latin-ext"],
  weight: "400",
});

const caveat = Caveat({
  variable: "--font-hand",
  subsets: ["latin"],
  weight: ["500", "700"],
});

// Wraps every public route (/, /ecosystem, /how-it-works, /philosophy,
// /projects/[slug], /private) in the Studio's own theme. Scoped to this
// route group only — the private tool under (app)/ and /login keeps its
// own ivory theme and Fraunces/Inter fonts from the root layout untouched.
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`studio-public ${anton.variable} ${caveat.variable}`}>
      <PublicNav />
      {children}
    </div>
  );
}
