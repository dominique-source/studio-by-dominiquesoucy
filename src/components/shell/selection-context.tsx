"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { ViewMode } from "@/lib/types";

export interface ViewItemRef {
  viewId: string;
  itemId: string;
}

interface SelectionContextValue {
  selectedEntityId: string | null;
  select: (id: string | null, viewItem?: ViewItemRef | null) => void;
  selectedViewItem: ViewItemRef | null;
  mode: ViewMode;
  setMode: (mode: ViewMode) => void;
}

const SelectionContext = createContext<SelectionContextValue | null>(null);

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [selectedViewItem, setSelectedViewItem] = useState<ViewItemRef | null>(null);
  const [mode, setMode] = useState<ViewMode>("real");

  const select = useCallback((id: string | null, viewItem: ViewItemRef | null = null) => {
    setSelectedEntityId(id);
    setSelectedViewItem(viewItem);
  }, []);

  return (
    <SelectionContext.Provider value={{ selectedEntityId, select, selectedViewItem, mode, setMode }}>
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection() {
  const ctx = useContext(SelectionContext);
  if (!ctx) throw new Error("useSelection doit être utilisé dans SelectionProvider");
  return ctx;
}
