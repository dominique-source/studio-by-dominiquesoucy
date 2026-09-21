"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";
import { usePrefersReducedMotion } from "@/lib/motion/usePrefersReducedMotion";

const MAX_SHIFT = 8;

// A CTA that leans a few pixels toward the pointer on hover — desktop
// mouse only (a touch device has no hover to trigger this), clamped to a
// small, non-disorienting shift, and fully inert under reduced motion.
export function MagneticCTA({
  href,
  onClick,
  variant = "primary",
  children,
}: {
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  children: ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  const reduced = usePrefersReducedMotion();

  function handleMouseMove(event: MouseEvent<HTMLElement>) {
    if (reduced || !ref.current || !window.matchMedia("(hover: hover)").matches) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2 * MAX_SHIFT;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2 * MAX_SHIFT;
    ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }

  function handleMouseLeave() {
    if (ref.current) ref.current.style.transform = "translate3d(0, 0, 0)";
  }

  const className =
    variant === "primary"
      ? "inline-flex items-center gap-2 rounded-sm px-6 py-3 font-display text-sm font-bold uppercase tracking-[0.08em] transition-colors duration-200"
      : "inline-flex items-center gap-2 rounded-sm border px-6 py-3 font-display text-sm font-bold uppercase tracking-[0.08em] transition-colors duration-200";

  const style =
    variant === "primary"
      ? { background: "var(--studio-blue)", color: "var(--studio-black)", transitionTimingFunction: "var(--ease-cinematic)" }
      : { borderColor: "var(--studio-line)", color: "var(--studio-white)", transitionTimingFunction: "var(--ease-cinematic)" };

  if (href) {
    return (
      <a
        ref={ref}
        href={href}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={className}
        style={style}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={style}
    >
      {children}
    </button>
  );
}
