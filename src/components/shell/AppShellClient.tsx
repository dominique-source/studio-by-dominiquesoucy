"use client";

import { useState, type ReactNode } from "react";
import { Sidebar } from "@/components/shell/Sidebar";
import { TopBar } from "@/components/shell/TopBar";
import { CaptureBar } from "@/components/shell/CaptureBar";
import { FichePanel } from "@/components/fiche/FichePanel";
import { SelectionProvider } from "@/components/shell/selection-context";

export function AppShellClient({
  member,
  views,
  children,
}: {
  member: { displayName: string; email: string; isAdmin: boolean };
  views: { id: string; name: string }[];
  children: ReactNode;
}) {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {navOpen && (
        <button
          aria-label="Fermer la navigation"
          onClick={() => setNavOpen(false)}
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
        />
      )}
      <div
        className={`fixed inset-y-0 left-0 z-40 transition-transform duration-200 md:static md:translate-x-0 ${
          navOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar member={member} views={views} onNavigate={() => setNavOpen(false)} />
      </div>
      <SelectionProvider>
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar onOpenMenu={() => setNavOpen(true)} />
          <div className="flex min-h-0 flex-1">
            <div className="relative min-w-0 flex-1 overflow-hidden">
              {children}
              <CaptureBar />
            </div>
            <FichePanel />
          </div>
        </div>
      </SelectionProvider>
    </div>
  );
}
