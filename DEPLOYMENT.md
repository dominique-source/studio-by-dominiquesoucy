# Deployment — manual steps for Dominique

Everything below is the only thing left to do. The build passes, the
private tool is untouched, and Vercel's Git integration already
auto-deploys on push (confirmed working earlier).

1. **Review the preview deployment** for branch `feature/studio-public-rebuild`
   (link posted in the session's final report / Vercel dashboard). Open it
   on a phone and a laptop.
2. **Confirm or correct the project registry content** in
   `src/data/projects.ts` — every summary and status not explicitly given
   in the original brief was written conservatively (see
   `PROJECT_REGISTRY.md`'s "Calls made without direct evidence" section).
   In particular: confirm 5D Athlete's real status (`ACTIVE` vs the
   mockup's `LIVE`), and confirm whether Instinct nonprofit should be
   `ACTIVE` instead of `CONCEPT`.
3. **Merge `feature/studio-public-rebuild` into `main`** once approved.
   Pushing to `main` deploys to production automatically — no other action
   needed.
4. **Nothing to configure in Vercel.** No new environment variables, no
   new build settings, no new dependencies were added. The public site
   has zero Firebase dependency (every public page is static or has no
   external data need), so it isn't affected by the private tool's
   still-outstanding Firebase setup (documented separately, above, in the
   private-tool section of this README).
