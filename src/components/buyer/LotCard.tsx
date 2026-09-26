"use client";

import Image from "next/image";
import { MapPin, ShieldCheck, ArrowRight, FileCheck2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import type { ProduceListing } from "@/lib/mock-data";
import { extractGrade, extractMoisture } from "@/lib/buyer-mock";
import { toast } from "sonner";

function savingsPct(l: ProduceListing) {
  if (!l.mandiBenchmarkPrice) return 0;
  return Math.max(0, Math.round(((l.mandiBenchmarkPrice - l.farmGatePrice) / l.mandiBenchmarkPrice) * 100));
}

export function LotCard({ lot, onQuote }: { lot: ProduceListing; onQuote?: (lot: ProduceListing) => void }) {
  const { language } = useLanguage();
  const grade = lot.breakdown?.qualityGrade?.grade ?? extractGrade(lot.breakdown?.qualityGrade?.detail ?? "");
  const moisture = extractMoisture(lot.breakdown?.qualityGrade?.detail ?? "");
  const pct = savingsPct(lot);
  const perUnitSave = Math.max(0, lot.mandiBenchmarkPrice - lot.farmGatePrice);

  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-all hover:shadow-lg hover:-translate-y-0.5">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
        <Image
          src={lot.imageUrl}
          alt={lot.name}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute left-2.5 top-2.5 flex gap-1.5">
          <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-black text-white shadow">
            {grade}
          </span>
          {moisture && (
            <span className="rounded-full bg-slate-950/75 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 backdrop-blur">
              {language === "hi" ? `नमी ${moisture}` : `Moisture ${moisture}`}
            </span>
          )}
        </div>
        {pct > 0 && (
          <div className="absolute right-2.5 top-2.5 rounded-full bg-amber-400 px-2.5 py-0.5 text-[10px] font-black text-amber-950 shadow">
            {language === "hi" ? `मंडी से ${pct}% सस्ता` : `${pct}% below mandi`}
          </div>
        )}
      </div>

      <div className="space-y-3 p-4">
        <div>
          <h3 className="truncate text-sm font-black text-slate-900">
            {language === "hi" ? lot.hindiName : lot.name}
          </h3>
          <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-500">
            <MapPin className="size-3 shrink-0 text-emerald-600" />
            <span className="truncate">
              {lot.village} • {lot.distanceKm} km {language === "hi" ? "दूर" : "away"}
            </span>
          </p>
        </div>

        <div className="flex items-end justify-between rounded-xl bg-slate-50 p-2.5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              {language === "hi" ? "फार्म-गेट भाव" : "Farm-gate"}
            </p>
            <p className="text-lg font-black text-emerald-700">
              ₹{lot.farmGatePrice.toLocaleString("en-IN")}
              <span className="text-[11px] font-semibold text-slate-500">/{lot.unit}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              {language === "hi" ? "मंडी भाव" : "Mandi"}
            </p>
            <p className="text-sm font-bold text-slate-400 line-through">
              ₹{lot.mandiBenchmarkPrice.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px]">
          <span className="inline-flex items-center gap-1 font-bold text-slate-700">
            <ShieldCheck className="size-3.5 text-emerald-600" />
            {language === "hi" ? "ओपनCV प्रमाणित" : "OpenCV assayed"}
          </span>
          <span className="font-black text-slate-900">
            {lot.quantityAvailable} {lot.unit} {language === "hi" ? "उपलब्ध" : "available"}
          </span>
        </div>

        <div className="flex gap-2 pt-1">
          <Button
            variant="outline"
            size="sm"
            className="h-10 flex-1 rounded-xl border-emerald-300 text-xs font-bold text-emerald-800 hover:bg-emerald-50"
            onClick={() =>
              onQuote
                ? onQuote(lot)
                : toast.success(language === "hi" ? "कोटेशन अनुरोध भेजा गया" : "Quote request sent to seller")
            }
          >
            <FileCheck2 className="size-3.5" />
            {language === "hi" ? "भाव पूछें" : "Request quote"}
          </Button>
          <Button
            size="sm"
            className="h-10 flex-1 rounded-xl bg-emerald-700 text-xs font-black text-white hover:bg-emerald-800"
            onClick={() =>
              toast.success(
                language === "hi"
                  ? `${lot.quantityAvailable} ${lot.unit} लॉट एस्क्रो में बुक हो गया`
                  : `Lot of ${lot.quantityAvailable} ${lot.unit} booked in escrow`
              )
            }
          >
            {language === "hi" ? "लॉट बुक करें" : "Book lot"}
            <ArrowRight className="size-3.5" />
          </Button>
        </div>

        {perUnitSave > 0 && (
          <p className="text-center text-[11px] font-bold text-emerald-700">
            {language === "hi"
              ? `इस लॉट पर ≈ ₹${(perUnitSave * lot.quantityAvailable).toLocaleString("en-IN")} की बचत`
              : `≈ ₹${(perUnitSave * lot.quantityAvailable).toLocaleString("en-IN")} saved on this lot`}
          </p>
        )}
      </div>
    </div>
  );
}
