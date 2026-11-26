import type { AutomationFocus, IndustryVertical, PreferredTimeWindow, RegionCode, TeamSize } from "@/lib/types";

export const CAPABILITIES_MENU = [
  { id: "lead-response", title: "Inbound Lead & Sales Ops", desc: "Reply, qualify, update the CRM, and book the call.", href: "/#simulator" },
  { id: "booking", title: "Client Onboarding & Admin", desc: "Collect documents and provision the workspace.", href: "/#systems" },
  { id: "crm-sync", title: "CRM & Systems Integration", desc: "Two-way sync across the tools you already run.", href: "/#stack" },
  { id: "follow-up", title: "Quote & Pipeline Follow-Up", desc: "Check-ins that stop the moment someone replies.", href: "/#capabilities" },
  { id: "front-desk", title: "Internal AI Assistants", desc: "Answers grounded in your SOPs, with citations.", href: "/#capabilities" },
  { id: "escalation", title: "Human-in-the-Loop Workflows", desc: "Approval gates and an audit trail your team can read.", href: "/#engineering" },
] as const;

export const INDUSTRIES_MENU = [
  { id: "lead_ops", title: "Sales & Intake", desc: "Inbound requests, qualification, and diary booking." },
  { id: "client_admin", title: "Client Onboarding", desc: "Document collection, checklists, and provisioning." },
  { id: "dispatch_quotes", title: "Dispatch & Quoting", desc: "Coverage checks, quote drafts, and job cards." },
  { id: "internal_ops", title: "Internal Ops", desc: "Policy lookup, citations, and owner handoff." },
] as const;

export const HERO_COPY = {
  line1: "AI systems",
  line2: "built to run",
  line3: "operations.",
  cta: "Explore live workflows",
  captionLabel: "Relay Systems",
  caption1: "Custom AI automation for US & UK operating teams.",
  caption2: "Less repetitive admin. Faster handoffs. Clear human control.",
  rightPill: "AI Automation Agency",
  thesis1: "From incoming request",
  thesis2: "to completed workflow.",
  pause: "Pause motion",
  resume: "Resume motion",
};

export const SYSTEMS_COPY = {
  eyebrow: "Selected builds",
  line1: "Production systems.",
  line2: "Built around real teams.",
  recovered: { US: "$41,850", UK: "£32,900" } as Record<RegionCode, string>,
  review: {
    US: {
      title: "Needs review · Commercial HVAC retrofit (Austin 78704)",
      body: "$4,200 estimate drafted — paused for ops manager sign-off.",
    },
    UK: {
      title: "Needs review · Commercial boiler replacement (London SW11)",
      body: "£3,400 estimate drafted — paused for ops manager sign-off.",
    },
  } as Record<RegionCode, { title: string; body: string }>,
  one: {
    id: "lead_ops" as IndustryVertical,
    tag: "Revenue & Intake / Autonomous Lead Desk",
    title: "Multi-channel intake, CRM sync, and diary booking.",
    summary: "Answers inbound forms, texts, and emails inside your rules, updates CRM records cleanly, and books qualified appointments without staff chasing.",
    inspect: "Inspect architecture",
    link: "Try live walkthrough",
  },
  two: {
    id: "dispatch_quotes" as IndustryVertical,
    tag: "Operations & Field / Quoting & Admin Copilot",
    title: "Quote drafting and triage with human sign-off.",
    summary: "Checks coverage and job history, drafts structured estimates, chases open quotes, and pauses for manager approval on non-standard jobs.",
    inspect: "Inspect architecture",
    link: "Try live walkthrough",
  },
};

export const CASE_STUDIES = {
  lead_ops: {
    title: "Autonomous Lead Desk",
    trigger: "A form, text, or email arrives outside office hours.",
    reasoning: "The system checks hours, coverage, and the approved rate card before it replies.",
    tools: "Inbox, HubSpot or Pipedrive, and the live calendar.",
    rule: "Anything outside the rate card or the service area waits for a person.",
  },
  dispatch_quotes: {
    title: "Quoting & Admin Copilot",
    trigger: "A field request arrives with an address and a job type.",
    reasoning: "Coverage is checked, then a structured estimate is drafted from the job history.",
    tools: "ServiceTitan or Jobber, the CRM, and the dispatch board.",
    rule: "Non-standard prices stay in review until a manager approves the draft.",
  },
} as const;

