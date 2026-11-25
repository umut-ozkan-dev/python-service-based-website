"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { useRegion } from "@/context/RegionContext";
import { ROI_COPY } from "@/lib/copy";
import { formatCurrency } from "@/lib/region-config";
import { RESPONSE_TIME_STOPS, calculateRoiClient } from "@/lib/roi";
import { TOKEN } from "@/lib/tokens";

const RESPONSE_SCALE = ["5m", "30m", "2h", "6h", "24h+"];

export function RoiCalculatorSection() {
  const { region, config } = useRegion();
  const [monthlyEnquiries, setMonthlyEnquiries] = useState(65);
  const [avgAppointmentValue, setAvgAppointmentValue] = useState(850);
  const [currentCloseRatePct, setCurrentCloseRatePct] = useState(22);
  const [responseStopIndex, setResponseStopIndex] = useState(2);
  const [hasEditedValue, setHasEditedValue] = useState(false);
  const effectiveAvgValue = hasEditedValue ? avgAppointmentValue : config.defaultAvgTicket;
  const outputs = calculateRoiClient({
    region,
    monthly_enquiries: monthlyEnquiries,
    avg_appointment_value: effectiveAvgValue,
    current_close_rate_pct: currentCloseRatePct,
    current_response_minutes: RESPONSE_TIME_STOPS[responseStopIndex].minutes,
  });

  return (
    <section id="roi-calculator" className={`${TOKEN.SECTION_PY} ${TOKEN.SECTION_BORDER} ${TOKEN.SECTION_ANCHOR}`}>
      <div className={TOKEN.CONTAINER}>
        <p className={TOKEN.EYEBROW_WRAP}><span className={TOKEN.EYEBROW_DASH} />{ROI_COPY.eyebrow}</p>
        <h2 className={`${TOKEN.H2} mt-4`}>
          <span className="block font-light">{ROI_COPY.line1}</span>
          <span className="block font-semibold">{ROI_COPY.line2}</span>
        </h2>
        <p className={`${TOKEN.BODY_LG} mt-4 max-w-2xl`}>{ROI_COPY.subtitle}</p>
        <div className="mt-14 grid items-start gap-8 lg:grid-cols-12">
          <div className={`${TOKEN.PANEL} space-y-7 lg:col-span-7`}>
            {[
              { id: "monthly-enquiries", label: ROI_COPY.enquiriesLabel, tip: ROI_COPY.enquiriesTooltip, value: String(monthlyEnquiries), min: 5, max: 1000, step: 5, current: monthlyEnquiries, onChange: (value: number) => setMonthlyEnquiries(value), scale: ["5", "500", "1,000"] },
            ].map((slider) => (
              <div key={slider.id}>
                <div className="flex items-center justify-between gap-4">
                  <label htmlFor={slider.id} className="text-sm text-slate-200">{slider.label}</label>
                  <span className="font-mono text-sm font-medium tabular-nums text-sky-300">{slider.value}</span>
                </div>
                <p className="mb-3 mt-1 text-xs text-slate-500">{slider.tip}</p>
                <input id={slider.id} className="relay-slider" type="range" min={slider.min} max={slider.max} step={slider.step} value={slider.current} onChange={(event) => slider.onChange(Number(event.target.value))} />
                <div className="mt-1.5 flex justify-between font-mono text-[11px] text-slate-500">{slider.scale.map((item) => <span key={item}>{item}</span>)}</div>
              </div>
            ))}
            <div>
              <div className="flex items-center justify-between gap-4">
                <label htmlFor="avg-value" className="text-sm text-slate-200">{ROI_COPY.valueLabel[region]}</label>
                <span className="font-mono text-sm font-medium tabular-nums text-sky-300">{formatCurrency(effectiveAvgValue, region)}</span>
              </div>
              <p className="mb-3 mt-1 text-xs text-slate-500">{ROI_COPY.valueTooltip}</p>
              <input id="avg-value" className="relay-slider" type="range" min={100} max={10000} step={50} value={effectiveAvgValue} onChange={(event) => { setHasEditedValue(true); setAvgAppointmentValue(Number(event.target.value)); }} />
              <div className="mt-1.5 flex justify-between font-mono text-[11px] text-slate-500">
                <span>{formatCurrency(100, region)}</span><span>{formatCurrency(5000, region)}</span><span>{formatCurrency(10000, region)}</span>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between gap-4">
                <label htmlFor="close-rate" className="text-sm text-slate-200">{ROI_COPY.closeLabel}</label>
                <span className="font-mono text-sm font-medium tabular-nums text-sky-300">{currentCloseRatePct}%</span>
              </div>
              <p className="mb-3 mt-1 text-xs text-slate-500">{ROI_COPY.closeTooltip}</p>
              <input id="close-rate" className="relay-slider" type="range" min={5} max={60} step={1} value={currentCloseRatePct} onChange={(event) => setCurrentCloseRatePct(Number(event.target.value))} />
              <div className="mt-1.5 flex justify-between font-mono text-[11px] text-slate-500"><span>5%</span><span>30%</span><span>60%</span></div>
            </div>
            <div>
              <div className="flex items-center justify-between gap-4">
                <label htmlFor="response-time" className="text-sm text-slate-200">{ROI_COPY.responseLabel}</label>
                <span className="font-mono text-sm font-medium tabular-nums text-sky-300">{RESPONSE_TIME_STOPS[responseStopIndex].label}</span>
              </div>
              <p className="mb-3 mt-1 text-xs text-slate-500">{ROI_COPY.responseTooltip}</p>
              <input id="response-time" className="relay-slider" type="range" min={0} max={4} step={1} value={responseStopIndex} onChange={(event) => setResponseStopIndex(Number(event.target.value))} />
              <div className="mt-1.5 flex justify-between font-mono text-[11px] text-slate-500">{RESPONSE_SCALE.map((item) => <span key={item}>{item}</span>)}</div>
            </div>
          </div>
          <aside className={`${TOKEN.PANEL} lg:sticky lg:top-24 lg:col-span-5`}>
            <div className="rounded-xl border border-rose-400/20 bg-rose-500/[0.06] p-4">
              <p className="text-sm text-rose-300">{ROI_COPY.lostTitle}</p>
              <p className="mt-2 font-heading text-3xl tabular-nums text-white">{formatCurrency(outputs.estimated_monthly_lost_revenue, region)}</p>
              <p className="text-xs text-rose-200/70">{ROI_COPY.lostSub}</p>
            </div>
            <div className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-500/[0.06] p-4">
              <p className="text-sm text-emerald-300">{ROI_COPY.recoveredTitle}</p>
              <p className="mt-2 font-heading text-3xl tabular-nums text-white">{formatCurrency(outputs.projected_recovered_revenue, region)}</p>
              <p className="text-xs text-emerald-100/70">Conservative 75% capture of recoverable enquiries (+{outputs.projected_additional_bookings} bookings/mo)</p>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/[0.08] pt-4">
              <div>
                <p className="text-sm text-white">{ROI_COPY.netTitle}</p>
                <p className="text-xs text-slate-500">{`After deducting ${outputs.currency_symbol}${outputs.monthly_fee}/mo Core Plan`}</p>
              </div>
              <p className="font-heading text-xl tabular-nums text-white">{formatCurrency(outputs.net_monthly_gain_after_fee, region)}</p>
            </div>
            <p className={`${TOKEN.BADGE_CYAN} mt-4`}>{ROI_COPY.paybackTitle}: {outputs.payback_display}</p>
            <Link href="/#book-call" className={`${TOKEN.BTN_PRIMARY} mt-6 w-full`}>{ROI_COPY.cta}<ArrowRight className="h-4 w-4" /></Link>
            <p className="mt-4 text-xs leading-relaxed text-slate-500">{ROI_COPY.footnote}</p>
          </aside>
        </div>
      </div>
    </section>
  );
}
