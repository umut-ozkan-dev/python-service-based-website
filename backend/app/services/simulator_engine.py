import uuid

from app.models.enums import EnquiryChannel, IndustryVertical, RegionCode
from app.schemas.simulation import (
    BookedAppointmentPreview,
    CrmPreviewPayload,
    SimulationRequest,
    SimulationResponse,
    SimulationStep,
)

US_FOOTER = (
    "Simulated walkthrough using sample US operational data. "
    "Live workflows enforce explicit opt-in, quiet hours, and audit logging."
)
UK_FOOTER = (
    "Simulated walkthrough using sample UK (+44) operational data. "
    "Live workflows enforce quiet hours, audit logging, and instant STOP opt-out."
)

HANDLES = {
    RegionCode.US: "+1 (512) •••-0148",
    RegionCode.UK: "+44 7700 •••214",
}


def _pack(
    elapsed: int,
    label: str,
    title: str,
    actor: str,
    badge: str,
    body: str,
    approval: str | None = None,
) -> dict:
    return {
        "elapsed": elapsed,
        "label": label,
        "title": title,
        "actor": actor,
        "badge": badge,
        "body": body,
        "approval": approval,
    }


def _lead_ops(region: RegionCode, channel: EnquiryChannel) -> tuple[list[dict], dict]:
    uk = region == RegionCode.UK
    crm = "Pipedrive" if uk else "HubSpot"
    value = "£1,150" if uk else "$1,450"
    opener = {
        EnquiryChannel.SMS: "Hi — can you take new demo requests this week and book a sales call?",
        EnquiryChannel.WEB_FORM: "New demo request submitted from the website form.",
        EnquiryChannel.EMAIL: "Email in: answer inbound demo requests and book the call.",
    }[channel]
    steps = [
        _pack(0, "00s", "Enquiry received", "prospect", "Incoming", opener),
        _pack(
            8,
            "08s",
            "Context-checked reply",
            "relay60_ai",
            "Relay • Reply",
            f"Yes. We can reply inside your approved rules, log the contact in {crm}, "
            "and offer Thu 11:00 AM or Fri 2:30 PM.",
        ),
        _pack(
            23,
            "23s",
            "Prospect qualified",
            "prospect",
            "Prospect reply",
            "Thursday at 11:00 AM works.",
        ),
        _pack(
            39,
            "39s",
            "CRM record created",
            "crm_system",
            "CRM sync",
            f"Created contact Jordan Hale ({HANDLES[region]}) in {crm}. "
            f"Tagged [Inbound, Qualified]. Est. value {value}. Transcript attached.",
        ),
        _pack(
            51,
            "51s",
            "Calendar invite confirmed",
            "calendar_system",
            "Calendar",
            "Booked sales intake for Thu 11:00 AM on Google Calendar. Confirmation sent.",
        ),
    ]
    preview = {
        "name": "Jordan Hale",
        "value": value,
        "stage": "Appointment Booked",
        "status": "Qualified — High Intent",
        "service": "Sales intake",
        "slot": "Thu 11:00 AM",
        "calendar": "Google Calendar",
        "decision": "qualified_and_booked",
        "confidence": 0.94,
    }
    return steps, preview


