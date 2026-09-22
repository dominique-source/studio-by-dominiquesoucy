# Final Report — Corrective Rebuild of the Public Marketing Site

## 1. Scope of this pass

Rebuilt the five public, unauthenticated marketing pages of
studio-by-dominiquesoucy against the approved reference maquettes shipped
in `Studio_by_Dominique_Soucy_Animation_Kit.zip`:

| Route | Reference | Status |
|---|---|---|
| `/` | `01-homepage-maquette.png` | Rebuilt |
| `/ecosystem` | `02-ecosystem-maquette.png` | Rebuilt |
| `/how-it-works` | `03-how-it-works-maquette.png` | Rebuilt |
| `/philosophy` | `04-philosophy-maquette.png` | Rebuilt |
| `/purinstinct` | `05-purinstinct-portal-maquette.png` | Rebuilt (new route) |

The authenticated private app (canvas, entities, Firebase-backed workflow)
was not touched.

## 2. Process followed

Per the brief's own instruction, no long audit preceded the rebuild.
`PREVIOUS_IMPLEMENTATION_FAILURE.md` and `WASTED_WORK_AND_USAGE_REPORT.md`
were written first, from actual git history only. The homepage (the kit's
`01-homepage-maquette.png`, not covered by the brief's page-by-page spec)
was treated as the true gating first page, since it replaces the
previously broken `/` route. Each subsequent page was built, screenshotted
at true full content height with Playwright, and compared against its
reference before moving to the next — `visual-comparisons/` holds every
reference/render pair. Fidelity notes for all five pages are in
`VISUAL_FIDELITY_REPORT.md`.

## 3. Brand and typography reconciliation

The brief's prose asked for "deep black, mineral white, silver, controlled
solar amber or warm gold." The kit's own `animation-tokens.css` — a
binding asset, not a suggestion — defines `--studio-blue: #1478ff` as the
single signature accent used throughout all five approved maquettes, with
no amber or gold anywhere in the kit. The maquettes were followed as the
literal visual truth: black/white/silver base, signature blue accent.
Serif display type (Fraunces, used by the private app) was not carried
into any public page; all public headlines use Anton
(`font-studio-display`), matching the condensed-sans requirement.

## 4. The "studio doum.zip" instruction

That archive was never present in this repository or referenced by any
code in this pass. Nothing here uses it or any electric-blue Instinct
Studio identity as the parent brand — the single blue system already
comes from the approved kit itself, not from that archive.

## 5. Photography: honest placeholders, not fabrication

The animation kit ships zero real photography — only atmosphere textures,
abstract glow graphics, hand-drawn marks, and one storyboard sketch sheet.
Every maquette shows real athlete/action photos in its photo slots.
Rather than generate or fake photography, every photo position renders as
`PhotoSlot`: a styled, clearly-labeled placeholder panel, sized and framed
exactly like the reference photo, that becomes a real `<img>` the moment
one is supplied. This is documented as the single largest, systematic gap
in `VISUAL_FIDELITY_REPORT.md` and is not hidden or minimized there.

## 6. Live/active project configuration

`src/data/studio-companies.ts` sets `href: "https://purinstinct.com"` only
for PürInstinct, taken directly from the approved `page4.png` reference.
Every other company's `href` is `null` — no URL was guessed or invented
for 5D Athlete, Ballers Only, Instinct Studio, or In Five. In-construction
projects (`LAB_PROJECTS`, 11 names) remain represented as "The Lab" — a
weight-3, distinctly-styled node on the ecosystem map — rather than as
disabled cards or hidden entirely.

## 7. Animation systems: implemented vs. deferred

Implemented (CSS-driven, `studio-public.css` + `animation-tokens.css`
keyframes): `.signal-path` stroke-draw, `.signal-node` pulse, `.fragment`
staggered reveal, `.nucleus` ignite glow — applied across all five pages
for SOURCE IGNITION, RELATIONSHIP SIGNAL (signal lines + waypoint pulses),
PROCESS ASSEMBLY (how-it-works wave), and PHILOSOPHY FIELD.
`prefers-reduced-motion` is respected globally and verified (animation
duration collapses to ~1ms).

**Not implemented in this pass** (JS-driven, not just CSS classes):
pointer-driven parallax/relationship highlighting, the PROJECT PORTAL
`clip-path`/`--portal-x`/`--portal-y` route-transition effect when
entering `/purinstinct` from the ecosystem map (the portal page exists and
is linked, but opens as a normal page navigation, not an animated portal
expansion), and SESSION MEMORY (per-session visited-company trace). These
are called out explicitly rather than claimed as done.

## 8. A real bug found and fixed: site-wide unscrollable overflow

Every page's `<main>` used `min-h-screen overflow-hidden` while being the
sole flex child of `<body className="min-h-full flex flex-col ...">`
under `html, body { height: 100% }`. Per the CSS flexbox spec, a flex
item's automatic minimum size becomes `0` in an axis whose overflow isn't
`visible` — so every page's real content (up to ~1740px on
`/how-it-works`) was silently clipped to exactly one viewport height, with
everything below invisible and **unreachable by scrolling in a real
browser**, not just in a screenshot. Found via `document.body.scrollHeight`
always exactly equaling `window.innerHeight` regardless of content or
viewport size. Fixed site-wide by changing `overflow-hidden` to
`overflow-x-clip`, which still contains horizontal bleed from edge
marginalia without triggering the flex min-size rule. Verified
before/after on all five pages.

## 9. Responsive translation

The desktop composition technique (a fixed-aspect-ratio canvas with
percentage-positioned HTML nodes and a matching SVG overlay) only reads
correctly with room for several scattered elements at once. Below the
`lg` breakpoint (1024px), every page now renders a purpose-built vertical
stack of the same content — same copy, same data, same hierarchy — rather
than shrinking the desktop canvas in place. Verified with Playwright at
390×844 (phone) and 768×1024 (tablet): zero horizontal overflow
(`scrollWidth === clientWidth`) on any of the five pages at either size.

## 10. Quality gates and known gaps

- `npm run build` — green (all five public routes prerender as static).
- `npx eslint src` — no errors.
- `npx vitest run` — **no test files exist in this repository**; this is
  a pre-existing condition (no test suite was ever configured here), not
  something broken by this pass. Not fabricated as passing.
- No 404s or JS console errors on any of the five pages (checked via a
  headless Playwright pass watching `response`/`pageerror` events).
- `prefers-reduced-motion` verified to collapse animation timing.
- No official URL was invented anywhere; `purinstinct.com` is the one
  external link and comes from the approved reference.

**Known gaps, honestly stated:** no real photography (by design, per
section 5); the portal-open transition and other JS-driven animation
systems listed in section 7 are not yet built; no automated test coverage
exists for the new pages. Nothing in this report claims a gap that was
fixed but wasn't, or hides a gap that remains.
