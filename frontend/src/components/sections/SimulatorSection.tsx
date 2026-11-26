"use client";

import { AlertCircle, Check, CheckCircle2, Loader2, Play, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { useRegion } from "@/context/RegionContext";
import { ApiClientError, runSimulationApi } from "@/lib/api";
import { SIMULATOR_COPY } from "@/lib/copy";
import { TOKEN } from "@/lib/tokens";
import type { EnquiryChannel, IndustryVertical, SimulationResponse, SimulationStep } from "@/lib/types";

const CHANNELS: Array<{ id: EnquiryChannel; label: string }> = [
  { id: "sms", label: "SMS" },
  { id: "web_form", label: "Web Form" },
  { id: "email", label: "Email" },
];
const TABS: IndustryVertical[] = ["lead_ops", "client_admin", "dispatch_quotes", "internal_ops"];

function cardClass(actor: SimulationStep["actor"], approval: boolean) {
  if (approval) return "rounded-xl border border-amber-400/30 bg-amber-400/[0.05] p-4";
  if (actor === "relay60_ai") return "rounded-xl border border-sky-400/30 bg-sky-400/[0.04] p-4";
  if (actor === "calendar_system") return "rounded-xl border border-emerald-400/30 bg-emerald-400/[0.04] p-4";
  return "rounded-xl border border-white/[0.08] bg-[#06080B] p-4";
}

export function SimulatorSection() {
  const { region } = useRegion();
  const [vertical, setVertical] = useState<IndustryVertical>("lead_ops");
  const [channel, setChannel] = useState<EnquiryChannel>("sms");
  const [inputMode, setInputMode] = useState<"preset" | "custom">("preset");
  const [customEnquiry, setCustomEnquiry] = useState("");
  const [simulationData, setSimulationData] = useState<SimulationResponse | null>(null);
  const [visibleStepCount, setVisibleStepCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [holdApproval, setHoldApproval] = useState(false);
  const [approvedNote, setApprovedNote] = useState(false);
  const [viewMode, setViewMode] = useState<"walkthrough" | "json">("walkthrough");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const timersRef = useRef<number[]>([]);
  const abortRef = useRef<AbortController | null>(null);
  const approvedRef = useRef(false);
  const dataRef = useRef<SimulationResponse | null>(null);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    abortRef.current?.abort();
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const schedule = useCallback((fromCount: number) => {
    const data = dataRef.current;
    if (!data) return;
    const target = fromCount + 1;
    if (target > data.steps.length) {
      setIsPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => {
      setVisibleStepCount(target);
      const step = data.steps[target - 1];
      if (step.requires_approval && !approvedRef.current) {
        setHoldApproval(true);
        setIsPlaying(false);
        return;
      }
      schedule(target);
    }, 700);
    timersRef.current.push(timer);
  }, []);

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<IndustryVertical>).detail;
      if (!TABS.includes(detail)) return;
      setInputMode("preset");
      setVertical(detail);
    };
    window.addEventListener("relay:select-vertical", handler);
    return () => window.removeEventListener("relay:select-vertical", handler);
  }, []);

  const loadSimulation = useCallback(async (animate: boolean) => {
    clearTimers();
    const controller = new AbortController();
    abortRef.current = controller;
    setIsLoading(true);
    setErrorMsg(null);
    setHoldApproval(false);
    setApprovedNote(false);
    approvedRef.current = false;
    try {
      const data = await runSimulationApi(
        { vertical, channel, region, custom_enquiry: inputMode === "custom" && customEnquiry.trim() ? customEnquiry : null },
        controller.signal,
      );
      if (controller.signal.aborted) return;
      dataRef.current = data;
      setSimulationData(data);
      if (animate) {
        setVisibleStepCount(0);
        setIsPlaying(true);
        schedule(0);
      } else {
        setVisibleStepCount(data.steps.length);
        setIsPlaying(false);
      }
    } catch (error) {
      if (controller.signal.aborted) return;
      setErrorMsg(error instanceof ApiClientError ? error.fieldErrors?.custom_enquiry || error.message : "Unable to reach the server. Please check your connection and try again.");
    } finally {
      if (!controller.signal.aborted) setIsLoading(false);
    }
  }, [channel, clearTimers, customEnquiry, inputMode, region, schedule, vertical]);

  useEffect(() => {
    if (inputMode === "custom") return;
    void loadSimulation(false);
  }, [channel, inputMode, loadSimulation, region, vertical]);

  const stageOn = [visibleStepCount >= 1, visibleStepCount >= 2, visibleStepCount >= 4, visibleStepCount >= 5];
  const buttonLabel = isLoading || isPlaying ? SIMULATOR_COPY.runPlaying : simulationData ? SIMULATOR_COPY.runReplay : SIMULATOR_COPY.runIdle;

  return (
    <section id="simulator" className={`${TOKEN.SECTION_PY} ${TOKEN.SECTION_BORDER} ${TOKEN.SECTION_ANCHOR}`}>
      <div className={TOKEN.CONTAINER}>
        <p className={TOKEN.EYEBROW_WRAP}><span className={TOKEN.EYEBROW_DASH} />{SIMULATOR_COPY.eyebrow}</p>
        <h2 className={`${TOKEN.H2} mt-4`}>
          <span className="block font-light">{SIMULATOR_COPY.line1}</span>
          <span className="block font-semibold">{SIMULATOR_COPY.line2}</span>
        </h2>
        <p className={`${TOKEN.BODY_LG} mt-4 max-w-3xl`}>{SIMULATOR_COPY.subtitle}</p>
        <div className="mt-8 flex flex-wrap gap-5 border-b border-white/[0.08]">
          {TABS.map((id) => (
            <button key={id} type="button" className={`border-b-2 pb-3 text-sm ${vertical === id ? "border-sky-400 text-white" : "border-transparent text-slate-500 hover:text-slate-300"}`} onClick={() => setVertical(id)}>
              {SIMULATOR_COPY.tabs[id]}
            </button>
          ))}
        </div>
        <div className="mt-6 overflow-hidden rounded-2xl border border-white/[0.1] bg-[#0A0C10]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] bg-[#080A0E] px-5 py-3.5">
            <div>
              <p className="text-sm text-white">{SIMULATOR_COPY.studioLeft}</p>
              <p className="text-xs text-slate-500">{SIMULATOR_COPY.studioRight}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {CHANNELS.map((item) => (
                <button key={item.id} type="button" onClick={() => setChannel(item.id)} className={`rounded-full px-3 py-1 text-xs ${channel === item.id ? "bg-white text-black" : "border border-white/10 text-slate-400"}`}>{item.label}</button>
              ))}
              <span className="hidden h-4 w-px bg-white/10 sm:inline-block" aria-hidden="true" />
              <button type="button" onClick={() => setViewMode("walkthrough")} className={`rounded-full px-3 py-1 text-xs ${viewMode === "walkthrough" ? "bg-white/15 text-white" : "text-slate-500"}`}>{SIMULATOR_COPY.walkthroughMode}</button>
              <button type="button" onClick={() => setViewMode("json")} className={`rounded-full px-3 py-1 text-xs ${viewMode === "json" ? "bg-white/15 text-white" : "text-slate-500"}`}>{SIMULATOR_COPY.jsonMode}</button>
              <span className="hidden h-4 w-px bg-white/10 sm:inline-block" aria-hidden="true" />
              <button type="button" onClick={() => setInputMode("preset")} className={`rounded-full px-3 py-1 text-xs ${inputMode === "preset" ? "bg-white/15 text-white" : "text-slate-500"}`}>{SIMULATOR_COPY.presetMode}</button>
              <button type="button" onClick={() => setInputMode("custom")} className={`rounded-full px-3 py-1 text-xs ${inputMode === "custom" ? "bg-white/15 text-white" : "text-slate-500"}`}>{SIMULATOR_COPY.customMode}</button>
            </div>
          </div>
          <div className="grid grid-cols-2 border-b border-white/[0.07] bg-[#07090D] sm:grid-cols-4">
            {SIMULATOR_COPY.stages.map((label, index) => (
              <p key={label} className={`flex items-center gap-2 px-4 py-3 text-xs ${stageOn[index] ? "text-sky-300" : "text-slate-600"}`}>
                <span className={`inline-flex h-4 w-4 items-center justify-center rounded-full border ${stageOn[index] ? "border-emerald-400 text-emerald-300" : "border-white/15"}`}>
                  {stageOn[index] ? <Check className="h-3 w-3" /> : null}
                </span>
                {label}
              </p>
            ))}
          </div>
          {inputMode === "custom" ? (
            <div className="border-b border-white/[0.07] p-5">
              <textarea className={TOKEN.INPUT} rows={3} maxLength={280} value={customEnquiry} placeholder={SIMULATOR_COPY.placeholder} onChange={(event) => setCustomEnquiry(event.target.value)} />
              <p className="mt-1 text-right font-mono text-[11px] text-slate-500">{customEnquiry.length}/280</p>
            </div>
          ) : null}
          {viewMode === "json" ? (
            <pre className="overflow-x-auto p-5 font-mono text-xs text-sky-200/90">{JSON.stringify(simulationData?.webhook_json_preview ?? { status: "waiting" }, null, 2)}</pre>
          ) : (
            <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-12">
              <ol className="space-y-3 lg:col-span-7" aria-live="polite">
                {(simulationData?.steps ?? []).slice(0, visibleStepCount).map((step, index) => (
                  <li key={step.step_number} className={cardClass(step.actor, step.requires_approval)}>
                    <div className="flex items-center justify-between gap-3">
                      <span className={`${TOKEN.MONO_TAG} text-sky-300`}>{step.timestamp_label}</span>
                      <span className="text-xs text-slate-400">{step.actor_badge}</span>
                    </div>
                    <p className="mt-1 text-[11px] uppercase tracking-wide text-slate-500">{step.stage_title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-200">{step.message_body}</p>
                    {approvedNote && step.requires_approval ? <p className="mt-2 text-xs text-emerald-300">{SIMULATOR_COPY.approved}</p> : null}
                    {holdApproval && step.requires_approval && index === visibleStepCount - 1 ? (
                      <button
                        type="button"
                        className="mt-3 inline-flex items-center gap-2 rounded-full border border-amber-300/40 bg-amber-400/15 px-3 py-1.5 text-xs font-medium text-amber-100"
                        onClick={() => {
                          approvedRef.current = true;
                          setApprovedNote(true);
                          setHoldApproval(false);
                          setIsPlaying(true);
                          schedule(visibleStepCount);
                        }}
                      >
                        {SIMULATOR_COPY.approve}
                      </button>
                    ) : null}
                  </li>
                ))}
              </ol>
              <div className="space-y-4 lg:col-span-5">
                <div className={TOKEN.PANEL_INSET}>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">{SIMULATOR_COPY.recordTitle}</p>
                  {simulationData && visibleStepCount >= 4 ? (
                    <dl className="mt-3 divide-y divide-white/[0.06] text-sm">
                      <div className="flex justify-between gap-3 py-2"><dt className="text-slate-500">Contact</dt><dd>{simulationData.crm_preview.contact_name}</dd></div>
                      <div className="flex justify-between gap-3 py-2"><dt className="text-slate-500">Handle</dt><dd className={TOKEN.MONO_TAG}>{simulationData.crm_preview.contact_handle}</dd></div>
                      <div className="flex justify-between gap-3 py-2"><dt className="text-slate-500">Stage</dt><dd>{simulationData.crm_preview.pipeline_stage}</dd></div>
                    </dl>
                  ) : <p className="mt-3 text-sm text-slate-500">{SIMULATOR_COPY.waiting}</p>}
                </div>
                <div className={TOKEN.PANEL_INSET}>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-emerald-300">{SIMULATOR_COPY.outcomeTitle}</p>
                  {simulationData && visibleStepCount >= simulationData.steps.length ? (
                    <div className="mt-3 text-sm text-slate-200">
                      <p className="inline-flex items-center gap-2 text-emerald-300"><CheckCircle2 className="h-4 w-4" />{simulationData.appointment_preview.service_label}</p>
                      <p className="mt-2">{simulationData.appointment_preview.slot_display}</p>
                      <p className="text-slate-400">{simulationData.appointment_preview.calendar_target}</p>
                    </div>
                  ) : <p className="mt-3 text-sm text-slate-500">{SIMULATOR_COPY.waiting}</p>}
                </div>
                <div className="rounded-xl border border-amber-400/20 bg-amber-400/[0.05] p-4">
                  <p className={TOKEN.BADGE_AMBER}>{SIMULATOR_COPY.boundaryTitle}</p>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">{SIMULATOR_COPY.boundaryBody}</p>
                </div>
                {errorMsg ? <p className={TOKEN.ERROR_TEXT}><AlertCircle className="h-3.5 w-3.5" />{errorMsg}</p> : null}
              </div>
            </div>
          )}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] bg-[#080A0E] px-5 py-3.5">
            <p className="max-w-xl text-xs text-slate-500">{SIMULATOR_COPY.footnote}</p>
            <div className="flex gap-2">
              <button type="button" className={TOKEN.BTN_GHOST} onClick={() => { clearTimers(); setVisibleStepCount(0); setSimulationData(null); dataRef.current = null; setHoldApproval(false); }}>
                <RotateCcw className="h-3.5 w-3.5" />{SIMULATOR_COPY.restart}
              </button>
              <button type="button" className={TOKEN.BTN_PRIMARY} disabled={isLoading || isPlaying || holdApproval} onClick={() => void loadSimulation(true)}>
                {isLoading || isPlaying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                {buttonLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
