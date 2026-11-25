import { CapabilitiesSection } from "@/components/sections/CapabilitiesSection";
import { ConnectedStackSection } from "@/components/sections/ConnectedStackSection";
import { EngineeringStandardSection } from "@/components/sections/EngineeringStandardSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { LeadBookingSection } from "@/components/sections/LeadBookingSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { RoiCalculatorSection } from "@/components/sections/RoiCalculatorSection";
import { SimulatorSection } from "@/components/sections/SimulatorSection";
import { SystemsShowcaseSection } from "@/components/sections/SystemsShowcaseSection";
import { FAQ_ITEMS } from "@/lib/copy";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      name: "Relay60 Done-For-You 60-Second AI Lead Response",
      provider: {
        "@type": "Organization",
        name: "Relay60",
        url: "https://relay60.com",
        email: "hello@relay60.com",
      },
      areaServed: ["US", "GB"],
      serviceType: "Automated Lead Response, CRM Integration, and Appointment Scheduling",
      offers: [
        { "@type": "Offer", price: "497", priceCurrency: "USD" },
        { "@type": "Offer", price: "397", priceCurrency: "GBP" },
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
      <SimulatorSection />
      <CapabilitiesSection />
      <ConnectedStackSection />
      <ProcessSection />
      <RoiCalculatorSection />
      <EngineeringStandardSection />
      <PricingSection />
      <FaqSection />
      <LeadBookingSection />
    </>
  );
}
