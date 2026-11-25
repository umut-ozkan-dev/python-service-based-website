from datetime import UTC, datetime

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

from app.adapters.base import DispatchResult
from app.adapters.registry import AdapterRegistry
from app.core.config import Settings
from app.models.enums import DispatchChannel, DispatchStatus, LeadResponseStatus
from app.models.lead import Lead, LeadDispatchLog


def _log_from_result(
    lead_id: str, channel: DispatchChannel, result: DispatchResult
) -> LeadDispatchLog:
    return LeadDispatchLog(
        lead_id=lead_id,
        channel=channel,
        adapter_used=result.adapter_used,
        status=result.status,
        latency_ms=result.latency_ms,
        payload_preview=result.payload_preview,
        error_detail=result.error_detail,
    )


async def execute_lead_dispatch_pipeline(
    lead_id: str,
    session_factory: async_sessionmaker[AsyncSession],
    settings: Settings,
) -> None:
    async with session_factory() as session:
        lead = await session.get(Lead, lead_id)
        if lead is None:
            return
        lead.response_status = LeadResponseStatus.RESPONDING
        await session.commit()

        registry = AdapterRegistry(settings)
        logs: list[LeadDispatchLog] = []

        email_result = await registry.for_channel(DispatchChannel.EMAIL_ACK).send(
            DispatchChannel.EMAIL_ACK,
            {
                "to": lead.work_email,
                "subject": f"Relay60 Instant Confirmation — {lead.business_name}",
                "preferred_time_window": lead.preferred_time_window.value,
                "full_name": lead.full_name,
                "business_name": lead.business_name,
            },
        )
        logs.append(_log_from_result(lead.id, DispatchChannel.EMAIL_ACK, email_result))

        if lead.sms_consent is False:
            logs.append(
                LeadDispatchLog(
                    lead_id=lead.id,
                    channel=DispatchChannel.SMS_ACK,
                    adapter_used="compliance_gate",
                    status=DispatchStatus.SKIPPED,
                    latency_ms=0,
                    payload_preview='{"reason": "sms_consent_false"}',
                    error_detail=None,
                )
            )
        else:
            sms_result = await registry.for_channel(DispatchChannel.SMS_ACK).send(
                DispatchChannel.SMS_ACK,
                {
                    "to": lead.phone,
                    "body": (
                        f"Relay60 confirmation for {lead.business_name}: your enquiry is logged "
                        "and a setup call is being reserved. Reply STOP to opt out. "
                        "Reply HELP for help. Msg & data rates may apply."
                    ),
                },
            )
            logs.append(_log_from_result(lead.id, DispatchChannel.SMS_ACK, sms_result))

        crm_result = await registry.for_channel(DispatchChannel.CRM_SYNC).send(
            DispatchChannel.CRM_SYNC,
            {
                "full_name": lead.full_name,
                "work_email": lead.work_email,
                "phone": lead.phone,
                "business_name": lead.business_name,
                "vertical": lead.vertical.value,
                "region": lead.region.value,
                "consent_timestamp": lead.consent_timestamp.isoformat(),
                "sms_consent": lead.sms_consent,
                "utm_source": lead.utm_source,
                "utm_medium": lead.utm_medium,
                "utm_campaign": lead.utm_campaign,
            },
        )
        logs.append(_log_from_result(lead.id, DispatchChannel.CRM_SYNC, crm_result))

        founder_result = await registry.for_channel(DispatchChannel.FOUNDER_ALERT).send(
            DispatchChannel.FOUNDER_ALERT,
            {
                "business_name": lead.business_name,
                "vertical": lead.vertical.value,
                "region": lead.region.value,
                "monthly_lead_volume": lead.monthly_lead_volume.value,
                "preferred_time_window": lead.preferred_time_window.value,
            },
        )
        logs.append(_log_from_result(lead.id, DispatchChannel.FOUNDER_ALERT, founder_result))

        session.add_all(logs)
        sent_count = sum(1 for row in logs if row.status == DispatchStatus.SENT)
        failed_count = sum(1 for row in logs if row.status == DispatchStatus.FAILED)
        if failed_count == 0 and sent_count >= 1:
            lead.response_status = LeadResponseStatus.RESPONDED
        elif failed_count >= 1 and sent_count >= 1:
            lead.response_status = LeadResponseStatus.PARTIAL_FAILURE
        else:
            lead.response_status = LeadResponseStatus.FAILED
        lead.updated_at = datetime.now(UTC)
        await session.commit()