export const SIMULATOR_COPY = {
  eyebrow: "Workflow studio",
  line1: "See how the system runs.",
  line2: "Step by step.",
  subtitle: "Pick an operational track below—or type a realistic request—to inspect the automated decision steps, human approval boundary, and live JSON webhook payload.",
  studioLeft: "relay. / workflow studio",
  studioRight: "Simulated walkthrough · no live messages sent",
  tabs: {
    lead_ops: "01 Sales & Intake",
    client_admin: "02 Client Onboarding",
    dispatch_quotes: "03 Dispatch & Quoting",
    internal_ops: "04 Internal Ops",
  } as Record<IndustryVertical, string>,
  stages: ["1. Request arrives", "2. System replies", "3. Record updated", "4. Outcome confirmed"],
  presetMode: "Sample request",
  customMode: "Write your own",
  placeholder: "e.g., Can you answer new demo requests and book a call if they fit our service area?",
  restart: "Reset",
  runIdle: "Run walkthrough",
  runPlaying: "Running...",
  runReplay: "Run again",
  walkthroughMode: "Walkthrough",
  jsonMode: "JSON Trace",
  approve: "Approve & continue",
  approved: "Approved by operator",
  recordTitle: "System record",
  outcomeTitle: "Outcome & dispatch",
  waiting: "Run the walkthrough to see the outcome.",
  boundaryTitle: "Human override rule",
  boundaryBody: "The system only acts inside approved rules. Sensitive, priced, or incomplete work pauses and waits for your team.",
  footnote: "Simulated example using sample operational data. No external emails, texts, or records are created.",
};

export const CAPABILITIES_COPY = {
  eyebrow: "What we build",
  line1: "Automation systems",
  line2: "for operating teams.",
  subtitle: "We start with the workflow that costs the most time, then connect the records around it so the handoff is visible.",
  cards: [
    { title: "Inbound Lead & Sales Ops", body: "Instant response, qualification, CRM updates, and calendar booking across forms, email, and SMS." },
    { title: "Client Onboarding & Admin", body: "Document collection, data extraction, checklist tracking, and workspace provisioning without manual chasing." },
    { title: "CRM & Systems Integration", body: "Clean two-way syncing between legacy tools, CRMs, billing software, and internal databases." },
    { title: "Internal AI Assistants", body: "Private team assistants grounded strictly in your SOPs, pricing rules, and client history with citations." },
    { title: "Quote & Pipeline Follow-Up", body: "Timed, polite follow-ups on open proposals and unbooked enquiries that stop the instant a client responds." },
    { title: "Human-in-the-Loop Workflows", body: "Explicit approval gates, confidence thresholds, and audit logs so sensitive decisions always stay with your team." },
  ],
};

export const STACK_COPY = {
  eyebrow: "Integrations",
  line1: "Built around the software",
  line2: "your team already uses.",
  subtitle: "We review access, permissions, and the records that matter before anything is connected.",
  pillars: [
    { num: "01", title: "Inbox & messaging", body: "Forms, shared inboxes, and business SMS numbers in one queue." },
    { num: "02", title: "CRM & records", body: "Reads the account first, then writes a structured note back." },
    { num: "03", title: "Calendars & dispatch", body: "Checks real availability before a slot or arrival window is offered." },
    { num: "04", title: "Rules & approvals", body: "Custom prices, missing documents, and edge cases stay with your team." },
  ],
};

export const INTEGRATION_PILLS = ["HubSpot", "Pipedrive", "ServiceTitan", "Jobber", "GoHighLevel", "Google Calendar", "Microsoft Outlook", "Slack", "Notion", "Cal.com"] as const;

export const PROCESS_COPY = {
  eyebrow: "How we work",
  line1: "Scope. Build.",
  line2: "Launch. Support.",
  steps: [
    { num: "01", title: "Scope", lead: "Find the bottleneck.", body: "We map the request path, the tools involved, and the decisions a person still has to make." },
    { num: "02", title: "Build", lead: "Test real cases.", body: "We write the rules, the failure paths, and the approval gates, then run them against examples from your team." },
    { num: "03", title: "Launch", lead: "Connect live tools.", body: "We wire the inbox, CRM, and calendar, then sit with the operators for the first handoffs." },
    { num: "04", title: "Support", lead: "Keep it current.", body: "When pricing, hours, or headcount change, we update the rules and watch the integration errors." },
  ],
};

