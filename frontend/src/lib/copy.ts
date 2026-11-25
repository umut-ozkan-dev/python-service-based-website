import type { IndustryVertical, MonthlyLeadVolume, PreferredTimeWindow, RegionCode } from "@/lib/types";

export const CAPABILITIES_MENU = [
  {
    id: "lead-response",
    title: "60-Second Lead Response",
    desc: "Answer web forms, SMS, and email before prospects move on.",
    href: "/#simulator",
  },
  {
    id: "front-desk",
    title: "AI Front-Desk & Triage",
    desc: "Qualify intent, urgency, and area coverage without rigid menus.",
    href: "/#capabilities",
  },
  {
    id: "crm-sync",
    title: "CRM & Record Sync",
    desc: "Log contacts, deal tags, and full transcripts automatically.",
    href: "/#stack",
  },
  {
    id: "booking",
    title: "Calendar & Dispatch Booking",
    desc: "Confirm live appointment slots directly on your team calendar.",
    href: "/#systems",
  },
  {
    id: "follow-up",
    title: "Multi-Touch Recovery",
    desc: "Polite 14-day follow-up loops that stop when leads reply or book.",
    href: "/#capabilities",
  },
  {
    id: "escalation",
    title: "Human Escalation Gates",
    desc: "Pause automation and alert staff on clinical, legal, or edge cases.",
    href: "/#engineering",
  },
] as const;

export const INDUSTRIES_MENU = [
  {
    id: "dental" as IndustryVertical,
    title: "Dental & Orthodontics",
    desc: "Invisalign, emergency exams, and after-hours new-patient bookings.",
  },
  {
    id: "medspa" as IndustryVertical,
    title: "Med Spa & Aesthetics",
    desc: "Injectable consults, skin safety screening, and deposit links.",
  },
  {
    id: "trades" as IndustryVertical,
    title: "HVAC, Plumbing & Trades",
    desc: "ZIP/postcode checks, same-day dispatch, and replacement surveys.",
  },
  {
    id: "clinics_legal" as IndustryVertical,
    title: "Physio, Chiro & Advisory",
    desc: "Triage screening, matter intake, and practitioner scheduling.",
  },
] as const;

export const HERO_COPY = {
  line1: "Autonomous",
  line2: "response systems",
  line3: "engineered for",
  line4: "service teams.",
  cta: "See the system live",
  captionLabel: "Lead & Operations Infrastructure",
  caption1: "AI automation for US & UK appointment businesses.",
  caption2: "Under-60-second replies. Zero dropped enquiries.",
  rightPill: "60-Second Infrastructure",
  thesis1: "From incoming enquiry",
  thesis2: "to booked calendar slot.",
  pause: "Pause motion",
  resume: "Resume motion",
};

export const SYSTEMS_COPY = {
  eyebrow: "Inside the systems",
  line1: "Real pipelines.",
  line2: "Closer telemetry.",
  recovered: { US: "$41,850", UK: "£32,900" } as Record<RegionCode, string>,
  one: {
    tag: "Clinics & Multi-Channel / Inbound Command",
    title: "Lead response and booking in one loop.",
    summary: "Web form, SMS, and inbox triage connected straight to your CRM and live appointment calendar.",
    link: "Inspect live workflow",
  },
  two: {
    tag: "Trades & Advisory / Autonomous Front Desk",
    title: "Connected triage with human review gates.",
    summary: "After-hours qualification and 5-touch recovery, paired with instant coordinator handoff on sensitive requests.",
    link: "Test trades pipeline",
  },
};

