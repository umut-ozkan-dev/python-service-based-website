export type RegionCode = "US" | "UK";
export type IndustryVertical = "dental" | "medspa" | "trades" | "clinics_legal";
export type EnquiryChannel = "sms" | "web_form" | "email";
export type MonthlyLeadVolume = "under_30" | "30_to_75" | "76_to_200" | "200_plus";
export type PreferredTimeWindow = "morning" | "afternoon" | "evening" | "first_available";
export type LeadResponseStatus =
  | "received"
  | "responding"
  | "responded"
  | "partial_failure"
  | "failed"
  | "booked"
  | "archived";
export type DispatchChannel = "email_ack" | "sms_ack" | "crm_sync" | "founder_alert";
export type DispatchStatus = "sent" | "skipped" | "failed";

export interface LeadCreateRequest {
  full_name: string;
  work_email: string;
  phone: string;
  business_name: string;
  website_url: string | null;
  vertical: IndustryVertical;
  region: RegionCode;
  monthly_lead_volume: MonthlyLeadVolume;
  current_tools: string | null;
  preferred_time_window: PreferredTimeWindow;
  notes: string | null;
  sms_consent: boolean;
  privacy_consent: boolean;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
}

export interface LeadCreateResponse {
  lead_id: string;
  response_status: LeadResponseStatus;
  sla_target_seconds: number;
  sms_ack_queued: boolean;
  email_ack_queued: boolean;
  preferred_time_window: PreferredTimeWindow;
  submitted_at: string;
  confirmation_headline: string;
  confirmation_message: string;
}

export interface SimulationRequest {
  vertical: IndustryVertical;
  channel: EnquiryChannel;
  region: RegionCode;
  custom_enquiry?: string | null;
}

export interface SimulationStep {
  step_number: number;
  elapsed_seconds: number;
  timestamp_label: string;
  stage_title: string;
  actor: "prospect" | "relay60_ai" | "crm_system" | "calendar_system";
  actor_badge: string;
  message_body: string;
}

export interface CrmPreviewPayload {
  contact_name: string;
  contact_handle: string;
  vertical_tag: string;
  source_channel: EnquiryChannel;
  qualification_status: "Qualified — High Intent";
  estimated_value_display: string;
  pipeline_stage: "Appointment Booked";
  response_sla_seconds: number;
}

export interface BookedAppointmentPreview {
  service_label: string;
  slot_display: string;
  calendar_target: string;
  confirmation_sent_via: string;
}

export interface SimulationResponse {
  simulation_id: string;
  vertical: IndustryVertical;
  channel: EnquiryChannel;
  region: RegionCode;
  is_custom_enquiry: boolean;
  total_elapsed_seconds: number;
  steps: SimulationStep[];
  crm_preview: CrmPreviewPayload;
  appointment_preview: BookedAppointmentPreview;
  compliance_footer: string;
}

export interface RoiInputs {
  region: RegionCode;
  monthly_enquiries: number;
  avg_appointment_value: number;
  current_close_rate_pct: number;
  current_response_minutes: number;
}

export interface RoiOutputs {
  region: RegionCode;
  currency_symbol: "$" | "£";
  estimated_monthly_lost_revenue: number;
  projected_recovered_revenue: number;
  projected_additional_bookings: number;
  net_monthly_gain_after_fee: number;
  setup_fee: number;
  monthly_fee: number;
  first_month_total_investment: number;
  payback_days: number;
  payback_display: string;
}

export interface ApiErrorPayload {
  error: {
    code: string;
    message: string;
    field_errors: Record<string, string> | null;
  };
}
