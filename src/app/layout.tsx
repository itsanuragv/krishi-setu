import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import { Toaster } from "sonner";
import { MswProvider } from "@/lib/msw-provider";
import { QueryProvider } from "@/lib/query-provider";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Krishi Setu",
  description:
    "Bharat's direct farm-to-kitchen marketplace with vernacular voice listing, OpenCV quality pre-checks, PostGIS hyperlocal matching, and UPI escrow settlement.",
  openGraph: {
    title: "Krishi Setu",
    description:
      "Bharat's direct farm-to-kitchen marketplace with vernacular voice listing, OpenCV quality pre-checks, PostGIS hyperlocal matching, and UPI escrow settlement.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${fraunces.variable} antialiased`}>
        <MswProvider>
          <QueryProvider>
            {children}
            <Toaster richColors position="top-center" />
          </QueryProvider>
        </MswProvider>
      </body>
    </html>
  );
}