export const SIMULATOR_COPY = {
  eyebrow: "Workflow studio",
  line1: "See the system.",
  line2: "Not just the promise.",
  subtitle:
    "Four real service verticals. Pick an industry and inbound channel—or type your own enquiry—to watch our live API execute reply, qualification, CRM logging, and booking.",
  studioLeft: "relay60. / workflow studio",
  studioRight: "Interactive example · simulated data",
  tabs: {
    dental: "01 Dental & Clinics",
    medspa: "02 Med Spa",
    trades: "03 Trades & Dispatch",
    clinics_legal: "04 Physio & Legal",
  } as Record<IndustryVertical, string>,
  stages: ["01 Enquiry received", "02 08s contextual reply", "03 CRM & rules synced", "04 Slot confirmed"],
  presetMode: "Preset scenario",
  customMode: "Custom enquiry",
  placeholder: "e.g., Hi, do you have any urgent appointments tomorrow afternoon and what is the initial visit fee?",
  restart: "Restart",
  runIdle: "Start walkthrough",
  runPlaying: "Running pipeline...",
  runReplay: "Replay walkthrough",
  boundaryTitle: "Connected context. Defined boundaries.",
  boundaryBody:
    "Autonomous inside your approved pricing and scheduling rules. Clinical, legal, or urgent exceptions pause immediately for human approval.",
  footnote:
    "An illustrative walkthrough powered by the Relay60 simulation API. No live customer messages are sent and no external records are modified.",
};

export const CAPABILITIES_COPY = {
  eyebrow: "Capabilities",
  line1: "AI operations",
  line2: "built around your business.",
  subtitle:
    "Leading with 60-second inbound response, engineered as modular systems that remove repetitive front-desk and follow-up bottlenecks.",
  cards: [
    {
      title: "60-Second Lead Response",
      body: "Every web form, SMS, and email enquiry receives a tailored, human-grade reply within 60 seconds—day, night, and weekends.",
    },
    {
      title: "AI Front-Desk & Triage",
      body: "Asks your 1–3 qualification questions (area coverage, urgency, treatment or job scope) using your exact pricing rules and tone.",
    },
    {
      title: "CRM & Pipeline Synchronization",
      body: "Creates structured contacts, applies intent tags, updates pipeline stages, and attaches complete conversation transcripts automatically.",
    },
    {
      title: "Calendar & Dispatch Booking",
      body: "Reads real-time team availability and locks confirmed appointments or dispatch windows directly into your existing booking calendar.",
    },
    {
      title: "Multi-Touch Recovery Loops",
      body: "When a prospect gets distracted mid-thread, polite spaced follow-ups run across 14 days—and stop the second they reply or book.",
    },
    {
      title: "Human Escalation & Audit",
      body: "Strict domain guardrails prevent off-script pricing or clinical/legal advice. Edge cases pause automation and alert your team immediately.",
    },
  ],
};

export const STACK_COPY = {
  eyebrow: "Connected infrastructure",
  line1: "Your tools.",
  line2: "One connected loop.",
  subtitle: "Zero rip-and-replace. We wire directly into the inboxes, CRMs, and calendars your staff already open every morning.",
  pillars: [
    {
      num: "01",
      title: "Channels & Inboxes",
      body: "Web forms, dedicated US/UK SMS numbers, and shared clinic or trade email inboxes routed into one pipeline.",
    },
    {
      num: "02",
      title: "CRM & Operations",
      body: "Two-way reads and writes for contacts, job estimates, tags, and transcript audit trails without duplicate entries.",
    },
    {
      num: "03",
      title: "Calendars & Dispatch",
      body: "Live slot availability across single-site calendars, multi-practitioner diaries, and territory dispatch boards.",
    },
    {
      num: "04",
      title: "Boundaries & Control",
      body: "Explicit escalation triggers, quiet-hours scheduling, and instant STOP opt-out enforcement built at the system layer.",
    },
  ],
};

export const INTEGRATION_PILLS = [
  "HubSpot",
  "GoHighLevel",
  "ServiceTitan",
  "Jobber",
  "Pipedrive",
  "Clio",
  "Cliniko / Jane App",
  "Google Calendar",
  "Microsoft Outlook",
  "Cal.com & Calendly",
];

