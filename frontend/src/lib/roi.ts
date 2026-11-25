import type { RoiInputs, RoiOutputs } from "@/lib/types";

export const RESPONSE_TIME_STOPS = [
  { label: "5 mins", minutes: 5 },
  { label: "30 mins", minutes: 30 },
  { label: "2 hours", minutes: 120 },
  { label: "6 hours", minutes: 360 },
  { label: "24+ hours (Next Day)", minutes: 1440 },
] as const;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function calculateRoiClient(inputs: RoiInputs): RoiOutputs {
  const monthlyEnquiries = clamp(inputs.monthly_enquiries, 5, 1000);
  const avgAppointmentValue = clamp(inputs.avg_appointment_value, 100, 10000);
  const currentCloseRatePct = clamp(inputs.current_close_rate_pct, 5, 60);
  const currentResponseMinutes = clamp(inputs.current_response_minutes, 1, 2880);

  const currencySymbol = inputs.region === "US" ? "$" : "£";
  const setupFee = inputs.region === "US" ? 995 : 795;
  const monthlyFee = inputs.region === "US" ? 497 : 397;
  const firstMonthTotalInvestment = setupFee + monthlyFee;

  let upliftFactor = 0.8;
  if (currentResponseMinutes <= 5) upliftFactor = 0.12;
  else if (currentResponseMinutes <= 30) upliftFactor = 0.28;
  else if (currentResponseMinutes <= 120) upliftFactor = 0.48;
  else if (currentResponseMinutes <= 360) upliftFactor = 0.65;

  const baseCloseRate = currentCloseRatePct / 100;
  const optimalCloseRate = Math.min(0.7, baseCloseRate * (1 + upliftFactor));
  const missedAppointmentsRaw = monthlyEnquiries * Math.max(0, optimalCloseRate - baseCloseRate);
  const estimatedMonthlyLostRevenue = Math.round(missedAppointmentsRaw * avgAppointmentValue);
  const recoveredAppointmentsRaw = missedAppointmentsRaw * 0.75;
  const projectedAdditionalBookings = Math.round(recoveredAppointmentsRaw * 10) / 10;
  const projectedRecoveredRevenue = Math.round(recoveredAppointmentsRaw * avgAppointmentValue);
  const netMonthlyGainAfterFee = projectedRecoveredRevenue - monthlyFee;

  let paybackDays = 365;
  let paybackDisplay = "90+ days";
  if (projectedRecoveredRevenue > 0) {
    const dailyRecovered = projectedRecoveredRevenue / 30;
    paybackDays = Math.min(365, Math.max(1, Math.ceil(firstMonthTotalInvestment / dailyRecovered)));
    paybackDisplay = paybackDays <= 90 ? `${paybackDays} days` : "90+ days";
  }

  return {
    region: inputs.region,
    currency_symbol: currencySymbol,
    estimated_monthly_lost_revenue: estimatedMonthlyLostRevenue,
    projected_recovered_revenue: projectedRecoveredRevenue,
    projected_additional_bookings: projectedAdditionalBookings,
    net_monthly_gain_after_fee: netMonthlyGainAfterFee,
    setup_fee: setupFee,
    monthly_fee: monthlyFee,
    first_month_total_investment: firstMonthTotalInvestment,
    payback_days: paybackDays,
    payback_display: paybackDisplay,
  };
}
