"use client";

import { useState } from "react";
import { ShieldCheck, Camera, MessageSquare, MapPin, Gavel } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatInr } from "@/lib/utils";
import type { DisputeCase } from "@/lib/mock-data";
import { useLanguage } from "@/context/LanguageContext";

interface CaseFileProps {
  dispute: DisputeCase;
  onRefund?: () => void;
  onRelease?: () => void;
  onSplit?: () => void;
  className?: string;
}

/** Dispute case-file: timeline + both parties' evidence + escrow actions. */
export function CaseFile({ dispute, onRefund, onRelease, onSplit, className }: CaseFileProps) {
  const { t } = useLanguage();
  const [tab, setTab] = useState<"evidence" | "ai">("evidence");

  return (
    <div className={cn("rounded-2xl border border-[#E5E7EB] bg-white shadow-sm overflow-hidden", className)}>
      <div className="bg-[var(--portal-soft)] p-4 border-b border-[#E5E7EB]">
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="font-heading font-bold text-[#1F2937]">
              {dispute.cropName} · {dispute.batchWeight}
            </div>
            <div className="text-xs text-[#6B7280]">
              {t("kit_order")}: {dispute.orderNumber} · {dispute.id}
            </div>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] px-3 py-1 text-xs font-bold text-[#92400E]">
            <ShieldCheck className="h-3.5 w-3.5" />
            {formatInr(dispute.escrowAmount)} {t("kit_escrow_locked")}
          </span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-lg bg-white p-2 border border-[#E5E7EB]">
            <div className="font-semibold text-[#1F2937]">{dispute.farmer.name}</div>
            <div className="text-[#6B7280]">{dispute.farmer.location}</div>
            <div className="mt-1 font-bold text-[#2E7D32]">★ {dispute.farmer.trustScore}</div>
          </div>
          <div className="rounded-lg bg-white p-2 border border-[#E5E7EB]">
            <div className="font-semibold text-[#1F2937]">{dispute.buyer.name}</div>
            <div className="text-[#6B7280]">{dispute.buyer.business}</div>
            <div className="mt-1 text-[#6B7280]">{dispute.buyer.location}</div>
          </div>
        </div>
      </div>

      <div className="flex border-b border-[#E5E7EB]">
        {(["evidence", "ai"] as const).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setTab(k)}
            className={cn(
              "flex-1 min-h-[48px] text-sm font-semibold",
              tab === k
                ? "text-[var(--portal-dark)] border-b-2 border-[var(--portal)]"
                : "text-[#6B7280]"
            )}
          >
            {k === "evidence" ? t("kit_evidence") : t("kit_ai_analysis")}
          </button>
        ))}
      </div>

      <div className="p-4">
        {tab === "evidence" ? (
          <div className="grid sm:grid-cols-2 gap-3">
            <figure className="rounded-xl overflow-hidden border border-[#E5E7EB]">
              <img src={dispute.farmerDispatchPhoto} alt="Dispatch" className="h-36 w-full object-cover" loading="lazy" />
              <figcaption className="p-2 text-xs">
                <span className="inline-flex items-center gap-1 font-semibold text-[#1F2937]">
                  <Camera className="h-3.5 w-3.5" /> {t("kit_dispatch_photo")}
                </span>
                <div className="text-[#6B7280] mt-0.5">
                  {t("kit_grade")} {dispute.farmerOpenCvStats.grade} · {t("kit_blur")}{" "}
                  {dispute.farmerOpenCvStats.blurScore} · {dispute.farmerOpenCvStats.timestamp}
                </div>
              </figcaption>
            </figure>
            <figure className="rounded-xl overflow-hidden border border-[#E5E7EB]">
              <img src={dispute.buyerReportedPhoto} alt="Arrival" className="h-36 w-full object-cover" loading="lazy" />
              <figcaption className="p-2 text-xs">
                <span className="inline-flex items-center gap-1 font-semibold text-[#1F2937]">
                  <Camera className="h-3.5 w-3.5" /> {t("kit_arrival_photo")}
                </span>
                <div className="text-[#6B7280] mt-0.5 flex items-start gap-1">
                  <MessageSquare className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                  {dispute.buyerComplaint}
                </div>
              </figcaption>
            </figure>
            <div className="sm:col-span-2 flex items-center gap-1.5 text-xs text-[#6B7280]">
              <MapPin className="h-3.5 w-3.5" /> GPS transit log available · {t("kit_status")}: {dispute.status}
            </div>
          </div>
        ) : (
          <div className="rounded-xl bg-[var(--portal-soft)] p-3 text-sm text-[#374151]">
            <div className="font-semibold text-[#1F2937] mb-1">{t("kit_ai_analysis")}</div>
            {dispute.aiDiscrepancyAnalysis}
            <div className="mt-2 rounded-lg bg-white border border-[#E5E7EB] p-2 text-xs">
              <span className="font-semibold">{t("kit_recommended")}: </span>
              {dispute.recommendedAction}
            </div>
          </div>
        )}

        <div className="mt-4">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[#6B7280] mb-2">
            <Gavel className="h-3.5 w-3.5" /> {t("kit_escrow_action")}
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={onRefund}
              className="min-h-[52px] rounded-xl bg-[#DC2626] font-heading font-bold text-white text-sm hover:bg-[#B91C1C] active:scale-95 transition-all"
            >
              {t("kit_refund")}
            </button>
            <button
              type="button"
              onClick={onSplit}
              className="min-h-[52px] rounded-xl bg-[#D97706] font-heading font-bold text-white text-sm hover:bg-[#B45309] active:scale-95 transition-all"
            >
              {t("kit_split")}
            </button>
            <button
              type="button"
              onClick={onRelease}
              className="min-h-[52px] rounded-xl bg-[#2E7D32] font-heading font-bold text-white text-sm hover:bg-[#1B5E20] active:scale-95 transition-all"
            >
              {t("kit_release")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
