import uuid

from app.models.enums import EnquiryChannel, IndustryVertical, RegionCode
from app.schemas.simulation import (
    BookedAppointmentPreview,
    CrmPreviewPayload,
    SimulationRequest,
    SimulationResponse,
    SimulationStep,
)

STEP_META = [
    (1, 0, "00s", "Enquiry Received", "prospect"),
    (2, 8, "08s", "Instant Contextual Reply", "relay60_ai"),
    (3, 23, "23s", "Qualifying Question Handled", "prospect"),
    (4, 39, "39s", "CRM Contact & Deal Created", "crm_system"),
    (5, 51, "51s", "Calendar Slot Confirmed", "calendar_system"),
]

VERTICAL_TAG = {
    IndustryVertical.DENTAL: "Dental & Orthodontics",
    IndustryVertical.MEDSPA: "Med Spa & Aesthetics",
    IndustryVertical.TRADES: "HVAC, Plumbing & Home Services",
    IndustryVertical.CLINICS_LEGAL: "Physio, Chiro & Local Legal",
}

TOKENS: dict[tuple[IndustryVertical, RegionCode], dict[str, str]] = {
    (IndustryVertical.DENTAL, RegionCode.US): {
        "contact_phone": "+1 (512) 555-0148",
        "value": "$1,450",
        "implant_or_aligner_price": "$189",
        "clinic_name": "Oakridge Dental Studio",
        "crm": "HubSpot CRM",
        "calendar": "Dentrix / Google Calendar",
    },
    (IndustryVertical.DENTAL, RegionCode.UK): {
        "contact_phone": "+44 7700 900214",
        "value": "£1,150",
        "implant_or_aligner_price": "£145",
        "clinic_name": "Kensington Smile Clinic",
        "crm": "HubSpot CRM",
        "calendar": "Dentally / Google Calendar",
    },
    (IndustryVertical.MEDSPA, RegionCode.US): {
        "contact_phone": "+1 (512) 555-0182",
        "value": "$680",
        "consult_deposit": "$50",
        "clinic_name": "Lumina Med Spa",
        "crm": "GoHighLevel CRM",
        "calendar": "Boulevard / Calendly",
    },
    (IndustryVertical.MEDSPA, RegionCode.UK): {
        "contact_phone": "+44 7700 900589",
        "value": "£520",
        "consult_deposit": "£40",
        "clinic_name": "Mayfair Aesthetics Clinic",
        "crm": "GoHighLevel CRM",
        "calendar": "Phorest / Calendly",
    },
    (IndustryVertical.TRADES, RegionCode.US): {
        "contact_phone": "+1 (512) 555-0166",
        "value": "$920",
        "callout_fee": "$89",
        "system_term": "central AC unit",
        "postal_sample": "78704",
        "company_name": "Apex HVAC & Plumbing",
        "crm": "ServiceTitan / Jobber",
        "calendar": "Dispatch Board",
    },
    (IndustryVertical.TRADES, RegionCode.UK): {
        "contact_phone": "+44 7700 900731",
        "value": "£740",
        "callout_fee": "£75",
        "system_term": "combi boiler",
        "postal_sample": "SW11",
        "company_name": "Thames Heating & Plumbing",
        "crm": "Jobber / Simpro",
        "calendar": "Engineer Dispatch Diary",
    },
    (IndustryVertical.CLINICS_LEGAL, RegionCode.US): {
        "contact_phone": "+1 (512) 555-0199",
        "value": "$1,200",
        "session_price": "$140",
        "practice_term": "physical therapy evaluation",
        "firm_name": "Summit Spine & Rehab",
        "crm": "Clio / Pipedrive",
        "calendar": "Jane App / Outlook",
    },
    (IndustryVertical.CLINICS_LEGAL, RegionCode.UK): {
        "contact_phone": "+44 7700 900842",
        "value": "£950",
        "session_price": "£110",
        "practice_term": "physiotherapy assessment",
        "firm_name": "Citygate Physio & Legal",
        "crm": "Clio / Pipedrive",
        "calendar": "Cliniko / Outlook",
    },
}

