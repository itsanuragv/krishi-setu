"use client";

import { TrendingUp, TrendingDown, Scale } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatInr } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

interface MandiCompareCardProps {
  crop: string;
  mandiPrice: number;
  yourPrice: number;
  unit: string;
  className?: string;
}

/** "Mandi vs Aapka Daam" — price transparency card with the +₹ diff highlighted. */
export function MandiCompareCard({ crop, mandiPrice, yourPrice, unit, className }: MandiCompareCardProps) {
  const { t } = useLanguage();
  const diff = yourPrice - mandiPrice;
  const positive = diff >= 0;
  return (
    <div className={cn("rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm", className)}>
      <div className="flex items-center gap-2 text-sm font-semibold text-[#1F2937] font-heading">
        <Scale className="h-4 w-4 text-[var(--portal)]" />
        {crop}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-[#F3F4F6] p-3">
          <div className="text-xs text-[#6B7280]">{t("kit_mandi_rate")}</div>
          <div className="text-lg font-bold font-heading text-[#1F2937]">
            {formatInr(mandiPrice)}
            <span className="text-xs font-medium text-[#6B7280]">/{unit}</span>
          </div>
        </div>
        <div className="rounded-xl bg-[var(--portal-light)] p-3">
          <div className="text-xs text-[var(--portal-dark)] font-medium">{t("kit_your_price")}</div>
          <div className="text-lg font-bold font-heading text-[var(--portal-dark)]">
            {formatInr(yourPrice)}
            <span className="text-xs font-medium">/{unit}</span>
          </div>
        </div>
      </div>
      <div
        className={cn(
          "mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold",
          positive ? "bg-[#E8F5E9] text-[#1B5E20]" : "bg-[#FEF2F2] text-[#B91C1C]"
        )}
      >
        {positive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
        {positive ? "+" : "−"}
        {formatInr(Math.abs(diff))}/{unit} {t("kit_extra_earning")}
      </div>
    </div>
  );
}
