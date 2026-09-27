"use client";

import { Sprout, Store, Truck, BadgeIndianRupee } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatInr } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

interface PriceJourneyProps {
  farmerPrice: number;
  retailPrice: number;
  unit: string;
  className?: string;
  compact?: boolean;
}

/** Price Journey strip: Farmer ₹X → Retail ₹Y → "Aapki bachat ₹Z". */
export function PriceJourney({ farmerPrice, retailPrice, unit, className, compact }: PriceJourneyProps) {
  const { t } = useLanguage();
  const saving = Math.max(0, retailPrice - farmerPrice);
  return (
    <div className={cn("rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-3", className)}>
      <div className="flex items-center justify-between gap-1 text-center">
        <div className="flex-1">
          <Sprout className="mx-auto h-4 w-4 text-[#2E7D32]" />
          <div className={cn("font-bold font-heading text-[#1F2937]", compact ? "text-sm" : "text-base")}>
            {formatInr(farmerPrice)}
          </div>
          <div className="text-[11px] text-[#6B7280]">
            {t("kit_farmer_gets")}/{unit}
          </div>
        </div>
        <Truck className="h-4 w-4 shrink-0 text-[#9CA3AF]" />
        <div className="flex-1">
          <Store className="mx-auto h-4 w-4 text-[#6B7280]" />
          <div className={cn("font-bold font-heading text-[#6B7280] line-through decoration-[#DC2626]/60", compact ? "text-sm" : "text-base")}>
            {formatInr(retailPrice)}
          </div>
          <div className="text-[11px] text-[#6B7280]">
            {t("kit_retail_price")}/{unit}
          </div>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-center gap-1.5 rounded-lg bg-[#E8F5E9] px-2 py-1.5 text-sm font-bold text-[#1B5E20]">
        <BadgeIndianRupee className="h-4 w-4" />
        {t("kit_you_save")}: {formatInr(saving)}/{unit}
      </div>
    </div>
  );
}
