"use client";

import { AlertCircle, Calendar, CheckCircle2, ExternalLink, Loader2, Lock } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useRegion } from "@/context/RegionContext";
import { ApiClientError, createLeadApi } from "@/lib/api";
import { CONTACT_STRIP, FORM_COPY, VERTICAL_OPTIONS, VOLUME_OPTIONS, WINDOW_OPTIONS } from "@/lib/copy";
import { TOKEN } from "@/lib/tokens";
import type { IndustryVertical, LeadCreateResponse, MonthlyLeadVolume, PreferredTimeWindow } from "@/lib/types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className={TOKEN.ERROR_TEXT}>
      <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
      {message}
    </p>
  );
}

export function LeadBookingSection() {
  const { region, config } = useRegion();
  const [fullName, setFullName] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [vertical, setVertical] = useState<IndustryVertical>("dental");
  const [monthlyLeadVolume, setMonthlyLeadVolume] = useState<MonthlyLeadVolume>("30_to_75");
  const [currentTools, setCurrentTools] = useState("");
  const [preferredTimeWindow, setPreferredTimeWindow] = useState<PreferredTimeWindow>("first_available");
  const [notes, setNotes] = useState("");
  const [smsConsent, setSmsConsent] = useState(false);
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [utmParams, setUtmParams] = useState<{
    utm_source: string | null;
    utm_medium: string | null;
    utm_campaign: string | null;
  }>({ utm_source: null, utm_medium: null, utm_campaign: null });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<LeadCreateResponse | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUtmParams({
      utm_source: params.get("utm_source"),
      utm_medium: params.get("utm_medium"),
      utm_campaign: params.get("utm_campaign"),
    });
  }, []);

  function validateForm(): boolean {
    const next: Record<string, string> = {};
    if (fullName.trim().length < 2) next.full_name = FORM_COPY.errors.full_name;
    if (!EMAIL_RE.test(workEmail.trim())) next.work_email = FORM_COPY.errors.work_email;
    if (phone.replace(/\D/g, "").length < 10) next.phone = FORM_COPY.errors.phone;
    if (businessName.trim().length < 2) next.business_name = FORM_COPY.errors.business_name;
    if (privacyConsent !== true) next.privacy_consent = FORM_COPY.errors.privacy_consent;
    setFieldErrors(next);
    const first = Object.keys(next)[0];
    if (first) {
      document.getElementById(first)?.focus();
      return false;
    }
    return true;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFormError(null);
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const result = await createLeadApi({
        full_name: fullName.trim(),
        work_email: workEmail.trim(),
        phone: phone.trim(),
        business_name: businessName.trim(),
        website_url: websiteUrl.trim() || null,
        vertical,
        region,
        monthly_lead_volume: monthlyLeadVolume,
        current_tools: currentTools.trim() || null,
        preferred_time_window: preferredTimeWindow,
        notes: notes.trim() || null,
        sms_consent: smsConsent,
        privacy_consent: true,
        utm_source: utmParams.utm_source,
        utm_medium: utmParams.utm_medium,
        utm_campaign: utmParams.utm_campaign,
      });
      setSubmissionResult(result);
      document.getElementById("book-call")?.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      if (error instanceof ApiClientError) {
        if (error.fieldErrors) setFieldErrors((current) => ({ ...current, ...error.fieldErrors }));
        setFormError(error.message);
      } else {
        setFormError("Unable to reach the Relay60 server. Please check your connection and try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const embedUrl = process.env.NEXT_PUBLIC_BOOKING_EMBED_URL || "";
  const showEmbed = embedUrl.startsWith("https://cal.com/") || embedUrl.startsWith("https://calendly.com/");
  const windowLabel = WINDOW_OPTIONS.find((option) => option.value === (submissionResult?.preferred_time_window ?? preferredTimeWindow))?.label;

  return (
    <section id="book-call" className={`${TOKEN.SECTION_PY} ${TOKEN.SECTION_BORDER} ${TOKEN.SECTION_ANCHOR}`}>
      <div className={TOKEN.CONTAINER}>
        <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {CONTACT_STRIP.map((card) => {
            const inner = (
              <>
                <p className="text-xs font-medium tracking-wide text-slate-400">{card.label}</p>
                <p className="mt-2 text-sm font-medium text-white">{card.value}</p>
                <p className="mt-1 text-xs text-slate-500">{card.sub}</p>
              </>
            );
            return card.href ? (
              <a key={card.label} href={card.href} className="rounded-2xl border border-white/[0.08] bg-[#0A0C10] p-5 transition-colors hover:border-white/20">
                {inner}
              </a>
            ) : (
              <div key={card.label} className="rounded-2xl border border-white/[0.08] bg-[#0A0C10] p-5">
                {inner}
              </div>
            );
          })}
        </div>
        <p className={TOKEN.EYEBROW_WRAP}>
          <span className={TOKEN.EYEBROW_DASH} />
          {FORM_COPY.eyebrow}
        </p>
        <h2 className={`${TOKEN.H2} mt-4`}>
          <span className="block font-light">{FORM_COPY.line1}</span>
          <span className="block font-semibold">{FORM_COPY.line2}</span>
        </h2>
        <p className={`${TOKEN.BODY_LG} mt-4 max-w-3xl`}>{FORM_COPY.subtitle}</p>

        {submissionResult ? (
          <div className={`${TOKEN.PANEL} mt-10`}>
            <p className={TOKEN.BADGE_LIVE}>
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
              Pipeline confirmed
            </p>
            <h3 className={`${TOKEN.H3} mt-4`}>{submissionResult.confirmation_headline}</h3>
            <p className={`${TOKEN.BODY_SM} mt-3`}>{submissionResult.confirmation_message}</p>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className={TOKEN.PANEL_INSET}>
                <p className="inline-flex items-center gap-2 text-sm text-white">
                  <Lock className="h-4 w-4" aria-hidden="true" />
                  {FORM_COPY.proofLead}
                </p>
                <p className={`${TOKEN.MONO_TAG} mt-2 break-all text-sky-300`}>{submissionResult.lead_id}</p>
                <p className="text-xs text-slate-500">{submissionResult.submitted_at}</p>
              </div>
              <div className={TOKEN.PANEL_INSET}>
                <p className="inline-flex items-center gap-2 text-sm text-white">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" aria-hidden="true" />
                  {FORM_COPY.proofEmail}
                </p>
                <p className="mt-2 text-sm text-slate-400">{FORM_COPY.proofEmailStatus}</p>
              </div>
              <div className={TOKEN.PANEL_INSET}>
                <p className="text-sm text-white">{FORM_COPY.proofSms}</p>
                <p className="mt-2 text-sm text-slate-400">
                  {submissionResult.sms_ack_queued ? FORM_COPY.proofSmsQueued : FORM_COPY.proofSmsSkipped}
                </p>
              </div>
              <div className={TOKEN.PANEL_INSET}>
                <p className="inline-flex items-center gap-2 text-sm text-white">
                  <Calendar className="h-4 w-4" aria-hidden="true" />
                  {FORM_COPY.proofWindow}
                </p>
                <p className="mt-2 text-sm text-slate-400">{windowLabel}</p>
              </div>
            </div>
            {showEmbed ? (
              <div className="mt-6">
                <p className={TOKEN.BODY_SM}>{FORM_COPY.embedPrompt}</p>
                <iframe
                  src={embedUrl}
                  title="Schedule your 15-minute Relay60 setup call"
                  className="mt-6 h-[620px] w-full rounded-xl border border-white/[0.08] bg-[#06080B]"
                  loading="lazy"
                />
                <a href={embedUrl} className={`${TOKEN.BTN_SECONDARY} mt-4`} target="_blank" rel="noreferrer">
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  Open scheduler
                </a>
              </div>
            ) : null}
          </div>
        ) : (
          <form className={`${TOKEN.PANEL} mt-10 space-y-5`} onSubmit={(event) => void handleSubmit(event)} noValidate>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="full_name" className={TOKEN.LABEL}>{FORM_COPY.fullNameLabel}</label>
                <input id="full_name" className={TOKEN.INPUT} value={fullName} placeholder={FORM_COPY.fullNamePlaceholder} onChange={(event) => setFullName(event.target.value)} />
                <FieldError message={fieldErrors.full_name} />
              </div>
              <div>
                <label htmlFor="work_email" className={TOKEN.LABEL}>{FORM_COPY.emailLabel}</label>
                <input id="work_email" type="email" className={TOKEN.INPUT} value={workEmail} placeholder={FORM_COPY.emailPlaceholder} onChange={(event) => setWorkEmail(event.target.value)} />
                <FieldError message={fieldErrors.work_email} />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="phone" className={TOKEN.LABEL}>{FORM_COPY.phoneLabel}</label>
                <input id="phone" className={TOKEN.INPUT} value={phone} placeholder={config.phonePlaceholder} onChange={(event) => setPhone(event.target.value)} />
                <p className="mt-1.5 text-xs text-slate-500">{FORM_COPY.phoneHelper}</p>
                <FieldError message={fieldErrors.phone} />
              </div>
              <div>
                <label htmlFor="business_name" className={TOKEN.LABEL}>{FORM_COPY.businessLabel}</label>
                <input id="business_name" className={TOKEN.INPUT} value={businessName} placeholder={FORM_COPY.businessPlaceholder} onChange={(event) => setBusinessName(event.target.value)} />
                <FieldError message={fieldErrors.business_name} />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="vertical" className={TOKEN.LABEL}>{FORM_COPY.verticalLabel}</label>
                <select id="vertical" className={TOKEN.SELECT} value={vertical} onChange={(event) => setVertical(event.target.value as IndustryVertical)}>
                  {VERTICAL_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="monthly_lead_volume" className={TOKEN.LABEL}>{FORM_COPY.volumeLabel}</label>
                <select id="monthly_lead_volume" className={TOKEN.SELECT} value={monthlyLeadVolume} onChange={(event) => setMonthlyLeadVolume(event.target.value as MonthlyLeadVolume)}>
                  {VOLUME_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="website_url" className={TOKEN.LABEL}>{FORM_COPY.websiteLabel}</label>
                <input id="website_url" className={TOKEN.INPUT} value={websiteUrl} placeholder={FORM_COPY.websitePlaceholder} onChange={(event) => setWebsiteUrl(event.target.value)} />
              </div>
              <div>
                <label htmlFor="current_tools" className={TOKEN.LABEL}>{FORM_COPY.toolsLabel}</label>
                <input id="current_tools" className={TOKEN.INPUT} value={currentTools} placeholder={FORM_COPY.toolsPlaceholder} onChange={(event) => setCurrentTools(event.target.value)} />
              </div>
            </div>
            <div>
              <label htmlFor="preferred_time_window" className={TOKEN.LABEL}>{FORM_COPY.windowLabel}</label>
              <select id="preferred_time_window" className={TOKEN.SELECT} value={preferredTimeWindow} onChange={(event) => setPreferredTimeWindow(event.target.value as PreferredTimeWindow)}>
                {WINDOW_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="notes" className={TOKEN.LABEL}>{FORM_COPY.notesLabel}</label>
              <textarea id="notes" className={TOKEN.INPUT} rows={2} value={notes} placeholder={FORM_COPY.notesPlaceholder} onChange={(event) => setNotes(event.target.value)} />
            </div>
            <div className="rounded-xl border border-white/[0.08] bg-[#06080B] p-4">
              <label className="flex items-start gap-3 text-xs leading-relaxed text-slate-400">
                <input type="checkbox" className={TOKEN.CHECKBOX} checked={smsConsent} onChange={(event) => setSmsConsent(event.target.checked)} />
                <span>{FORM_COPY.smsConsent}</span>
              </label>
            </div>
            <div className="rounded-xl border border-white/[0.08] bg-[#06080B] p-4">
              <label className="flex items-start gap-3 text-xs leading-relaxed text-slate-400">
                <input id="privacy_consent" type="checkbox" className={TOKEN.CHECKBOX} checked={privacyConsent} onChange={(event) => setPrivacyConsent(event.target.checked)} />
                <span>
                  {FORM_COPY.privacyLead}
                  <Link href="/privacy" className="font-medium text-sky-300 underline">Privacy Policy</Link>
                  {FORM_COPY.privacyMid}
                  <Link href="/terms" className="font-medium text-sky-300 underline">Terms of Service</Link>
                  {FORM_COPY.privacyTail}
                </span>
              </label>
              <FieldError message={fieldErrors.privacy_consent} />
            </div>
            {formError ? (
              <p className="flex items-center gap-2 rounded-xl border border-rose-500/25 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                {formError}
              </p>
            ) : null}
            <button type="submit" className={`${TOKEN.BTN_PRIMARY} w-full py-3.5`} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {isSubmitting ? FORM_COPY.submitBusy : FORM_COPY.submitIdle}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
