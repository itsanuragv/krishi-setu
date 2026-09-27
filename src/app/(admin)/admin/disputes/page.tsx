"use client";

import { useState } from "react";
import { Gavel, Clock, CheckCircle2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { PortalShell, PortalHero, CaseFile } from "@/components/portals";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, formatInr } from "@/lib/utils";
import { MOCK_DISPUTES, DISPUTE_WAIT } from "@/lib/portal-mocks/admin";
import type { DisputeCase } from "@/lib/mock-data";

type Status = DisputeCase["status"];

const statusTone: Record<Status, string> = {
  "Pending Mediation": "bg-[#FEF3C7] text-[#92400E]",
  "Resolved - Payout Completed": "bg-[#E8F5E9] text-[#1B5E20]",
  "Split Mediated": "bg-[#DBEAFE] text-[#1E3A8A]",
};

export default function AdminDisputesPage() {
  const [cases, setCases] = useState<DisputeCase[]>(MOCK_DISPUTES);
  const [selectedId, setSelectedId] = useState<string>(MOCK_DISPUTES[0].id);
  const selected = cases.find((c) => c.id === selectedId) ?? cases[0];

  const resolve = (id: string, status: Status, message: string) => {
    setCases((cs) => cs.map((c) => (c.id === id ? { ...c, status } : c)));
    toast.success(message);
  };

  return (
    <PortalShell accent="admin">
      <div className="space-y-5">
        <PortalHero
          eyebrow="Disputes"
          title="Dispute Queue"
          subtitle="Dense mediation console: pick a case, review the evidence, move the escrow. AI analysis is advisory — the decision is yours."
          stats={[
            { label: "Open cases", value: String(cases.filter((c) => c.status === "Pending Mediation").length) },
            {
              label: "Escrow locked",
              value: formatInr(cases.filter((c) => c.status === "Pending Mediation").reduce((s, c) => s + c.escrowAmount, 0)),
            },
          ]}
        />

        <Card className="shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB] text-left text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                    <th className="px-4 py-3">Case</th>
                    <th className="px-4 py-3">Crop / lot</th>
                    <th className="px-4 py-3">Parties</th>
                    <th className="px-4 py-3 text-right">Escrow</th>
                    <th className="px-4 py-3">Waiting</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3F4F6]">
                  {cases.map((c) => (
                    <tr
                      key={c.id}
                      onClick={() => setSelectedId(c.id)}
                      className={cn(
                        "cursor-pointer transition-colors hover:bg-[#F8FAFC]",
                        c.id === selectedId && "bg-[var(--portal-soft)]"
                      )}
                    >
                      <td className="px-4 py-3">
                        <div className="font-semibold text-[#1F2937]">{c.id}</div>
                        <div className="text-xs text-[#9CA3AF]">{c.orderNumber}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-[#374151]">{c.cropName}</div>
                        <div className="text-xs text-[#9CA3AF]">{c.batchWeight}</div>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#4B5563]">
                        <div className="font-medium text-[#374151]">{c.farmer.name}</div>
                        <div>vs {c.buyer.name}</div>
                      </td>
                      <td className="px-4 py-3 text-right font-bold font-heading text-[#1F2937]">
                        {formatInr(c.escrowAmount)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-xs text-[#D97706]">
                          <Clock className="h-3.5 w-3.5" />
                          {c.status === "Pending Mediation" ? DISPUTE_WAIT[c.id] ?? "—" : "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={cn("font-semibold", statusTone[c.status])}>{c.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {selected && (
          <div className="flex items-center gap-2">
            <Gavel className="h-5 w-5 text-[var(--portal-dark)]" />
            <h2 className="font-heading text-lg font-bold text-[#1F2937]">
              Case file — {selected.id}
            </h2>
          </div>
        )}

        {/* All-clear empty state: queue fully resolved */}
        {cases.length > 0 && cases.every((c) => c.status !== "Pending Mediation") && (
          <div className="rounded-2xl border border-[#BBF7D0] bg-[#F0FDF4] p-8 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-[#16A34A]" />
            <p className="mt-2 font-heading text-lg font-bold text-[#1F2937]">Queue clear</p>
            <p className="mx-auto mt-1 max-w-md text-sm text-[#4B5563]">
              Every dispute is resolved and every escrow rupee has been moved. New cases land here automatically.
            </p>
            <a
              href="/admin/fraud-review"
              className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[var(--portal-dark)] px-5 font-heading text-sm font-bold text-white transition-transform active:scale-95"
            >
              <ShieldAlert className="h-4 w-4" />
              Review fraud signals
            </a>
          </div>
        )}

        {selected && (
          <CaseFile
            dispute={selected}
            onRefund={() =>
              resolve(
                selected.id,
                "Resolved - Payout Completed",
                `Escrow ${formatInr(selected.escrowAmount)} refunded to buyer`
              )
            }
            onRelease={() =>
              resolve(
                selected.id,
                "Resolved - Payout Completed",
                `Escrow ${formatInr(selected.escrowAmount)} released to farmer`
              )
            }
            onSplit={() =>
              resolve(
                selected.id,
                "Split Mediated",
                `Escrow split per AI recommendation — ${selected.id} marked Split Mediated`
              )
            }
          />
        )}
      </div>
    </PortalShell>
  );
}
