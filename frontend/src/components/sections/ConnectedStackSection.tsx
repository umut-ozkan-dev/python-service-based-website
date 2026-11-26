import { SmokedGlassStack } from "@/components/visuals/SmokedGlassStack";
import { INTEGRATION_PILLS, STACK_COPY } from "@/lib/copy";
import { TOKEN } from "@/lib/tokens";

export function ConnectedStackSection() {
  return (
    <section id="stack" className={`${TOKEN.SECTION_PY} ${TOKEN.SECTION_BORDER} ${TOKEN.SECTION_ANCHOR}`}>
      <div className={TOKEN.CONTAINER}>
        <p className={TOKEN.EYEBROW_WRAP}>
          <span className={TOKEN.EYEBROW_DASH} />
          {STACK_COPY.eyebrow}
        </p>
        <h2 className={`${TOKEN.H2} mt-4`}>
          <span className="block font-light">{STACK_COPY.line1}</span>
          <span className="block font-semibold">{STACK_COPY.line2}</span>
        </h2>
        <p className={`${TOKEN.BODY_LG} mt-4 max-w-2xl`}>{STACK_COPY.subtitle}</p>
        <SmokedGlassStack />
        <div className="mt-4 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STACK_COPY.pillars.map((pillar) => (
            <article key={pillar.num} className="border-t border-white/[0.12] pt-5">
              <p className="font-mono text-xs text-sky-400">{pillar.num}</p>
              <h3 className="mt-3 text-lg font-medium text-white">{pillar.title}</h3>
              <p className={`${TOKEN.BODY_SM} mt-2`}>{pillar.body}</p>
            </article>
          ))}
        </div>
        <ul className="mt-14 flex flex-wrap items-center gap-2.5">
          {INTEGRATION_PILLS.map((pill) => (
            <li key={pill} className="rounded-full border border-white/[0.08] bg-white/[0.02] px-3.5 py-1.5 text-xs text-slate-400">
              {pill}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
