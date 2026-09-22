# Previous implementation — visual fidelity failure

This document records why the current public-facing site fails the assignment, based on a direct comparison between what's in the repository (`src/components/landing/PublicLanding.tsx`, `src/data/domains.ts`, commits `6a9c254`, `5b3eb6a`, `f4ab1b2`) and the approved visual references (`page1.png`–`page4.png` at the repo root, and the fuller `Studio_by_Dominique_Soucy_Animation_Kit.zip`, which contains a 5th maquette — `00-maquettes/01-homepage-maquette.png` — not named individually in the corrective brief but clearly the composition `PublicLanding.tsx` was meant to be).

## What's verifiably true, compared side by side

1. **The approved mockups were not available when this page was built, and it shows.** `PublicLanding.tsx` and `page1.png`–`page4.png` were added in different commits (`6a9c254` vs. later "Add files via upload" commits), so there was no visual reference to build against at the time. The result reads as a generic placeholder regardless of intent.
2. **Cinematic composition was replaced by a generic layout.** The references are full-bleed, dark, photographic, collaged, hand-annotated single compositions. `PublicLanding.tsx` is a centered text header over a plain `sm:grid-cols-2` card grid — a template you'd see on any SaaS landing page.
3. **Condensed display typography was replaced with a serif font.** The page's title uses the `font-display` class, which resolves (via `globals.css`) to Fraunces — a serif. The references use a heavy condensed sans throughout, with no serif anywhere.
4. **Project imagery was replaced with cards and text.** There is zero photography, film-fragment collage, or SVG signal system in the current page. Every reference composition is built from real imagery, torn-paper fragments, and glowing connective lines.
5. **The Studio has no visual "nucleus."** The references place a literal glowing hub (labeled "STUDIO" / "STUDIO BY DOMINIQUE SOUCY") at the gravitational center of the composition, with signal lines radiating to each company. The current page has no equivalent — just a wordmark and a subhead above the grid.

## Claims in the corrective brief that do **not** match this repository's actual history

I was told not to defend the previous implementation, and I'm not — the fidelity gap above is real and is the reason for this rebuild. But two of the prescribed acknowledgement items describe things that did not happen here, and I'm not going to sign off on them as if they did:

- **"The ecosystem became a weak diagram of similar blue dots."** There is no ecosystem diagram in this codebase at any point in its history — no nucleus, no nodes, no connecting lines, blue or otherwise. `PublicLanding.tsx` is a static card grid with no diagram of any kind.
- **"The website inherited too much of the Instinct Studio identity."** "Instinct Studio" does not appear anywhere in the current codebase. `src/data/domains.ts` lists PürInstinct, Ballers Only, In Five, Gamification, Manipule le jeu, and Events & Community — all marked `TODO` placeholders — with no Instinct Studio entry and no blue-flooding of any kind to correct.
- **"Standard reveal animations were presented as signature motion."** There is no animation in `PublicLanding.tsx` at all — no `IntersectionObserver`, no transitions, no keyframes. There was nothing to mistake for signature motion because nothing was built.
- **"Technical metrics were prioritized over artistic accuracy."** The only prior technical work on this surface was two production-crash fixes (`5b3eb6a`, `f4ab1b2`) — a hard ESM/CJS module-resolution crash and an unhandled `getAuth()` throw taking down `/login`. Both were real outages, not a stand-in for design work; no performance or Core Web Vitals audit was run against the landing page.

I'm flagging these rather than including them as acknowledged fact, because a corrective record that states things that didn't happen is as unreliable as one that hides what did.

## Root cause, stated plainly

The public landing page was built as a functional placeholder before the visual direction existed, then never revisited once the mockups and animation kit arrived. It was never designed against the references — not "redesigned away from them," never built from them in the first place. That's the gap this rebuild closes.
