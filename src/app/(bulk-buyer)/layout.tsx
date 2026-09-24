import type { Metadata } from "next";
import { AppShell } from "@/components/shared/app-shell";

export const metadata: Metadata = {
  title: "Bulk Agribusiness & HoReCa Procurement Highway",
  description:
    "Source verified metric-ton agricultural produce directly from FPOs and progressive farmers with escrow-backed contracts and OpenCV quality assurance.",
  openGraph: {
    title: "Bulk Buyer Procurement | Krishi Setu (कृषि सेतु)",
    description: "Direct B2B agri-procurement with real-time quality grading and transparent logistics.",
  },
};

export default function BuyerLayout({ children }: { children: React.ReactNode }) {
  return <AppShell role="bulk_buyer">{children}</AppShell>;
}
