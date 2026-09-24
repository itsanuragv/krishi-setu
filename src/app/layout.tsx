import type { Metadata, Viewport } from "next";
import { DM_Sans, Fraunces, Noto_Sans_Devanagari } from "next/font/google";
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

const notoDevanagari = Noto_Sans_Devanagari({
  variable: "--font-noto-devanagari",
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#059669",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://krishi-setu-lovat.vercel.app"),
  title: {
    default: "Krishi Setu (कृषि सेतु) | Bharat's Direct Farm-to-Buyer Digital Highway",
    template: "%s | Krishi Setu (कृषि सेतु)",
  },
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
    "fresh vegetables India",
    "organic produce direct",
    "Agmarknet prices live",
  ],
  authors: [{ name: "Krishi Setu Network", url: "https://krishi-setu-lovat.vercel.app" }],
  creator: "Krishi Setu Team",
  publisher: "Krishi Setu Network",
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: "/",
    languages: {
      "en-IN": "/",
      "hi-IN": "/",
    },
  },
  openGraph: {
    title: "Krishi Setu (कृषि सेतु) — Direct Farm-to-Buyer Marketplace",
    description:
      "Empowering Indian farmers with direct farm-gate sales, OpenCV quality grading, and guaranteed UPI escrow settlement.",
    url: "https://krishi-setu-lovat.vercel.app",
    siteName: "Krishi Setu (कृषि सेतु)",
    images: [
      {
        url: "/kisan-setu-emblem.png",
        width: 800,
        height: 800,
        alt: "Krishi Setu Emblem & Agri Network",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Krishi Setu (कृषि सेतु) — Direct Farm-to-Buyer Marketplace",
    description:
      "Direct farm-to-kitchen marketplace connecting smallholder farmers with buyers via voice AI, OpenCV grading, and UPI escrow.",
    images: ["/kisan-setu-emblem.png"],
    creator: "@KrishiSetu",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/kisan-setu-emblem.png", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/kisan-setu-emblem.png",
    apple: "/kisan-setu-emblem.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${fraunces.variable} ${notoDevanagari.variable} antialiased`}>
        <MswProvider>
          <QueryProvider>
            <LanguageProvider>
              {children}
              <VoiceAssistant />
              <Toaster
                richColors
                position="top-center"
                offset="92px"
                mobileOffset="86px"
              />
            </LanguageProvider>
          </QueryProvider>
        </MswProvider>
      </body>
    </html>
  );
}
