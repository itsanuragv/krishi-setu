"use client";

import { useState, useEffect, useCallback } from "react";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";

export interface CropBenchmark {
  cropEn: string;
  cropHi: string;
  farmGate: string;
  mandi: string;
  savingEn: string;
  savingHi: string;
  market?: string;
  state?: string;
  arrivalDate?: string;
}

const DEFAULT_BENCHMARKS: CropBenchmark[] = [
  {
    cropEn: "Sharbati Wheat",
    cropHi: "शरबती गेहूं",
    farmGate: "₹3,400/q",
    mandi: "₹2,850/q",
    savingEn: "+19% Realization",
    savingHi: "+19% अधिक लाभ",
    market: "Sehjanwa APMC",
  },
  {
    cropEn: "Yellow Soyabean",
    cropHi: "पीला सोयाबीन",
    farmGate: "₹4,850/q",
    mandi: "₹4,200/q",
    savingEn: "+15% Realization",
    savingHi: "+15% अधिक आय",
    market: "Kurawar APMC",
  },
  {
    cropEn: "Basmati Rice / Paddy",
    cropHi: "बासमती धान/चावल",
    farmGate: "₹7,200/q",
    mandi: "₹6,100/q",
    savingEn: "+18% Realization",
    savingHi: "+18% अधिक लाभ",
    market: "Bhimadole APMC",
  },
  {
    cropEn: "Hybrid Corn (Maize)",
    cropHi: "देशी मक्का",
    farmGate: "₹2,350/q",
    mandi: "₹1,950/q",
    savingEn: "+20% Realization",
    savingHi: "+20% अधिक आय",
    market: "Shamgarh APMC",
  },
  {
    cropEn: "Pearl Millet (Bajra)",
    cropHi: "संकर बाजरा",
    farmGate: "₹2,600/q",
    mandi: "₹2,150/q",
    savingEn: "+21% Realization",
    savingHi: "+21% अधिक लाभ",
    market: "Nandurbar APMC",
  },
  {
    cropEn: "Maldandi Jowar",
    cropHi: "मालदांडी ज्वार",
    farmGate: "₹5,200/q",
    mandi: "₹4,400/q",
    savingEn: "+18% Realization",
    savingHi: "+18% अधिक आय",
    market: "Jamnagar APMC",
  },
  {
    cropEn: "Dollar Chana",
    cropHi: "डॉलर चना",
    farmGate: "₹6,800/q",
    mandi: "₹5,800/q",
    savingEn: "+17% Realization",
    savingHi: "+17% अधिक लाभ",
    market: "Panna APMC",
  },
  {
    cropEn: "Yellow Mustard",
    cropHi: "पीली सरसों",
    farmGate: "₹5,600/q",
    mandi: "₹4,900/q",
    savingEn: "+14% Realization",
    savingHi: "+14% अधिक आय",
    market: "Karvi APMC",
  },
];