export const PROCESS_COPY = {
  eyebrow: "Delivery cadence",
  line1: "Audit. Architect.",
  line2: "Connect. Operate.",
  steps: [
    {
      num: "01",
      title: "Audit",
      lead: "Map the bottlenecks.",
      body: "A 15-minute review of your enquiry channels, response gaps, CRM fields, and booking rules with clear success targets.",
    },
    {
      num: "02",
      title: "Architect",
      lead: "Engineer the playbook.",
      body: "Custom response scripts, qualification logic, carrier setup, and strict escalation guardrails tested against realistic edge cases.",
    },
    {
      num: "03",
      title: "Connect",
      lead: "Wire into your stack.",
      body: "Live two-way hookup to your forms, SMS, email, CRM, and calendar—QA verified end-to-end within 7 business days.",
    },
    {
      num: "04",
      title: "Operate",
      lead: "Monitor and refine.",
      body: "Ongoing SLA monitoring, deliverability checks, seasonal offer tuning, and conversion reviews—month-to-month with zero lock-in.",
    },
  ],
};

export const ROI_COPY = {
  eyebrow: "Revenue telemetry",
  line1: "Quantify the cost",
  line2: "of slow follow-up.",
  subtitle: "Adjust the parameters below to model monthly enquiry leakage and payback speed against our fixed setup and monthly retainer.",
  enquiriesLabel: "Monthly Inbound Enquiries (Web, SMS & Email)",
  enquiriesTooltip: "Total new customer enquiries arriving across your website forms, email, and text messages each month.",
  valueLabel: {
    US: "Average Customer / Appointment Value ($ USD)",
    UK: "Average Customer / Appointment Value (£ GBP)",
  } as Record<RegionCode, string>,
  valueTooltip: "Average first-visit ticket or lifetime job/treatment value of one booked customer.",
  closeLabel: "Current Enquiry-to-Booking Close Rate (%)",
  closeTooltip: "Percentage of raw inbound enquiries that currently end up as a confirmed appointment on your calendar.",
  responseLabel: "Current Average Response Time",
  responseTooltip: "Include evenings and weekends—when 42% of local service and clinic enquiries arrive.",
  lostTitle: "Estimated Monthly Lost Revenue",
  lostSub: "Leaking to faster local competitors",
  recoveredTitle: "Projected Monthly Recovered Revenue",
  netTitle: "Net Monthly Gain After Relay60 Plan",
  paybackTitle: "Estimated Payback Period (Setup + Month 1)",
  cta: "Book a 15-min walkthrough",
  footnote:
    "Illustrative projection modeled on published B2B/SMB speed-to-lead conversion decay benchmarks and a conservative 75% capture factor. Actual bookings depend on local demand, ad quality, and calendar capacity.",
};

export const ENGINEERING_COPY = {
  eyebrow: "Direct engineering",
  line1: "Systems that run",
  line2: "while your team works.",
  lead: "The engineers who scope your workflow are the engineers who build, integrate, and maintain it—no account-manager handoffs, no generic chatbot templates, and no bloated dashboard your staff has to babysit.",
  quote:
    "Most automation agencies sell noisy demos that break in week two. We engineer quiet, deterministic response and booking pipelines around how your business actually operates.",
  metrics: [
    { value: "< 60s", label: "Target response SLA" },
    { value: "7 days", label: "Typical go-live window" },
    { value: "14 days", label: "Cancel notice—zero lock-in" },
  ],
  layers: [
    { layer: "01", title: "Autonomous Agents", desc: "Classify intent, reply naturally, handle triage" },
    { layer: "02", title: "System Orchestration", desc: "One deterministic loop across web, SMS, and email" },
    { layer: "03", title: "Guardrails & Escalation", desc: "Domain boundaries, quiet hours, instant staff alerts" },
    { layer: "04", title: "CRM & Calendar Sync", desc: "Clean records, tags, transcripts, and confirmed slots" },
    { layer: "05", title: "Your Daily Operation", desc: "The clinic, trade, or advisory team it all runs for" },
  ],
};

