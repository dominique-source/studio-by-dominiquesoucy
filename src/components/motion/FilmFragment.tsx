"use client";

import { TextureWindow, type SpriteRect } from "./TextureWindow";

const SHEET = "/assets/studio/film-fragments/film-fragments-transparent.png";

// Approximate pixel rectangles for each distinct fragment on the
// 1536x1024 sheet (visually surveyed — the kit ships no coordinate
// manifest). Each is a genuinely separate torn-film-strip still, not an
// object-position pan across the whole sheet.
const VARIANTS: Record<string, SpriteRect> = {
  floodlights: { x: 20, y: 10, width: 630, height: 300 },
  streaks: { x: 730, y: 40, width: 340, height: 290 },
  road: { x: 1150, y: 40, width: 320, height: 300 },
  filmstrip: { x: 30, y: 350, width: 220, height: 350 },
  glassShard: { x: 300, y: 350, width: 400, height: 350 },
  track: { x: 730, y: 420, width: 480, height: 260 },
  blueBeam: { x: 1250, y: 370, width: 240, height: 330 },
  horizonStreak: { x: 30, y: 740, width: 590, height: 250 },
  frame: { x: 1120, y: 730, width: 370, height: 280 },
};

export function FilmFragment({
  variant,
  displayWidth = 220,
  rotate = 0,
  className,
}: {
  variant: keyof typeof VARIANTS;
  displayWidth?: number;
  rotate?: number;
  className?: string;
}) {
  return (
    <TextureWindow
      src={SHEET}
      rect={VARIANTS[variant]}
      displayWidth={displayWidth}
      rotate={rotate}
      className={className}
    />
  );
}
