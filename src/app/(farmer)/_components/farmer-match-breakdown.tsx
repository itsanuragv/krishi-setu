"use client";

import { useLanguage } from "@/context/LanguageContext";
import type { MatchBreakdown } from "@/lib/schemas/match";

const FACTORS = [
  { key: "quantity", labelKey: "farmer_bd_quantity" },
  { key: "price", labelKey: "farmer_bd_price" },
  { key: "location", labelKey: "farmer_bd_location" },
  { key: "quality", labelKey: "farmer_bd_quality" },
  { key: "trust", labelKey: "farmer_bd_trust" },
] as const;

const FACTOR_MAX = 22;

/**
 * FarmerMatchBreakdown — the 5-factor match score bars, fully i18n'd
 * (the shared MatchScore component has hardcoded English labels).
 */
export function FarmerMatchBreakdown({
  breakdown,
}: {
  breakdown: MatchBreakdown;
}) {
  const { t } = useLanguage();
  return (
    <ul className="space-y-2.5">
      {FACTORS.map(({ key, labelKey }) => {
        const value = breakdown[key];
        const pct = Math.min(100, Math.round((value / FACTOR_MAX) * 100));
        return (
          <li key={key}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-medium text-[#4B5563]">{t(labelKey)}</span>
              <span className="font-bold tabular-nums text-[#1F2937]">
                {value}
                <span className="font-medium text-[#9CA3AF]">/{FACTOR_MAX}</span>
              </span>
            </div>
            <div
              className="h-1.5 overflow-hidden rounded-full bg-[#E5E7EB]"
              role="progressbar"
              aria-valuenow={value}
              aria-valuemin={0}
              aria-valuemax={FACTOR_MAX}
              aria-label={t(labelKey)}
            >
              <div
                className="h-full rounded-full bg-[var(--portal)] transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
