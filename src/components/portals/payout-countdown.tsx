"use client";

import { Wallet, Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatInr } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

interface PayoutCountdownProps {
  amount: number;
  daysLeft: number;
  upiLabel?: string;
  className?: string;
}

/** Plain-language earnings: "Is hafte ₹X UPI me aayega · N din me". */
export function PayoutCountdown({ amount, daysLeft, upiLabel, className }: PayoutCountdownProps) {
  const { t } = useLanguage();
  const pct = Math.max(8, Math.min(100, ((7 - daysLeft) / 7) * 100));
  return (
    <div
      className={cn(
        "rounded-2xl p-4 sm:p-5 text-white shadow-sm",
        "bg-[linear-gradient(135deg,var(--portal),var(--portal-dark))]",
        className
      )}
    >
      <div className="flex items-center gap-2 text-white/85 text-xs font-semibold uppercase tracking-wide">
        <Wallet className="h-4 w-4" />
        {t("kit_payout_title")}
      </div>
      <div className="mt-2 font-heading text-2xl sm:text-3xl font-bold !text-white">
        {t("kit_this_week")} {formatInr(amount)}
      </div>
      <div className="mt-1 text-sm text-white/85">
        {t("kit_payout_coming")}
        {upiLabel ? ` · ${upiLabel}` : ""}
      </div>
      <div className="mt-3 h-2.5 rounded-full bg-white/25 overflow-hidden">
        <div className="h-full rounded-full bg-white transition-all" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-2 flex items-center gap-1.5 text-xs text-white/85">
        <Timer className="h-3.5 w-3.5" />
        {daysLeft <= 0 ? t("kit_payout_today") : `${daysLeft} ${t("kit_days_suffix")} ${t("kit_remaining")}`}
      </div>
    </div>
  );
}
