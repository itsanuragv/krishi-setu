"use client";

import { AlertTriangle, ShieldAlert, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

export interface FraudSignalItem {
  id: string;
  label: string;
  detail: string;
  severity: "high" | "medium" | "low";
}

interface FraudSignalsProps {
  signals: FraudSignalItem[];
  className?: string;
}

/** Fraud signals panel — velocity, photo duplication, serial complainers, collusion. */
export function FraudSignals({ signals, className }: FraudSignalsProps) {
  const { t } = useLanguage();
  const icon = {
    high: <ShieldAlert className="h-5 w-5 text-[#DC2626]" />,
    medium: <AlertTriangle className="h-5 w-5 text-[#D97706]" />,
    low: <Info className="h-5 w-5 text-[#2563EB]" />,
  };
  const sevLabel = {
    high: t("kit_severity_high"),
    medium: t("kit_severity_medium"),
    low: t("kit_severity_low"),
  };
  const rowTone = {
    high: "border-[#FECACA] bg-[#FEF2F2]",
    medium: "border-[#FDE68A] bg-[#FFFBEB]",
    low: "border-[#BFDBFE] bg-[#EFF6FF]",
  };
  return (
    <div className={cn("rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm", className)}>
      <div className="text-sm font-bold font-heading text-[#1F2937]">{t("kit_fraud_title")}</div>
      <div className="mt-3 space-y-2.5">
        {signals.map((s) => (
          <div key={s.id} className={cn("flex gap-3 rounded-xl border p-3", rowTone[s.severity])}>
            <span className="mt-0.5 shrink-0">{icon[s.severity]}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[#1F2937]">{s.label}</span>
                <span className="rounded-full bg-white/70 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-[#4B5563]">
                  {sevLabel[s.severity]}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-[#4B5563]">{s.detail}</p>
            </div>
          </div>
        ))}
        {signals.length === 0 && (
          <p className="text-sm text-[#6B7280]">{t("kit_fraud_none")}</p>
        )}
      </div>
    </div>
  );
}