FEE_KEY = {
    IndustryVertical.DENTAL: "implant_or_aligner_price",
    IndustryVertical.MEDSPA: "consult_deposit",
    IndustryVertical.TRADES: "callout_fee",
    IndustryVertical.CLINICS_LEGAL: "session_price",
}
LABEL_KEY = {
    IndustryVertical.DENTAL: "clinic_name",
    IndustryVertical.MEDSPA: "clinic_name",
    IndustryVertical.TRADES: "company_name",
    IndustryVertical.CLINICS_LEGAL: "firm_name",
}

PRICE_TOKENS = ("price", "cost", "how much", "quote", "fee", "$", "£")
URGENT_TOKENS = ("urgent", "emergency", "today", "asap", "pain", "broken", "leak")
WEEKEND_TOKENS = ("weekend", "saturday", "evening", "after", "late")

US_FOOTER = (
    "Simulated demonstration for a US business. Live SMS follows TCPA express written "
    "consent, A2P 10DLC carrier registration, quiet-hours rules, and automatic STOP/HELP "
    "keyword handling. Message and data rates may apply."
)
UK_FOOTER = (
    "Simulated demonstration for a UK business (+44). Live messaging includes local "
    "quiet-hours scheduling, encrypted transit, and automatic STOP opt-out handling."
)


