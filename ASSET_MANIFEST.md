# Asset manifest

Source: `Studio_by_Dominique_Soucy_Animation_Kit.zip` (preserved, untouched,
at the repository root). Extracted into `public/assets/studio/` per the
suggested structure. Nothing here was fabricated — every raster/SVG file is
exactly as supplied; only its *use* (cropping window, color, position) is
project-specific.

## Mockups — `public/assets/studio/mockups/`

Reference only, per the kit's own README ("rebuild them with live HTML,
CSS, SVG and real media"). Not shipped anywhere on the live site.

| File | Used as reference for |
|---|---|
| `01-homepage-maquette.png` | `/` — hero copy, layout, CTA wording |
| `02-ecosystem-maquette.png` | `/ecosystem` — orbit layout, legend copy |
| `03-how-it-works-maquette.png` | `/how-it-works` — numbered stage treatment |
| `04-philosophy-maquette.png` | `/philosophy` — connected-thought layout |
| `05-purinstinct-portal-maquette.png` | `ProjectPortal` — the "Enter [Project]" pattern |

## Film fragments — `public/assets/studio/film-fragments/film-fragments-transparent.png`

One 1536×1024 sheet of torn-film-strip stills, cropped via CSS
`object-position` windows (see `src/components/motion/FilmFragment.tsx`
for the exact coordinates of each named variant: `floodlights`, `streaks`,
`road`, `filmstrip`, `glassShard`, `track`, `blueBeam`, `horizonStreak`,
`frame`).

Used in:
- `LivingSignalField` (homepage hero) — `floodlights`, `streaks`,
  `filmstrip`, `track`, `blueBeam`, revealed by the pointer-following mask.
- `LayeredArtwork` (project portal + `/projects/[slug]`) — `glassShard`, as
  the texture layer behind each project's title (hidden below `sm` to
  avoid crowding narrow screens).

## Editorial marks — `public/assets/studio/editorial-marks/editorial-marks-transparent.png`

One 1536×1024 sheet of hand-drawn arrows, circles, brackets and a question
mark, cropped the same way (see `EditorialMark.tsx` for variants:
`arrowRight`, `circle`, `question`, `cross`, `underline`, `brackets`,
`orbit`, `swoosh`, `arrowUpRight`).

Used in:
- `LivingSignalField` — `swoosh`, `circle`, `arrowUpRight` as revealed
  fragments.
- `LayeredArtwork` — `circle` as the sketches layer.
- Homepage's closing "One Studio" section — `orbit`.

## Storyboard / prototype fragments — `public/assets/studio/storyboard-fragments/storyboard-prototype-fragments-transparent.png`

Extracted and organized per the suggested structure. Not yet windowed into
a named component variant — reserved for a future pass on `/how-it-works`
(the Prototype stage) once Dominique confirms which specific frames should
represent it; using it without that confirmation risked picking imagery
that reads as a specific, unapproved product decision.

## SVG signals — `public/assets/studio/signals/`

| File | Status |
|---|---|
| `signal-network.svg` | Reference only — the site's `SignalLine` primitive draws its own paths per section instead of this fixed one, since each section needs a different path shape. Same color tokens (`#1478ff` / `--studio-blue`). |
| `orbit-system.svg` | Reference only — `GravityInterface` computes its own orbit rings and node positions from live project data rather than this fixed layout, since the real ecosystem has 36 projects, not 5. |
| `portal-frame.svg` | Reference only — not used directly; `ProjectPortal`'s clip-path expansion achieves the same "frame" effect without a static corner-bracket asset. |

## Animation tokens — `03-motion/animation-tokens.css`

Adapted almost verbatim into `src/styles/studio-public.css`, scoped under
`.studio-public` instead of `:root` so it never leaks into the private
tool's own ivory theme (both live in the same Next.js app). Same colors,
same easing curves, same keyframe names (`signal-draw`, `signal-pulse`,
`fragment-enter`, `portal-open`).

## What was not used

No file was discarded. The storyboard-fragments sheet (above) is extracted
and organized but not yet wired into a page — flagged for Dominique's
review rather than guessed at.
