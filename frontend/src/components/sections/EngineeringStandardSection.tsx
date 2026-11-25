import { ENGINEERING_COPY } from "@/lib/copy";
import { TOKEN } from "@/lib/tokens";

export function EngineeringStandardSection() {
  return (
    <section id="engineering" className={`${TOKEN.SECTION_PY} ${TOKEN.SECTION_BORDER} ${TOKEN.SECTION_ANCHOR}`}>
      <div className={`${TOKEN.CONTAINER} grid items-center gap-12 lg:grid-cols-12`}>
        <div className="lg:col-span-6">
          <p className={TOKEN.EYEBROW_WRAP}>
            <span className={TOKEN.EYEBROW_DASH} />
            {ENGINEERING_COPY.eyebrow}
          </p>
          <h2 className={`${TOKEN.H2} mt-4`}>
            <span className="block font-light">{ENGINEERING_COPY.line1}</span>
            <span className="block font-semibold">{ENGINEERING_COPY.line2}</span>
          </h2>
          <p className={`${TOKEN.BODY_LG} mt-5`}>{ENGINEERING_COPY.lead}</p>
          <blockquote className="mt-6 border-l-2 border-sky-400 pl-4 text-sm italic leading-relaxed text-slate-300">
            {ENGINEERING_COPY.quote}
          </blockquote>
          <dl className="mt-8 grid grid-cols-3 gap-4">
            {ENGINEERING_COPY.metrics.map((metric) => (
              <div key={metric.label}>
                <dt className="font-heading text-2xl font-medium text-white">{metric.value}</dt>
                <dd className="mt-1 text-xs text-slate-500">{metric.label}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="lg:col-span-6">
          <div className="space-y-2.5 rounded-2xl border border-white/[0.08] bg-[#0A0C10] p-6">
            {ENGINEERING_COPY.layers.map((layer) => (
              <div key={layer.layer} className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.07] bg-[#0E1117] px-4 py-3.5">
                <div>
                  <p className="font-mono text-xs text-sky-400">{layer.layer}</p>
                  <p className="text-sm font-medium text-white">{layer.title}</p>
                </div>
                <p className="max-w-[14rem] text-right text-xs text-slate-400">{layer.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
