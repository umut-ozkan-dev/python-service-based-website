"use client";

import { useRegion } from "@/context/RegionContext";
import { TOKEN } from "@/lib/tokens";
import type { RegionCode } from "@/lib/types";

const OPTIONS: Array<{ code: RegionCode; label: string }> = [
  { code: "US", label: "US $" },
  { code: "UK", label: "UK £" },
];

export function RegionSwitcher({ className = "" }: { className?: string }) {
  const { region, setRegion } = useRegion();
  return (
    <div
      role="group"
      aria-label="Select currency and region"
      className={`inline-flex items-center rounded-full border border-white/[0.1] bg-white/[0.04] p-0.5 ${className}`}
    >
      {OPTIONS.map((option) => {
        const active = region === option.code;
        return (
          <button
            key={option.code}
            type="button"
            aria-pressed={active}
            onClick={() => setRegion(option.code)}
            className={`${TOKEN.FOCUS_RING} ${
              active
                ? "rounded-full bg-white/[0.14] px-2.5 py-1 text-xs font-semibold text-white"
                : "rounded-full px-2.5 py-1 text-xs font-medium text-slate-400 hover:text-white"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
