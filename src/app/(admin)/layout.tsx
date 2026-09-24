import type { Metadata } from "next";
import { AppShell } from "@/components/shared/app-shell";

export const metadata: Metadata = {
  title: "Admin & Escrow Dispute Operations Console",
  description: "Internal risk monitoring, mandi rate sync, KYC verification, and dispute resolution platform.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AppShell role="admin">{children}</AppShell>;
}
