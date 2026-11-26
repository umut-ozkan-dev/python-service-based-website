import { Bot, Calendar, Database, RefreshCw, ShieldCheck, Zap } from "lucide-react";

import { CAPABILITIES_COPY } from "@/lib/copy";
import { TOKEN } from "@/lib/tokens";

const ICONS = [Zap, Calendar, Database, RefreshCw, Bot, ShieldCheck];

export function CapabilitiesSection() {
  return (
    <section id="capabilities" className={`${TOKEN.SECTION_PY} ${TOKEN.SECTION_BORDER} ${TOKEN.SECTION_ANCHOR}`}>
      <div className={TOKEN.CONTAINER}>
        <p className={TOKEN.EYEBROW_WRAP}>
          <span className={TOKEN.EYEBROW_DASH} />
          {CAPABILITIES_COPY.eyebrow}
        </p>
        <h2 className={`${TOKEN.H2} mt-4 max-w-3xl`}>
          <span className="block font-light">{CAPABILITIES_COPY.line1}</span>
          <span className="block font-semibold">{CAPABILITIES_COPY.line2}</span>
        </h2>
        <p className={`${TOKEN.BODY_LG} mt-4 max-w-2xl`}>{CAPABILITIES_COPY.subtitle}</p>
        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] md:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES_COPY.cards.map((card, index) => {
            const Icon = ICONS[index];
            return (
              <article key={card.title} className="bg-[#0A0C10] p-7 transition-colors hover:bg-[#0E1117]">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-slate-300">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-base font-medium text-white">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{card.body}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
