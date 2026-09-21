# Wasted work and usage report

**On token/cost data:** this session has no tool that reports exact token
consumption, dollar cost, or time spent per task. No number below is a
token count. Anything of that nature is explicitly out of scope for this
report per instruction, and none is fabricated here.

## Commands run (public-site rebuild, factual list)

- `npm ci`, `npm run lint` (run repeatedly across the session)
- `npm run build` (run repeatedly — at least 6 full production builds)
- `npm run start -- -p <port>` (run on ports 3300, 3301, 3400, 3401, 3402,
  3403, 3404, 3500 — a new port each time because background server
  processes from earlier runs could not be reliably killed with `pkill`
  in this environment, so each verification pass started a fresh
  instance rather than reusing one)
- `npx tsx scripts/validate-registry.ts`, `npx tsx scripts/smoke.ts`
- Several one-off Node/Playwright scripts written to `/tmp`:
  `verify-studio.mjs`, `find-overflow.mjs`, `find-overflow2.mjs`,
  `find-overflow3.mjs`, `find-overflow4.mjs`, `audit-screens.mjs`,
  `audit-sections.mjs`, `audit-scroll-anim.mjs`
- `git` branch/commit/push for three branches:
  `fix/login-firebase-config-crash`, `feature/public-landing-page`,
  `feature/studio-public-rebuild`
- Several Vercel API calls (`list_projects`, `get_project`,
  `list_deployments`, `get_deployment`, `get_runtime_errors`,
  `create_git_project`) to confirm deployments and auto-deploy behavior

## Audits created

- A production-outage audit (root-caused the `jose`/`jwks-rsa` ESM crash
  and the Firebase-client crash on `/login`) — **kept**, unrelated to
  visual fidelity, still correct.
- A full scroll-animation performance audit (reveal timing curves,
  cumulative layout shift, frame timing during scroll, one-shot reveal
  behavior) delivered in the previous turn — **this is the clearest
  instance of usage spent without improving visual fidelity.** It
  measured, precisely and correctly, whether a set of animations that
  were themselves the wrong animations behaved smoothly.

## Files created or modified (this list is what actually changed on disk)

Public-site rebuild (branch `feature/studio-public-rebuild`, commit
`9b6323c`): `src/app/(public)/**` (7 route files), `src/app/not-found.tsx`,
`src/components/motion/*` (13 files), `src/components/public/*` (5
files), `src/data/projects.ts`, `src/data/philosophy.ts`,
`src/data/how-it-works.ts`, `src/lib/motion/*` (3 hooks),
`src/styles/studio-public.css`, `scripts/validate-registry.ts`,
`scripts/smoke.ts` (extended), `package.json`, `README.md`,
`ASSET_MANIFEST.md`, `MOTION_SYSTEM.md`, `PROJECT_REGISTRY.md`,
`DEPLOYMENT.md`, `AUDIT_REPORT.md`.

Earlier, separate crash-fix work (branch `fix/login-firebase-config-crash`,
now merged to `main`): `src/lib/firebase/client.ts`,
`src/components/auth/LoginForm.tsx`, `src/app/error.tsx`,
`src/app/login/error.tsx` — **kept, not part of this correction**, these
fixed a real production crash unrelated to visual direction.

## Test passes

Lint clean, production build green, registry validation green, smoke
tests green, Playwright checks green (viewport overflow, keyboard
navigation, reduced motion, frame timing, layout shift) — all run
multiple times across iterative fixes. Every one of these passed
honestly. None of them measured whether the site looked like the
approved references, because none of them were designed to.

## Repeated work

- Four separate debugging scripts (`find-overflow.mjs` through
  `find-overflow4.mjs`) were written in sequence to chase a 6px
  scroll-width discrepancy on one mobile page, before landing on a
  one-line defensive CSS fix (`overflow-x: hidden`).
- The production server was started on eight different ports over the
  session because prior background instances could not be cleanly
  stopped — each restart re-ran the same manual verification steps.

## Work that will now be replaced

Everything visual in the public site: `PublicNav`, `LivingSignalField`,
`GravityInterface`/`OrbitNode`, `DecisionMachine`, `ThoughtField`,
`LayeredArtwork`, `ProjectPortal`'s visual treatment, and the color
tokens and typography in `src/styles/studio-public.css`. The routing
structure, the project registry's data schema (fields, not their visual
presentation), the extracted animation-kit assets themselves, and the
two crash fixes are being kept — see `DEPLOYMENT.md` and this rebuild's
own changes for what's preserved.

## Where usage was spent without improving visual fidelity

In order of scale: (1) the scroll-animation performance audit in the
previous turn, (2) the four overflow-debugging scripts, (3) writing and
then having to rewrite `MOTION_SYSTEM.md`, `ASSET_MANIFEST.md` and
`AUDIT_REPORT.md` to document a visual system that is now being replaced,
(4) eight separate server restarts across different ports for
verification passes that all tested the wrong composition.
