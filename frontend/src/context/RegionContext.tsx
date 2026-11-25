"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { REGION_CONFIG, type RegionMetadata } from "@/lib/region-config";
import type { RegionCode } from "@/lib/types";

const STORAGE_KEY = "relay60_region_v1";

interface RegionContextValue {
  region: RegionCode;
  setRegion: (next: RegionCode) => void;
  config: RegionMetadata;
  isHydrated: boolean;
}

const RegionContext = createContext<RegionContextValue | null>(null);

export function RegionProvider({ children }: { children: React.ReactNode }) {
  const [region, setRegionState] = useState<RegionCode>("US");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "US" || saved === "UK") {
        setRegionState(saved);
      } else if (Intl.DateTimeFormat().resolvedOptions().timeZone === "Europe/London") {
        setRegionState("UK");
      }
    } catch {
      /* storage unavailable */
    }
    setIsHydrated(true);
  }, []);

  const setRegion = useCallback((next: RegionCode) => {
    setRegionState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const value = useMemo<RegionContextValue>(
    () => ({ region, setRegion, config: REGION_CONFIG[region], isHydrated }),
    [region, setRegion, isHydrated],
  );

  return <RegionContext.Provider value={value}>{children}</RegionContext.Provider>;
}

export function useRegion(): RegionContextValue {
  const value = useContext(RegionContext);
  if (!value) {
    throw new Error("useRegion must be used within RegionProvider");
  }
  return value;
}