def _client_admin(region: RegionCode, channel: EnquiryChannel) -> tuple[list[dict], dict]:
    uk = region == RegionCode.UK
    crm = "Pipedrive" if uk else "HubSpot"
    opener = {
        EnquiryChannel.SMS: "Signed today. Sending the onboarding pack and company details.",
        EnquiryChannel.WEB_FORM: "New client submitted the onboarding form and company details.",
        EnquiryChannel.EMAIL: "Email in: signed agreement plus company details for onboarding.",
    }[channel]
    steps = [
        _pack(0, "00s", "Onboarding received", "prospect", "Incoming", opener),
        _pack(
            6,
            "06s",
            "Details extracted",
            "relay60_ai",
            "Relay • Checklist",
            "Extracted the legal name and billing contact. Missing: signed DPA.",
        ),
        _pack(
            16, "16s", "Document returned", "prospect", "Client reply", "Uploaded the signed DPA."
        ),
        _pack(
            28,
            "28s",
            "Human review gate",
            "relay60_ai",
            "Needs approval",
            "Provisioning is ready. Automation stays paused until an operator approves.",
            "Approve account provisioning",
        ),
        _pack(
            44,
            "44s",
            "Workspace provisioned",
            "calendar_system",
            "Provisioned",
            f"Workspace folder created. {crm} stage set to Onboarding Active. Kickoff call booked.",
        ),
    ]
    preview = {
        "name": "Avery Chen",
        "value": "£2,400" if uk else "$3,200",
        "stage": "Onboarding Active",
        "status": "Waiting on operator approval",
        "service": "Client kickoff",
        "slot": "Tue 9:30 AM",
        "calendar": f"{crm} + shared drive",
        "decision": "paused_for_provisioning",
        "confidence": 0.9,
    }
    return steps, preview


def _dispatch(region: RegionCode, channel: EnquiryChannel) -> tuple[list[dict], dict]:
    uk = region == RegionCode.UK
    job = (
        "postcode SW11 / commercial boiler / £3,400"
        if uk
        else "ZIP 78704 / central HVAC / $4,200"
    )
    board = "Jobber" if uk else "ServiceTitan"
    opener = {
        EnquiryChannel.SMS: f"Service request: {job}. Can you come out this week?",
        EnquiryChannel.WEB_FORM: f"Web request received: {job}.",
        EnquiryChannel.EMAIL: f"Email request: {job}. Please quote and schedule.",
    }[channel]
    steps = [
        _pack(0, "00s", "Service request received", "prospect", "Incoming", opener),
        _pack(
            9,
            "09s",
            "Area and diagnostics",
            "relay60_ai",
            "Relay • Triage",
            "Coverage confirmed. Asked for the unit model, age, and whether the site is occupied.",
        ),
        _pack(
            20,
            "20s",
            "Specs supplied",
            "prospect",
            "Customer reply",
            "Unit is 14 years old. The site is occupied on weekdays.",
        ),
        _pack(
            32,
            "32s",
            "Human review gate",
            "relay60_ai",
            "Needs approval",
            "Custom quote draft is ready. Automation is paused for manager sign-off.",
            "Approve custom quote draft",
        ),
        _pack(
            48,
            "48s",
            "Job card confirmed",
            "calendar_system",
            "Dispatch",
            f"Job card pushed to {board}. Arrival window confirmed for Thu 1:00–3:00 PM.",
        ),
    ]
    preview = {
        "name": "Morgan Ellis",
        "value": "£3,400" if uk else "$4,200",
        "stage": "Quote Pending Approval",
        "status": "Paused for custom price",
        "service": "Commercial service visit",
        "slot": "Thu 1:00–3:00 PM",
        "calendar": board,
        "decision": "paused_for_quote",
        "confidence": 0.88,
    }
    return steps, preview


def _internal(region: RegionCode, channel: EnquiryChannel) -> tuple[list[dict], dict]:
    crm = "Pipedrive" if region == RegionCode.UK else "HubSpot"
    opener = {
        EnquiryChannel.SMS: "What's our cancellation notice on the Northline support plan?",
        EnquiryChannel.WEB_FORM: "What is the cancellation notice on the Northline plan?",
        EnquiryChannel.EMAIL: "Please confirm the Northline cancellation notice and who to notify.",
    }[channel]
    steps = [
        _pack(0, "00s", "Question received", "prospect", "Incoming", opener),
        _pack(
            5,
            "05s",
            "Grounded answer",
            "relay60_ai",
            "Relay • Citation",
            "Support Plan v3, clause 4.2: 14 days' written notice. Account history in "
            f"{crm} matches that clause. No custom rider found.",
        ),
        _pack(
            14,
            "14s",
            "Clarification",
            "prospect",
            "Follow-up",
            "Does that notice cover the onboarding workspace too?",
        ),
        _pack(
            24,
            "24s",
            "Ticket written",
            "crm_system",
            "CRM note",
            f"Summary written to {crm}. Cited Support Plan v3 §4.2 and the account record.",
        ),
        _pack(
            36,
            "36s",
            "Owner notified",
            "calendar_system",
            "Notified",
            "Account owner notified with the verified clause references. No external message sent.",
        ),
    ]
    preview = {
        "name": "Northline Ops",
        "value": "Internal",
        "stage": "Knowledge Ticket Logged",
        "status": "Answered from approved sources",
        "service": "Policy lookup",
        "slot": "Logged just now",
        "calendar": crm,
        "decision": "answered_from_sop",
        "confidence": 0.97,
    }
    return steps, preview


