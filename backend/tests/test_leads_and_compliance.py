from sqlalchemy import func, select

from app.models.enums import DispatchChannel, DispatchStatus
from app.models.lead import Lead, LeadDispatchLog


def _lead_payload(**overrides):
    payload = {
        "full_name": "Sarah Jenkins",
        "work_email": "sarah@northline.example",
        "phone": "(512) 555-0148",
        "business_name": "Northline Ops",
        "region": "US",
        "team_size": "11_to_50",
        "automation_focus": "inbound_leads",
        "preferred_time_window": "morning",
        "sms_consent": False,
        "privacy_consent": True,
    }
    payload.update(overrides)
    return payload


async def test_create_lead_without_sms_consent_succeeds_and_skips_sms_dispatch(client, db_maker):
    response = await client.post("/api/v1/leads", json=_lead_payload())
    assert response.status_code == 201
    body = response.json()
    assert body["sms_ack_queued"] is False
    assert body["email_ack_queued"] is True
    assert body["confirmation_headline"] == "Enquiry received."
    async with db_maker() as session:
        lead = (await session.execute(select(Lead))).scalar_one()
        logs = (await session.execute(select(LeadDispatchLog))).scalars().all()
    assert lead.phone == "+15125550148"
    assert lead.vertical.value == "lead_ops"
    assert lead.response_status == "responded"
    assert len(logs) == 4
    by_channel = {log.channel: log.status for log in logs}
    assert by_channel[DispatchChannel.SMS_ACK] == DispatchStatus.SKIPPED
    assert by_channel[DispatchChannel.EMAIL_ACK] == DispatchStatus.SENT
    assert by_channel[DispatchChannel.CRM_SYNC] == DispatchStatus.SENT
    assert by_channel[DispatchChannel.FOUNDER_ALERT] == DispatchStatus.SENT


async def test_create_lead_with_sms_consent_dispatches_all_four_channels(client, db_maker):
    response = await client.post(
        "/api/v1/leads",
        json=_lead_payload(
            region="UK",
            phone="07700 900214",
            work_email="hannah@thames.example",
            sms_consent=True,
            automation_focus="client_onboarding",
        ),
    )
    assert response.status_code == 201
    assert response.json()["sms_ack_queued"] is True
    async with db_maker() as session:
        lead = (await session.execute(select(Lead))).scalar_one()
        logs = (await session.execute(select(LeadDispatchLog))).scalars().all()
    assert lead.phone == "+447700900214"
    assert lead.vertical.value == "client_admin"
    assert len(logs) == 4
    assert all(log.status == DispatchStatus.SENT for log in logs)


async def test_create_lead_without_phone_skips_sms(client, db_maker):
    response = await client.post("/api/v1/leads", json=_lead_payload(phone=None, sms_consent=False))
    assert response.status_code == 201
    assert response.json()["sms_ack_queued"] is False
    async with db_maker() as session:
        lead = (await session.execute(select(Lead))).scalar_one()
        logs = (await session.execute(select(LeadDispatchLog))).scalars().all()
    assert lead.phone is None
    sms = {log.channel: log.status for log in logs}[DispatchChannel.SMS_ACK]
    assert sms == DispatchStatus.SKIPPED


async def test_create_lead_rejects_sms_consent_without_phone(client, db_maker):
    response = await client.post("/api/v1/leads", json=_lead_payload(phone=None, sms_consent=True))
    assert response.status_code == 422
    field_errors = response.json()["error"]["field_errors"]
    assert "phone" in field_errors
    async with db_maker() as session:
        count = (await session.execute(select(func.count(Lead.id)))).scalar_one()
    assert count == 0


async def test_create_lead_rejects_missing_privacy_consent_with_422(client, db_maker):
    response = await client.post("/api/v1/leads", json=_lead_payload(privacy_consent=False))
    assert response.status_code == 422
    error = response.json()["error"]
    assert error["code"] == "VALIDATION_ERROR"
    assert "privacy_consent" in error["field_errors"]
    async with db_maker() as session:
        count = (await session.execute(select(func.count(Lead.id)))).scalar_one()
    assert count == 0


async def test_create_lead_rejects_invalid_email_and_phone_with_422(client):
    response = await client.post(
        "/api/v1/leads",
        json=_lead_payload(work_email="not-an-email", phone="123"),
    )
    assert response.status_code == 422
    field_errors = response.json()["error"]["field_errors"]
    assert "work_email" in field_errors
    assert "phone" in field_errors
