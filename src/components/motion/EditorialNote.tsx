"use client";

import type { CSSProperties } from "react";

// A short handwritten-style editorial annotation, exactly the kind
// scattered through every approved reference ("Same human different
// angles.", "Discipline creates freedom."). Caveat only — never used for
// a page title.
export function EditorialNote({
  children,
  rotate = -2,
  className,
  style,
}: {
  children: React.ReactNode;
  rotate?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <p
      className={`font-hand text-lg leading-tight sm:text-xl ${className ?? ""}`}
      style={{
        color: "var(--studio-white)",
        transform: `rotate(${rotate}deg)`,
        textShadow: "0 1px 8px rgba(0,0,0,0.6)",
        ...style,
      }}
    >
      {children}
      <span
        aria-hidden="true"
        className="mt-0.5 block h-[2px] w-2/3"
        style={{ background: "var(--studio-gold)", opacity: 0.7 }}
      />
    </p>
  );
}
