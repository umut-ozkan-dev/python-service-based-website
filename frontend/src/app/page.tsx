import { CapabilitiesSection } from "@/components/sections/CapabilitiesSection";
import { ConnectedStackSection } from "@/components/sections/ConnectedStackSection";
import { EngineeringStandardSection } from "@/components/sections/EngineeringStandardSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { LeadBookingSection } from "@/components/sections/LeadBookingSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { SystemsShowcaseSection } from "@/components/sections/SystemsShowcaseSection";
import { FAQ_ITEMS } from "@/lib/copy";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      name: "Relay Systems AI Automation",
      provider: {
        "@type": "Organization",
        name: "Relay Systems",
        url: "https://relayops.io",
        email: "hello@relayops.io",
      },
      areaServed: ["US", "GB"],
      serviceType: "AI Workflow Automation, Inbound Operations, CRM Integration, and Appointment Booking",
      offers: [
        { "@type": "Offer", price: "4500", priceCurrency: "USD" },
        { "@type": "Offer", price: "3500", priceCurrency: "GBP" },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ_ITEMS.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HeroSection />
      <SystemsShowcaseSection />
      <CapabilitiesSection />
      <ConnectedStackSection />
      <ProcessSection />
      <EngineeringStandardSection />
      <PricingSection />
      <FaqSection />
      <LeadBookingSection />
    </>
  );
}
