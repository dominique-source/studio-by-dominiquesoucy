/**
 * Foundational ground texture used at the base of the homepage and
 * ecosystem compositions — a jagged mountain silhouette, hand-authored as
 * flat polygons (no external image), sitting under the collage.
 */
export function MountainGround({
  className = "",
  position = "absolute",
}: {
  className?: string;
  /** "absolute" pins to the bottom of a positioned ancestor; "static" flows inline. */
  position?: "absolute" | "static";
}) {
  return (
    <svg
      viewBox="0 0 1600 220"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`pointer-events-none h-40 w-full sm:h-56 ${
        position === "absolute" ? "absolute inset-x-0 bottom-0" : ""
      } ${className}`}
    >
      <polygon
        points="0,220 0,140 120,90 240,130 360,60 470,120 600,40 720,110 860,70 980,150 1120,80 1260,140 1380,60 1500,120 1600,90 1600,220"
        fill="#0d131c"
      />
      <polygon
        points="0,220 0,180 160,150 320,190 480,130 660,175 840,120 1020,180 1200,140 1360,190 1600,150 1600,220"
        fill="#161f2c"
      />
      <polygon points="0,220 0,205 200,195 420,215 640,190 860,212 1080,198 1300,216 1600,200 1600,220" fill="#05070a" />
    </svg>
  );
}
