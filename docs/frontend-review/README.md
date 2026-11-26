# Relay60 frontend review packet

Captured 25 Nov 2026 from the local production build at `http://127.0.0.1:3000`, with the API on `http://127.0.0.1:8000`. Desktop frames are 1440×900. The phone frame is 390×844 and does not scroll sideways (`scrollWidth` equals `clientWidth`).

This pass keeps the obsidian studio layout and replaces the marketing copy. The FastAPI backend was not edited. `/privacy` and `/terms` still render an empty page. There is no announcement bar, no ROI calculator, no Double-Lock guarantee, and no fake phone lines in the footer.

## Page order

1. Hero with the orbital chronometer
2. Selected builds
3. Live walkthrough
4. Capabilities
5. Integrations
6. Process
7. Engineering
8. Pricing
9. FAQ
10. Intake

## Screenshots

### Hero

`relay60.` pill navbar: Services, Industries, Work, Process, Pricing, and Book a call. No currency switcher. Chronometer reads `08s` / Enquiry answered, with WEB, SMS, and MAIL nodes. Pause motion is at the bottom right.

![Hero](screenshots/01-hero.png)

### Services menu

Six items: Inbound Lead Response, Appointment Booking, CRM & Admin Automation, Quote & Lead Follow-Up, Internal Team Assistants, Custom Workflow Builds. Footer link: “See a workflow in action.”

![Services menu](screenshots/02-services-menu.png)

### Industries menu

Dental & Private Clinics, Aesthetics & Med Spas, Home Services & Trades, Physio, Legal & Advisory. The chronometer has advanced to `23s` / Details qualified.

![Industries menu](screenshots/03-industries-menu.png)

### Selected builds, US

Client Intake shows 14s median reply, 94% handled automatically, 38 bookings this week, and **$41,850** booked pipeline. After-hours desk shows the amber review gate for a SW11 boiler quote, with Send quote and Take over.

![Systems, US](screenshots/04-systems.png)

### Selected builds, UK

Same dashboards after the pricing switcher is set to UK. Booked pipeline reads **£32,900**.

![Systems, UK](screenshots/12-systems-uk.png)

### Live walkthrough

The studio calls the simulation API and shows the US dental SMS sample end to end: enquiry, 08s reply, 23s qualification, 39s CRM record, 51s calendar booking. The sidebar is labeled “CRM record created” and “Calendar booking.” The compliance footer is not rendered. Sample CRM text still contains the API’s fictional `555-0148` contact, which is response data, not a site phone number.

![Walkthrough](screenshots/05-walkthrough.png)

### Capabilities

Six hairline cells: inbound response, diary booking, CRM admin, follow-up, internal assistants, custom workflow engineering.

![Capabilities](screenshots/06-capabilities.png)

### Integrations

Four pillars plus HubSpot, GoHighLevel, ServiceTitan, Jobber, Pipedrive, Clio, Cliniko, Google Calendar, Microsoft Outlook, and Cal.com.

![Integrations](screenshots/07-integrations.png)

### Process

Scope, Build, Launch, Support.

![Process](screenshots/08-process.png)

### Engineering

Direct / Auditable / Bounded, and a four-layer stack: Capture, Decision layer, Execution, Oversight.

![Engineering](screenshots/09-engineering.png)

### Pricing, US

Single-Workflow Build is **$497/month** with a **$995** build. Multi-Site is **From $897/month**, build from **$1,795**. The guarantee box is gone. The note under the cards is the 15-minute scope line. Both buttons sit on the same baseline.

![Pricing, US](screenshots/10-pricing-us.png)

### Pricing, UK

**£397/month** and **£795** build. Multi-Site is **From £697/month**, build from **£1,450**.

![Pricing, UK](screenshots/11-pricing-uk.png)

### FAQ

Sticky “Straight answers.” column and a hairline accordion. The first answer is open.

![FAQ](screenshots/13-faq.png)

### Intake

Three contact cards, then the form. There is no website field. Tools and preferred window share one row. SMS consent is optional and unchecked. Privacy and terms are linked. This frame was taken after the UK switch, so the phone placeholder is `+44 7700 900123`.

![Intake](screenshots/14-intake.png)

### Intake validation

Submitting the empty form shows the five existing errors: full name, work email, phone, company name, and privacy consent.

![Intake validation](screenshots/16-intake-validation.png)

### Footer

Email, “United States & United Kingdom,” and links for Services, Work, Walkthrough, Process, Pricing, Privacy Policy, and Terms of Service. No phone numbers. Copyright is “© 2026 Relay60. All rights reserved.”

![Footer](screenshots/15-footer.png)

### Empty legal pages

`/privacy` and `/terms` render the navbar and footer only. The page body is empty.

![Privacy](screenshots/17-privacy.png)

![Terms](screenshots/18-terms.png)

### 404

“Page not found.” with “Back to homepage.”

![404](screenshots/19-not-found.png)

### Phone, 390×844

The hero stacks: headline, chronometer, then the studio pill. The menu lists the six services, four industries, Work, Process, Pricing, and Book a call. No horizontal overflow.

![Mobile hero](screenshots/20-mobile-hero.png)

![Mobile menu](screenshots/21-mobile-menu.png)