def _scripts() -> dict[tuple[IndustryVertical, EnquiryChannel], list[str]]:
    d = IndustryVertical.DENTAL
    m = IndustryVertical.MEDSPA
    t = IndustryVertical.TRADES
    c = IndustryVertical.CLINICS_LEGAL
    sms = EnquiryChannel.SMS
    web = EnquiryChannel.WEB_FORM
    email = EnquiryChannel.EMAIL
    return {
        (d, sms): [
            (
                "Hi, do you offer Invisalign consultations on evenings or Saturdays? "
                "Looking to fix crowding on my lower teeth."
            ),
            (
                "Hi Sarah! Thanks for texting {clinic_name}. Yes—we run Invisalign 3D scan "
                "consultations until 7:00 PM on Thursdays and Saturday mornings (comprehensive "
                "exam + scan is {implant_or_aligner_price}, credited toward treatment). Have you "
                "had orthodontic treatment before, and would Thursday at 5:45 PM or Saturday at "
                "10:15 AM suit you?"
            ),
            "Had braces as a teenager. Thursday at 5:45 PM works great for me!",
            (
                "Created contact Sarah Jenkins ({contact_phone}) in {crm} • Tagged: "
                "[Invisalign, Relapse Case, Evening Slot] • Est. Case Value: {value} • "
                "Full SMS transcript attached."
            ),
            (
                "Booked 'Invisalign 3D Scan Consult' for Thu 5:45 PM on {calendar}. "
                "Instant SMS confirmation + digital intake link dispatched."
            ),
        ],
        (d, web): [
            (
                "[Web Form Submission] Name: David Miller | Service: Cracked Molar / "
                "Emergency Crown | Note: Chipped my back tooth at dinner, mild sensitivity, "
                "hoping to be seen tomorrow."
            ),
            (
                "Hi David—we just received your urgent dental request at {clinic_name}. "
                "We hold priority restorative slots daily for cracked teeth. Are you "
                "experiencing sharp pain or swelling right now, and can you make tomorrow "
                "at 9:20 AM or 2:10 PM?"
            ),
            "No swelling, just sensitive to cold water. 9:20 AM tomorrow please.",
            (
                "Created contact David Miller ({contact_phone}) in {crm} • Tagged: "
                "[Urgent Restorative, Crown Candidate] • Est. Case Value: {value} • "
                "Web form + SMS thread synced."
            ),
            (
                "Booked 'Priority Exam & X-Ray' for Tomorrow 9:20 AM on {calendar}. "
                "Directions & parking details sent via SMS & Email."
            ),
        ],
        (d, email): [
            (
                "Subject: New patient whitening & hygiene enquiry — Hi team, my partner and "
                "I just moved nearby and want to book check-ups plus professional teeth "
                "whitening before a wedding next month."
            ),
            (
                "Welcome to the neighborhood, Emma! At {clinic_name}, we can book "
                "back-to-back new-patient hygiene & whitening assessments for both of you "
                "in a single visit ({implant_or_aligner_price} per person). What date is "
                "the wedding so we time your shade boost properly, and do you prefer "
                "mornings or late afternoons?"
            ),
            "Wedding is on the 28th! Next Tuesday morning back-to-back would be ideal.",
            (
                "Created household deal Emma & Partner (emma.w@example.com) in {crm} • "
                "Tagged: [New Patient x2, Cosmetic Whitening] • Est. Value: {value} • "
                "Email thread logged."
            ),
            (
                "Booked consecutive slots Tue 9:00 AM & 9:45 AM on {calendar}. "
                "Calendar invitations and new-patient forms emailed."
            ),
        ],
        (m, sms): [
            "Hey! How much is lip filler + masseter tox and do you have any openings this Friday?",
            (
                "Hi Chloe! {clinic_name} here. Every injectable visit starts with an aesthetic "
                "nurse consultation ({consult_deposit} deposit, applied 100% to your treatment "
                "that same day). Have you had dermal filler or masseter treatment in the past "
                "6 months, and would Friday at 1:30 PM or 4:00 PM work?"
            ),
            "First time for masseter, had lip filler a year ago. Friday at 4:00 PM please!",
            (
                "Created contact Chloe Brooks ({contact_phone}) in {crm} • Tagged: "
                "[Injectables, Lip + Masseter, High Intent] • Est. Ticket: {value} • "
                "SMS consent & history logged."
            ),
            (
                "Reserved Fri 4:00 PM Nurse Injector Consult + Treatment Block on {calendar}. "
                "Secure {consult_deposit} booking link & pre-care guide sent."
            ),
        ],
        (m, web): [
            (
                "[Web Form Submission] Name: Rachel Patel | Goal: Acne Scarring & Skin "
                "Texture | Preferred Contact: Text or Email | Availability: Weekdays after 3pm."
            ),
            (
                "Hi Rachel, thanks for reaching out to {clinic_name} about acne scar "
                "resurfacing! Our medical aestheticians typically pair RF Microneedling or "
                "chemical remodeling after a VISIA skin scan ({consult_deposit} redeemable "
                "deposit). Are you currently using prescription retinoids/Accutane, and does "
                "Wednesday at 3:30 PM or Thursday at 5:00 PM suit you?"
            ),
            "No Accutane, just standard skincare. Wednesday at 3:30 PM is great.",
            (
                "Created contact Rachel Patel ({contact_phone}) in {crm} • Tagged: "
                "[RF Microneedling Series, Contraindication Cleared] • Est. Package Value: "
                "{value}."
            ),
            (
                "Booked 'VISIA Skin Scan & Scar Consult' Wed 3:30 PM on {calendar}. "
                "Confirmation email & SMS reminder scheduled."
            ),
        ],
        (m, email): [
            (
                "Subject: Laser hair removal package pricing — Hello, I'd like to start "
                "laser hair removal for underarms and full legs. Is it safe for olive skin tones?"
            ),
            (
                "Hi Sofia, great question! At {clinic_name} we use dual-wavelength "
                "medical-grade lasers (Alexandrite + Nd:YAG) specifically calibrated for "
                "olive and deeper skin tones. A patch test + consultation takes 20 minutes "
                "({consult_deposit} credited to any 6-session package). Have you waxed or "
                "tanned in the last 2 weeks, and would Monday at 11:00 AM or Tuesday at "
                "5:30 PM work for your patch test?"
            ),
            "Haven't waxed or tanned recently. Tuesday at 5:30 PM works!",
            (
                "Created contact Sofia Rossi (sofia.r@example.com) in {crm} • Tagged: "
                "[Laser Hair Full Legs + Underarms, Nd:YAG] • Est. Package Value: {value}."
            ),
            (
                "Booked 'Laser Patch Test & Consult' Tue 5:30 PM on {calendar}. "
                "Pre-shave instructions emailed automatically."
            ),
        ],
        (t, sms): [
            (
                "Hi our {system_term} just stopped working and water is dripping from the "
                "tray. Can someone come out today? Area code {postal_sample}."
            ),
            (
                "Hi Mark—{company_name} dispatch here. Yes, we cover {postal_sample} and "
                "have a licensed technician finishing a job nearby! Diagnostic callout is "
                "{callout_fee} (waived if you approve the repair). Is the leak near any "
                "electrical panel, and can someone be home for our 2:00 PM–4:00 PM arrival "
                "window today?"
            ),
            (
                "Away from electrics, I switched the breaker off just in case. "
                "Yes I'm home 2-4 PM today."
            ),
            (
                "Created urgent job Mark Stevens ({contact_phone}) in {crm} • Area: "
                "{postal_sample} • Tagged: [Same-Day Emergency, {system_term}] • "
                "Est. Job Value: {value}."
            ),
            (
                "Assigned Today 2:00 PM–4:00 PM window on {calendar}. "
                "Technician tracker SMS & booking confirmation sent."
            ),
        ],
        (t, web): [
            (
                "[Request a Quote Form] Name: Ben Carter | Area: {postal_sample} | "
                "Service: Full {system_term} replacement quote | Notes: Current system is "
                "14 years old and noisy."
            ),
            (
                "Hi Ben! Thanks for requesting a replacement quote from {company_name}. "
                "We provide free, fixed-price on-site surveys in {postal_sample} with 0% "
                "financing options. Roughly how many bedrooms/bathrooms is the property, "
                "and would tomorrow at 10:00 AM or Thursday at 4:00 PM work for a "
                "30-minute survey?"
            ),
            "4 bedrooms, 2.5 baths. Thursday at 4:00 PM is ideal.",
            (
                "Created high-ticket estimate Ben Carter ({contact_phone}) in {crm} • "
                "Property: 4-Bed ({postal_sample}) • Tagged: [System Replacement Quote] • "
                "Est. Value: {value}."
            ),
            (
                "Booked 'Senior Estimator On-Site Survey' Thu 4:00 PM on {calendar}. "
                "Homeowner prep checklist sent via Email & SMS."
            ),
        ],
        (t, email): [
            (
                "Subject: Annual maintenance & safety check — Hello, we just bought a "
                "house in {postal_sample} and want to get the {system_term} serviced and "
                "checked this week."
            ),
            (
                "Congratulations on the new home, Hannah! {company_name} runs full "
                "multi-point {system_term} tune-ups and safety inspections in "
                "{postal_sample} for {callout_fee}. Do you know the make/brand on the "
                "front casing, and would Wednesday morning (9:00 AM–11:00 AM) or Friday "
                "afternoon (1:00 PM–3:00 PM) suit you?"
            ),
            "Not sure on the model yet, happy to send a photo! Friday 1-3 PM works best.",
            (
                "Created residential customer Hannah Cole (h.cole@example.com) in {crm} • "
                "Area: {postal_sample} • Tagged: [New Homeowner Tune-Up, Membership "
                "Prospect] • Est. LTV: {value}."
            ),
            (
                "Scheduled Fri 1:00 PM–3:00 PM Service Window on {calendar}. "
                "Photo-upload reply link & confirmation emailed."
            ),
        ],
        (c, sms): [
            (
                "Hi, pulled my lower back lifting weights yesterday and struggling to sit "
                "at my desk. Do you have a {practice_term} slot tomorrow?"
            ),
            (
                "Hi Alex—sorry to hear about your back! {firm_name} can get you in "
                "tomorrow for a 45-minute {practice_term} + hands-on relief session "
                "({session_price}). Just to check safety first: do you have any "
                "numbness/tingling down your legs, or is the pain localized to your lower "
                "back? Tomorrow at 11:15 AM and 4:30 PM are open."
            ),
            (
                "No numbness in legs, just tight and sore in my lower right back. "
                "11:15 AM tomorrow please!"
            ),
            (
                "Created patient Alex Turner ({contact_phone}) in {crm} • Triage: "
                "Red-Flag Negative (Acute Lumbar Strain) • Plan Est. Value: {value}."
            ),
            (
                "Booked 'Initial 45-Min Rehab Assessment' Tomorrow 11:15 AM on {calendar}. "
                "Digital health history form texted."
            ),
        ],
        (c, web): [
            (
                "[Consultation Request] Name: Claire Dawson | Matter: Commercial Lease "
                "Review | Timeline: Signing landlord heads of terms next week, need "
                "fixed-fee review."
            ),
            (
                "Hi Claire, thank you for contacting {firm_name}. Our commercial property "
                "team handles fixed-fee retail and office lease reviews within 5 business "
                "days. Have you already received the draft lease pack from the landlord's "
                "side, and can you join a 15-minute conflict & scope call tomorrow at "
                "10:00 AM or 3:00 PM?"
            ),
            "Yes, received the PDF draft this morning. Tomorrow at 10:00 AM works well.",
            (
                "Created matter lead Claire Dawson ({contact_phone}) in {crm} • Practice "
                "Area: Commercial Lease (Draft Ready) • Est. Fixed Fee: {value}."
            ),
            (
                "Booked '15-Min Solicitor Scope Call' Tomorrow 10:00 AM on {calendar}. "
                "Secure document upload portal link emailed."
            ),
        ],
        (c, email): [
            (
                "Subject: Post-knee surgery rehab — Hi, I'm 2 weeks post-ACL reconstruction "
                "and my surgeon cleared me to begin structured outpatient rehab twice a week."
            ),
            (
                "Hi Jordan, wishing you a smooth recovery! At {firm_name}, our sports rehab "
                "specialists follow surgeon-specific ACL protocols ({session_price} initial "
                "assessment). Could you bring or reply with your post-op protocol sheet, "
                "and would Monday at 2:00 PM or Tuesday at 9:30 AM work to kick off Week 1?"
            ),
            "I have the PDF from my surgeon ready. Tuesday at 9:30 AM is perfect.",
            (
                "Created rehab care plan Jordan Hayes (jordan.h@example.com) in {crm} • "
                "Tagged: [Post-Op ACL, 12-Week Protocol] • Est. Plan Value: {value}."
            ),
            (
                "Booked 'Post-Op ACL Initial Assessment' Tue 9:30 AM on {calendar}. "
                "Intake packet & clinic access guide emailed."
            ),
        ],
    }


