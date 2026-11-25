"use client";

import { ArrowRight } from "lucide-react";

import { useRegion } from "@/context/RegionContext";
import { SYSTEMS_COPY } from "@/lib/copy";
import { TOKEN } from "@/lib/tokens";
import type { IndustryVertical } from "@/lib/types";

function Spark({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 120 28" className="mt-3 h-7 w-full" aria-hidden="true">
      <path d={d} fill="none" stroke="#38BDF8" strokeWidth="1.4" />
      <path d={`${d} L120 28 L0 28 Z`} fill="rgba(56,189,248,0.12)" stroke="none" />
    </svg>
  );
}

function openStudio(id: IndustryVertical) {
  window.dispatchEvent(new CustomEvent("relay60:select-vertical", { detail: id }));
}

export function SystemsShowcaseSection() {
  const { region } = useRegion();
  return (
    <section id="systems" className={`${TOKEN.SECTION_PY} ${TOKEN.SECTION_BORDER} ${TOKEN.SECTION_ANCHOR}`}>
      <div className={TOKEN.CONTAINER}>
        <p className={TOKEN.EYEBROW_WRAP}>
          <span className={TOKEN.EYEBROW_DASH} />
          {SYSTEMS_COPY.eyebrow}
        </p>
        <h2 className={`${TOKEN.H2} mt-4`}>
          <span className="block font-light">{SYSTEMS_COPY.line1}</span>
          <span className="block font-semibold">{SYSTEMS_COPY.line2}</span>
        </h2>
        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:items-start">
          <article className="lg:col-span-7">
            <div className="overflow-hidden rounded-2xl border border-white/[0.1] bg-[#0B0E14] shadow-[0_24px_80px_rgba(0,0,0,0.7)]">
              <div className="flex">
                <aside className="hidden w-36 flex-col gap-2 border-r border-white/[0.06] bg-[#080A0F] p-3.5 text-[11px] text-slate-500 sm:flex">
                  <span>Inbox</span>
                  <span className="text-slate-200">Command</span>
                  <span>Calendar</span>
                  <span>Audit</span>
                </aside>
                <div className="min-w-0 flex-1 p-4 sm:p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-white">Good morning, Sarah.</p>
                    <span className={TOKEN.BADGE_LIVE}>LIVE</span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {[
                      ["11.4s", "Median Reply", "M2 22 C18 8 28 18 40 14 S70 6 90 12 110 8 118 10"],
                      ["98.6%", "Under-60s SLA", "M2 18 C20 16 30 6 48 12 S78 20 100 8 112 14 118 12"],
                      ["47", "Booked This Month", "M2 20 C16 12 34 22 52 10 S80 4 118 16"],
                      [SYSTEMS_COPY.recovered[region], "Recovered Pipeline", "M2 22 C22 10 40 18 60 8 S90 20 118 6"],
                    ].map(([value, label, path]) => (
                      <div key={label} className="rounded-xl border border-white/[0.07] bg-[#10131A] p-3">
                        <p className="font-mono text-lg text-white">{value}</p>
                        <p className="text-[11px] text-slate-500">{label}</p>
                        <Spark d={path} />
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 rounded-xl border border-white/[0.07] bg-[#080A0F] p-3 text-xs text-slate-400">
                    <p className="text-slate-200">Relay60 Copilot</p>
                    <p className="mt-2">08s reply sent</p>
                    <p>CRM synced</p>
                  </div>
                </div>
              </div>
            </div>
            <p className={`${TOKEN.EYEBROW_WRAP} mt-6`}>
              <span className={TOKEN.EYEBROW_DASH} />
              {SYSTEMS_COPY.one.tag}
            </p>
            <h3 className={`${TOKEN.H3} mt-3`}>{SYSTEMS_COPY.one.title}</h3>
            <p className={`${TOKEN.BODY_SM} mt-2 max-w-xl`}>{SYSTEMS_COPY.one.summary}</p>
            <a href="#simulator" onClick={() => openStudio("dental")} className={`${TOKEN.BTN_SECONDARY} mt-5`}>
              {SYSTEMS_COPY.one.link}
              <ArrowRight className="h-4 w-4" />
            </a>
          </article>
          <article className="lg:col-span-5 lg:mt-20">
            <div className="overflow-hidden rounded-2xl border border-white/[0.1] bg-[#0B0E14] p-4 sm:p-5">
              <div className="flex items-center justify-between text-xs">
                <p className="text-slate-300">Front Desk · After Hours</p>
                <span className={TOKEN.BADGE_CYAN}>84% Autonomous</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-white/[0.07] bg-[#10131A] p-3">
                  <p className="font-mono text-lg text-white">14s</p>
                  <p className="text-[11px] text-slate-500">Avg Response</p>
                  <Spark d="M2 18 C18 8 36 20 58 12 S90 6 118 14" />
                </div>
                <div className="rounded-xl border border-white/[0.07] bg-[#10131A] p-3">
                  <p className="font-mono text-lg text-white">19.5h</p>
                  <p className="text-[11px] text-slate-500">Staff Time Saved</p>
                  <Spark d="M2 20 C24 16 40 6 70 14 S100 22 118 8" />
                </div>
              </div>
              <div className="mt-3 rounded-xl border border-amber-400/25 bg-amber-400/[0.05] p-4">
                <p className="text-sm text-amber-200">Complex quote flagged · Paused for coordinator</p>
                <div className="mt-3 flex gap-2 text-xs">
                  <span className="rounded-full border border-amber-300/30 px-2.5 py-1 text-amber-200">Approve</span>
                  <span className="rounded-full border border-white/15 px-2.5 py-1 text-slate-300">Take over</span>
                </div>
              </div>
            </div>
            <p className={`${TOKEN.EYEBROW_WRAP} mt-6`}>
              <span className={TOKEN.EYEBROW_DASH} />
              {SYSTEMS_COPY.two.tag}
            </p>
            <h3 className={`${TOKEN.H3} mt-3`}>{SYSTEMS_COPY.two.title}</h3>
            <p className={`${TOKEN.BODY_SM} mt-2`}>{SYSTEMS_COPY.two.summary}</p>
            <a href="#simulator" onClick={() => openStudio("trades")} className={`${TOKEN.BTN_SECONDARY} mt-5`}>
              {SYSTEMS_COPY.two.link}
              <ArrowRight className="h-4 w-4" />
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}