export const PRICING_COPY = {
  eyebrow: "Transparent terms",
  line1: "Fixed setup.",
  line2: "Predictable monthly.",
  subtitle: "No enterprise quote games, no per-lead taxes, and no 12-month contracts. One saved booking a month typically covers the entire retainer.",
  popular: "Recommended",
  coreTitle: "Core Clinic & Trade Plan",
  coreIdeal: "Single-location clinics, med spas, trades, and local practices handling up to 500 enquiries/month.",
  coreSetupLabel: "One-Time Done-For-You Setup",
  setupHeading: "Included in One-Time Setup",
  monthlyHeading: "Included Every Month",
  coreSetup: [
    "Custom AI playbook trained on your services, pricing, FAQs & tone of voice",
    "Web form, dedicated SMS number (A2P 10DLC / UK sender registration) & email hookup",
    "Two-way integration with your existing CRM & booking calendar",
    "Qualification triage rules + human escalation triggers configured",
    "End-to-end QA testing & go-live within 7 business days",
  ],
  coreMonthly: [
    "Up to 500 inbound enquiries/month answered in < 60 seconds (24/7/365)",
    "Automated 5-touch polite follow-up sequence for non-bookers",
    "Real-time CRM contact creation, deal tagging & transcript logging",
    "Monthly prompt tuning, seasonal offer updates & deliverability monitoring",
    "Cancel anytime with 14 days' notice—zero long-term lock-in",
  ],
  coreCta: "Start With Core Plan — Book 15-Min Call",
  proTitle: "Multi-Location Pro Plan",
  proIdeal: "Multi-site clinic groups, regional home-service fleets, and high-spend ad accounts up to 3 locations.",
  proSetupLabel: "One-Time Multi-Site Setup",
  proHeading: "Everything in Core, Plus",
  proItems: [
    "Up to 2,000 inbound enquiries/month across up to 3 locations",
    "Multi-practitioner or territory postcode/ZIP round-robin calendar routing",
    "Custom webhook & ad-conversion offline attribution sync (Google / Meta Ads)",
    "Priority Slack or WhatsApp direct engineering support channel",
    "Bi-weekly conversion rate review & script optimization",
  ],
  proCta: "Book Multi-Site Architecture Call",
  guaranteeTitle: "The Double-Lock 7-Day Launch & 60-Second SLA Guarantee",
  guaranteeBody:
    "1) We launch your fully tested system within 7 business days of onboarding kick-off, or we refund 100% of your setup fee. 2) If Relay60 fails to respond to eligible inbound enquiries in under 60 seconds during your first 30 days live, your first monthly retainer is on us.",
};

export const FAQ_COPY = {
  eyebrow: "Straight answers",
  heading: "Straight answers.",
  subtitle: "The operational questions clinic owners, trade operators, and partners ask before we build.",
};

