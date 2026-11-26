import enum


class RegionCode(str, enum.Enum):
    US = "US"
    UK = "UK"


class IndustryVertical(str, enum.Enum):
    LEAD_OPS = "lead_ops"
    CLIENT_ADMIN = "client_admin"
    DISPATCH_QUOTES = "dispatch_quotes"
    INTERNAL_OPS = "internal_ops"


class EnquiryChannel(str, enum.Enum):
    SMS = "sms"
    WEB_FORM = "web_form"
    EMAIL = "email"


class MonthlyLeadVolume(str, enum.Enum):
    UNDER_30 = "under_30"
    FROM_30_TO_75 = "30_to_75"
    FROM_76_TO_200 = "76_to_200"
    OVER_200 = "200_plus"


class TeamSize(str, enum.Enum):
    SOLO_SMALL = "1_to_10"
    GROWING = "11_to_50"
    MID_MARKET = "51_to_200"
    ENTERPRISE = "200_plus"


class AutomationFocus(str, enum.Enum):
    INBOUND_LEADS = "inbound_leads"
    CLIENT_ONBOARDING = "client_onboarding"
    CRM_DATA_SYNC = "crm_data_sync"
    INTERNAL_ASSISTANT = "internal_assistant"
    CUSTOM_WORKFLOW = "custom_workflow"


class PreferredTimeWindow(str, enum.Enum):
    MORNING = "morning"
    AFTERNOON = "afternoon"
    EVENING = "evening"
    FIRST_AVAILABLE = "first_available"


class LeadResponseStatus(str, enum.Enum):
    RECEIVED = "received"
    RESPONDING = "responding"
    RESPONDED = "responded"
    PARTIAL_FAILURE = "partial_failure"
    FAILED = "failed"
    BOOKED = "booked"
    ARCHIVED = "archived"


class DispatchChannel(str, enum.Enum):
    EMAIL_ACK = "email_ack"
    SMS_ACK = "sms_ack"
    CRM_SYNC = "crm_sync"
    FOUNDER_ALERT = "founder_alert"


class DispatchStatus(str, enum.Enum):
    SENT = "sent"
    SKIPPED = "skipped"
    FAILED = "failed"


ALLOWED_ADMIN_TRANSITIONS: dict[LeadResponseStatus, set[LeadResponseStatus]] = {
    LeadResponseStatus.RECEIVED: {
        LeadResponseStatus.RESPONDED,
        LeadResponseStatus.BOOKED,
        LeadResponseStatus.ARCHIVED,
    },
    LeadResponseStatus.RESPONDING: {
        LeadResponseStatus.RESPONDED,
        LeadResponseStatus.BOOKED,
        LeadResponseStatus.ARCHIVED,
    },
    LeadResponseStatus.RESPONDED: {
        LeadResponseStatus.BOOKED,
        LeadResponseStatus.ARCHIVED,
    },
    LeadResponseStatus.PARTIAL_FAILURE: {
        LeadResponseStatus.RESPONDED,
        LeadResponseStatus.BOOKED,
        LeadResponseStatus.ARCHIVED,
    },
    LeadResponseStatus.FAILED: {
        LeadResponseStatus.RESPONDED,
        LeadResponseStatus.BOOKED,
        LeadResponseStatus.ARCHIVED,
    },
    LeadResponseStatus.BOOKED: {LeadResponseStatus.ARCHIVED},
    LeadResponseStatus.ARCHIVED: {
        LeadResponseStatus.RESPONDED,
        LeadResponseStatus.BOOKED,
    },
}
