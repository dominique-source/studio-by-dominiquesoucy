"use client";

import type { ReactNode } from "react";

// Re-keying `children` on `statusKey` restarts the CSS "fragment" reveal
// animation — used whenever a status-dependent block (portal body, node
// detail) swaps content in place.
export function StatusTransition({ statusKey, children }: { statusKey: string; children: ReactNode }) {
  return (
    <div key={statusKey} className="fragment">
      {children}
    </div>
  );
}