BUILDERS = {
    IndustryVertical.LEAD_OPS: _lead_ops,
    IndustryVertical.CLIENT_ADMIN: _client_admin,
    IndustryVertical.DISPATCH_QUOTES: _dispatch,
    IndustryVertical.INTERNAL_OPS: _internal,
}


def _apply_custom(steps: list[dict], custom: str, preview: dict) -> None:
    lowered = custom.lower()
    if any(word in lowered for word in ("price", "cost", "fee", "how much")):
        clause = "Approved pricing is only quoted from the live rate card, never invented."
    elif any(word in lowered for word in ("urgent", "asap", "emergency")):
        clause = "Urgent requests are flagged for a person before any commitment is made."
    else:
        clause = "The request is handled inside the approved workflow and stops at the human gate."
    steps[0]["body"] = custom
    steps[1]["body"] = f"Received. {clause}"
    steps[3]["body"] = steps[3]["body"] + " Tagged: [Custom Live Test]."
    preview["name"] = "Custom Enquiry"
    preview["service"] = "Custom workflow test"


def build_simulation_response(req: SimulationRequest) -> SimulationResponse:
    steps, preview = BUILDERS[req.vertical](req.region, req.channel)
    if req.custom_enquiry:
        _apply_custom(steps, req.custom_enquiry, preview)
    simulation_id = str(uuid.uuid4())
    approval = next((step["approval"] for step in steps if step["approval"]), None)
    models = [
        SimulationStep(
            step_number=index + 1,
            elapsed_seconds=step["elapsed"],
            timestamp_label=step["label"],
            stage_title=step["title"],
            actor=step["actor"],
            actor_badge=step["badge"],
            message_body=step["body"],
            requires_approval=step["approval"] is not None,
            approval_action_label=step["approval"],
        )
        for index, step in enumerate(steps)
    ]
    via = {
        EnquiryChannel.SMS: "SMS",
        EnquiryChannel.WEB_FORM: "Web form",
        EnquiryChannel.EMAIL: "Email",
    }
    return SimulationResponse(
        simulation_id=simulation_id,
        vertical=req.vertical,
        channel=req.channel,
        region=req.region,
        is_custom_enquiry=req.custom_enquiry is not None,
        total_elapsed_seconds=steps[-1]["elapsed"],
        steps=models,
        crm_preview=CrmPreviewPayload(
            contact_name=preview["name"],
            contact_handle=(
                HANDLES[req.region]
                if req.channel != EnquiryChannel.EMAIL
                else "ops@client-example.com"
            ),
            vertical_tag=req.vertical.value,
            source_channel=req.channel,
            qualification_status=preview["status"],
            estimated_value_display=preview["value"],
            pipeline_stage=preview["stage"],
            response_sla_seconds=steps[1]["elapsed"],
        ),
        appointment_preview=BookedAppointmentPreview(
            service_label=preview["service"],
            slot_display=preview["slot"],
            calendar_target=preview["calendar"],
            confirmation_sent_via=via[req.channel],
        ),
        compliance_footer=US_FOOTER if req.region == RegionCode.US else UK_FOOTER,
        webhook_json_preview={
            "event_id": simulation_id,
            "workflow": req.vertical.value,
            "channel": req.channel.value,
            "region": req.region.value,
            "confidence": preview["confidence"],
            "decision": preview["decision"],
            "crm_actions": [preview["stage"], "transcript_logged"],
            "human_gate": {"required": approval is not None, "action": approval},
        },
    )
