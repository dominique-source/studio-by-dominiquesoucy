# Visual Fidelity Report

This report compares each rebuilt public page against its approved reference
maquette from `Studio_by_Dominique_Soucy_Animation_Kit.zip`
(`00-maquettes/`). Reference/render pairs are saved in `visual-comparisons/`
as `pageN-<name>-reference.png` / `pageN-<name>-render.png`, captured with
Playwright at each page's true full content height (desktop, 1672px wide) —
`render.png` in each pair is the live page, not a mockup.

Every gap below has one root cause: **the animation kit ships no real
photography** — only atmosphere textures, abstract glow graphics,
hand-drawn marks, and one storyboard sketch sheet
(`01-raster-sheets/*.png`). Every photo slot in every maquette shows real
athletes and real environments. Rather than fabricate fake photos (which
would violate "do not invent" the same way an invented URL would), every
photo position is rendered as an honest `PhotoSlot` placeholder — a styled,
clearly-a-placeholder panel sized and framed exactly like the reference
photo, ready to receive a real `<img>` the moment one is supplied. This is
the single biggest and only systematic visual gap on every page; it is not
repeated below per page except where it interacts with something else.

## Page 0 — Homepage (`01-homepage-maquette.png`, route `/`)

**Matches:** two-column hero layout, "Studio by Dominique Soucy" wordmark
in Anton/`font-studio-display`, blue gradient on "Dominique Soucy," nucleus
+ orbiting company nodes with signal-line connections, bottom ecosystem
strip with company pill list, mountain silhouette base, brand palette
(`#030507` black / `#1478ff` blue / white / silver).

**Differs:**
- Hero photo is a placeholder, not the real athlete portrait.
- The maquette's nucleus reads as a photographic/atmospheric glow; ours is
  a CSS globe-grid sphere (SVG ellipses + radial gradient) — same visual
  role (source of the signal lines), built from graphics instead of image
  compositing.
- Company orbit uses simple text/dot nodes rather than the maquette's
  layered photo-fragment collage, again due to the photography gap.

**Why:** photography gap (above). Structure, type, color, and hierarchy
are otherwise faithful.

## Page 1 — Ecosystem (`02-ecosystem-maquette.png`, route `/ecosystem`)

**Matches:** "One studio. Multiple companies." headline placement and
scale, subhead/body copy, six-company orbit (PürInstinct, 5D Athlete,
Ballers Only, In Five, Instinct Studio, The Lab) with weight-based
line/opacity variation, waypoint pulse dots riding the signal lines
(added to echo the maquette's satellite markers), globe nucleus, legend
("Size = priority / Distance = maturity / Opacity = activity"), "Select a
company ↓" prompt, editorial marginalia, mountain base.

**Differs:** company cards are placeholder panels instead of the
maquette's photo-collage cards with film-sprocket framing.

**Why:** photography gap. One structural note: the maquette bakes its nav
bar into the same fixed composition as the canvas below it; the live page
has a real flowing nav bar above a separately-sized canvas, so total page
height differs from the reference image's fixed 941px — this is expected
and correct for a real, scrollable page rather than a static image.

## Page 2 — How It Works (`03-how-it-works-maquette.png`, route `/how-it-works`)

**Matches:** "From instinct to company." headline, subhead, seven-stage
signal line (01 Idea → 07 Grow together) with 03 Prototype and 06 Find the
CEO enlarged/emphasized exactly as in the reference, arrow terminus after
07, per-stage annotation copy, closing statement "The CEO owns the
execution. The Studio protects the philosophy." with the two keywords in
blue, header photo cluster geometry (one large portrait + three supporting
shots with captions).

**Differs:** all photography is placeholder. The maquette layers small
sticky-note-style captions directly onto some photos (e.g. "PRODUCT USERS
REVENUE IMPACT" written on the Monetize image); ours renders those as
plain caption text below the placeholder instead, since there's no image
to write on top of.

**Why:** photography gap.

## Page 3 — Philosophy (`04-philosophy-maquette.png`, route `/philosophy`)

**Matches:** "Sport is Art." headline (Art. in blue), subhead/body, all
five philosophy-field principles verbatim (No more spectators / Play
before structure / Sport should bring people together / Build first,
learn from real use / Independent leaders, shared growth) with their
supporting note lines, signal lines converging on a central field point,
scattered editorial marginalia matching the reference's copy, two
manifesto CTAs at the bottom.

**Differs:** collage photography is placeholder; the two manifesto CTAs
render as disabled buttons rather than links, because no manifesto
document exists yet — linking them to a placeholder URL would have meant
inventing one, which the brief explicitly prohibits.

**Why:** photography gap + no-invented-URLs constraint.

## Page 4 — Pürinstinct Portal (`05-purinstinct-portal-maquette.png`, route `/purinstinct`)

**Matches:** portal chrome (Studio wordmark, "Original sport property"
eyebrow, "Return to the ecosystem" + close control — this page reads as an
overlay reached from the ecosystem map, not a top-level nav destination),
massive "Pürinstinct™" wordmark, subhead, five skill rings (Speed, Foot
skills, Hand skills, IQ, Evasion) connected by one winding signal line,
real stats (10,000+ participants / 150+ schools / One original sport
property — these are treated as confirmed, not invented, per the task
brief), "Enter Pürinstinct →" CTA styled with the glowing border from the
reference, `purinstinct.com` + "Live" status indicator, editorial
marginalia on both sides.

**Differs:** the hero action photo is a placeholder. The CTA is wired to
the real, already-confirmed URL (`https://purinstinct.com`, taken directly
from this maquette, opened in a new tab) — this is the one link on the
entire site that goes to a verified external destination.

**Why:** photography gap. The ecosystem page's PürInstinct node now also
links to this internal portal page, since it's the one company with a
built destination.

## Cross-cutting notes

- **A real, page-breaking layout bug was found and fixed during this
  pass:** every page's `<main>` used `min-h-screen overflow-hidden` while
  being the sole flex child of a `flex flex-column` `<body>` under
  `html, body { height: 100% }`. Per the flexbox spec, a flex item's
  automatic minimum size becomes `0` in an axis whose overflow isn't
  `visible` — so each page's real height (up to ~1740px on
  `/how-it-works`) was silently clipped to exactly one viewport, with the
  rest invisible and unreachable by scrolling, in every real browser, not
  just in screenshots. Fixed by changing `overflow-hidden` to
  `overflow-x-clip` (site-wide, all five pages), which still prevents
  horizontal bleed from edge marginalia without triggering the flex
  min-size rule. Verified with `document.body.scrollHeight` before/after
  on every page.
- **Mobile/tablet responsiveness** (task requirement, not a maquette
  fidelity item per se): the shared-coordinate absolute-canvas technique
  used for desktop composition (nucleus + orbiting cards, philosophy
  field, skill rings, process wave) only reads correctly with enough
  width for several scattered elements at once. Below the `lg` breakpoint
  (1024px, matching this repo's own desktop threshold), every page now
  renders a purpose-built vertical stack of the same content instead of
  shrinking the desktop canvas in place — verified with Playwright at
  390×844 (phone) and 768×1024 (tablet) with zero horizontal overflow on
  any page.
- No official URL was invented anywhere on the site.
  `purinstinct.com` is the only external link and comes directly from the
  approved page4 reference; every other company's `href` stays `null` in
  `src/data/studio-companies.ts`.
