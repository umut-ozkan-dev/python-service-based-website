from datetime import UTC, datetime
from typing import Annotated

from fastapi import APIRouter, BackgroundTasks, Depends, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import Settings, get_settings
from app.core.database import get_db_session, get_session_maker
from app.core.rate_limit import extract_client_ip, rate_limiter
from app.core.security import hash_ip
from app.models.enums import LeadResponseStatus
from app.models.lead import Lead
from app.schemas.lead import LeadCreateRequest, LeadCreateResponse
from app.services.lead_pipeline import execute_lead_dispatch_pipeline

router = APIRouter(prefix="/leads", tags=["leads"])

CONFIRMATION_HEADLINE = "Pipeline Triggered in Real Time — Your Enquiry Is Locked In."
CONFIRMATION_MESSAGE = (
    "We just recorded your enquiry, queued your instant email confirmation, "
    "synced our internal CRM, and alerted an onboarding engineer."
)


@router.post("", response_model=LeadCreateResponse, status_code=status.HTTP_201_CREATED)
async def create_lead(
    payload: LeadCreateRequest,
    request: Request,
    background_tasks: BackgroundTasks,
    session: Annotated[AsyncSession, Depends(get_db_session)],
    settings: Annotated[Settings, Depends(get_settings)],
) -> LeadCreateResponse:
    client_ip = extract_client_ip(request)
    await rate_limiter.check("leads", client_ip, settings.rate_limit_leads_per_min)
    now = datetime.now(UTC)
    lead = Lead(
        full_name=payload.full_name,
        work_email=payload.work_email,
        phone=payload.phone,
        business_name=payload.business_name,
        website_url=payload.website_url,
        vertical=payload.vertical,
        region=payload.region,
        monthly_lead_volume=payload.monthly_lead_volume,
        current_tools=payload.current_tools,
        preferred_time_window=payload.preferred_time_window,
        notes=payload.notes,
        sms_consent=payload.sms_consent,
        privacy_consent=payload.privacy_consent,
        consent_ip_hash=hash_ip(client_ip, settings.ip_hash_salt),
        consent_timestamp=now,
        utm_source=payload.utm_source,
        utm_medium=payload.utm_medium,
        utm_campaign=payload.utm_campaign,
        response_status=LeadResponseStatus.RECEIVED,
    )
    session.add(lead)
    await session.commit()
    await session.refresh(lead)
    background_tasks.add_task(
        execute_lead_dispatch_pipeline,
        lead.id,
        get_session_maker(),
        settings,
    )
    return LeadCreateResponse(
        lead_id=lead.id,
        response_status=LeadResponseStatus.RECEIVED,
        sla_target_seconds=60,
        sms_ack_queued=payload.sms_consent is True,
        email_ack_queued=True,
        preferred_time_window=lead.preferred_time_window,
        submitted_at=now,
        confirmation_headline=CONFIRMATION_HEADLINE,
        confirmation_message=CONFIRMATION_MESSAGE,
    )
