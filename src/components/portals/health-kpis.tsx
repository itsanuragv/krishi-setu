"use client";

import { Activity, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

export interface HealthKpiItem {
  id: string;
  label: string;
  value: string;
  target: string;
  /** true = value meets/exceeds target */
  onTrack: boolean;
  hint?: string;
}

interface HealthKpisProps {
  kpis: HealthKpiItem[];
  className?: string;
}

/** Marketplace health KPIs row — dispute rate, resolution time, auto-resolve %, payout TAT. */
export function HealthKpis({ kpis, className }: HealthKpisProps) {
  const { t } = useLanguage();
  return (
    <div className={cn("rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm", className)}>
      <div className="flex items-center gap-2 text-sm font-bold font-heading text-[#1F2937]">
        <Activity className="h-4 w-4 text-[var(--portal)]" />
        {t("kit_health_title")}
      </div>
      <div className="mt-3 grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {kpis.map((k) => (
          <div
            key={k.id}
            className={cn(
              "rounded-xl border p-3",
              k.onTrack ? "border-[#BBF7D0] bg-[#F0FDF4]" : "border-[#FDE68A] bg-[#FFFBEB]"
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#4B5563]">{k.label}</span>
              {k.onTrack ? (
                <CheckCircle2 className="h-4 w-4 text-[#16A34A]" />
              ) : (
                <AlertCircle className="h-4 w-4 text-[#D97706]" />
              )}
            </div>
            <div className="mt-1 font-heading text-xl font-bold text-[#1F2937]">{k.value}</div>
            <div className="text-[11px] text-[#6B7280]">
              {t("kit_target")}: {k.target}
            </div>
            {k.hint && <div className="mt-1 text-[11px] text-[#6B7280]">{k.hint}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