SCRIPTS = _scripts()

PREVIEWS: dict[tuple[IndustryVertical, EnquiryChannel], dict[str, str]] = {
    (IndustryVertical.DENTAL, EnquiryChannel.SMS): {
        "contact_name": "Sarah Jenkins",
        "contact_handle": "phone",
        "service_label": "Invisalign 3D Scan Consult",
        "slot_display": "Thu 5:45 PM",
        "confirmation_sent_via": "Instant SMS confirmation + digital intake link",
    },
    (IndustryVertical.DENTAL, EnquiryChannel.WEB_FORM): {
        "contact_name": "David Miller",
        "contact_handle": "phone",
        "service_label": "Priority Exam & X-Ray",
        "slot_display": "Tomorrow 9:20 AM",
        "confirmation_sent_via": "SMS & Email",
    },
    (IndustryVertical.DENTAL, EnquiryChannel.EMAIL): {
        "contact_name": "Emma & Partner",
        "contact_handle": "emma.w@example.com",
        "service_label": "New-patient hygiene & whitening",
        "slot_display": "Tue 9:00 AM & 9:45 AM",
        "confirmation_sent_via": "Email",
    },
    (IndustryVertical.MEDSPA, EnquiryChannel.SMS): {
        "contact_name": "Chloe Brooks",
        "contact_handle": "phone",
        "service_label": "Nurse Injector Consult + Treatment Block",
        "slot_display": "Fri 4:00 PM",
        "confirmation_sent_via": "Secure booking link & pre-care guide",
    },
    (IndustryVertical.MEDSPA, EnquiryChannel.WEB_FORM): {
        "contact_name": "Rachel Patel",
        "contact_handle": "phone",
        "service_label": "VISIA Skin Scan & Scar Consult",
        "slot_display": "Wed 3:30 PM",
        "confirmation_sent_via": "Email & SMS",
    },
    (IndustryVertical.MEDSPA, EnquiryChannel.EMAIL): {
        "contact_name": "Sofia Rossi",
        "contact_handle": "sofia.r@example.com",
        "service_label": "Laser Patch Test & Consult",
        "slot_display": "Tue 5:30 PM",
        "confirmation_sent_via": "Email",
    },
    (IndustryVertical.TRADES, EnquiryChannel.SMS): {
        "contact_name": "Mark Stevens",
        "contact_handle": "phone",
        "service_label": "Same-day diagnostic window",
        "slot_display": "Today 2:00 PM–4:00 PM",
        "confirmation_sent_via": "Technician tracker SMS",
    },
    (IndustryVertical.TRADES, EnquiryChannel.WEB_FORM): {
        "contact_name": "Ben Carter",
        "contact_handle": "phone",
        "service_label": "Senior Estimator On-Site Survey",
        "slot_display": "Thu 4:00 PM",
        "confirmation_sent_via": "Email & SMS",
    },
    (IndustryVertical.TRADES, EnquiryChannel.EMAIL): {
        "contact_name": "Hannah Cole",
        "contact_handle": "h.cole@example.com",
        "service_label": "Service Window",
        "slot_display": "Fri 1:00 PM–3:00 PM",
        "confirmation_sent_via": "Email",
    },
    (IndustryVertical.CLINICS_LEGAL, EnquiryChannel.SMS): {
        "contact_name": "Alex Turner",
        "contact_handle": "phone",
        "service_label": "Initial 45-Min Rehab Assessment",
        "slot_display": "Tomorrow 11:15 AM",
        "confirmation_sent_via": "SMS",
    },
    (IndustryVertical.CLINICS_LEGAL, EnquiryChannel.WEB_FORM): {
        "contact_name": "Claire Dawson",
        "contact_handle": "phone",
        "service_label": "15-Min Solicitor Scope Call",
        "slot_display": "Tomorrow 10:00 AM",
        "confirmation_sent_via": "Email",
    },
    (IndustryVertical.CLINICS_LEGAL, EnquiryChannel.EMAIL): {
        "contact_name": "Jordan Hayes",
        "contact_handle": "jordan.h@example.com",
        "service_label": "Post-Op ACL Initial Assessment",
        "slot_display": "Tue 9:30 AM",
        "confirmation_sent_via": "Email",
    },
}


