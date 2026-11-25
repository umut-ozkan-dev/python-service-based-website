"use client";

import { ArrowRight, Pause, Play } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { HeroChronometer } from "@/components/hero/HeroChronometer";
import { HERO_COPY } from "@/lib/copy";
import { TOKEN } from "@/lib/tokens";

export function HeroSection() {
  const [motionPaused, setMotionPaused] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMotionPaused(true);
    }
  }, []);

  return (
    <section className={`relative flex min-h-screen flex-col justify-between overflow-hidden bg-[#040507] pb-10 pt-28 ${motionPaused ? "motion-paused" : ""}`}>
      <div className="pointer-events-none absolute inset-0 hero-ambient" />
      <div className={`${TOKEN.CONTAINER} relative z-10 my-auto grid items-center gap-12 py-8 lg:grid-cols-12`}>
        <div className="lg:col-span-4">
          <h1 className={TOKEN.H1}>
            <span className="block font-light text-white/95">{HERO_COPY.line1}</span>
            <span className="block font-semibold text-white">{HERO_COPY.line2}</span>
            <span className="block font-light text-white/95">{HERO_COPY.line3}</span>
            <span className="block font-light text-slate-400">{HERO_COPY.line4}</span>
          </h1>
          <Link href="/#simulator" className="group mt-8 inline-flex items-center gap-3 text-sm font-medium text-slate-300 transition-colors hover:text-white">
            <span>{HERO_COPY.cta}</span>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 transition-all group-hover:border-white/40 group-hover:bg-white/[0.06]">
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        </div>
        <div className="flex justify-center lg:col-span-5">
          <HeroChronometer paused={motionPaused} />
        </div>
        <div className="flex flex-col items-start lg:col-span-3 lg:items-end lg:text-right">
          <span className={TOKEN.PILL_MUTED}>{HERO_COPY.rightPill}</span>
          <p className="mt-4 font-heading text-xl font-normal leading-snug tracking-tight text-slate-200 sm:text-2xl">
            {HERO_COPY.thesis1}
            <br />
            {HERO_COPY.thesis2}
          </p>
        </div>
      </div>
      <div className={`${TOKEN.CONTAINER} relative z-10 mt-8 flex flex-col items-start justify-between gap-4 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-end`}>
        <div>
          <p className="text-xs font-medium text-slate-300">{HERO_COPY.captionLabel}</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            {HERO_COPY.caption1}
            <br />
            {HERO_COPY.caption2}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setMotionPaused((paused) => !paused)}
          className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.02] px-3.5 py-1.5 text-xs text-slate-400 transition-colors hover:border-white/25 hover:text-white"
        >
          {motionPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
          {motionPaused ? HERO_COPY.resume : HERO_COPY.pause}
        </button>
      </div>
    </section>
  );
}
