"use client";

// A small glowing node — the "signal-pulse" heartbeat from the kit's motion
// tokens. Used at the ends of signal lines and at the Studio nucleus.
export function SignalPulse({
  size = 10,
  color = "var(--studio-blue)",
  colorSoft = "var(--studio-blue-soft)",
  className,
  style,
}: {
  size?: number;
  /** Defaults to blue (relationships / Instinct Studio). Pass the gold
   * tokens for the Studio nucleus itself. */
  color?: string;
  colorSoft?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      aria-hidden="true"
      className={`signal-node ${className ?? ""}`}
      style={
        {
          display: "inline-block",
          width: size,
          height: size,
          borderRadius: "50%",
          background: color,
          "--pulse-color": color,
          "--pulse-color-soft": colorSoft,
          ...style,
        } as React.CSSProperties
      }
    />
  );
}