def _badge(channel: EnquiryChannel, step_number: int) -> str:
    if step_number == 1:
        return {
            EnquiryChannel.SMS: "Incoming SMS",
            EnquiryChannel.WEB_FORM: "Incoming Web Form",
            EnquiryChannel.EMAIL: "Incoming Email",
        }[channel]
    if step_number == 2:
        return "Relay60 AI • Auto-Reply"
    if step_number == 3:
        return "Prospect Reply"
    if step_number == 4:
        return "CRM Webhook Sync"
    return "Calendar Confirmed"


def _append_custom_tag(message: str) -> str:
    if "]" in message:
        return message.replace("]", ", Custom Live Test]", 1)
    return message + " Tagged: [Custom Live Test]."


def _intent_clause(text: str, business_label: str, primary_fee: str) -> str:
    lowered = text.lower()
    if any(token in lowered for token in PRICE_TOKENS):
        return (
            "To answer your pricing question directly: initial visits/assessments start at "
            f"{primary_fee}, with full transparent options confirmed upfront."
        )
    if any(token in lowered for token in URGENT_TOKENS):
        return (
            "We hold priority same-day and next-morning urgent slots specifically for "
            "situations like yours."
        )
    if any(token in lowered for token in WEEKEND_TOKENS):
        return (
            "Yes—we offer extended late-afternoon and Saturday availability so you don't "
            "have to miss work."
        )
    return (
        f"We'd love to help with that at {business_label}—standard initial appointments "
        f"start at {primary_fee}."
    )


