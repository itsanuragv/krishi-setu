"use client";

import { useState } from "react";
import {
  BadgeCheck,
  Truck,
  FileDown,
  MessageSquareWarning,
  Eye,
  EyeOff,
  PackageCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";
import { MOCK_CONTRACTS } from "@/lib/buyer-mock";
import { EscrowStages } from "@/components/buyer/EscrowStages";
import { cn } from "@/lib/utils";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const STATUS_STYLE: Record<string, string> = {
  active: "bg-sky-100 text-sky-800",
  in_transit: "bg-amber-100 text-amber-800",
  qc_pending: "bg-violet-100 text-violet-800",
  settled: "bg-emerald-100 text-emerald-800",
};

export default function BuyerOrdersPage() {
  const { language } = useLanguage();
  const hi = language === "hi";
  const [showPin, setShowPin] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState<"all" | "active" | "settled">("all");

  const orders = MOCK_CONTRACTS.filter((c) =>
    filter === "all" ? true : filter === "settled" ? c.status === "settled" : c.status !== "settled"
  );

  const statusLabel = (s: string) =>
    s === "active" ? (hi ? "सक्रिय" : "Active")
    : s === "in_transit" ? (hi ? "रास्ते में" : "In transit")
    : s === "qc_pending" ? (hi ? "गुणवत्ता जांच" : "QC pending")
    : (hi ? "निपटान पूर्ण" : "Settled");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-black text-slate-900 sm:text-2xl">{hi ? "मेरे ऑर्डर" : "My orders"}</h1>
          <p className="text-xs text-slate-500 sm:text-sm">
            {hi ? "एस्क्रो-सुरक्षित थोक खरीद — लॉक से निपटान तक" : "Escrow-protected bulk purchases — from lock to settlement"}
          </p>
        </div>
        <div className="flex gap-1.5 rounded-xl border border-slate-200 bg-white p-1">
          {(["all", "active", "settled"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-[11px] font-bold transition-all",
                filter === f ? "bg-emerald-700 text-white" : "text-slate-500 hover:bg-slate-100"
              )}
            >
              {f === "all" ? (hi ? "सभी" : "All") : f === "active" ? (hi ? "सक्रिय" : "Active") : (hi ? "पूर्ण" : "Done")}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {orders.map((c) => {
          const lotValue = c.quantity * c.agreedPrice;
          return (
            <div key={c.id} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <PackageCheck className="size-5" />
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-black text-slate-900 sm:text-base">{hi ? c.lotNameHi : c.lotName}</h3>
                      <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-black", STATUS_STYLE[c.status])}>
                        {statusLabel(c.status)}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500">
                      <span className="font-mono font-bold text-slate-600">{c.contractNo}</span>
                      {" • "}{hi ? c.counterpartyHi : c.counterparty}
                      {" • "}{c.quantity} {c.unit} @ {inr(c.agreedPrice)}/{c.unit}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-slate-900">{inr(lotValue)}</p>
                  <p className="text-[10px] text-slate-500">{hi ? "अनुबंध मूल्य" : "Contract value"}</p>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-3">
                <EscrowStages stage={c.escrowStage} />
              </div>

              <div className="grid gap-2.5 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{hi ? "डिलीवरी तिथि" : "Delivery date"}</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs font-black text-slate-800">
                    <Truck className="size-3.5 text-slate-400" />
                    {c.deliveryDate}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{hi ? "हैंडओवर PIN" : "Handover PIN"}</p>
                  {c.status === "settled" ? (
                    <p className="mt-0.5 text-xs font-bold text-emerald-700">{hi ? "सत्यापित ✓" : "Verified ✓"}</p>
                  ) : (
                    <button
                      onClick={() => setShowPin({ ...showPin, [c.id]: !showPin[c.id] })}
                      className="mt-0.5 inline-flex items-center gap-1.5 font-mono text-xs font-black text-slate-800"
                    >
                      {showPin[c.id] ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                      {showPin[c.id] ? c.handoverPin : "••••"}
                      <span className="font-sans text-[10px] font-semibold text-slate-400">
                        {hi ? "ड्राइवर को बताएं" : "share with driver"}
                      </span>
                    </button>
                  )}
                </div>
                <div className="rounded-xl border border-slate-200 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{hi ? "मंडी बनाम बचत" : "Saved vs mandi"}</p>
                  <p className="mt-0.5 text-xs font-black text-emerald-700">
                    {inr((c.mandiPrice - c.agreedPrice) * c.quantity)}
                    <span className="ml-1 font-semibold text-slate-400">
                      ({Math.round(((c.mandiPrice - c.agreedPrice) / c.mandiPrice) * 100)}%)
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                <Button
                  size="sm" variant="outline"
                  className="h-9 rounded-xl text-[11px] font-bold"
                  onClick={() => toast.success(hi ? "GST इनवॉइस डाउनलोड हो रहा है" : "Downloading GST invoice")}
                >
                  <FileDown className="size-3.5" />
                  {hi ? "GST इनवॉइस" : "GST invoice"}
                </Button>
                <Button
                  size="sm" variant="outline"
                  className="h-9 rounded-xl text-[11px] font-bold"
                  onClick={() => toast.success(hi ? "गुणवत्ता प्रमाणपत्र खुल रहा है" : "Opening assay certificate")}
                >
                  <BadgeCheck className="size-3.5" />
                  {hi ? "गुणवत्ता प्रमाणपत्र" : "Assay certificate"}
                </Button>
                {c.status !== "settled" && (
                  <Button
                    size="sm" variant="outline"
                    className="h-9 rounded-xl border-rose-200 text-[11px] font-bold text-rose-700 hover:bg-rose-50"
                    onClick={() => toast.success(hi ? "विवाद एडमिन को भेजा गया" : "Dispute sent to admin")}
                  >
                    <MessageSquareWarning className="size-3.5" />
                    {hi ? "विवाद दर्ज करें" : "Raise dispute"}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