export const FAQ_ITEMS = [
  {
    question: "Will this sound like a pushy or robotic chatbot to my customers?",
    answer:
      "Never. We don't put a clunky 'press 1 for sales' widget on your site. Relay60 writes concise, warm, natural messages over real SMS and email tailored to your clinic or trade's exact terminology, pricing rules, and local area. Most customers assume they are texting your sharpest front-desk coordinator.",
  },
  {
    question: "Do we have to switch away from our current CRM or booking calendar?",
    answer:
      "No. Relay60 connects directly to the tools your team already uses—including HubSpot, GoHighLevel, ServiceTitan, Jobber, Pipedrive, Clio, Cliniko, Jane App, Google Calendar, Outlook, and Cal.com/Calendly. Your staff keeps working inside their familiar calendar.",
  },
  {
    question: "What happens if a customer asks a complex medical, legal, or urgent emergency question?",
    answer:
      "During setup, we program strict safety and escalation guardrails. Relay60 never gives clinical diagnoses, legal advice, or unapproved discounts. The moment an enquiry triggers an urgent, sensitive, or custom rule, Relay60 politely acknowledges the customer, pauses automation for that thread, and sends an instant alert to your team with the full transcript.",
  },
  {
    question: "How long does setup take, and how much of my time does it require?",
    answer:
      "We go live within 7 business days. All we need from you is one 30-minute onboarding call plus access to your calendar/CRM webhook. Our engineering team handles 100% of the prompt architecture, carrier registration, integration wiring, and end-to-end QA.",
  },
  {
    question: "How do SMS opt-outs, quiet hours, and US/UK carrier rules work?",
    answer:
      "Every workflow is built around permission-based messaging. For US businesses, we configure A2P 10DLC sender registration, express web-form opt-in language, local quiet-hours rules, and automatic STOP/HELP keyword handling under TCPA guidelines. For UK businesses, we configure dedicated +44 sender numbers, audit logging, encrypted transit, and instant STOP opt-out handling.",
  },
  {
    question: "What if a lead doesn't reply or book right away?",
    answer:
      "Roughly half of booked appointments come from polite follow-up rather than the first message. If a prospect goes quiet, Relay60 runs a gentle, value-first 5-touch follow-up sequence across 14 days—and stops the instant they reply, book, or opt out.",
  },
  {
    question: "Are we locked into a 6-month or 12-month agency contract?",
    answer:
      "No. After your one-time setup, the monthly plan is rolling month-to-month. You can pause or cancel anytime with 14 days' written notice before your next billing cycle.",
  },
  {
    question: "Can you handle multiple clinic locations, practitioners, or service territories?",
    answer:
      "Yes. Our Multi-Location Pro Plan routes enquiries by postcode/ZIP code, treatment type, or round-robin practitioner availability across up to 3 locations—and we can scale further for larger groups.",
  },
];

export const CONTACT_STRIP = [
  { label: "Direct email", sub: "Tell us what's slowing follow-up.", value: "hello@relay60.com", href: "mailto:hello@relay60.com" },
  { label: "US & UK delivery", sub: "Local sender numbers & timezone rules.", value: "Austin, TX · London, UK", href: null },
  { label: "Architecture call", sub: "15 minutes. No pitch deck.", value: "Live within 7 business days", href: null },
] as const;

export const FORM_COPY = {
  eyebrow: "Live pipeline test",
  line1: "Got slow follow-up?",
  line2: "We engineer the loop.",
  subtitle:
    "Submit your details below. Our own Relay60 FastAPI backend will log your enquiry, run our SMS compliance gate, and queue your instant confirmation in real time.",
  fullNameLabel: "Your Full Name *",
  fullNamePlaceholder: "Alex Morgan",
  emailLabel: "Work Email Address *",
  emailPlaceholder: "alex@yourbusiness.com",
  phoneLabel: "Mobile or Direct Phone *",
  phoneHelper: "Used for discovery call coordination—SMS only sent if you check the optional box below.",
  businessLabel: "Business or Clinic Name *",
  businessPlaceholder: "Oakridge Dental Studio",
  websiteLabel: "Business Website (Optional)",
  websitePlaceholder: "yourbusiness.com",
  verticalLabel: "Industry Vertical *",
  volumeLabel: "Approximate Monthly Enquiries *",
  toolsLabel: "Current CRM / Calendar (Optional)",
  toolsPlaceholder: "e.g., HubSpot + Google Calendar, Jobber, Cliniko",
  windowLabel: "Preferred 15-Min Call Window *",
  notesLabel: "Anything Specific You Want Automated? (Optional)",
  notesPlaceholder: "e.g., After-hours web enquiries and missed weekend texts",
  smsConsent:
    "Optional SMS Demo & Call Reminders: By checking this box, I consent to receive automated transactional and demo text messages from Relay60 at the phone number provided above regarding my enquiry and scheduled setup call. Message frequency varies (typically 1–4 messages per enquiry). Message and data rates may apply. Reply STOP to opt out at any time or HELP for help. Consent is not a condition of purchase.",
  privacyLead: "I agree to the Relay60 ",
  privacyMid: " and ",
  privacyTail: ", and consent to Relay60 processing my submitted business details to respond to my enquiry.",
  submitIdle: "Test Our 60s Pipeline & Book 15-Min Call",
  submitBusy: "Dispatching Instant Pipeline...",
  proofEmail: "Instant Email Confirmation Queued",
  proofEmailStatus: "Status: Dispatched (< 60s SLA)",
  proofSms: "SMS Demo Acknowledgement",
  proofSmsQueued: "Queued to your mobile (opt-in verified)",
  proofSmsSkipped: "Skipped cleanly (SMS opt-in checkbox left unchecked — compliance gate active)",
  proofLead: "Lead ID Logged & Encrypted",
  proofWindow: "Discovery Call Slot Preference",
  embedPrompt: "Want to pick an exact 15-minute calendar time right now? Select a slot below:",
  errors: {
    full_name: "Please enter your full name (2–120 characters).",
    work_email: "Please enter a valid work email address.",
    phone: "Please enter a valid US or UK phone number (10–15 digits).",
    business_name: "Please enter your business or clinic name (2–160 characters).",
    privacy_consent: "You must agree to the Privacy Policy and Terms of Service to continue.",
  },
};

