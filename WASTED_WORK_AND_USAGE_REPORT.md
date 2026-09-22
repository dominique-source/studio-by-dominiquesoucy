# Activity report — prior public-landing work

Scope: activity on the public-facing site only (`src/components/landing/`, `src/data/domains.ts`, `src/app/page.tsx`, and the two crash fixes), reconstructed from git history in this repository. I do not have access to another session's token usage or internal tool-call log — where that data would be needed, it's marked unavailable rather than estimated.

## Commits on this surface, in order

| Commit | What it did |
|---|---|
| `6a9c254` | Added `PublicLanding.tsx`, `src/data/domains.ts`, wired `/` to render it for logged-out visitors instead of redirecting straight to `/login`. |
| `1f25086` | Merge of the above (`feature/public-landing-page` branch) into `main`. |
| `5b3eb6a` | Production fix: pinned `jose` to a CJS-compatible version — `jwks-rsa` (pulled in by `firebase-admin`) was resolving to an ESM-only build, causing `ERR_REQUIRE_ESM` and a 500 on every request. |
| `f4ab1b2` | Production fix: `src/lib/firebase/client.ts` called `getAuth()` at module-evaluation time, which throws synchronously when `NEXT_PUBLIC_FIREBASE_*` env vars are absent — exactly the case in the deployed environment, since a real Firebase project was explicitly deferred. Added try/catch, a nullable `clientAuth`, error boundaries (`src/app/error.tsx`, `src/app/login/error.tsx`), and `scripts/smoke.ts` (no test framework existed) to check `/` and `/login` don't crash. |
| (unlabeled, "Add files via upload" ×2) | Added `page1.png`–`page4.png` and `Studio_by_Dominique_Soucy_Animation_Kit.zip` at the repo root. |

## Files created or modified on this surface

`src/components/landing/PublicLanding.tsx`, `src/data/domains.ts`, `src/app/page.tsx`, `src/components/auth/LoginForm.tsx`, `src/lib/firebase/client.ts`, `src/app/error.tsx`, `src/app/login/error.tsx`, `scripts/smoke.ts`, `package.json`/`package-lock.json` (the `jose` pin).

## Test passes

`scripts/smoke.ts` (added in `f4ab1b2`) — checks `/` and `/login` return 200 without a crash marker. This is the only automated check that has ever run against the public surface; there was no design-fidelity check of any kind (no screenshot comparison, no visual regression tooling).

## What was NOT spent here

- No performance audit, Lighthouse run, or Core Web Vitals check exists anywhere in this repo's history for the landing page.
- No animation was implemented, so no time was spent tuning stagger timing, easing, or `IntersectionObserver` thresholds on this surface — there is nothing here to have over-invested in.
- No screenshot-comparison work exists; `visual-comparisons/` does not exist yet.

## Work that will now be replaced

`PublicLanding.tsx` and `src/data/domains.ts` (placeholder roster) are being rebuilt entirely against the approved maquettes. `src/app/page.tsx`'s routing logic (render `PublicLanding` when logged out, otherwise the app) is being kept — it's correct; only what it renders is changing.

## Work that is being kept as-is

Both crash fixes (`5b3eb6a`, `f4ab1b2`) are real production bugs unrelated to visual fidelity and are not being touched. `scripts/smoke.ts` stays and will gain checks for the new routes as they're built.

## Token/session usage

Not available. I was not present for the session(s) that produced `6a9c254` through `f4ab1b2` and have no access to their token counts or internal command logs — only the resulting commits and diffs, which is what this report is built from. I'm not estimating a number to fill that gap.
