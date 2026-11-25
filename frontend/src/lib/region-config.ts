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
    displayPhone: "+1 (512) 555-0194",
    phonePlaceholder: "+1 (555) 234-5678",
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
    displayPhone: "+44 7700 900412",
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
