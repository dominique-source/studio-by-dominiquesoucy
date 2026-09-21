import { PUBLIC_DOMAINS } from "@/data/domains";
import { DOMAIN_COLORS } from "@/components/canvas/domain-colors";

export function PublicLanding() {
  return (
    <main
      className="min-h-screen bg-dot-grid"
      style={{ background: "var(--color-canvas)" }}
    >
      <div className="mx-auto flex max-w-4xl flex-col px-6 py-16 sm:py-24">
        <header className="text-center">
          <p className="font-display text-3xl font-black tracking-tight text-[var(--color-text)] sm:text-4xl">
            STUDIO
          </p>
          <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--color-text-3)]">
            Dominique Soucy
          </p>
          {/* TODO: replace with real hero copy. */}
          <p className="mx-auto mt-6 max-w-xl text-sm text-[var(--color-text-2)] sm:text-base">
            Un aperçu des initiatives, marques et projets en cours.
          </p>
        </header>

        <section className="mt-12 grid grid-cols-1 gap-4 sm:mt-16 sm:grid-cols-2">
          {PUBLIC_DOMAINS.map((domain) => {
            const color = DOMAIN_COLORS[domain.accent];
            const isLive = Boolean(domain.href);

            const cardContent = (
              <>
                <div className="flex items-center justify-between gap-3">
                  <p
                    className="font-display text-lg font-bold tracking-tight"
                    style={{ color: "var(--color-text)" }}
                  >
                    {domain.name}
                  </p>
                  <span
                    className="shrink-0 rounded-[var(--radius-pill)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em]"
                    style={
                      isLive
                        ? { color, backgroundColor: "var(--color-accent-green-tint)" }
                        : { color: "var(--color-text-3)", backgroundColor: "var(--color-surface-2)" }
                    }
                  >
                    {isLive ? "En ligne" : "En développement"}
                  </span>
                </div>
                <p className="mt-2 text-sm text-[var(--color-text-2)]">{domain.tagline}</p>
              </>
            );

            const cardClassName =
              "block rounded-[var(--radius-card)] border border-[var(--color-surface-border)] bg-[var(--color-surface)] p-5 shadow-sm transition";

            if (isLive) {
              return (
                <a
                  key={domain.name}
                  href={domain.href!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${cardClassName} hover:border-[var(--color-accent-green)]`}
                >
                  {cardContent}
                </a>
              );
            }

            return (
              <div key={domain.name} aria-disabled="true" className={`${cardClassName} opacity-70`}>
                {cardContent}
              </div>
            );
          })}
        </section>

        <footer className="mt-16 text-center text-xs text-[var(--color-text-3)]">
          © {new Date().getFullYear()} Studio Dominique Soucy
        </footer>
      </div>
    </main>
  );
}
