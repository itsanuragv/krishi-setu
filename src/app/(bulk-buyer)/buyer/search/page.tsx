"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { MOCK_PRODUCE_LISTINGS } from "@/lib/mock-data";
import { LotCard } from "@/components/buyer/LotCard";
import { cn } from "@/lib/utils";

export default function BuyerSearchPage() {
  const { language } = useLanguage();
  const hi = language === "hi";
  const [query, setQuery] = useState("");
  const [grade, setGrade] = useState("all");
  const [maxDistance, setMaxDistance] = useState(50);
  const [minQty, setMinQty] = useState(0);
  const [sortBy, setSortBy] = useState<"savings" | "price" | "distance" | "qty">("savings");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = MOCK_PRODUCE_LISTINGS.filter((l) => {
      if (q && !(l.name.toLowerCase().includes(q) || l.hindiName.includes(query.trim()))) return false;
      if (grade !== "all") {
        const g = l.breakdown?.qualityGrade?.grade ?? l.breakdown?.qualityGrade?.detail ?? "";
        if (!g.toLowerCase().includes(grade.toLowerCase())) return false;
      }
      if (l.distanceKm > maxDistance) return false;
      if (l.quantityAvailable < minQty) return false;
      return true;
    });
    return [...list].sort((a, b) => {
      if (sortBy === "price") return a.farmGatePrice - b.farmGatePrice;
      if (sortBy === "distance") return a.distanceKm - b.distanceKm;
      if (sortBy === "qty") return b.quantityAvailable - a.quantityAvailable;
      return b.mandiBenchmarkPrice - b.farmGatePrice - (a.mandiBenchmarkPrice - a.farmGatePrice);
    });
  }, [query, grade, maxDistance, minQty, sortBy]);

  const activeFilterCount = (grade !== "all" ? 1 : 0) + (maxDistance < 50 ? 1 : 0) + (minQty > 0 ? 1 : 0);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-black text-slate-900 sm:text-2xl">
          {hi ? "कॉन्ट्रैक्ट लॉट खोजें" : "Explore contract lots"}
        </h1>
        <p className="text-xs text-slate-500 sm:text-sm">
          {hi
            ? "प्रमाणित ग्रेड, नमी रिपोर्ट और मंडी-बचत के साथ थोक लॉट"
            : "Bulk lots with certified grades, moisture reports and mandi savings"}
        </p>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={hi ? "फसल खोजें — गेहूं, सोयाबीन, चना…" : "Search crops — wheat, soyabean, chana…"}
            className="h-12 rounded-2xl border-slate-200 bg-white pl-10 text-sm font-semibold shadow-xs"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setFiltersOpen(!filtersOpen)}
          className={cn("h-12 shrink-0 rounded-2xl border-slate-200 px-4 text-xs font-bold", filtersOpen && "border-emerald-500 bg-emerald-50 text-emerald-800")}
        >
          <SlidersHorizontal className="size-4" />
          {hi ? "फ़िल्टर" : "Filters"}
          {activeFilterCount > 0 && (
            <span className="ml-1 rounded-full bg-emerald-600 px-1.5 text-[10px] font-black text-white">{activeFilterCount}</span>
          )}
        </Button>
      </div>

      {filtersOpen && (
        <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">{hi ? "गुणवत्ता ग्रेड" : "Quality grade"}</label>
            <select value={grade} onChange={(e) => setGrade(e.target.value)} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-2.5 text-sm font-bold">
              <option value="all">{hi ? "सभी ग्रेड" : "All grades"}</option>
              <option value="grade a">Grade A</option>
              <option value="grade b">Grade B</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">
              {hi ? `अधिकतम दूरी: ${maxDistance} किमी` : `Max distance: ${maxDistance} km`}
            </label>
            <input type="range" min={5} max={50} step={5} value={maxDistance} onChange={(e) => setMaxDistance(Number(e.target.value))} className="h-11 w-full accent-emerald-600" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">{hi ? "न्यूनतम मात्रा (क्विंटल)" : "Min quantity (qtl)"}</label>
            <input type="range" min={0} max={200} step={10} value={minQty} onChange={(e) => setMinQty(Number(e.target.value))} className="h-11 w-full accent-emerald-600" />
            <p className="-mt-1 text-[11px] font-bold text-emerald-700">{minQty}+ qtl</p>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">{hi ? "क्रमबद्ध करें" : "Sort by"}</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-2.5 text-sm font-bold">
              <option value="savings">{hi ? "सबसे ज्यादा बचत" : "Highest savings"}</option>
              <option value="price">{hi ? "सबसे कम भाव" : "Lowest price"}</option>
              <option value="distance">{hi ? "नजदीकी पहले" : "Nearest first"}</option>
              <option value="qty">{hi ? "बड़ी मात्रा पहले" : "Largest lots first"}</option>
            </select>
          </div>
        </div>
      )}

      <p className="text-xs font-bold text-slate-500">
        {results.length} {hi ? "लॉट मिले" : "lots found"}
        {activeFilterCount > 0 && (
          <button
            onClick={() => { setGrade("all"); setMaxDistance(50); setMinQty(0); setQuery(""); }}
            className="ml-2 inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black text-slate-600 hover:bg-slate-200"
          >
            <X className="size-3" />
            {hi ? "साफ़ करें" : "Clear"}
          </button>
        )}
      </p>

      {results.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-sm font-black text-slate-700">{hi ? "कोई लॉट नहीं मिला" : "No lots match"}</p>
          <p className="mt-1 text-xs text-slate-500">{hi ? "फ़िल्टर ढीले करें या डिमांड बोर्ड पर RFQ डालें।" : "Loosen filters or post an RFQ on the demand board."}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((lot) => (
            <LotCard key={lot.id} lot={lot} />
          ))}
        </div>
      )}
    </div>
  );
}
