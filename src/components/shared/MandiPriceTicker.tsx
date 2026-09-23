"use client";

import { useLanguage } from "@/context/LanguageContext";

interface CropBenchmark {
  cropEn: string;
  cropHi: string;
  farmGate: string;
  mandi: string;
  savingEn: string;
  savingHi: string;
}

const CROP_BENCHMARKS: CropBenchmark[] = [
  {
    cropEn: "Sharbati Wheat",
    cropHi: "शरबती गेहूं",
    farmGate: "₹3,400/q",
    mandi: "₹2,850/q",
    savingEn: "+19% Realization",
    savingHi: "+19% अधिक लाभ",
  },
  {
    cropEn: "Yellow Soyabean",
    cropHi: "पीला सोयाबीन",
    farmGate: "₹4,850/q",
    mandi: "₹4,200/q",
    savingEn: "+15% Realization",
    savingHi: "+15% अधिक आय",
  },
  {
    cropEn: "Basmati Rice",
    cropHi: "बासमती चावल",
    farmGate: "₹7,200/q",
    mandi: "₹6,100/q",
    savingEn: "+18% Realization",
    savingHi: "+18% अधिक लाभ",
  },
  {
    cropEn: "Hybrid Corn (Maize)",
    cropHi: "देशी मक्का",
    farmGate: "₹2,350/q",
    mandi: "₹1,950/q",
    savingEn: "+20% Realization",
    savingHi: "+20% अधिक आय",
  },
  {
    cropEn: "Pearl Millet (Bajra)",
    cropHi: "संकर बाजरा",
    farmGate: "₹2,600/q",
    mandi: "₹2,150/q",
    savingEn: "+21% Realization",
    savingHi: "+21% अधिक लाभ",
  },
  {
    cropEn: "Maldandi Jowar",
    cropHi: "मालदांडी ज्वार",
    farmGate: "₹5,200/q",
    mandi: "₹4,400/q",
    savingEn: "+18% Realization",
    savingHi: "+18% अधिक आय",
  },
  {
    cropEn: "Dollar Chana",
    cropHi: "डॉलर चना",
    farmGate: "₹6,800/q",
    mandi: "₹5,800/q",
    savingEn: "+17% Realization",
    savingHi: "+17% अधिक लाभ",
  },
  {
    cropEn: "Yellow Mustard",
    cropHi: "पीली सरसों",
    farmGate: "₹5,600/q",
    mandi: "₹4,900/q",
    savingEn: "+14% Realization",
    savingHi: "+14% अधिक आय",
  },
];

export function MandiPriceTicker({ className = "" }: { className?: string }) {
  const { language } = useLanguage();

  // Duplicate the array for a seamless, gapless 360-degree marquee loop
  const duplicatedItems = [...CROP_BENCHMARKS, ...CROP_BENCHMARKS];

  return (
    <div
      className={`relative w-full border-b border-emerald-100/80 bg-white/80 backdrop-blur-md h-11 flex items-center overflow-hidden select-none ${className}`}
      role="region"
      aria-label="Live Mandi Price Benchmark Ticker"
    >
      {/* Fixed Left Badge (Anchor) with Solid/Blurred Backdrop so scrolling cards cleanly pass underneath */}
      <div className="relative z-20 shrink-0 h-full flex items-center gap-2 bg-white/95 sm:bg-white/90 backdrop-blur-md px-3 sm:px-4 border-r border-emerald-100/80 shadow-[6px_0_16px_rgba(255,255,255,0.95)]">
        <span className="relative flex size-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full size-2 bg-emerald-500" />
        </span>
        <span className="text-[11px] sm:text-xs font-semibold text-emerald-800 tracking-wide uppercase whitespace-nowrap">
          {language === "hi" ? "🔴 लाइव मंडी बेंचमार्क" : "🔴 LIVE MANDI BENCHMARK"}
        </span>
      </div>

      {/* Infinite Smooth Marquee Auto-Scroll with Edge Fading Alpha Mask */}
      <div 
        className="relative flex-1 overflow-hidden flex items-center"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 24px, black calc(100% - 32px), transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 24px, black calc(100% - 32px), transparent)",
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
              >
                <span className="text-slate-800 font-medium whitespace-nowrap">
                  {cropName}
                </span>
                <div className="flex items-center gap-1.5 text-[11px] whitespace-nowrap">
                  <span className="text-emerald-700 font-bold">{item.farmGate}</span>
                  <span className="text-slate-400 line-through text-[10px]">{item.mandi}</span>
                </div>
                <span className="bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-full text-[10px] whitespace-nowrap">
                  {saving}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
