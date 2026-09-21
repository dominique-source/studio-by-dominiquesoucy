"use client";

import { TextureWindow } from "./TextureWindow";

const SHEET = "/assets/studio/film-fragments/film-fragments-transparent.png";

// Cropped windows into the film-fragments sprite sheet — torn film-strip
// stills used as decorative cinematic texture across the public site.
// Each named variant points at a distinct region of the sheet.
const VARIANTS = {
  floodlights: "8% 12%",
  streaks: "50% 15%",
  road: "88% 12%",
  filmstrip: "8% 52%",
  glassShard: "32% 55%",
  track: "62% 52%",
  blueBeam: "92% 55%",
  horizonStreak: "12% 88%",
  frame: "92% 90%",
} as const;

export function FilmFragment({
  variant,
  width = 180,
  height = 140,
  rotate = 0,
  className,
}: {
  variant: keyof typeof VARIANTS;
  width?: number;
  height?: number;
  rotate?: number;
  className?: string;
}) {
  return (
    <TextureWindow
      src={SHEET}
      objectPosition={VARIANTS[variant]}
      width={width}
      height={height}
      rotate={rotate}
      className={className}
    />
  );
}
