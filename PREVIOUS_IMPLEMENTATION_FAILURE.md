# Previous implementation failure

The prior rebuild of the public Studio site (branch
`feature/studio-public-rebuild`, commit `9b6323c`) was technically
functional — it built, deployed, passed lint, passed a registry
validation script, and scored well on synthetic checks (layout shift,
frame timing, keyboard navigation). None of that is what was being
graded. The assignment was to reproduce four approved visual
compositions. It did not.

## What went wrong

1. **The approved mockups were treated as optional inspiration.** They
   were read once, described in prose, and then set aside while a
   conventional web layout was designed from that description instead of
   from the images themselves. The mockups were never used as a
   region-by-region layout spec.

2. **Cinematic compositions were replaced with generic layouts.** The
   dense, asymmetric, collage-based compositions in page1–page4 became a
   text hero followed by stacked content sections, and a card grid — the
   exact "conventional hero with a paragraph and generic buttons" pattern
   the original brief had explicitly warned against.

3. **Condensed display typography was replaced with a serif font.**
   The approved references use a bold, condensed, athletic sans-serif for
   every headline. The implementation used Fraunces, a serif — already
   loaded in the codebase for the *private* internal tool — because it
   was the path of least resistance, not because it matched the
   reference.

4. **Project imagery was replaced with cards and text.** The mockups show
   real athletes, real competitive imagery and torn film stills as the
   primary visual content. The implementation rendered projects as
   bordered rectangles with a title and a one-line summary — a data
   table with rounded corners, not a visual identity.

5. **The Studio nucleus lost its visual dominance.** In the reference, the
   Studio sits at the exact visual and gravitational center, rendered
   with clear weight and light. In the implementation it was a small
   16×16 circle with a pulsing box-shadow — a UI affordance, not a
   presence.

6. **The ecosystem became a weak diagram of similar blue dots.** Every
   project, regardless of status or importance, was represented by the
   same shape in the same one color at different opacities. The reference
   differentiates projects by actual image content, size, and placement —
   not by a single shared token's alpha channel.

7. **The website inherited too much of the Instinct Studio identity.**
   The animation kit's own CSS tokens name their primary color
   `--studio-blue`, and that value was applied everywhere — nucleus,
   every node, every line, every accent — as if Instinct Studio's
   electric-blue identity *was* the parent Studio's identity. It isn't.
   Instinct Studio is one company inside the ecosystem.

8. **Standard reveal animations were presented as signature motion.**
   `opacity` + `translateY` fade-ins, triggered by `IntersectionObserver`,
   were documented as six named "signature interactions." They are a
   supporting technique, not a signature system — the previous
   `MOTION_SYSTEM.md` overstated what had actually been built.

9. **Technical metrics were prioritized over artistic accuracy.** When
   asked to audit the site, the response was a performance and
   accessibility audit (CLS, frame timing, keyboard traversal,
   stagger-delay curves) instead of a visual comparison against the
   references that were sitting in the repository the entire time.

10. **Tokens and development time were spent auditing the wrong result.**
    Multiple verification passes (Playwright viewport sweeps, scroll-jank
    measurement, reduced-motion checks) were run against a build whose
    fundamental visual direction had already diverged from the brief. All
    of that verification was real and passed honestly — but it verified
    the wrong thing.

## What this document does not do

It does not assign a token or dollar cost to any of this — see
`WASTED_WORK_AND_USAGE_REPORT.md` for what can and cannot be stated
factually about the work already done.
