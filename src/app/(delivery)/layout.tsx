import type { Metadata } from "next";
import { AppShell } from "@/components/shared/app-shell";

export const metadata: Metadata = {
  title: "Delivery Partner & Rural Logistics Highway",
  description:
    "Logistics tracking, batch route optimization, and instant per-trip payout settlement for farm-to-door delivery partners.",
  openGraph: {
    title: "Logistics Partner Portal | Krishi Setu (कृषि सेतु)",
    description: "Earn guaranteed per-km compensation connecting local farms with city hubs and doorstep consumers.",
  },
};

export default function DeliveryLayout({ children }: { children: React.ReactNode }) {
  return <AppShell role="delivery">{children}</AppShell>;
}
