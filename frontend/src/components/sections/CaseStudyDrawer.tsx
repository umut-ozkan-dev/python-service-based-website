"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

import { CASE_STUDIES } from "@/lib/copy";
import { TOKEN } from "@/lib/tokens";
import type { IndustryVertical } from "@/lib/types";

export function CaseStudyDrawer({
  study,
  onClose,
  onLaunch,
}: {
  study: keyof typeof CASE_STUDIES | null;
  onClose: () => void;
  onLaunch: (id: IndustryVertical) => void;
}) {
  useEffect(() => {
    if (!study) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [study, onClose]);

  if (!study) return null;
  const item = CASE_STUDIES[study];
  const rows = [
    ["Trigger", item.trigger],
    ["AI reasoning layer", item.reasoning],
    ["Connected tools", item.tools],
    ["Human approval rule", item.rule],
  ];
  return (
    <div className="fixed inset-0 z-[60] flex justify-end bg-black/60 backdrop-blur-sm" role="presentation" onClick={onClose}>
      <aside className="h-full w-full max-w-md overflow-y-auto border-l border-white/[0.1] bg-[#0B0D12] p-6 shadow-2xl" role="dialog" aria-modal="true" aria-label={item.title} onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-heading text-2xl font-medium text-white">{item.title}</h3>
          <button type="button" aria-label="Close" className={TOKEN.BTN_GHOST} onClick={onClose}>
            <X className="h-4 w-4" />
          </button>
        </div>
        <dl className="mt-8 space-y-5">
          {rows.map(([label, body]) => (
            <div key={label} className="border-t border-white/[0.08] pt-4">
              <dt className="text-xs font-medium tracking-wide text-slate-500">{label}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-slate-300">{body}</dd>
            </div>
          ))}
        </dl>
        <button type="button" className={`${TOKEN.BTN_PRIMARY} mt-8 w-full`} onClick={() => onLaunch(study)}>
          Try this workflow
        </button>
      </aside>
    </div>
  );
}
