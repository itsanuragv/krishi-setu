"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Gavel,
  UserCheck,
  Flag,
  ArrowRight,
  CircleAlert,
  CheckCircle2,
  ShieldAlert,
  Wallet,
  PackagePlus,
} from "lucide-react";
import { toast } from "sonner";
import { PortalShell, PortalHero, HealthKpis } from "@/components/portals";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatInr } from "@/lib/utils";
import {
  MOCK_DISPUTES,
  MOCK_ACTIVITY_FEED,
  GMV_TICKER_START,
} from "@/lib/portal-mocks/admin";
import { MOCK_FRAUD_SIGNALS, MOCK_HEALTH_KPIS, MOCK_KYC_QUEUE } from "@/lib/mock-data";

const FLAGGED_LISTINGS = 3;

function useGmvTicker() {
  const [gmv, setGmv] = useState(GMV_TICKER_START);
  useEffect(() => {
    const id = setInterval(() => {
      setGmv((g) => g + 800 + Math.floor(Math.random() * 1600));
    }, 2500);
    return () => clearInterval(id);
  }, []);
  return gmv;
}

const queueCards = [
  {
    icon: <Gavel className="h-6 w-6 text-[#DC2626]" />,
    count: MOCK_DISPUTES.length,
    label: "Open disputes",
    sub: "₹7,91,400 escrow locked",
    href: "/admin/disputes",
    tone: "border-[#FECACA] bg-[#FEF2F2] hover:border-[#DC2626]",
  },
  {
    icon: <UserCheck className="h-6 w-6 text-[#D97706]" />,
    count: MOCK_KYC_QUEUE.length,
    label: "KYC pending",
    sub: "Oldest waiting 1 day",
    href: "/admin/users",
    tone: "border-[#FDE68A] bg-[#FFFBEB] hover:border-[#D97706]",
  },
  {
    icon: <Flag className="h-6 w-6 text-[#D97706]" />,
    count: FLAGGED_LISTINGS,
    label: "Flagged listings",
    sub: `${MOCK_FRAUD_SIGNALS.length} fraud signals active`,
    href: "/admin/fraud-review",
    tone: "border-[#FDE68A] bg-[#FFFBEB] hover:border-[#D97706]",
  },
];

const activityIcon: Record<string, React.ReactNode> = {
  dispute: <Gavel className="h-4 w-4 text-[#DC2626]" />,
  kyc: <UserCheck className="h-4 w-4 text-[#D97706]" />,
  fraud: <ShieldAlert className="h-4 w-4 text-[#7C3AED]" />,
  payout: <Wallet className="h-4 w-4 text-[#16A34A]" />,
  listing: <PackagePlus className="h-4 w-4 text-[#2563EB]" />,
};

export default function AdminDashboardPage() {
  const gmv = useGmvTicker();

  return (
    <PortalShell accent="admin">
      <div className="space-y-5">
        <PortalHero
          eyebrow="Admin console"
          title="Ops Console"
          subtitle="Triage-first view of everything that needs a decision right now. Nothing here is auto-resolved — every rupee moves because you moved it."
          stats={[
            { label: "GMV today (live)", value: formatInr(gmv) },
            { label: "Open disputes", value: String(MOCK_DISPUTES.length) },
            { label: "KYC pending", value: String(MOCK_KYC_QUEUE.length) },
            { label: "Fraud flags", value: String(MOCK_FRAUD_SIGNALS.length) },
          ]}
        />

        {/* Needs decision NOW */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <CircleAlert className="h-5 w-5 text-[#DC2626]" />
            <h2 className="font-heading text-lg font-bold text-[#1F2937]">Needs decision NOW</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {queueCards.map((q) => (
              <Link
                key={q.label}
                href={q.href}
                className={cn(
                  "flex items-center gap-4 rounded-2xl border-2 p-4 shadow-sm transition-all hover:shadow-md",
                  q.tone
                )}
              >
                <span className="shrink-0 rounded-xl bg-white p-2.5 shadow-sm">{q.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="font-heading text-2xl font-bold text-[#1F2937]">{q.count}</div>
                  <div className="text-sm font-semibold text-[#1F2937]">{q.label}</div>
                  <div className="text-xs text-[#6B7280]">{q.sub}</div>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 text-[#6B7280]" />
              </Link>
            ))}
          </div>
        </section>

        <HealthKpis kpis={MOCK_HEALTH_KPIS} />

        {/* Recent activity */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="font-heading text-base font-bold">Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="divide-y divide-[#F3F4F6]">
              {MOCK_ACTIVITY_FEED.map((a) => (
                <li key={a.id} className="flex items-start gap-3 py-2.5">
                  <span className="mt-0.5 shrink-0 rounded-lg bg-[#F9FAFB] p-1.5">
                    {activityIcon[a.kind]}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-[#374151]">{a.text}</p>
                    <p className="text-xs text-[#9CA3AF]">{a.time}</p>
                  </div>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => toast.message("Full audit log exports from the backend admin service.")}
              className="mt-2 text-sm font-semibold text-[var(--portal-dark)] hover:underline"
            >
              View full audit log →
            </button>
          </CardContent>
        </Card>

        <div className="flex items-center gap-2 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] p-3 text-sm text-[#166534]">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          Auto-moderation is healthy: 64% of disputes resolved without human touch. The queue above is everything left.
        </div>
      </div>
    </PortalShell>
  );
}
