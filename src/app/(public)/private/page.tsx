import Link from "next/link";
import { MagneticCTA } from "@/components/motion/MagneticCTA";

export const metadata = {
  title: "Private access — Studio by Dominique Soucy",
  description: "Layered access to the Studio's private tools and previews.",
};

const TIERS = [
  { name: "Public", description: "Everything on this site — the Studio, the ecosystem, the philosophy." },
  { name: "Guest", description: "Invited to view a specific private preview." },
  { name: "Member", description: "Access to a company's private workspace." },
  { name: "Founder member", description: "Early access across a company's private preview." },
  { name: "Employee", description: "Operational access inside a specific company." },
  { name: "Administrator", description: "Manages a company's workspace and members." },
  { name: "CEO", description: "Runs a company freely, within the Studio's philosophy." },
  { name: "Founder", description: "Dominique — protects the philosophical direction across every company." },
];

// This is not a new authentication system. The Studio's existing, working
// member login (Firebase Auth + server-verified session cookies) already
// lives at /login and protects the private workspace at /carte and
// related routes — untouched by this page. This route only explains the
// access model and hands qualifying visitors to that existing entrance.
export default function PrivatePage() {
  return (
    <main className="px-6 pb-24 pt-28 sm:px-10 sm:pt-32">
      <div className="mx-auto max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: "var(--studio-blue-soft)" }}>
          Private access
        </p>
        <h1 className="mt-3 font-display text-4xl font-black uppercase leading-[0.95] sm:text-5xl" style={{ color: "var(--studio-white)" }}>
          Public does not mean
          <br />
          fully accessible.
        </h1>
        <p className="mt-4 text-sm sm:text-base" style={{ color: "var(--studio-silver)" }}>
          Some Studio projects stay private while they&apos;re built, or belong to a company&apos;s own
          protected workspace. Access is layered, never all-or-nothing.
        </p>

        <ul className="mt-10 flex flex-col gap-4 border-t pt-8" style={{ borderColor: "var(--studio-line)" }}>
          {TIERS.map((tier) => (
            <li key={tier.name} className="grid grid-cols-[140px_1fr] gap-4">
              <span className="font-display text-sm font-black uppercase tracking-wide" style={{ color: "var(--studio-white)" }}>
                {tier.name}
              </span>
              <span className="text-sm" style={{ color: "var(--studio-silver)" }}>
                {tier.description}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap items-center gap-4 border-t pt-8" style={{ borderColor: "var(--studio-line)" }}>
          <MagneticCTA href="/login">Sign in to a private workspace →</MagneticCTA>
          <Link
            href="/ecosystem"
            className="font-mono text-xs uppercase tracking-[0.14em] underline underline-offset-4"
            style={{ color: "var(--studio-silver)" }}
          >
            Back to the ecosystem
          </Link>
        </div>
      </div>
    </main>
  );
}
