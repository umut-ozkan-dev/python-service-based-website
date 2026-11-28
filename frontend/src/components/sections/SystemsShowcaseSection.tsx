"use client";

import { useState } from "react";

import { CaseStudyDrawer } from "@/components/sections/CaseStudyDrawer";
import { useRegion } from "@/context/RegionContext";
import { CASE_STUDIES, SYSTEMS_COPY } from "@/lib/copy";
import { TOKEN } from "@/lib/tokens";

const SPARK_COLORS = ["#38BDF8", "#34D399", "#A78BFA", "#F59E0B"];

function Spark({ d, color }: { d: string; color: string }) {
  return (
    <svg viewBox="0 0 120 28" className="mt-3 h-7 w-full" aria-hidden="true">
      <path d={d} fill="none" stroke={color} strokeWidth="1.4" />
    </svg>
  );
}

function Chrome({ title, status, showSearch = false }: { title: string; status: string; showSearch?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-3">
      <div className="flex min-w-0 items-center gap-2">
        <span className="h-2 w-2 shrink-0 rounded-full bg-white/20" />
        <span className="h-2 w-2 shrink-0 rounded-full bg-white/15" />
        <span className="h-2 w-2 shrink-0 rounded-full bg-white/10" />
        <p className="ml-2 shrink-0 whitespace-nowrap text-xs text-slate-300">{title}</p>
      </div>
      <div className="flex items-center gap-2">
        {showSearch ? <span className="hidden shrink-0 whitespace-nowrap rounded-full border border-white/10 px-2 py-1 text-[10px] text-slate-500 sm:inline">Search records... ⌘K</span> : null}
        <span className={`${TOKEN.BADGE_LIVE} shrink-0 whitespace-nowrap`}>{status}</span>
      </div>
    </div>
  );
}

export function SystemsShowcaseSection() {
  const { region } = useRegion();
  const review = SYSTEMS_COPY.review[region];
  const [study, setStudy] = useState<keyof typeof CASE_STUDIES | null>(null);
  const metrics = [
    ["14s", "Median reply", "-62%", "M2 22 C18 8 28 18 40 14 S70 6 90 12 110 8 118 10"],
    ["94%", "Handled automatically", "99.1%", "M2 18 C20 16 30 6 48 12 S78 20 100 8 112 14 118 12"],
    ["38", "Bookings this week", "+18%", "M2 20 C16 12 34 22 52 10 S80 4 118 16"],
    [SYSTEMS_COPY.recovered[region], "Booked pipeline", "+24%", "M2 22 C22 10 40 18 60 8 S90 20 118 6"],
  ];

  return (
    <section id="systems" className={`${TOKEN.SECTION_PY} ${TOKEN.SECTION_BORDER} ${TOKEN.SECTION_ANCHOR}`}>
      <div className={TOKEN.CONTAINER}>
        <p className={TOKEN.EYEBROW_WRAP}><span className={TOKEN.EYEBROW_DASH} />{SYSTEMS_COPY.eyebrow}</p>
        <h2 className={`${TOKEN.H2} mt-4`}>
          <span className="block font-light">{SYSTEMS_COPY.line1}</span>
          <span className="block font-semibold">{SYSTEMS_COPY.line2}</span>
        </h2>
        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:items-start">
          <article className="lg:col-span-7">
            <div className="overflow-hidden rounded-2xl border border-white/[0.1] bg-[#0B0E14] shadow-[0_24px_80px_rgba(0,0,0,0.7)]">
              <Chrome title="Today's intake" status="ACTIVE" showSearch />
              <div className="grid grid-cols-2 gap-2 p-4">
                {metrics.map(([value, label, delta, path], index) => (
                  <div key={label} className="rounded-xl border border-white/[0.07] bg-[#10131A] p-3">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="font-mono text-lg text-white">{value}</p>
                      <p className="text-[10px] text-slate-500">{delta}</p>
                    </div>
                    <p className="text-[11px] text-slate-500">{label}</p>
                    <Spark d={path} color={SPARK_COLORS[index]} />
                  </div>
                ))}
              </div>
              <div className="mx-4 mb-4 rounded-xl border border-white/[0.07] bg-[#080A0F] p-3 text-xs text-slate-400">
                <p className="text-slate-200">Recent activity</p>
                <p className="mt-2">19:42 · Jordan Hale — Intake booked for Thu 11:00</p>
                <p className="mt-1">19:48 · Avery Chen — DPA received, waiting on approval</p>
              </div>
            </div>
            <p className={`${TOKEN.EYEBROW_WRAP} mt-6`}><span className={TOKEN.EYEBROW_DASH} />{SYSTEMS_COPY.one.tag}</p>
            <h3 className={`${TOKEN.H3} mt-3`}>{SYSTEMS_COPY.one.title}</h3>
            <p className={`${TOKEN.BODY_SM} mt-2 max-w-xl`}>{SYSTEMS_COPY.one.summary}</p>
            <div className="mt-5">
              <button type="button" className={TOKEN.BTN_SECONDARY} onClick={() => setStudy("lead_ops")}>{SYSTEMS_COPY.one.inspect}</button>
            </div>
          </article>
          <article className="lg:col-span-5 lg:mt-20">
            <div className="overflow-hidden rounded-2xl border border-white/[0.1] bg-[#0B0E14]">
              <Chrome title="Field dispatch & quoting" status="78% autonomous" />
              <div className="grid grid-cols-2 gap-2 p-4">
                <div className="rounded-xl border border-white/[0.07] bg-[#10131A] p-3">
                  <p className="font-mono text-lg text-white">18s</p>
                  <p className="text-[11px] text-slate-500">First reply</p>
                  <Spark d="M2 18 C18 8 36 20 58 12 S90 6 118 14" color="#38BDF8" />
                </div>
                <div className="rounded-xl border border-white/[0.07] bg-[#10131A] p-3">
                  <p className="font-mono text-lg text-white">16 hrs</p>
                  <p className="text-[11px] text-slate-500">Admin saved / wk</p>
                  <Spark d="M2 20 C24 16 40 6 70 14 S100 22 118 8" color="#F59E0B" />
                </div>
              </div>
              <div className="mx-4 mb-4 rounded-xl border border-amber-400/25 bg-amber-400/[0.05] p-4">
                <p className="text-sm text-amber-200">{review.title}</p>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">{review.body}</p>
                <div className="mt-3 flex gap-2 text-xs">
                  <span className="rounded-full border border-amber-300/30 px-2.5 py-1 text-amber-200">Send quote</span>
                  <span className="rounded-full border border-white/15 px-2.5 py-1 text-slate-300">Take over</span>
                </div>
              </div>
            </div>
            <p className={`${TOKEN.EYEBROW_WRAP} mt-6`}><span className={TOKEN.EYEBROW_DASH} />{SYSTEMS_COPY.two.tag}</p>
            <h3 className={`${TOKEN.H3} mt-3`}>{SYSTEMS_COPY.two.title}</h3>
            <p className={`${TOKEN.BODY_SM} mt-2`}>{SYSTEMS_COPY.two.summary}</p>
            <div className="mt-5">
              <button type="button" className={TOKEN.BTN_SECONDARY} onClick={() => setStudy("dispatch_quotes")}>{SYSTEMS_COPY.two.inspect}</button>
            </div>
          </article>
        </div>
      </div>
      <CaseStudyDrawer study={study} onClose={() => setStudy(null)} />
    </section>
  );
}
