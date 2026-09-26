"use client";

import { Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { ESCROW_STAGE_LABELS } from "@/lib/buyer-mock";
import { cn } from "@/lib/utils";

/** 4-stage escrow progress: Advance locked → In transit → QC passed → Settled */
export function EscrowStages({ stage }: { stage: 0 | 1 | 2 | 3 }) {
  const { language } = useLanguage();
  return (
    <div className="flex items-center gap-0.5 sm:gap-1" aria-label="Escrow stages">
      {ESCROW_STAGE_LABELS.map((label, i) => {
        const done = i < stage;
        const current = i === stage;
        return (
          <div key={i} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <span
                className={cn(
                  "flex size-6 items-center justify-center rounded-full border text-[10px] font-black transition-colors",
                  done && "border-emerald-600 bg-emerald-600 text-white",
                  current && "border-emerald-600 bg-emerald-100 text-emerald-800 ring-2 ring-emerald-200",
                  !done && !current && "border-slate-300 bg-slate-100 text-slate-400"
                )}
              >
                {done ? <Check className="size-3.5" /> : i + 1}
              </span>
              <span
                className={cn(
                  "whitespace-nowrap text-[9px] font-bold leading-none",
                  done || current ? "text-emerald-800" : "text-slate-400"
                )}
              >
                {language === "hi" ? label.hi : label.en}
              </span>
            </div>
            {i < ESCROW_STAGE_LABELS.length - 1 && (
              <div
                className={cn(
                  "mx-1 mb-4 h-0.5 flex-1 rounded-full",
                  i < stage ? "bg-emerald-500" : "bg-slate-200"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
