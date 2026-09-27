"use client";

import { useState } from "react";
import { Delete } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

interface PinPadProps {
  length?: number;
  onComplete: (pin: string) => void;
  variant?: "green" | "blue";
  label?: string;
  disabled?: boolean;
  className?: string;
}

/** Big numeric keypad for the 4-digit handover PIN / pickup OTP money moment. */
export function PinPad({ length = 4, onComplete, variant = "blue", label, disabled, className }: PinPadProps) {
  const { t } = useLanguage();
  const [pin, setPin] = useState("");

  const press = (d: string) => {
    if (disabled || pin.length >= length) return;
    const next = pin + d;
    setPin(next);
    if (next.length === length) {
      onComplete(next);
      setTimeout(() => setPin(""), 600);
    }
  };

  const backspace = () => {
    if (disabled) return;
    setPin((p) => p.slice(0, -1));
  };

  const dotColor = variant === "green" ? "bg-[#2E7D32]" : "bg-[#1D4ED8]";

  return (
    <div className={cn("rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm", className)}>
      {label && (
        <div className="text-center text-sm font-semibold text-[#1F2937] font-heading">
          {label}
        </div>
      )}
      <div className="mt-4 flex justify-center gap-3" aria-live="polite">
        {Array.from({ length }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-4 w-4 rounded-full border-2 transition-colors",
              i < pin.length ? dotColor + " border-transparent" : "border-[#D1D5DB] bg-[#F3F4F6]"
            )}
          />
        ))}
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2.5 max-w-[280px] mx-auto">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => press(d)}
            disabled={disabled}
            className="flex h-16 items-center justify-center rounded-2xl bg-[#F3F4F6] font-heading text-2xl font-bold text-[#1F2937] transition-all hover:bg-[#E5E7EB] active:scale-95 disabled:opacity-40"
          >
            {d}
          </button>
        ))}
        <div />
        <button
          type="button"
          onClick={() => press("0")}
          disabled={disabled}
          className="flex h-16 items-center justify-center rounded-2xl bg-[#F3F4F6] font-heading text-2xl font-bold text-[#1F2937] transition-all hover:bg-[#E5E7EB] active:scale-95 disabled:opacity-40"
        >
          0
        </button>
        <button
          type="button"
          onClick={backspace}
          disabled={disabled}
          aria-label={t("kit_backspace")}
          className="flex h-16 items-center justify-center rounded-2xl bg-[#F3F4F6] text-[#4B5563] transition-all hover:bg-[#E5E7EB] active:scale-95 disabled:opacity-40"
        >
          <Delete className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
