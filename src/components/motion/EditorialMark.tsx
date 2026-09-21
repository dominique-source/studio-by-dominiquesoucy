"use client";

import { TextureWindow } from "./TextureWindow";

const SHEET = "/assets/studio/editorial-marks/editorial-marks-transparent.png";

// Cropped windows into the editorial-marks sprite sheet — the hand-drawn
// arrows, circles and brackets used as annotation accents. Names describe
// the mark, not its screen position.
const VARIANTS = {
  arrowRight: "8% 12%",
  circle: "50% 12%",
  question: "92% 12%",
  cross: "8% 50%",
  underline: "50% 48%",
  brackets: "92% 48%",
  orbit: "8% 88%",
  swoosh: "50% 85%",
  arrowUpRight: "92% 88%",
} as const;

export function EditorialMark({
  variant,
  width = 96,
  height = 64,
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
