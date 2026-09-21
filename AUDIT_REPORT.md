# Audit report

## What was broken

Three separate, unrelated problems, found and fixed across this project's
history in this repository:

1. **Production 500 on every request** (fixed earlier, commit `5b3eb6a`).
   `firebase-admin` → `jwks-rsa@4.1.0` did a plain CommonJS `require('jose')`
   against a pure-ESM `jose@6.x`, throwing `ERR_REQUIRE_ESM` on every
   request that touched auth — which included `/`. Fixed with an npm
   `overrides` pin to `jose@4.15.5` (last dual CJS/ESM release).

2. **`/login` crashing with Next.js's generic error screen** (fixed
   earlier, commit `f4ab1b2`). `src/lib/firebase/client.ts` called
   `getAuth()` at module-evaluation time; with no real Firebase project
   configured in Vercel, that threw `auth/invalid-api-key` uncaught during
   SSR. Fixed by making the client init defensive (nullable `clientAuth`,
   caught in a try/catch) and adding `error.tsx` boundaries.

3. **No public-facing content existed at all** (this rebuild). `/`
   unconditionally redirected every visitor to `/login` — there was no
   public homepage, no ecosystem page, no philosophy page, nothing. This
   is what the current rebuild request addressed.

## Why Vercel failed

Items 1–2 were genuine runtime bugs (see their commit messages for full
detail) — not Vercel misconfiguration. Item 3 was never a "failure" in the
technical sense: the app was, by design, a fully private internal tool
(its own README calls it *"Application privée"*). It simply had no public
site layered in front of it until now.

## What was changed (this rebuild)

- Extracted the supplied `Studio_by_Dominique_Soucy_Animation_Kit.zip`
  (uploaded to the repo root mid-session) into `public/assets/studio/`,
  organized per the suggested structure. Original ZIP preserved at the
  repo root, untouched.
- Added a new `(public)` route group with its own dark theme
  (`src/styles/studio-public.css`, scoped — the private tool's ivory
  theme is untouched) and five new routes: `/`, `/ecosystem`,
  `/how-it-works`, `/philosophy`, `/projects/[slug]`, `/private`.
  Removed the placeholder single-page landing built earlier this session
  (`src/components/landing/`, `src/data/domains.ts`) — superseded by this
  fuller build.
- Built a 36-entry project registry (`src/data/projects.ts`) covering
  every project named in the brief, plus the twelve motion primitives and
  six signature interactions documented in `MOTION_SYSTEM.md`.
- Added `scripts/validate-registry.ts` (`npm run validate:registry`) and
  extended `scripts/smoke.ts` — no test framework existed in this repo;
  both are dependency-free scripts run via the already-installed `tsx`.
- `not-found.tsx` — a styled 404 in the same dark theme.

The private tool (`(app)/`, `/login`, `src/lib/firebase/`,
`src/lib/server/`, Firestore rules, Firebase Admin) was **not modified**
in this pass beyond the two fixes in items 1–2 above, both already shipped
before this rebuild started.

## Remaining manual configuration

See `DEPLOYMENT.md` — in short: review the preview, confirm two
uncertain project statuses, then merge to `main`. No Vercel settings, env
vars, or dependencies need to change.

## Routes tested

Verified locally via a production build (`npm run build` + `npm run
start`) and Playwright, at 1440×900, 768×1024 and 390×844:

- `/`, `/ecosystem`, `/how-it-works`, `/philosophy`, `/private` — 200,
  zero console errors, zero horizontal overflow at any width.
- `/projects/purinstinct` and `/projects/sports-district` (one `LIVE`
  featured project, one `FUTURE` unfeatured project) — 200, same checks.
- `/projects/this-project-does-not-exist` — 404, no crash.
- `/carte` (private tool) — still 307s to `/login` when logged out,
  confirming the private tool's protection is untouched.
- `/login` — still renders 200 (the earlier fix holds).
- Keyboard: Tab reaches every ecosystem node; Enter opens a project's
  portal; Escape closes it and returns focus.
- `prefers-reduced-motion: reduce` — homepage hero renders its static
  composition immediately, fully legible, no motion.

Two real bugs were found and fixed during this verification pass (not
before): orbit node labels overflowing at tablet width when
un-abbreviated (`OrbitNode.tsx`, now wraps within a fixed max-width), and
the nav overflowing at 390px width (`PublicNav.tsx`, tightened spacing and
dropped the redundant "Studio" link already served by the logo). A
residual few-pixel scrollWidth discrepancy tied to the portal's
CSS-transform reveal animation was closed defensively with `overflow-x:
hidden` on the public layout.

## Build result

`npm run lint` — clean (one pre-existing, unrelated warning in
`scripts/seed.ts`). `npm run build` — succeeds; `/`, `/ecosystem`,
`/how-it-works`, `/philosophy`, `/private` and all 36 `/projects/[slug]`
pages prerender statically. `npm run validate:registry` — all checks
pass. `npm run smoke` — all checks pass, including confirmation that the
private tool's protected routes still redirect correctly.
