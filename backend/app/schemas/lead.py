import re
from datetime import datetime

from email_validator import EmailNotValidError, validate_email
from pydantic import BaseModel, ConfigDict, Field, ValidationInfo, field_validator

from app.models.enums import (
    IndustryVertical,
    LeadResponseStatus,
    MonthlyLeadVolume,
    PreferredTimeWindow,
    RegionCode,
)
from app.schemas.common import DispatchLogItem

_HTML_TAGS = re.compile(r"<[^>]*>")
_WEBSITE = re.compile(r"^https?://[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(/.*)?$")


def _optional_text(value: object, max_length: int) -> str | None:
    if value is None:
        return None
    text = _HTML_TAGS.sub("", str(value)).strip()
    if text == "":
        return None
    if len(text) > max_length:
        raise ValueError(f"Please keep this field under {max_length} characters.")
    return text


class LeadCreateRequest(BaseModel):
    full_name: str
    work_email: str
    region: RegionCode
    phone: str
    business_name: str
    website_url: str | None = None
    vertical: IndustryVertical
    monthly_lead_volume: MonthlyLeadVolume
    current_tools: str | None = None
    preferred_time_window: PreferredTimeWindow = PreferredTimeWindow.FIRST_AVAILABLE
    notes: str | None = None
    sms_consent: bool = False
    privacy_consent: bool
    utm_source: str | None = None
    utm_medium: str | None = None
    utm_campaign: str | None = None

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, value: str) -> str:
        text = value.strip()
        if len(text) < 2 or len(text) > 120:
            raise ValueError("Please enter your full name (2–120 characters).")
        return text

    @field_validator("work_email")
    @classmethod
    def validate_work_email(cls, value: str) -> str:
        text = value.strip().lower()
        if len(text) > 254 or text == "":
            raise ValueError("Please enter a valid work email address.")
        try:
            validate_email(text, check_deliverability=False)
        except EmailNotValidError as exc:
            raise ValueError("Please enter a valid work email address.") from exc
        return text

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value: str, info: ValidationInfo) -> str:
        cleaned = re.sub(r"[\s\-\(\)\.]", "", value.strip())
        region = info.data.get("region")
        if region == RegionCode.UK and re.fullmatch(r"0[1-9]\d{8,9}", cleaned):
            return "+44" + cleaned[1:]
        if region == RegionCode.US and re.fullmatch(r"[2-9]\d{9}", cleaned):
            return "+1" + cleaned
        if re.fullmatch(r"\+?[1-9]\d{9,14}", cleaned):
            return cleaned if cleaned.startswith("+") else "+" + cleaned
        raise ValueError("Please enter a valid US or UK phone number (10–15 digits).")

    @field_validator("business_name")
    @classmethod
    def validate_business_name(cls, value: str) -> str:
        text = value.strip()
        if len(text) < 2 or len(text) > 160:
            raise ValueError("Please enter your business or clinic name (2–160 characters).")
        return text

    @field_validator("website_url", mode="before")
    @classmethod
    def validate_website(cls, value: object) -> str | None:
        if value is None:
            return None
        text = str(value).strip()
        if text == "":
            return None
        if not text.startswith("http://") and not text.startswith("https://"):
            text = "https://" + text
        if len(text) > 255 or not _WEBSITE.fullmatch(text):
            raise ValueError("Please enter a valid website domain (e.g., brightsmile.com).")
        return text

    @field_validator("current_tools", mode="before")
    @classmethod
    def validate_current_tools(cls, value: object) -> str | None:
        return _optional_text(value, 200)

    @field_validator("notes", mode="before")
    @classmethod
    def validate_notes(cls, value: object) -> str | None:
        return _optional_text(value, 1000)

    @field_validator("privacy_consent")
    @classmethod
    def validate_privacy_consent(cls, value: bool) -> bool:
        if value is not True:
            raise ValueError(
                "You must agree to the Privacy Policy and Terms of Service to continue."
            )
        return value

    @field_validator("utm_source", "utm_medium", mode="before")
    @classmethod
    def validate_utm_short(cls, value: object) -> str | None:
        return _optional_text(value, 100)

    @field_validator("utm_campaign", mode="before")
    @classmethod
    def validate_utm_campaign(cls, value: object) -> str | None:
        return _optional_text(value, 120)


class LeadCreateResponse(BaseModel):
    lead_id: str
    response_status: LeadResponseStatus
    sla_target_seconds: int
    sms_ack_queued: bool
    email_ack_queued: bool
    preferred_time_window: PreferredTimeWindow
    submitted_at: datetime
    confirmation_headline: str
    confirmation_message: str


class LeadSummaryItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    full_name: str
    work_email: str
    phone: str
    business_name: str
    vertical: IndustryVertical
    region: RegionCode
    monthly_lead_volume: MonthlyLeadVolume
    sms_consent: bool
    response_status: LeadResponseStatus
    created_at: datetime


class SimulationSummaryItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    vertical: IndustryVertical
    channel: str
    region: RegionCode
    is_custom_enquiry: bool
    sample_enquiry: str
    created_at: datetime


class LeadListResponse(BaseModel):
    total: int
    limit: int
    offset: int
    items: list[LeadSummaryItem]
    recent_simulations: list[SimulationSummaryItem]


class LeadDetailResponse(LeadSummaryItem):
    website_url: str | None
    current_tools: str | None
    preferred_time_window: PreferredTimeWindow
    notes: str | None
    privacy_consent: bool
    consent_ip_hash: str
    consent_timestamp: datetime
    utm_source: str | None
    utm_medium: str | None
    utm_campaign: str | None
    admin_notes: str | None
    updated_at: datetime
    dispatch_logs: list[DispatchLogItem]


class LeadAdminUpdateRequest(BaseModel):
    response_status: LeadResponseStatus | None = None
    admin_notes: str | None = Field(default=None, max_length=2000)
