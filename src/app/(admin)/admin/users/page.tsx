"use client";

import { useState } from "react";
import { UserCheck, UserX, FileCheck, Tractor, Truck, Store } from "lucide-react";
import { toast } from "sonner";
import { PortalShell, PortalHero } from "@/components/portals";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MOCK_KYC_QUEUE, type KycApplicant } from "@/lib/mock-data";

type RoleFilter = "all" | KycApplicant["role"];

const tabs: { key: RoleFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "farmer", label: "Farmers" },
  { key: "delivery", label: "Delivery" },
  { key: "buyer", label: "Buyers" },
];

const roleIcon: Record<KycApplicant["role"], React.ReactNode> = {
  farmer: <Tractor className="h-4 w-4 text-[#2E7D32]" />,
  delivery: <Truck className="h-4 w-4 text-[#7C3AED]" />,
  buyer: <Store className="h-4 w-4 text-[#1D4ED8]" />,
};

const roleTone: Record<KycApplicant["role"], string> = {
  farmer: "bg-[#E8F5E9] text-[#1B5E20]",
  delivery: "bg-[#EDE9FE] text-[#5B21B6]",
  buyer: "bg-[#DBEAFE] text-[#1E3A8A]",
};

function KycCard({
  applicant,
  onDecision,
}: {
  applicant: KycApplicant;
  onDecision: (id: string, approved: boolean, name: string) => void;
}) {
  return (
    <Card className="shadow-sm">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="shrink-0 rounded-lg bg-[#F9FAFB] p-1.5">{roleIcon[applicant.role]}</span>
              <p className="truncate font-heading text-base font-bold text-[#1F2937]">{applicant.name}</p>
            </div>
            <p className="mt-1 text-xs text-[#6B7280]">
              {applicant.district} · submitted {applicant.submittedAgo}
            </p>
          </div>
          <Badge className={cn("shrink-0 capitalize font-semibold", roleTone[applicant.role])}>
            {applicant.role}
          </Badge>
        </div>

        <div>
          <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">
            Documents
          </div>
          <ul className="space-y-1.5">
            {applicant.documents.map((d) => (
              <li key={d} className="flex items-center gap-2 text-sm text-[#374151]">
                <FileCheck className="h-4 w-4 shrink-0 text-[#16A34A]" />
                {d}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            className="min-h-[44px] bg-[#2E7D32] font-heading font-bold hover:bg-[#1B5E20]"
            onClick={() => onDecision(applicant.id, true, applicant.name)}
          >
            <UserCheck className="mr-1.5 h-4 w-4" />
            Approve
          </Button>
          <Button
            variant="destructive"
            className="min-h-[44px] font-heading font-bold"
            onClick={() => onDecision(applicant.id, false, applicant.name)}
          >
            <UserX className="mr-1.5 h-4 w-4" />
            Reject
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminUsersPage() {
  const [queue, setQueue] = useState<KycApplicant[]>(MOCK_KYC_QUEUE);
  const [filter, setFilter] = useState<RoleFilter>("all");

  const decide = (id: string, approved: boolean, name: string) => {
    setQueue((q) => q.filter((a) => a.id !== id));
    if (approved) toast.success(`${name} approved — KYC verified`);
    else toast.error(`${name} rejected — applicant notified`);
  };

  const visible = queue.filter((a) => filter === "all" || a.role === filter);

  return (
    <PortalShell accent="admin">
      <div className="space-y-5">
        <PortalHero
          eyebrow="Identity"
          title="KYC Verification Queue"
          subtitle="Every applicant below has documents on file. Approve to activate the account, reject to bounce it back with reasons."
          stats={[
            { label: "Pending review", value: String(queue.length) },
            { label: "Farmers", value: String(queue.filter((a) => a.role === "farmer").length) },
            { label: "Delivery", value: String(queue.filter((a) => a.role === "delivery").length) },
            { label: "Buyers", value: String(queue.filter((a) => a.role === "buyer").length) },
          ]}
        />

        {/* Role filter tabs */}
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setFilter(t.key)}
              className={cn(
                "min-h-[44px] shrink-0 rounded-full px-5 text-sm font-semibold transition-all",
                filter === t.key
                  ? "bg-[var(--portal-dark)] text-white shadow-sm"
                  : "bg-white text-[#4B5563] border border-[#E5E7EB] hover:border-[var(--portal)]"
              )}
            >
              {t.label}
              <span className="ml-1.5 opacity-70">
                {t.key === "all" ? queue.length : queue.filter((a) => a.role === t.key).length}
              </span>
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <div className="rounded-2xl border border-[#BBF7D0] bg-[#F0FDF4] p-8 text-center">
            <UserCheck className="mx-auto h-10 w-10 text-[#16A34A]" />
            <p className="mt-2 font-heading text-lg font-bold text-[#1F2937]">Queue clear</p>
            <p className="mx-auto mt-1 max-w-md text-sm text-[#4B5563]">
              No pending KYC applications for this filter. New applications land here as soon as they are submitted.
            </p>
            <a
              href="/admin/dashboard"
              className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[var(--portal-dark)] px-5 font-heading text-sm font-bold text-white transition-transform active:scale-95"
            >
              Back to ops console
            </a>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((a) => (
              <KycCard key={a.id} applicant={a} onDecision={decide} />
            ))}
          </div>
        )}
      </div>
    </PortalShell>
  );
}
