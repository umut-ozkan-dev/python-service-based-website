"use client";

import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { RegionSwitcher } from "@/components/layout/RegionSwitcher";
import { useRegion } from "@/context/RegionContext";
import { PRICING_COPY } from "@/lib/copy";
import { formatCurrency } from "@/lib/region-config";
import { TOKEN } from "@/lib/tokens";

function Checklist({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-4 space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-2 text-sm text-slate-300">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function PricingSection() {
  const { region, config } = useRegion();
  return (
    <section id="pricing" className={`${TOKEN.SECTION_PY} ${TOKEN.SECTION_BORDER} ${TOKEN.SECTION_ANCHOR}`}>
      <div className={TOKEN.CONTAINER}>
        <div className="mx-auto max-w-3xl">
          <p className={TOKEN.EYEBROW_WRAP}><span className={TOKEN.EYEBROW_DASH} />{PRICING_COPY.eyebrow}</p>
          <h2 className={`${TOKEN.H2} mt-4`}>
            <span className="block font-light">{PRICING_COPY.line1}</span>
            <span className="block font-semibold">{PRICING_COPY.line2}</span>
          </h2>
          <p className={`${TOKEN.BODY_LG} mt-4`}>{PRICING_COPY.subtitle}</p>
          <div className="mt-6"><RegionSwitcher /></div>
        </div>
        <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 items-stretch gap-8 lg:grid-cols-2">
          <article className="relative flex h-full flex-col rounded-2xl border border-sky-400/35 bg-gradient-to-b from-sky-400/[0.07] via-[#0A0C10] to-[#0A0C10] p-7 sm:p-8">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-medium text-white">{PRICING_COPY.coreTitle}</h3>
                <span className={TOKEN.BADGE_CYAN}>{PRICING_COPY.popular}</span>
              </div>
              <p className={`${TOKEN.BODY_SM} mt-2`}>{PRICING_COPY.coreIdeal}</p>
              <p className="mt-6 font-heading text-4xl tabular-nums text-white">{formatCurrency(config.coreMonthlyFee, region)}<span className="text-base text-slate-400">/month</span></p>
              <p className="mt-3 text-xs text-slate-400">{PRICING_COPY.coreSetupLabel}: {formatCurrency(config.coreSetupFee, region)}</p>
              <h4 className="mt-6 text-sm text-white">{PRICING_COPY.setupHeading}</h4>
              <Checklist items={PRICING_COPY.coreSetup} />
              <h4 className="mt-6 text-sm text-white">{PRICING_COPY.monthlyHeading}</h4>
              <Checklist items={PRICING_COPY.coreMonthly} />
            </div>
            <Link href="/#book-call" className={`${TOKEN.BTN_PRIMARY} mt-8 w-full`}>{PRICING_COPY.coreCta}<ArrowRight className="h-4 w-4" /></Link>
          </article>
          <article className="flex h-full flex-col rounded-2xl border border-white/[0.08] bg-[#0A0C10] p-7 sm:p-8">
            <div className="flex-1">
              <h3 className="text-xl font-medium text-white">{PRICING_COPY.proTitle}</h3>
              <p className={`${TOKEN.BODY_SM} mt-2`}>{PRICING_COPY.proIdeal}</p>
              <p className="mt-6 font-heading text-4xl tabular-nums text-white">{formatCurrency(config.proMonthlyFee, region)}<span className="text-base text-slate-400">/month</span></p>
              <p className="mt-3 text-xs text-slate-400">{PRICING_COPY.proSetupLabel}: {formatCurrency(config.proSetupFee, region)}</p>
              <h4 className="mt-6 text-sm text-white">{PRICING_COPY.proHeading}</h4>
              <Checklist items={PRICING_COPY.proItems} />
            </div>
            <Link href="/#book-call" className={`${TOKEN.BTN_SECONDARY} mt-8 w-full`}>{PRICING_COPY.proCta}<ArrowRight className="h-4 w-4" /></Link>
          </article>
        </div>
        <div className="mx-auto mt-8 flex max-w-5xl items-start gap-4 rounded-2xl border border-white/[0.08] bg-[#0A0C10] p-6">
          <ShieldCheck className="h-5 w-5 shrink-0 text-sky-300" aria-hidden="true" />
          <div>
            <h3 className="text-base font-medium text-white">{PRICING_COPY.guaranteeTitle}</h3>
            <p className={`${TOKEN.BODY_SM} mt-2`}>{PRICING_COPY.guaranteeBody}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
