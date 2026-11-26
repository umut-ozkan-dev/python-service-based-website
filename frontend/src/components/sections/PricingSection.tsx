"use client";

import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";

import { RegionSwitcher } from "@/components/layout/RegionSwitcher";
import { useRegion } from "@/context/RegionContext";
import { PRICING_COPY, PRICING_TIERS } from "@/lib/copy";
import { formatCurrency } from "@/lib/region-config";
import { TOKEN } from "@/lib/tokens";

export function PricingSection() {
  const { region, config } = useRegion();
  const prices = {
    audit: formatCurrency(config.auditFee, region),
    build: formatCurrency(config.buildFee, region),
    partner: formatCurrency(config.partnerMonthly, region),
  };
  return (
    <section id="pricing" className={`${TOKEN.SECTION_PY} ${TOKEN.SECTION_BORDER} ${TOKEN.SECTION_ANCHOR}`}>
      <div className={TOKEN.CONTAINER}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-3xl">
            <p className={TOKEN.EYEBROW_WRAP}><span className={TOKEN.EYEBROW_DASH} />{PRICING_COPY.eyebrow}</p>
            <h2 className={`${TOKEN.H2} mt-4`}>
              <span className="block font-light">{PRICING_COPY.line1}</span>
              <span className="block font-semibold">{PRICING_COPY.line2}</span>
            </h2>
            <p className={`${TOKEN.BODY_LG} mt-4`}>{PRICING_COPY.subtitle}</p>
          </div>
          <RegionSwitcher />
        </div>
        <div className="mx-auto mt-14 grid max-w-6xl grid-cols-1 items-stretch gap-6 lg:grid-cols-3">
          {PRICING_TIERS.map((tier) => (
            <article key={tier.id} className={`flex h-full flex-col rounded-2xl p-7 ${tier.featured ? "border border-sky-400/35 bg-gradient-to-b from-sky-400/[0.07] via-[#0A0C10] to-[#0A0C10]" : "border border-white/[0.08] bg-[#0A0C10]"}`}>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-medium tracking-wide text-slate-500">{tier.kicker}</p>
                  {tier.featured ? <span className={TOKEN.BADGE_CYAN}>{PRICING_COPY.recommended}</span> : null}
                </div>
                <h3 className="mt-3 text-xl font-medium text-white">{tier.title}</h3>
                <p className={`${TOKEN.BODY_SM} mt-3 min-h-[4.5rem]`}>{tier.ideal}</p>
                <p className="mt-6 font-heading text-4xl tabular-nums text-white">
                  {tier.kind === "partner" ? <span className="mr-1.5 text-sm font-normal text-slate-400">From </span> : null}
                  {prices[tier.kind]}
                  <span className="text-base text-slate-400">{tier.kind === "partner" ? "/mo" : ""}</span>
                </p>
                <p className="mt-2 text-xs text-slate-500">{tier.cadence}{tier.kind === "build" ? ` · optional ${formatCurrency(config.monitorMonthly, region)}/mo` : ""}</p>
                <ul className="mt-6 space-y-3">
                  {tier.items.map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-slate-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/#book-call" className={`${tier.featured ? TOKEN.BTN_PRIMARY : TOKEN.BTN_SECONDARY} mt-8 w-full`}>
                {tier.cta}<ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
