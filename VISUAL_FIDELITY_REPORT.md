# Visual fidelity report

Screenshots for every page are in `visual-comparisons/` — `pageN-reference.png` is the approved mockup, `pageN-render.png` is the live build, both captured at 1690×942 (the reference's own resolution). No claim below is made without that screenshot evidence sitting alongside it.

## Page 1 — Ecosystem / Source composition (page1.png)

**Matches:** Studio nucleus centered and dominant, rendered in the corrected solar-gold identity (not Instinct Studio's blue); five flagship companies (PürInstinct, 5D Athlete, Ballers Only, In Five, Instinct Studio) arranged around it as real cropped film-texture tiles, each with its own accent color and status marker; visible blue connection signals from nucleus to every company; condensed Anton headline "ONE STUDIO. MULTIPLE COMPANIES." in the reference's placement and weight; handwritten annotations at the reference's approximate positions; a ground-texture strip anchoring the bottom; "select a company" invitation.

**Differs:** The reference's company images are real athlete photography; this build uses cropped stills from the animation kit's abstract film-fragment sprite sheet instead (torn-glass, floodlight and track textures), since no athlete photography was supplied anywhere in the repository or the kit — inventing stock photography was explicitly ruled out by the brief. The reference shows mountain photography at the base; this build uses an SVG silhouette for the same reason (no mountain asset exists in the supplied kit). The reference's "THE LAB / FUTURE IP" distant node and the full 36-project catalog are represented separately, below this hero, as a dedicated browsable list — cramming all 36 projects into the primary composition would have contradicted the reference's own restraint (5–6 nodes, not 36).

**Remaining to correct:** Real project photography, if and when Dominique supplies it, should replace the film-fragment crops — the tile components (`SourceComposition.tsx`) are already built to take that swap without restructuring.

## Page 2 — How It Works (page2.png)

**Matches:** The exact seven-step sequence from the reference (Idea → Pitch → Prototype → Prove → Monetize → Find the CEO → Grow Together), replacing the previous, unfaithful six-stage "Instinct/Idea/Prototype/Company/CEO/Growth" abstraction entirely. One continuous horizontal signal line runs the full strip. Each stage carries real cropped imagery from the storyboard/film sheets (tactics board for Idea, storyboard grid for Prototype, running-figure sketch for Prove) instead of being a text-only list item. The closing statement ("THE CEO OWNS THE EXECUTION. THE STUDIO PROTECTS THE PHILOSOPHY.") carries the reference's visual weight, with the second line in blue.

**Differs:** The reference's imagery is a mix of real photography and hand-drawn storyboard sketches on one continuous canvas; this build's real assets are exclusively the supplied storyboard/film sprite sheets, arranged as discrete cards in a horizontally scroll-snapping strip rather than one seamless painted composition (a horizontal scroll strip is a legitimate, common responsive translation of a "cinematic journey" that also solves the reference's implicit need to work at any viewport width, not just its native 1690px canvas).

**Remaining to correct:** None structural; would benefit from real photography for the "Prove" and "Monetize" stages if supplied later.

## Page 3 — Philosophy (page3.png)

**Matches:** Dominant "SPORT IS ART." statement with the reference's word-level color split (white / blue); a connected field of ten authored principles (not independent text blocks) joined by drawn signal lines; a central physical anchor object (rendered as a lit sphere, since no basketball/soccer-ball photograph was supplied); two of the ten principles carry real film-texture imagery, breaking up the field the same way the reference mixes photography with text.

**Differs:** The reference shows several images (a basketball dunk, a soccer ball, crowd photography) distributed across the whole field; this build uses only two texture cards plus the central anchor, since only two of the film-fragment crops read as generically applicable without misrepresenting a specific unphotographed scene. Two initial layout drafts had genuine text-overlap bugs (found and fixed during this pass — see spacing in `ThoughtField.tsx`'s `POSITIONS` map).

**Remaining to correct:** More imagery per principle if real photography becomes available.

## Page 4 — PürInstinct portal (page4.png)

**Matches:** Monumental "PÜRINSTINCT" title at the reference's scale and weight; the five skill dimensions (Speed, Hand Skills, Foot Skills, Evasion, IQ) as connected badges radiating from a central point, in PürInstinct's own rust/orange identity (not the Studio's gold or Instinct Studio's blue); the three stats (10,000+ Participants, 150+ Schools, One Original Sport Property); a strong "Enter PürInstinct" CTA to the real official URL; "Return to the ecosystem" control; this is a bespoke component (`PurinstinctPortal.tsx`), not the generic project template — the brief's explicit demonstration of a company having its own identity.

**Differs:** The reference's background is a real action photograph of five athletes mid-play; this build uses a low-opacity film-fragment texture instead, for the same no-invented-photography reason as page 1.

**A real bug found and fixed during this page's construction, worth recording:** Anton (the condensed display font) renders the character "Ü" as a broken/empty glyph at large display sizes — reproduced with a literal hardcoded uppercase string, ruling out a `text-transform` synthesis issue, a Google Fonts subset issue, and a loading issue. Every place a project title renders in Anton now routes through a small `DisplayText` helper that substitutes just that one character into the Inter fallback font at matching weight — verified fixed via screenshot, not assumed.

**Remaining to correct:** Real athlete photography, if supplied.

## Cross-cutting

Two real layout bugs were found and fixed via this screenshot-comparison process itself (not assumed fixed): text overlap in the Philosophy field's node spacing, and stage-1 clipping at the start of the How It Works horizontal strip. Both are visible as corrected in the current `pageN-render.png` files.
