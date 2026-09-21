"use client";

import type { CSSProperties } from "react";

// Shared implementation behind FilmFragment and EditorialMark: a true
// sprite-sheet crop. Renders the full sheet at its native size and masks
// everything but one pixel rectangle via a negative background-position —
// NOT next/image with object-fit:cover, which scales the *entire* sheet
// down to fit the container (every "fragment" ends up showing almost the
// whole sheet, barely panned — the bug this replaces). Always decorative
// — aria-hidden per the kit's own production rules.
const SHEET_NATIVE_WIDTH = 1536;
const SHEET_NATIVE_HEIGHT = 1024;

export interface SpriteRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function TextureWindow({
  src,
  rect,
  displayWidth,
  rotate = 0,
  className,
  style,
}: {
  src: string;
  rect: SpriteRect;
  /** Rendered width in px; height is derived from the rect's aspect ratio. */
  displayWidth: number;
  rotate?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const scale = displayWidth / rect.width;
  const displayHeight = rect.height * scale;

  return (
    <div
      aria-hidden="true"
      className={`fragment ${className ?? ""}`}
      style={{
        width: displayWidth,
        height: displayHeight,
        overflow: "hidden",
        transform: `rotate(${rotate}deg)`,
        ...style,
      }}
    >
      <div
        style={{
          width: SHEET_NATIVE_WIDTH * scale,
          height: SHEET_NATIVE_HEIGHT * scale,
          backgroundImage: `url(${src})`,
          backgroundSize: `${SHEET_NATIVE_WIDTH * scale}px ${SHEET_NATIVE_HEIGHT * scale}px`,
          backgroundPosition: `${-rect.x * scale}px ${-rect.y * scale}px`,
          backgroundRepeat: "no-repeat",
        }}
      />
    </div>
  );
}
