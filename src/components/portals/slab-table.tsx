"use client";

import { cn } from "@/lib/utils";
import { formatInr } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

export interface PriceSlab {
  minQty: number;
  price: number;
}

interface SlabTableProps {
  slabs: PriceSlab[];
  unit: string;
  activeQty?: number;
  className?: string;
}

/** 3-tier bulk pricing slabs; highlights the tier the buyer's qty unlocks. */
export function SlabTable({ slabs, unit, activeQty, className }: SlabTableProps) {
  const { t } = useLanguage();
  const sorted = [...slabs].sort((a, b) => a.minQty - b.minQty);
  const activeIdx =
    typeof activeQty === "number"
      ? sorted.reduce((acc, s, i) => (activeQty >= s.minQty ? i : acc), -1)
      : -1;
  const best = sorted[sorted.length - 1];

  return (
    <div className={cn("rounded-xl border border-[#E5E7EB] bg-white overflow-hidden", className)}>
      <div className="bg-[var(--portal-soft)] px-3 py-2 text-xs font-bold uppercase tracking-wide text-[var(--portal-dark)]">
        {t("kit_slab_title")}
      </div>
      <div className="divide-y divide-[#F3F4F6]">
        {sorted.map((s, i) => {
          const active = i === activeIdx;
          return (
            <div
              key={s.minQty}
              className={cn(
                "flex items-center justify-between px-3 py-2.5",
                active && "bg-[var(--portal-light)]"
              )}
            >
              <span className="text-sm text-[#4B5563]">
                <span className="font-bold text-[#1F2937]">{s.minQty}+</span> {unit}
                {active && (
                  <span className="ml-2 rounded-full bg-[var(--portal)] px-2 py-0.5 text-[11px] font-bold text-white">
                    {t("kit_slab_yours")}
                  </span>
                )}
              </span>
              <span className={cn("font-heading font-bold", active ? "text-[var(--portal-dark)]" : "text-[#1F2937]")}>
                {formatInr(s.price)}
                <span className="text-xs font-medium text-[#6B7280]">/{unit}</span>
              </span>
            </div>
          );
        })}
      </div>
      {best && (
        <div className="px-3 py-2 text-xs text-[#6B7280] bg-[#F9FAFB]">
          {t("kit_slab_best")}: {formatInr(best.price)}/{unit} {t("kit_slab_at")} {best.minQty}+ {unit}
        </div>
      )}
    </div>
  );
}
