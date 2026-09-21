# Motion system

Twelve reusable primitives, in `src/components/motion/`, plus two
page-specific compositions in `src/components/public/`. Every animation
communicates one idea — none run as pure decoration. All respect
`prefers-reduced-motion` (see `src/styles/studio-public.css`'s global
reduced-motion block, plus each component's own reduced-motion branch
where it matters).

## The twelve primitives

| Component | What it communicates |
|---|---|
| `SignalLine` | A relationship being drawn between two points — animates once, on scroll into view. |
| `SignalPulse` | A living, active signal — the pulsing dot at the Studio nucleus and at path endpoints. |
| `OrbitNode` | A project's current state — size, brightness and interactivity all derive from its `status`. |
| `FilmFragment` | Cinematic texture — a cropped window into the supplied film-fragments sheet. |
| `EditorialMark` | A hand-made annotation — a cropped window into the supplied editorial-marks sheet. |
| `ProjectPortal` | "This project deserves its own moment" — a full-screen presentation that opens from the exact node you clicked. |
| `LayeredArtwork` | A project's identity arriving in order (status → title → summary → texture → sketch), not all at once. |
| `ThoughtConnection` | Two philosophy statements that continue one another. |
| `MemoryTrace` | "You've already seen this" — a same-session-only visited marker. |
| `ConstructionSignal` | "This is genuinely being built" — hazard-style hatching, never a fake percentage. |
| `StatusTransition` | Re-keys a subtree so its `fragment` reveal restarts when status-dependent content swaps. |
| `MagneticCTA` | "This is the one action that matters here" — leans a few px toward the pointer, desktop-hover only. |

## The six signature interactions

1. **Living Signal** (`LivingSignalField`, homepage). A soft radial mask
   follows the pointer (or a touch drag) over a field of hidden film
   fragments and editorial marks — motion reveals what's underneath. When
   the pointer slows below 0.35 px/ms for 220 ms, a signal line draws from
   the Studio's mark to wherever the visitor settled. Reduced motion:
   the mask is removed entirely and every fragment sits at rest, visible,
   static — nothing is hidden that a reduced-motion visitor can't see.

2. **Gravity Interface** (`GravityInterface`, `/ecosystem`). All 36 visible
   projects, positioned by `orbit` (1 = closest/most active, 4 = furthest/
   most speculative) and rendered as `OrbitNode`s whose brightness comes
   from `status`. Selecting one highlights its `relationships` and dims
   everything else. Below `md`, this becomes a plain vertical list —
   deliberately, not a shrunken orbit with unreadable labels.

3. **Living Portal** (`ProjectPortal`). Opens from the exact node position
   (`--portal-x`/`--portal-y`) via a `clip-path: circle()` expansion, then
   reveals `LayeredArtwork`'s layers in sequence. Closing it un-mounts
   only the portal — the ecosystem underneath never re-renders, so spatial
   context survives.

4. **Decision Machine** (`DecisionMachine`, `/how-it-works`). Each of the
   six stages reveals on scroll via `IntersectionObserver`, in order,
   communicating the brief's own model: instinct → idea → prototype →
   company → CEO → growth.

5. **Thought Field** (`ThoughtField`, `/philosophy`). Ten authored
   principles (`src/data/philosophy.ts`) at fixed coordinates, connected
   by `ThoughtConnection` lines exactly where the content says one idea
   continues another — never a randomly generated relationship. Below
   `md`, the same ten thoughts render as a plain readable list.

6. **Memory Trace** (`useMemoryTrace` + `MemoryTrace`). `sessionStorage`
   only — nothing persists past the browser tab, nothing is sent
   anywhere. Marks a project "Viewed" on the ecosystem page once its
   portal has been opened this session.

## Library choices

No new animation dependency was added. GSAP and React Three Fiber were
both considered and rejected: the brief itself says to use them "only if
[already installed]" or "only for the ecosystem, and only if the result
stays stable on mobile and during server rendering" — plain SVG + CSS
transforms/opacity, as used throughout, met every interaction in the brief
without the bundle size, SSR-safety work, or mobile-stability risk a 3D
engine would add for what is fundamentally 2D, DOM-positioned content.
