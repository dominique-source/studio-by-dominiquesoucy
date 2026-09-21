"use client";

// A small glowing node — the "signal-pulse" heartbeat from the kit's motion
// tokens. Used at the ends of signal lines and at the Studio nucleus.
export function SignalPulse({
  size = 10,
  className,
  style,
}: {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      aria-hidden="true"
      className={`signal-node ${className ?? ""}`}
      style={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: "50%",
        background: "var(--studio-blue)",
        ...style,
      }}
    />
  );
}
