import type { Metadata } from "next";
import { Fraunces, Inter, Anton } from "next/font/google";
import "@xyflow/react/dist/style.css";
import "./globals.css";
import "./studio-public.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600", "700", "900"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Public marketing site only (studio-public.css) — kept separate from the
// authenticated app's Fraunces/Inter tokens above, never overriding them.
const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Studio Dominique Soucy",
  description: "Carte visuelle privée des initiatives, marques, personnes et décisions.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${fraunces.variable} ${inter.variable} ${anton.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-canvas text-text">{children}</body>
    </html>
  );
}
