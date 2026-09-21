"use client";

import { TextureWindow, type SpriteRect } from "./TextureWindow";

const SHEET = "/assets/studio/storyboard-fragments/storyboard-prototype-fragments-transparent.png";

// Approximate pixel rectangles surveyed on the 1536x1024 sheet.
const VARIANTS: Record<string, SpriteRect> = {
  runningFigure: { x: 20, y: 10, width: 480, height: 420 },
  tacticsBoard: { x: 540, y: 40, width: 470, height: 380 },
  runningGirl: { x: 1060, y: 10, width: 460, height: 420 },
  mobileWireframe: { x: 20, y: 470, width: 300, height: 520 },
  storyboardGrid: { x: 360, y: 470, width: 470, height: 520 },
  jumpSequence: { x: 870, y: 500, width: 240, height: 480 },
  diagonalStripe: { x: 1140, y: 470, width: 380, height: 520 },
};

export function StoryboardFragment({
  variant,
  displayWidth = 200,
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
