import type { Metadata } from "next";
import { AppShell } from "@/components/shared/app-shell";

export const metadata: Metadata = {
  title: "Kisan Portal & Direct Farm Selling",
  description:
    "Direct harvest listing, real-time Agmarknet mandi benchmarks, vernacular voice AI assistant, and guaranteed UPI escrow settlement for farmers.",
  openGraph: {
    title: "Kisan Portal | Krishi Setu (कृषि सेतु)",
    description: "Sell harvest directly at 20-30% higher margins with OpenCV AI quality grading and escrow payment guarantee.",
  },
};

export default function FarmerLayout({ children }: { children: React.ReactNode }) {
  return <AppShell role="farmer">{children}</AppShell>;
}
