"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { FAQ_COPY, FAQ_ITEMS } from "@/lib/copy";
import { TOKEN } from "@/lib/tokens";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <section id="faq" className="scroll-mt-28 border-t border-white/[0.07] py-28 sm:py-36">
      <div className={`${TOKEN.CONTAINER} grid gap-12 lg:grid-cols-12`}>
        <div className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
          <p className={TOKEN.EYEBROW_WRAP}><span className={TOKEN.EYEBROW_DASH} />{FAQ_COPY.eyebrow}</p>
          <h2 className={`${TOKEN.H2} mt-4`}>{FAQ_COPY.heading}</h2>
          <p className={`${TOKEN.BODY_SM} mt-4`}>{FAQ_COPY.subtitle}</p>
          <a href="mailto:hello@relayops.io" className="mt-6 inline-block text-sm text-sky-300 hover:text-sky-200">hello@relayops.io</a>
        </div>
        <div className="divide-y divide-white/[0.08] border-y border-white/[0.08] lg:col-span-8">
          {FAQ_ITEMS.map((item, idx) => {
            const open = openIndex === idx;
            return (
              <div key={item.question}>
                <button type="button" aria-expanded={open} aria-controls={`faq-panel-${idx}`} className={`${TOKEN.FOCUS_RING} flex w-full items-center justify-between gap-4 py-5 text-left`} onClick={() => setOpenIndex(open ? null : idx)}>
                  <span className="text-sm font-medium text-white sm:text-base">{item.question}</span>
                  <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
                </button>
                {open ? <div id={`faq-panel-${idx}`} className="pb-5"><p className={TOKEN.BODY_SM}>{item.answer}</p></div> : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