export const ENGINEERING_COPY = {
  eyebrow: "Why teams work with us",
  line1: "Built by engineers.",
  line2: "Run without babysitting.",
  lead: "You work with the people who design and maintain the system. There is no separate account layer and no prompt your operators cannot inspect.",
  quote: "Good automation should feel quiet. The record stays current, the reply is inside your rules, and a person steps in only when the decision is actually theirs.",
  metrics: [
    { value: "Direct", label: "Scoped and built by the same engineers" },
    { value: "Auditable", label: "Every step written back to your system of record" },
    { value: "Bounded", label: "A human gate when judgment is required" },
  ],
  layers: [
    { layer: "01", title: "Capture", desc: "Forms, email, SMS, and internal questions" },
    { layer: "02", title: "Decision layer", desc: "Rules, citations, and confidence limits" },
    { layer: "03", title: "Execution", desc: "Replies, records, follow-ups, and bookings" },
    { layer: "04", title: "Oversight", desc: "Approvals, logs, and manual takeover" },
  ],
};

export const PRICING_COPY = {
  eyebrow: "Engagement models",
  line1: "Scoped cleanly.",
  line2: "Priced upfront.",
  subtitle: "Start with a focused 5-day workflow audit, ship a single production system at a fixed price, or retain our engineers across multiple departments.",
  recommended: "Recommended",
  monitorNote: "Optional monthly monitoring & tuning",
};

export const PRICING_TIERS = [
  {
    id: "audit",
    kicker: "01 / Workflow Audit",
    title: "5-day technical discovery",
    ideal: "Map bottlenecks, review API/data access, and leave with a prioritized technical build plan.",
    kind: "audit",
    cadence: "one-time · 5 business days",
    featured: false,
    cta: "Book an audit",
    items: [
      "End-to-end operational bottleneck & ROI audit",
      "Review of existing APIs, CRM schemas & permissions",
      "Prioritized 90-day automation architecture roadmap",
      "Fixed build estimates & security boundary plan",
      "100% credited if you proceed to a build within 30 days",
    ],
  },
  {
    id: "build",
    kicker: "02 / Production System",
    title: "Single end-to-end build",
    ideal: "One end-to-end AI workflow engineered, tested on real data, and connected to your live tools.",
    kind: "build",
    cadence: "one-time build",
    featured: true,
    cta: "Scope a build",
    items: [
      "One complete AI workflow engineered & QA tested",
      "Two-way integration with your live CRM, inbox & tools",
      "Custom guardrails, error retries & human approval gates",
      "Operator handover walkthrough & full documentation",
      "Optional monthly monitoring & tuning",
    ],
  },
  {
    id: "partner",
    kicker: "03 / Embedded AI Partner",
    title: "Multi-system automation",
    ideal: "Dedicated systems engineering across sales ops, onboarding, internal copilots, and custom pipelines.",
    kind: "partner",
    cadence: "monthly",
    featured: false,
    cta: "Discuss partnership",
    items: [
      "Ongoing engineering across sales, admin & internal ops",
      "Custom agent teams, document pipelines & copilots",
      "Direct Slack or Teams channel with your build engineers",
      "Proactive model evaluation, monitoring & uptime alerts",
      "Rolling quarterly or monthly terms—no 12-month lock-in",
    ],
  },
] as const;

export const FAQ_COPY = {
  eyebrow: "Questions",
  heading: "Straight answers.",
  subtitle: "The practical questions operators ask before a build starts.",
};

export const FAQ_ITEMS = [
  { question: "Will the replies sound like a generic chatbot?", answer: "No. Each workflow is written around your services, tone, and the questions your team already answers. Messages stay short and specific." },
  { question: "Do we have to replace our CRM or calendar?", answer: "No. We connect to the system of record you already use. If the tool is older or custom, we look at its API or webhook during the audit." },
  { question: "What happens on a sensitive or unusual request?", answer: "The workflow stops. It tells the person we have the request, alerts your team with the full context, and does not invent a price or a promise." },
  { question: "How long does a build take?", answer: "A single production workflow is usually live within two weeks of kickoff, once we have access and a sign-off. Multi-system work is scoped with milestones first." },
  { question: "How do opt-outs and quiet hours work?", answer: "Messaging is permission-based. Quiet hours, sender registration where it is required, and STOP handling are part of the system, not an afterthought." },
  { question: "What if someone stops replying?", answer: "A short sequence of spaced check-ins can continue, and it ends the moment they reply, book, or opt out." },
  { question: "Can our team take over a thread?", answer: "Yes. Every workflow has a manual takeover. When someone on your team steps in, the automation yields." },
  { question: "Is there a long contract?", answer: "The audit and the production build are fixed fees. Ongoing monitoring, when you want it, is month to month with 14 days' notice." },
];

