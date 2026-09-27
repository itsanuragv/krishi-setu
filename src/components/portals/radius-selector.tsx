"use client";

import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

interface RadiusSelectorProps {
  value: number;
  onChange: (km: number) => void;
  options?: number[];
  className?: string;
}

/** Hero radius filter — the <25km USP as the organising principle. */
export function RadiusSelector({ value, onChange, options = [5, 10, 15, 25], className }: RadiusSelectorProps) {
  const { t } = useLanguage();
  return (
    <div className={cn("rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm", className)}>
      <div className="flex items-center gap-2 text-sm font-semibold text-[#1F2937] font-heading">
        <MapPin className="h-4 w-4 text-[var(--portal)]" />
        {t("kit_radius_title")}
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {options.map((km) => {
          const active = value === km;
          return (
            <button
              key={km}
              type="button"
              onClick={() => onChange(km)}
              aria-pressed={active}
              className={cn(
                "min-h-[52px] rounded-xl border-2 px-2 py-2 text-sm font-bold transition-all active:scale-95",
                active
                  ? "border-[var(--portal)] bg-[var(--portal-light)] text-[var(--portal-dark)]"
                  : "border-[#E5E7EB] bg-white text-[#4B5563] hover:border-[var(--portal)]"
              )}
            >
              {km} <span className="font-medium">km</span>
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-[#6B7280]">{t("kit_radius_hint")}</p>
    </div>
  );
}
