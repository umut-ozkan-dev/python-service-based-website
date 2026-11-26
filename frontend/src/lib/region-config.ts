import type { RegionCode } from "@/lib/types";

export interface RegionMetadata {
  code: RegionCode;
  flag: string;
  label: string;
  currencySymbol: "$" | "£";
  currencyCode: "USD" | "GBP";
  coreSetupFee: number;
  coreMonthlyFee: number;
  proSetupFee: number;
  proMonthlyFee: number;
  auditFee: number;
  buildFee: number;
  monitorMonthly: number;
  partnerMonthly: number;
  displayPhone: string;
  phonePlaceholder: string;
  defaultAvgTicket: number;
  complianceBadge: string;
  postalTerm: string;
}

export const REGION_CONFIG: Record<RegionCode, RegionMetadata> = {
  US: {
    code: "US",
    flag: "🇺🇸",
    label: "US ($)",
    currencySymbol: "$",
    currencyCode: "USD",
    coreSetupFee: 995,
    coreMonthlyFee: 497,
    proSetupFee: 1795,
    proMonthlyFee: 897,
    auditFee: 1500,
    buildFee: 4500,
    monitorMonthly: 950,
    partnerMonthly: 3500,
    displayPhone: "",
    phonePlaceholder: "+1 (512) 234-5678",
    defaultAvgTicket: 850,
    complianceBadge: "US Carrier-Compliant (TCPA & A2P 10DLC Ready)",
    postalTerm: "ZIP code",
  },
  UK: {
    code: "UK",
    flag: "🇬🇧",
    label: "UK (£)",
    currencySymbol: "£",
    currencyCode: "GBP",
    coreSetupFee: 795,
    coreMonthlyFee: 397,
    proSetupFee: 1450,
    proMonthlyFee: 697,
    auditFee: 1200,
    buildFee: 3500,
    monitorMonthly: 750,
    partnerMonthly: 2800,
    displayPhone: "",
    phonePlaceholder: "+44 7700 900123",
    defaultAvgTicket: 650,
    complianceBadge: "",
    postalTerm: "postcode",
  },
};

export function formatCurrency(amount: number, region: RegionCode): string {
  return new Intl.NumberFormat(region === "US" ? "en-US" : "en-GB", {
    style: "currency",
    currency: region === "US" ? "USD" : "GBP",
    maximumFractionDigits: 0,
  }).format(amount);
}
