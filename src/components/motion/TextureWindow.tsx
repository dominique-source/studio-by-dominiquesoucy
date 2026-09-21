"use client";

import Image from "next/image";
import type { CSSProperties } from "react";

// Shared implementation behind FilmFragment and EditorialMark: both crop a
// small "window" into one of the studio-animation-kit's full sprite sheets
// via object-position, rather than pre-slicing dozens of individual files.
// Always decorative — aria-hidden per the kit's own production rules.
export function TextureWindow({
  src,
  objectPosition,
  width,
  height,
  rotate = 0,
  className,
  style,
  fadeIn,
}: {
  src: string;
  objectPosition: string;
  width: number;
  height: number;
  rotate?: number;
  className?: string;
  style?: CSSProperties;
  fadeIn?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={`fragment relative overflow-hidden ${fadeIn ? "" : ""} ${className ?? ""}`}
      style={{
        width,
        height,
        transform: `rotate(${rotate}deg)`,
        ...style,
      }}
    >
      <Image
        src={src}
        alt=""
        fill
        sizes={`${width}px`}
        style={{ objectFit: "cover", objectPosition }}
      />
    </div>
  );
}