export const CONTACT_STRIP = [
  { label: "Email us", sub: "Tell us which workflow is eating the week.", value: "hello@relayops.io", href: "mailto:hello@relayops.io" },
  { label: "Where we work", sub: "Remote engineering, in your timezone.", value: "United States & United Kingdom", href: null },
  { label: "Introductory call", sub: "A working session, not a pitch.", value: "15 minutes · Clear scope", href: null },
] as const;

export const FORM_COPY = {
  eyebrow: "Start a conversation",
  line1: "Tell us which workflow",
  line2: "should run itself.",
  subtitle: "A few details are enough. We follow up to book a short technical walkthrough.",
  fullNameLabel: "Full name *",
  fullNamePlaceholder: "Alex Morgan",
  emailLabel: "Work email *",
  emailPlaceholder: "alex@company.com",
  businessLabel: "Company name *",
  businessPlaceholder: "Northline Ops",
  phoneLabel: "Phone (optional)",
  phoneHelper: "Used only to coordinate the call. Text updates are sent only if you opt in.",
  teamLabel: "Team size *",
  focusLabel: "What do you want to automate first? *",
  toolsLabel: "Current tools (optional)",
  toolsPlaceholder: "e.g., HubSpot, ServiceTitan, Google Calendar",
  windowLabel: "Preferred call window *",
  notesLabel: "Briefly describe the workflow eating your team's time (optional)",
  notesPlaceholder: "e.g., New demo requests sit overnight and nobody updates the CRM.",
  smsConsent: "Optional text updates: I agree to receive SMS confirmations and call reminders from Relay Systems at the number above. Message frequency varies; message and data rates may apply. Reply STOP to opt out or HELP for help. Consent is optional.",
  privacyLead: "I agree to the ",
  privacyMid: " and ",
  privacyTail: ".",
  submitIdle: "Request a call",
  submitBusy: "Sending...",
  confirmBadge: "Enquiry received",
  confirmTitle: "Thanks—we've received your details.",
  confirmBody: "Your request is logged and a confirmation email is on its way. We will follow up shortly to confirm a time.",
  confirmRefLabel: "Reference",
  confirmWindowLabel: "Preferred window",
  confirmStatusLabel: "Status",
  confirmStatus: "Confirmation queued",
  embedPrompt: "Or choose a 15-minute slot directly below:",
  errors: {
    full_name: "Please enter your full name (2–120 characters).",
    work_email: "Please enter a valid work email address.",
    phone: "Please enter a valid US or UK phone number (10–15 digits).",
    business_name: "Please enter your company name (2–160 characters).",
    privacy_consent: "You must agree to the Privacy Policy and Terms of Service to continue.",
    sms_phone: "Please provide a phone number to enable optional text updates.",
  },
};

export const TEAM_OPTIONS: Array<{ value: TeamSize; label: string }> = [
  { value: "1_to_10", label: "1–10" },
  { value: "11_to_50", label: "11–50" },
  { value: "51_to_200", label: "51–200" },
  { value: "200_plus", label: "200+" },
];

export const FOCUS_OPTIONS: Array<{ value: AutomationFocus; label: string }> = [
  { value: "inbound_leads", label: "Inbound leads & sales" },
  { value: "client_onboarding", label: "Client onboarding & admin" },
  { value: "crm_data_sync", label: "CRM & data sync" },
  { value: "internal_assistant", label: "Internal AI assistant" },
  { value: "custom_workflow", label: "Custom multi-step workflow" },
];

export const WINDOW_OPTIONS: Array<{ value: PreferredTimeWindow; label: string }> = [
  { value: "first_available", label: "First available" },
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Late afternoon" },
];

export const FOOTER_LINKS = [
  { label: "Services", href: "/#capabilities" },
  { label: "Work", href: "/#systems" },
  { label: "Workflow Studio", href: "/#simulator" },
  { label: "Process", href: "/#process" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Admin Console", href: "/admin" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
] as const;

export const FOOTER_COPY = {
  summary: "Custom AI automation and operational systems for US and UK businesses.",
  email: "hello@relayops.io",
  location: "United States & United Kingdom",
  copyright: "© 2026 Relay Systems. All rights reserved.",
};

export const NOT_FOUND_COPY = {
  badge: "404",
  heading: "Page not found.",
  body: "The page you are looking for does not exist or has moved.",
  cta: "Back to homepage",
};

export interface LegalClause {
  heading: string;
  body: string;
  highlight?: boolean;
}

export const PRIVACY_CLAUSES: LegalClause[] = [];
export const TERMS_CLAUSES: LegalClause[] = [];