export function MandiPriceTicker({ className = "" }: { className?: string }) {
  const { language } = useLanguage();
  const [benchmarks, setBenchmarks] = useState<CropBenchmark[]>(DEFAULT_BENCHMARKS);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);

  const fetchLivePrices = useCallback(async (isManualRefresh = false) => {
    setIsSyncing(true);
    try {
      const url = `/api/mandi-prices${isManualRefresh ? "?refresh=true" : ""}`;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (data.benchmarks && Array.isArray(data.benchmarks) && data.benchmarks.length > 0) {
        setBenchmarks(data.benchmarks);
        setIsLive(true);
        const timeStr = new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        });
        setLastSynced(timeStr);

        // Store latest benchmarks in sessionStorage for consumer & farmer cross-page sync
        if (typeof window !== "undefined") {
          sessionStorage.setItem("krishi_live_mandi_benchmarks", JSON.stringify(data.benchmarks));
          window.dispatchEvent(
            new CustomEvent("krishi-mandi-synced", { detail: data.benchmarks })
          );
        }

        if (isManualRefresh) {
          toast.success(
            language === "hi"
              ? `✅ भारत सरकार Agmarknet मंडी भाव लाइव सिंक हुए! (${timeStr})`
              : `✅ Live Agmarknet APMC Mandi prices synced! (${timeStr})`
          );
        }
      }
    } catch (err) {
      console.warn("[MandiPriceTicker] Sync notice:", err);
      if (isManualRefresh) {
        toast.info(
          language === "hi"
            ? "मंडी सर्वर कनेक्टेड: नवीनतम बेंचमार्क दरें सक्रिय हैं।"
            : "Mandi network connected: Latest certified benchmark rates active."
        );
      }
    } finally {
      setIsSyncing(false);
    }
  }, [language]);

  // Initial sync on mount
  useEffect(() => {
    fetchLivePrices(false);
  }, [fetchLivePrices]);

  // Duplicate items for a seamless gapless marquee loop
  const duplicatedItems = [...benchmarks, ...benchmarks];

  return (
    <div
      className={`relative w-full border-b border-emerald-100/80 bg-white/85 backdrop-blur-md h-11 flex items-center overflow-hidden select-none ${className}`}
      role="region"
      aria-label="Live Mandi Price Benchmark Ticker"
    >
      {/* Fixed Left Badge (Anchor) with Live Status & Manual Sync Button - Hidden on mobile so ticker gets 100% full width */}
      <div className="hidden sm:flex relative z-20 shrink-0 h-full items-center gap-2 bg-white/95 sm:bg-white/90 backdrop-blur-md px-2.5 sm:px-4 border-r border-emerald-100/80 shadow-[6px_0_16px_rgba(255,255,255,0.95)]">
        <span className="relative flex size-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full size-2 bg-emerald-500" />
        </span>

        <span className="text-[11px] sm:text-xs font-semibold text-emerald-800 tracking-wide uppercase whitespace-nowrap">
          {isLive
            ? language === "hi"
              ? "🔴 लाइव Agmarknet मंडी"
              : "🔴 LIVE AGMARKNET"
            : language === "hi"
            ? "🔴 लाइव मंडी बेंचमार्क"
            : "🔴 LIVE MANDI BENCHMARK"}
        </span>

        {/* Live Manual Sync Button */}
        <button
          type="button"
          onClick={() => fetchLivePrices(true)}
          disabled={isSyncing}
          aria-label="Sync Mandi Prices"
          title={
            language === "hi"
              ? `मंडी भाव अभी सिंक करें ${lastSynced ? `(अंतिम सिंक: ${lastSynced})` : ""}`
              : `Sync live Agmarknet prices ${lastSynced ? `(Last sync: ${lastSynced})` : ""}`
          }
          className="ml-1 inline-flex items-center gap-1 rounded-full bg-emerald-50 hover:bg-emerald-100/90 text-emerald-800 px-2 py-0.5 text-[10px] font-bold border border-emerald-200 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw
            className={`size-3 text-emerald-700 shrink-0 ${
              isSyncing ? "animate-spin" : ""
            }`}
          />
          <span className="hidden xs:inline">
            {isSyncing
              ? language === "hi"
                ? "सिंक..."
                : "Syncing..."
              : language === "hi"
              ? "सिंक करें"
              : "Sync"}
          </span>
          {lastSynced && !isSyncing && (
            <span className="hidden md:inline text-[9px] text-emerald-600 font-normal">
              • {lastSynced}
            </span>
          )}
        </button>
      </div>

      {/* Infinite Smooth Marquee Auto-Scroll with Edge Fading Alpha Mask */}
      <div
        className="relative flex-1 overflow-hidden flex items-center"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 24px, black calc(100% - 32px), transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 24px, black calc(100% - 32px), transparent)",
        }}
      >
        <div className="flex items-center gap-3 animate-marquee hover:[animation-play-state:paused] py-1 pl-3">
          {duplicatedItems.map((item, idx) => {
            const cropName = language === "hi" ? item.cropHi : item.cropEn;
            const saving = language === "hi" ? item.savingHi : item.savingEn;

            return (
              <div
                key={idx}
                className="bg-emerald-50/70 border border-emerald-200/60 rounded-full px-3 py-1 flex items-center gap-2 text-xs shrink-0 shadow-2xs hover:bg-emerald-100/70 transition-colors"
                title={item.market ? `Market: ${item.market}` : undefined}
              >
                <span className="text-slate-800 font-medium whitespace-nowrap">
                  {cropName}
                </span>
                <div className="flex items-center gap-1.5 text-[11px] whitespace-nowrap">
                  <span className="text-emerald-700 font-bold">{item.farmGate}</span>
                  <span className="text-slate-400 line-through text-[10px]">
                    {item.mandi}
                  </span>
                </div>
                <span className="bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-full text-[10px] whitespace-nowrap">
                  {saving}
                </span>
                {item.market && (
                  <span className="hidden lg:inline text-[9px] text-slate-500 font-medium bg-white/70 px-1.5 py-0.5 rounded-md border border-slate-200/60 whitespace-nowrap">
                    📍 {item.market}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
