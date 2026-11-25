"use client";

import { ArrowUp, Mail, PhoneCall } from "lucide-react";
import Link from "next/link";

import { FOOTER_COPY, FOOTER_LINKS } from "@/lib/copy";
import { REGION_CONFIG } from "@/lib/region-config";
import { TOKEN } from "@/lib/tokens";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.07] bg-[#040507] py-14">
      <div className={`${TOKEN.CONTAINER} grid grid-cols-1 gap-10 md:grid-cols-3`}>
        <div>
          <p className="font-heading text-lg font-semibold text-white">
            relay60<span className="text-sky-400">.</span>
          </p>
          <p className={`${TOKEN.BODY_SM} mt-3`}>{FOOTER_COPY.summary}</p>
        </div>
        <div className="space-y-2 text-sm text-slate-300">
          <a className="flex items-center gap-2 hover:text-white" href="mailto:hello@relay60.com">
            <Mail className="h-4 w-4" aria-hidden="true" />
            {FOOTER_COPY.email}
          </a>
          <p className="flex items-center gap-2">
            <PhoneCall className="h-4 w-4" aria-hidden="true" />
            US Line {REGION_CONFIG.US.displayPhone}
          </p>
          <p className="flex items-center gap-2">
            <PhoneCall className="h-4 w-4" aria-hidden="true" />
            UK Line {REGION_CONFIG.UK.displayPhone}
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          {FOOTER_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-slate-400 hover:text-white">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      <div className={`${TOKEN.CONTAINER} mt-10 flex items-center justify-between gap-4 border-t border-white/[0.07] pt-6`}>
        <p className="text-xs text-slate-500">{FOOTER_COPY.copyright}</p>
        <button
          type="button"
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.03] text-slate-400 transition-colors hover:border-white/25 hover:text-white"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>
    </footer>
  );
}
