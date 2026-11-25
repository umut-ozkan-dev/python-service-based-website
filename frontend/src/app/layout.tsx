import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { RegionProvider } from "@/context/RegionContext";

import "./globals.css";

const headingFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const sansFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Relay60 | Done-For-You 60-Second AI Lead Response & Booking for US & UK Businesses",
  description:
    "Never lose another enquiry to a slow callback. Relay60 answers Web Form, SMS, and Email leads in under 60 seconds, syncs your CRM, and books appointments 24/7.",
  openGraph: {
    title: "Relay60 — Every Enquiry Answered, Qualified & Booked in Under 60 Seconds",
    description:
      "Done-for-you 60-second AI lead response, CRM logging, and calendar booking for appointment-based businesses in the US & UK.",
    type: "website",
    siteName: "Relay60",
  },
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${headingFont.variable} ${sansFont.variable} ${monoFont.variable}`}>
      <body className="flex min-h-screen flex-col bg-[#040507] font-sans text-slate-100 antialiased selection:bg-sky-400/25 selection:text-white">
        <RegionProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </RegionProvider>
      </body>
    </html>
  );
}
