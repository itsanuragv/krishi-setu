import type { Metadata, Viewport } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import { Toaster } from "sonner";
import { MswProvider } from "@/lib/msw-provider";
import { QueryProvider } from "@/lib/query-provider";
import { LanguageProvider } from "@/context/LanguageContext";
import { VoiceAssistant } from "@/components/shared/voice-assistant";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#059669",
};

export const metadata: Metadata = {
  title: "Krishi Setu (कृषि सेतु) | Bharat's Direct Farm-to-Buyer Digital Highway",
  description:
    "Direct farm-to-kitchen digital marketplace connecting smallholder farmers with consumers, retail grocers, and HoReCa buyers with vernacular voice AI, OpenCV quality pre-check, and smart escrow payments.",
  keywords: [
    "Krishi Setu",
    "कृषि सेतु",
    "Kisan Mitra",
    "agritech marketplace",
    "farm to kitchen",
    "direct farm produce",
    "FPO procurement",
    "mandi rates",
    "hyperlocal agritech",
  ],
  authors: [{ name: "Krishi Setu Network" }],
  openGraph: {
    title: "Krishi Setu (कृषि सेतु) — Direct Farm-to-Buyer Marketplace",
    description:
      "Empowering Indian farmers with direct farm-gate sales, OpenCV quality grading, and guaranteed UPI escrow settlement.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${fraunces.variable} antialiased`}>
        <MswProvider>
          <QueryProvider>
            <LanguageProvider>
              {children}
              <VoiceAssistant />
              <Toaster richColors position="top-center" />
            </LanguageProvider>
          </QueryProvider>
        </MswProvider>
      </body>
    </html>
  );
}
