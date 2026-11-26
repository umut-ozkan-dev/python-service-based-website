export type RegionCode = "US" | "UK";
export type IndustryVertical = "lead_ops" | "client_admin" | "dispatch_quotes" | "internal_ops";
export type EnquiryChannel = "sms" | "web_form" | "email";
export type MonthlyLeadVolume = "under_30" | "30_to_75" | "76_to_200" | "200_plus";
export type TeamSize = "1_to_10" | "11_to_50" | "51_to_200" | "200_plus";
export type AutomationFocus =
  | "inbound_leads"
  | "client_onboarding"
  | "crm_data_sync"
  | "internal_assistant"
  | "custom_workflow";
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
  business_name: string;
  phone: string | null;
  region: RegionCode;
  team_size: TeamSize;
  automation_focus: AutomationFocus;
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
  requires_approval: boolean;
  approval_action_label: string | null;
}

export interface CrmPreviewPayload {
  contact_name: string;
  contact_handle: string;
  vertical_tag: string;
  source_channel: EnquiryChannel;
  qualification_status: string;
  estimated_value_display: string;
  pipeline_stage: string;
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
  webhook_json_preview: Record<string, unknown>;
}

export interface DispatchLog {
  id: string;
  channel: DispatchChannel;
  adapter_used: string;
  status: DispatchStatus;
  latency_ms: number;
  payload_preview: string;
  error_detail: string | null;
  created_at: string;
}

export interface LeadSummary {
  id: string;
  full_name: string;
  work_email: string;
  phone: string | null;
  business_name: string;
  vertical: IndustryVertical;
  team_size: TeamSize;
  automation_focus: AutomationFocus;
  region: RegionCode;
  sms_consent: boolean;
  response_status: LeadResponseStatus;
  created_at: string;
}

export interface SimulationSummary {
  id: string;
  vertical: IndustryVertical;
  channel: string;
  region: RegionCode;
  is_custom_enquiry: boolean;
  sample_enquiry: string;
  created_at: string;
}

export interface LeadListResponse {
  total: number;
  limit: number;
  offset: number;
  items: LeadSummary[];
  recent_simulations: SimulationSummary[];
}

export interface LeadDetail extends LeadSummary {
  current_tools: string | null;
  preferred_time_window: PreferredTimeWindow;
  notes: string | null;
  admin_notes: string | null;
  updated_at: string;
  dispatch_logs: DispatchLog[];
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
