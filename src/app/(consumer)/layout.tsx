import type { Metadata } from "next";
import { AppShell } from "@/components/shared/app-shell";

export const metadata: Metadata = {
  title: "Farm-Fresh Grocery & Direct Kitchen Marketplace",
  description:
    "Order pesticide-conscious farm produce directly from verified local farmers within 50km with same-day hyper-local delivery and UPI payment.",
  openGraph: {
    title: "Fresh Farm Store | Krishi Setu (कृषि सेतु)",
    description: "Farm-to-kitchen produce delivered fresh within hours directly from verified farmers.",
  },
};

export default function ConsumerLayout({ children }: { children: React.ReactNode }) {
  return <AppShell role="consumer">{children}</AppShell>;
}