export const VERTICAL_OPTIONS: Array<{ value: IndustryVertical; label: string }> = [
  { value: "dental", label: "Dental & Orthodontics" },
  { value: "medspa", label: "Med Spa & Aesthetics" },
  { value: "trades", label: "HVAC, Plumbing & Home Services" },
  { value: "clinics_legal", label: "Physio, Chiro & Local Legal" },
];

export const VOLUME_OPTIONS: Array<{ value: MonthlyLeadVolume; label: string }> = [
  { value: "under_30", label: "Under 30 enquiries/month" },
  { value: "30_to_75", label: "30–75 enquiries/month" },
  { value: "76_to_200", label: "76–200 enquiries/month" },
  { value: "200_plus", label: "200+ enquiries/month" },
];

export const WINDOW_OPTIONS: Array<{ value: PreferredTimeWindow; label: string }> = [
  { value: "first_available", label: "First Available Slot (Next 24–48 Hours)" },
  { value: "morning", label: "Morning (9:00 AM – 12:00 PM Local Time)" },
  { value: "afternoon", label: "Afternoon (12:00 PM – 4:00 PM Local Time)" },
  { value: "evening", label: "Late Afternoon (4:00 PM – 6:30 PM Local Time)" },
];

export const FOOTER_LINKS = [
  { label: "Systems", href: "/#systems" },
  { label: "Workflow Studio", href: "/#simulator" },
  { label: "ROI Calculator", href: "/#roi-calculator" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
] as const;

export const FOOTER_COPY = {
  summary: "Relay60 engineers and operates autonomous 60-second lead response, CRM sync, and appointment booking systems for US & UK service teams.",
  email: "hello@relay60.com",
  copyright: "© 2026 Relay60 Systems Inc. / Relay60 Systems Ltd. All rights reserved. Mobile opt-in data and consent are never shared with third parties for marketing purposes.",
};

export const NOT_FOUND_COPY = {
  badge: "404 — PAGE NOT FOUND",
  heading: "This Page Missed Its Appointment.",
  body: "Unlike our <60-second lead response engine, the URL you requested doesn't exist or has moved.",
  cta: "Return to homepage",
};

export interface LegalClause {
  heading: string;
  body: string;
  highlight?: boolean;
}

export const PRIVACY_CLAUSES: LegalClause[] = [];

export const TERMS_CLAUSES: LegalClause[] = [];