def _render_messages(req: SimulationRequest, tokens: dict[str, str]) -> list[str]:
    templates = list(SCRIPTS[(req.vertical, req.channel)])
    messages = [template.format(**tokens) for template in templates]
    if not req.custom_enquiry:
        return messages
    business_label = tokens[LABEL_KEY[req.vertical]]
    primary_fee = tokens[FEE_KEY[req.vertical]]
    intent = _intent_clause(req.custom_enquiry, business_label, primary_fee)
    messages[0] = req.custom_enquiry
    messages[1] = (
        f"Hi there! Thanks for reaching out to {business_label}. {intent} So we match you "
        "with the right specialist, is this your first visit with us, and would tomorrow "
        "at 10:30 AM or Thursday at 4:15 PM work for you?"
    )
    messages[2] = "First time visiting! Tomorrow at 10:30 AM works great, please lock that in."
    messages[3] = _append_custom_tag(messages[3])
    messages[4] = _append_custom_tag(messages[4])
    return messages


def build_simulation_response(req: SimulationRequest) -> SimulationResponse:
    tokens = TOKENS[(req.vertical, req.region)]
    messages = _render_messages(req, tokens)
    steps = [
        SimulationStep(
            step_number=number,
            elapsed_seconds=elapsed,
            timestamp_label=label,
            stage_title=title,
            actor=actor,  # type: ignore[arg-type]
            actor_badge=_badge(req.channel, number),
            message_body=messages[index],
        )
        for index, (number, elapsed, label, title, actor) in enumerate(STEP_META)
    ]
    preview = PREVIEWS[(req.vertical, req.channel)]
    handle = preview["contact_handle"]
    if handle == "phone":
        handle = tokens["contact_phone"]
    contact_name = "Custom Enquiry" if req.custom_enquiry else preview["contact_name"]
    service_label = preview["service_label"]
    slot_display = preview["slot_display"]
    if req.custom_enquiry:
        service_label = "Custom Live Test Appointment"
        slot_display = "Tomorrow 10:30 AM"
    return SimulationResponse(
        simulation_id=str(uuid.uuid4()),
        vertical=req.vertical,
        channel=req.channel,
        region=req.region,
        is_custom_enquiry=req.custom_enquiry is not None,
        total_elapsed_seconds=51,
        steps=steps,
        crm_preview=CrmPreviewPayload(
            contact_name=contact_name,
            contact_handle=handle,
            vertical_tag=VERTICAL_TAG[req.vertical],
            source_channel=req.channel,
            qualification_status="Qualified — High Intent",
            estimated_value_display=tokens["value"],
            pipeline_stage="Appointment Booked",
            response_sla_seconds=8,
        ),
        appointment_preview=BookedAppointmentPreview(
            service_label=service_label,
            slot_display=slot_display,
            calendar_target=tokens["calendar"],
            confirmation_sent_via=preview["confirmation_sent_via"],
        ),
        compliance_footer=US_FOOTER if req.region == RegionCode.US else UK_FOOTER,
    )
