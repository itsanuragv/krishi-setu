"use client";

import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

export interface DeliverySlot {
  id: string;
  label: string;
  sub?: string;
  available: boolean;
}

interface SlotPickerProps {
  slots: DeliverySlot[];
  value?: string;
  onChange: (id: string) => void;
  className?: string;
}

/** Delivery slot picker — e.g. 6 AM kitchen-prep slots for HoReCa. */
export function SlotPicker({ slots, value, onChange, className }: SlotPickerProps) {
  const { t } = useLanguage();
  return (
    <div className={cn("rounded-xl border border-[#E5E7EB] bg-white p-3", className)}>
      <div className="flex items-center gap-2 text-sm font-semibold text-[#1F2937] font-heading">
        <Clock className="h-4 w-4 text-[var(--portal)]" />
        {t("kit_slot_title")}
      </div>
      <div className="mt-2.5 grid grid-cols-2 sm:grid-cols-3 gap-2">
        {slots.map((s) => {
          const active = value === s.id;
          return (
            <button
              key={s.id}
              type="button"
              disabled={!s.available}
              onClick={() => onChange(s.id)}
              className={cn(
                "min-h-[56px] rounded-xl border-2 px-2 py-2 text-left transition-all active:scale-95 disabled:opacity-40",
                active
                  ? "border-[var(--portal)] bg-[var(--portal-light)]"
                  : "border-[#E5E7EB] bg-white hover:border-[var(--portal)]"
              )}
            >
              <div className={cn("text-sm font-bold", active ? "text-[var(--portal-dark)]" : "text-[#1F2937]")}>
                {s.label}
              </div>
              {s.sub && <div className="text-[11px] text-[#6B7280]">{s.sub}</div>}
              {!s.available && <div className="text-[11px] font-semibold text-[#DC2626]">{t("kit_slot_full")}</div>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
