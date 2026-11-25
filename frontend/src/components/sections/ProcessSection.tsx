import { PROCESS_COPY } from "@/lib/copy";
import { TOKEN } from "@/lib/tokens";

export function ProcessSection() {
  return (
    <section id="process" className={`${TOKEN.SECTION_PY} ${TOKEN.SECTION_BORDER} ${TOKEN.SECTION_ANCHOR}`}>
      <div className={TOKEN.CONTAINER}>
        <p className={TOKEN.EYEBROW_WRAP}>
          <span className={TOKEN.EYEBROW_DASH} />
          {PROCESS_COPY.eyebrow}
        </p>
        <h2 className={`${TOKEN.H2} mt-4`}>
          <span className="block font-light">{PROCESS_COPY.line1}</span>
          <span className="block font-semibold">{PROCESS_COPY.line2}</span>
        </h2>
        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS_COPY.steps.map((step) => (
            <article key={step.num}>
              <p className="font-mono text-xs text-slate-500">{step.num}</p>
              <h3 className="mt-3 font-heading text-2xl font-medium text-white">{step.title}</h3>
              <p className="mt-2 text-sm font-medium text-slate-200">{step.lead}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{step.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
