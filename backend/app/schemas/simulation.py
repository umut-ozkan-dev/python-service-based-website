from typing import Literal

from pydantic import BaseModel, field_validator

from app.models.enums import EnquiryChannel, IndustryVertical, RegionCode


class SimulationRequest(BaseModel):
    vertical: IndustryVertical
    channel: EnquiryChannel
    region: RegionCode
    custom_enquiry: str | None = None

    @field_validator("custom_enquiry", mode="before")
    @classmethod
    def validate_custom_enquiry(cls, value: object) -> str | None:
        if value is None:
            return None
        text = str(value).strip().replace("<", "").replace(">", "")
        if text == "":
            return None
        if len(text) < 10 or len(text) > 280:
            raise ValueError("Custom sample enquiry must be between 10 and 280 characters.")
        return text


class SimulationStep(BaseModel):
    step_number: int
    elapsed_seconds: int
    timestamp_label: str
    stage_title: str
    actor: Literal["prospect", "relay60_ai", "crm_system", "calendar_system"]
    actor_badge: str
    message_body: str


class CrmPreviewPayload(BaseModel):
    contact_name: str
    contact_handle: str
    vertical_tag: str
    source_channel: EnquiryChannel
    qualification_status: Literal["Qualified — High Intent"]
    estimated_value_display: str
    pipeline_stage: Literal["Appointment Booked"]
    response_sla_seconds: int


class BookedAppointmentPreview(BaseModel):
    service_label: str
    slot_display: str
    calendar_target: str
    confirmation_sent_via: str


class SimulationResponse(BaseModel):
    simulation_id: str
    vertical: IndustryVertical
    channel: EnquiryChannel
    region: RegionCode
    is_custom_enquiry: bool
    total_elapsed_seconds: int
    steps: list[SimulationStep]
    crm_preview: CrmPreviewPayload
    appointment_preview: BookedAppointmentPreview
    compliance_footer: str
