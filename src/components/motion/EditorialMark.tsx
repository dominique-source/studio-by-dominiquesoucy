"use client";

import { TextureWindow, type SpriteRect } from "./TextureWindow";

const SHEET = "/assets/studio/editorial-marks/editorial-marks-transparent.png";
const CELL_W = 512;
const CELL_H = 341;

// The sheet is a clean 3x3 grid of hand-drawn marks.
const VARIANTS: Record<string, SpriteRect> = {
  arrowRight: { x: 0, y: 0, width: CELL_W, height: CELL_H },
  circle: { x: CELL_W, y: 0, width: CELL_W, height: CELL_H },
  question: { x: CELL_W * 2, y: 0, width: CELL_W, height: CELL_H },
  cross: { x: 0, y: CELL_H, width: CELL_W, height: CELL_H },
  underline: { x: CELL_W, y: CELL_H, width: CELL_W, height: CELL_H },
  brackets: { x: CELL_W * 2, y: CELL_H, width: CELL_W, height: CELL_H },
  orbit: { x: 0, y: CELL_H * 2, width: CELL_W, height: CELL_H },
  swoosh: { x: CELL_W, y: CELL_H * 2, width: CELL_W, height: CELL_H },
  arrowUpRight: { x: CELL_W * 2, y: CELL_H * 2, width: CELL_W, height: CELL_H },
};

export function EditorialMark({
  variant,
  displayWidth = 110,
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
