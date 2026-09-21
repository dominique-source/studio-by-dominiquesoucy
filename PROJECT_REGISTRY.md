# Project registry

Single source of truth: `src/data/projects.ts` (36 entries). Consumed by
the homepage's featured/in-construction sections, `/ecosystem`'s Gravity
Interface, and every `/projects/[slug]` page. Validated by
`npm run validate:registry` (unique slugs, valid enum values, well-formed
URLs, no relationship pointing at a missing/hidden project, no "Learn
more" CTA anywhere, every LIVE project has a real URL).

## Schema

```ts
title, slug, category, status, accessLevel, maturity, orbit,
visualWeight, accentColor, summary, image, officialUrl,
relationships, featured, visibility, ctaLabel
```

`status` is one of `LIVE | ACTIVE | PRIVATE_PREVIEW | IN_DEVELOPMENT |
CONCEPT | FUTURE` — this exact set, per the brief. `orbit` (1–4) and
`visualWeight` (1–3) drive the Gravity Interface's layout and node size;
they default from `status` but are stored per-project so they can be
tuned individually later without touching layout code.

## Only four URLs are real

`purinstinct.com`, `ballersonly-by-dominiquesoucy.com`, `getinfive.com` are
the three documented in the brief. Every other project has
`officialUrl: null` — its card links to `/projects/[slug]` (or `/private`
for the two `PRIVATE_PREVIEW` entries) instead of guessing a domain. This
was a hard rule, not a stylistic choice: **do not invent official URLs.**

## Calls made without direct evidence

The brief flagged a few projects as needing a judgment call. Each is
recorded here for Dominique to correct if the read is wrong — nothing was
guessed silently.

- **5D Athlete** — brief said "ACTIVE OR IN DEVELOPMENT." Set to `ACTIVE`.
  (Note: the approved ecosystem mockup itself shows a `LIVE` dot next to
  5D Athlete — that's mockup flavor, not one of the six allowed status
  values, so it wasn't used as the literal enum value. Worth confirming
  directly with Dominique which is correct.)
- **Instinct nonprofit** — brief said "CONCEPT OR ACTIVE," no repository
  evidence either way. Set to `CONCEPT` (the more conservative reading —
  claiming a nonprofit is `ACTIVE` without evidence risked overstating
  its real status).
- **Manifeste Arts Sportif / Manifeste Instinct** — not covered by the
  brief's status list at all. Set to `ACTIVE`, on the reasoning that a
  manifesto is a written statement that either exists or doesn't; there's
  no "in development" state for a text that's already been written for
  the philosophy page.
- **PürInstinct Clinics / PürInstinct School / Teacher Clinics** — not
  covered by the brief's status list. Set to `ACTIVE`, because PürInstinct
  itself is `LIVE` and its own summary explicitly says "book clinics" —
  these read as existing offerings of a live product, not speculative
  ones.
- **All other "additional icons"** (Championnat scolaire, Vente de
  ballons, tournaments, the individual 5D Squash/app sub-items, etc.) —
  given no purpose text in the brief at all. Summaries were written as
  literal, conservative descriptions of what the name itself says, never
  an invented backstory, feature list, or metric.

## Relationships

`relationships` is hand-authored per project (e.g. `ballers-xii` →
`ballers-only`, `inner-game`; `5d-squash-elite/school/corporate` →
`5d-squash`). This drives both the "Related projects" section on every
portal/detail page and which nodes move closer when one is selected on
`/ecosystem`.
