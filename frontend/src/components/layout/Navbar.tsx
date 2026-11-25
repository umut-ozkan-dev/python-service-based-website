"use client";

import {
  ArrowUpRight,
  Bot,
  Building2,
  Calendar,
  ChevronDown,
  Database,
  Menu,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { RegionSwitcher } from "@/components/layout/RegionSwitcher";
import { CAPABILITIES_MENU, INDUSTRIES_MENU } from "@/lib/copy";
import type { IndustryVertical } from "@/lib/types";

const CAPABILITY_ICONS = {
  "lead-response": Zap,
  "front-desk": Bot,
  "crm-sync": Database,
  booking: Calendar,
  "follow-up": RefreshCw,
  escalation: ShieldCheck,
} as const;

const INDUSTRY_ICONS = {
  dental: Building2,
  medspa: Sparkles,
  trades: Workflow,
  clinics_legal: Users,
} as const;

type MenuName = "capabilities" | "industries" | null;

export function Navbar() {
  const [openMenu, setOpenMenu] = useState<MenuName>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenMenu(null);
    };
    const onPointer = (event: MouseEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setOpenMenu(null);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onPointer);
    };
  }, []);

  function selectIndustry(id: IndustryVertical) {
    setOpenMenu(null);
    setMobileOpen(false);
    window.dispatchEvent(new CustomEvent("relay60:select-vertical", { detail: id }));
    document.getElementById("simulator")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      <div className="relative mx-auto max-w-6xl">
        <div className="flex h-14 items-center justify-between rounded-full border border-white/[0.1] bg-[#090B0F]/85 px-4 shadow-[0_12px_40px_rgba(0,0,0,0.65)] backdrop-blur-xl sm:px-5">
          <Link href="/" className="font-heading text-lg font-semibold tracking-tight text-white" onClick={() => setOpenMenu(null)}>
            relay60<span className="text-sky-400">.</span>
          </Link>
          <nav ref={navRef} aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            <button
              type="button"
              aria-expanded={openMenu === "capabilities"}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm ${openMenu === "capabilities" ? "bg-white/[0.08] text-white" : "text-slate-300 hover:text-white"}`}
              onClick={() => setOpenMenu((current) => (current === "capabilities" ? null : "capabilities"))}
            >
              Capabilities
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${openMenu === "capabilities" ? "rotate-180" : ""}`} />
            </button>
            <button
              type="button"
              aria-expanded={openMenu === "industries"}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm ${openMenu === "industries" ? "bg-white/[0.08] text-white" : "text-slate-300 hover:text-white"}`}
              onClick={() => setOpenMenu((current) => (current === "industries" ? null : "industries"))}
            >
              Industries
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${openMenu === "industries" ? "rotate-180" : ""}`} />
            </button>
            <Link href="/#systems" className="rounded-full px-3 py-1.5 text-sm text-slate-300 hover:text-white" onClick={() => setOpenMenu(null)}>
              Systems
            </Link>
            <Link href="/#roi-calculator" className="rounded-full px-3 py-1.5 text-sm text-slate-300 hover:text-white" onClick={() => setOpenMenu(null)}>
              ROI
            </Link>
            <Link href="/#pricing" className="rounded-full px-3 py-1.5 text-sm text-slate-300 hover:text-white" onClick={() => setOpenMenu(null)}>
              Pricing
            </Link>
          </nav>
          <div className="hidden items-center gap-2.5 lg:flex">
            <RegionSwitcher />
            <Link href="/#book-call" className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-black transition-colors hover:bg-slate-200">
              Book a call
            </Link>
          </div>
          <button type="button" className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-300 lg:hidden" aria-expanded={mobileOpen} aria-controls="mobile-nav" onClick={() => setMobileOpen((open) => !open)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Menu</span>
          </button>
        </div>

        {openMenu ? (
          <div className="absolute left-1/2 top-[4.25rem] w-[min(92vw,680px)] -translate-x-1/2 rounded-2xl border border-white/[0.1] bg-[#0B0D12]/98 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.85)] backdrop-blur-2xl">
            <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">
              {openMenu === "capabilities" ? "Capabilities" : "Industries"}
            </p>
            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {openMenu === "capabilities"
                ? CAPABILITIES_MENU.map((item) => {
                    const Icon = CAPABILITY_ICONS[item.id];
                    return (
                      <Link key={item.id} href={item.href} onClick={() => setOpenMenu(null)} className="group flex gap-3 rounded-xl p-2.5 hover:bg-white/[0.04]">
                        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-slate-300 group-hover:border-sky-400/40 group-hover:text-sky-300">
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span>
                          <span className="block text-sm font-medium text-white">{item.title}</span>
                          <span className="mt-0.5 block text-xs text-slate-400">{item.desc}</span>
                        </span>
                      </Link>
                    );
                  })
                : INDUSTRIES_MENU.map((item) => {
                    const Icon = INDUSTRY_ICONS[item.id];
                    return (
                      <button key={item.id} type="button" onClick={() => selectIndustry(item.id)} className="group flex gap-3 rounded-xl p-2.5 text-left hover:bg-white/[0.04]">
                        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-slate-300 group-hover:border-sky-400/40 group-hover:text-sky-300">
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span>
                          <span className="block text-sm font-medium text-white">{item.title}</span>
                          <span className="mt-0.5 block text-xs text-slate-400">{item.desc}</span>
                        </span>
                      </button>
                    );
                  })}
            </div>
            <Link href="/#simulator" onClick={() => setOpenMenu(null)} className="mt-4 flex items-center justify-between border-t border-white/[0.07] pt-3.5 text-xs text-slate-400 hover:text-white">
              Open interactive workflow studio
              <ArrowUpRight className="h-3.5 w-3.5 text-sky-400" />
            </Link>
          </div>
        ) : null}

        {mobileOpen ? (
          <div id="mobile-nav" className="mt-2 rounded-2xl border border-white/[0.1] bg-[#0B0D12]/95 p-5 backdrop-blur-xl lg:hidden">
            <div className="flex flex-col gap-2 text-sm text-slate-200">
              {CAPABILITIES_MENU.map((item) => (
                <Link key={item.id} href={item.href} onClick={() => setMobileOpen(false)}>{item.title}</Link>
              ))}
              {INDUSTRIES_MENU.map((item) => (
                <button key={item.id} type="button" className="text-left" onClick={() => selectIndustry(item.id)}>{item.title}</button>
              ))}
              <Link href="/#systems" onClick={() => setMobileOpen(false)}>Systems</Link>
              <Link href="/#roi-calculator" onClick={() => setMobileOpen(false)}>ROI</Link>
              <Link href="/#pricing" onClick={() => setMobileOpen(false)}>Pricing</Link>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <RegionSwitcher />
              <Link href="/#book-call" onClick={() => setMobileOpen(false)} className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-black">
                Book a call
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
