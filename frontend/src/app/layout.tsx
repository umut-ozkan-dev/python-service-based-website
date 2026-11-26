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
  title: "Relay | AI Automation Agency — Production Systems for Operations",
  description:
    "We design, build, and maintain custom AI workflows for growing businesses—connecting your inbox, CRM, documents, and internal tools with clear human oversight.",
  openGraph: {
    title: "Relay | AI Automation Agency — Production Systems for Operations",
    description: "Custom AI workflows for growing businesses, with clear human oversight.",
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
