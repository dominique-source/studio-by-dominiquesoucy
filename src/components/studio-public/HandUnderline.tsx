/**
 * Small hand-drawn accent underline, in the crayon-stroke language of the
 * approved editorial-marks sheet (studio-kit/raster). Drawn inline rather
 * than cropped from the raster sheet so its position/size stay exact and
 * verifiable, instead of guessed offsets into a 1536×1024 composite image.
 */
export function HandUnderline({ width = 96, className = "" }: { width?: number; className?: string }) {
  const h = 10;
  return (
    <svg
      width={width}
      height={h}
      viewBox={`0 0 ${width} ${h}`}
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d={`M2 6 C ${width * 0.3} 2, ${width * 0.7} 9, ${width - 2} 4`}
        stroke="var(--studio-blue)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d={`M2 8 C ${width * 0.3} 5, ${width * 0.7} 10, ${width - 2} 7`}
        stroke="var(--studio-white)"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}
