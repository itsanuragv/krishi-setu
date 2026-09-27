"use client";

import { useState } from "react";
import { ShieldAlert, Gauge, Info } from "lucide-react";
import { toast } from "sonner";
import { PortalShell, PortalHero, FraudSignals, type FraudSignalItem } from "@/components/portals";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MOCK_FRAUD_SIGNALS } from "@/lib/mock-data";
import { MOCK_FRAUD_THRESHOLDS } from "@/lib/portal-mocks/admin";

type Action = "friction" | "restrict" | "suspend";

const actionLabels: Record<Action, string> = {
  friction: "Add friction",
  restrict: "Restrict",
  suspend: "Suspend",
};

const severityDot = {
  high: "bg-[#DC2626]",
  medium: "bg-[#D97706]",
  low: "bg-[#2563EB]",
};

function EnforcementRow({ signal, onAct }: { signal: FraudSignalItem; onAct: () => void }) {
  const [acted, setActed] = useState<Action | null>(null);
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-[#E5E7EB] p-3 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-start gap-2.5">
        <span className={cn("mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full", severityDot[signal.severity])} />
        <div className="min-w-0">
          <div className="text-sm font-semibold text-[#1F2937]">{signal.label}</div>
          <div className="text-xs text-[#6B7280]">{signal.detail}</div>
        </div>
      </div>
      <div className="flex shrink-0 gap-2">
        {(Object.keys(actionLabels) as Action[]).map((a) => (
          <Button
            key={a}
            size="sm"
            variant={acted === a ? "default" : a === "suspend" ? "destructive" : "outline"}
            disabled={acted !== null}
            onClick={() => {
              setActed(a);
              onAct();
              toast.success(`${actionLabels[a]} applied — ${signal.id}`);
            }}
          >
            {actionLabels[a]}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default function FraudReviewPage() {
  const [actionsToday, setActionsToday] = useState(0);
  const highCount = MOCK_FRAUD_SIGNALS.filter((s) => s.severity === "high").length;

  return (
    <PortalShell accent="admin">
      <div className="space-y-5">
        <PortalHero
          eyebrow="Trust & safety"
          title="Fraud Review"
          subtitle="Signals are machine-flagged; enforcement is human. Escalate friction → restrict → suspend along the ladder below."
          stats={[
            { label: "Active signals", value: String(MOCK_FRAUD_SIGNALS.length) },
            { label: "High severity", value: String(highCount) },
            { label: "Actions today", value: String(actionsToday) },
          ]}
        />

        <FraudSignals signals={MOCK_FRAUD_SIGNALS} />

        {/* Enforcement actions */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 font-heading text-base font-bold">
              <ShieldAlert className="h-5 w-5 text-[#DC2626]" />
              Enforcement actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {MOCK_FRAUD_SIGNALS.map((s) => (
              <EnforcementRow key={s.id} signal={s} onAct={() => setActionsToday((n) => n + 1)} />
            ))}
          </CardContent>
        </Card>

        {/* Thresholds explainer */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 font-heading text-base font-bold">
              <Gauge className="h-5 w-5 text-[var(--portal-dark)]" />
              Enforcement ladder — thresholds
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {MOCK_FRAUD_THRESHOLDS.map((t, i) => (
              <div key={t.level} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--portal)] font-heading text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  {i < MOCK_FRAUD_THRESHOLDS.length - 1 && (
                    <span className="my-1 w-0.5 flex-1 bg-[#E5E7EB]" />
                  )}
                </div>
                <div className="pb-1">
                  <div className="text-sm font-bold text-[#1F2937]">{t.label}</div>
                  <div className="mt-0.5 flex items-start gap-1 text-xs text-[#4B5563]">
                    <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#9CA3AF]" />
                    <span><strong>Trigger:</strong> {t.trigger}</span>
                  </div>
                  <div className="mt-0.5 text-xs text-[#4B5563]"><strong>Effect:</strong> {t.effect}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </PortalShell>
  );
}
