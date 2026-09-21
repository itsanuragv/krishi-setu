"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Sprout, 
  Scan, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  MapPin, 
  ShieldCheck, 
  Zap, 
  Plus 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Navbar } from "@/components/shared/Navbar";
import { OpenCVScan, type CropGradingData } from "@/components/shared/OpenCVScan";
import { useLanguage } from "@/context/LanguageContext";
import { MOCK_PRODUCE_LISTINGS, type ProduceListing } from "@/lib/mock-data";

export default function FarmerPortalPage() {
  const { t, language } = useLanguage();
  
  // Listing Form State
  const [cropName, setCropName] = useState("");
  const [variety, setVariety] = useState("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [unit, setUnit] = useState("kg");
  const [floorPrice, setFloorPrice] = useState<number | "">("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListed, setIsListed] = useState(false);
  const [scannedGrade, setScannedGrade] = useState<CropGradingData | null>(null);
  
  // Listings list
  const [listings, setListings] = useState<ProduceListing[]>(MOCK_PRODUCE_LISTINGS.slice(0, 3));

  // Voice-to-Form Auto-Typing Simulation
  const simulateVoiceToForm = (targetData: {
    crop: string;
    variety: string;
    quantity: number;
    price: number;
    unit: string;
  }) => {
    setIsTyping(true);
    setIsListed(false);
    setCropName("");
    setVariety("");
    setQuantity("");
    setFloorPrice("");

    let cropIndex = 0;
    const cropStr = targetData.crop;
    const timer1 = setInterval(() => {
      if (cropIndex <= cropStr.length) {
        setCropName(cropStr.slice(0, cropIndex));
        cropIndex++;
      } else {
        clearInterval(timer1);
        setVariety(targetData.variety);
        setQuantity(targetData.quantity);
        setUnit(targetData.unit);
        setFloorPrice(targetData.price);
        setIsTyping(false);
        toast.success(
          `Voice AI Populated: ${targetData.quantity} ${targetData.unit} ${targetData.crop} @ ₹${targetData.price}/${targetData.unit}`
        );
      }
    }, 45);
  };

  const handleScanComplete = (results: {
    blurScore: number;
    brightness: number;
    resolution: string;
    passed: boolean;
    grading?: CropGradingData;
  }) => {
    if (results.grading) {
      setScannedGrade(results.grading);
      // Auto-populate or assist form input with AI detected crop and variety
      setCropName(results.grading.cropName);
      setVariety(results.grading.variety);
      toast.success(
        language === "hi"
          ? `एआई ग्रेडिंग: ${results.grading.cropName} (${results.grading.grade}) फॉर्म में दर्ज हुआ!`
          : `AI Grading: ${results.grading.cropName} (${results.grading.grade}) applied to listing form!`
      );
    }
  };

  const handleAutoList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropName || !quantity || !floorPrice) {
      toast.error("Please fill or voice-populate crop details");
      return;
    }

    const appliedGrade = scannedGrade?.grade || "Grade A";
    const appliedVerif = scannedGrade?.assayerVerificationId || "KS-QC-748291";

    const newListing: ProduceListing = {
      id: `prod-${Date.now()}`,
      name: `${cropName} (Fresh Farm Gate)`,
      hindiName: language === "hi" ? `${cropName} (ताजा फसल)` : "ताजा फसल",
      category: cropName.toLowerCase().includes("rice") || cropName.toLowerCase().includes("wheat") || cropName.toLowerCase().includes("चावल") || cropName.toLowerCase().includes("गेहूं") ? "Grains" : "Vegetables",
      farmerName: "Rameshwar Patil",
      farmerPhone: "+91 98221 45019",
      village: "Sanwer",
      district: "Indore, Madhya Pradesh",
      distanceKm: 5.4,
      quantityAvailable: Number(quantity),
      unit: unit,
      farmGatePrice: Number(floorPrice),
      mandiBenchmarkPrice: Math.round(Number(floorPrice) * 1.45),
      imageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80",
      matchScore: 98,
      breakdown: {
        priceIndex: { score: 98, detail: "31% below APMC Mandi rates" },
        distance: { score: 97, detail: "5.4 km hyperlocal farm radius" },
        qualityGrade: { 
          score: appliedGrade === "Grade A" ? 99 : appliedGrade === "Grade B" ? 93 : 84, 
          detail: `${appliedGrade} Gemini Vision Assayed (${appliedVerif})`, 
          grade: appliedGrade 
        },
        quantityFit: { score: 96, detail: "Direct fit for consumer & retail batch" },
        reliability: { score: 99, detail: "4.9★ PM-KISAN Verified Ledger", rating: 4.9 },
      },
      openCvMetrics: {
        blurScore: 94,
        brightnessPct: 88,
        resolution: "1080p Verified",
        status: `Assayed ${appliedGrade} - Auto-Listed`,
      },
    };

    setListings([newListing, ...listings]);
    setIsListed(true);
    toast.success("Produce Successfully Auto-Listed in Hyperlocal PostGIS Feed!");
  };

  // Preload initial crop or handle incoming voice listing
  useEffect(() => {
    // Check if voice assistant set a pending crop
    const stored = typeof window !== "undefined" ? sessionStorage.getItem("krishi_pending_voice_crop") : null;
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        sessionStorage.removeItem("krishi_pending_voice_crop");
        simulateVoiceToForm({
          crop: parsed.crop || "टमाटर",
          variety: parsed.variety || "Standard Grade-A",
          quantity: parsed.quantityKg || 50,
          price: parsed.pricePerKg || 40,
          unit: parsed.unit || "kg",
        });
        return;
      } catch (err) {
        console.error("Failed to parse voice crop:", err);
      }
    }

    simulateVoiceToForm({
      crop: "Rice",
      variety: "Basmati Grade-A",
      quantity: 50,
      price: 60,
      unit: "kg",
    });
  }, []);

  // Listen for real-time voice listing confirmed events while already on this page
  useEffect(() => {
    const handleVoiceList = (e: CustomEvent<{
      crop: string;
      variety: string;
      quantityKg: number;
      pricePerKg: number;
      unit: string;
    }>) => {
      if (e.detail) {
        simulateVoiceToForm({
          crop: e.detail.crop,
          variety: e.detail.variety || "Standard Grade-A",
          quantity: e.detail.quantityKg,
          price: e.detail.pricePerKg,
          unit: e.detail.unit || "kg",
        });
      }
    };

    window.addEventListener("krishi-voice-list-crop" as any, handleVoiceList as any);
    return () => {
      window.removeEventListener("krishi-voice-list-crop" as any, handleVoiceList as any);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[radial-gradient(at_top_left,#ecfdf5,#ffffff)] bg-grid-subtle">
      <Navbar />

      <main className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Farmer Profile & Ledger Bar */}
        <section className="glass rounded-3xl border border-emerald-200/90 bg-white/95 p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex size-12 sm:size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md shrink-0">
                <Sprout className="size-6 sm:size-7" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-base sm:text-2xl font-extrabold text-slate-900 leading-tight">
                    {t("farmer_name")}
                  </h1>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] sm:text-xs font-bold text-emerald-800 shrink-0">
                    <ShieldCheck className="size-3 sm:size-3.5 text-emerald-600" />
                    {t("pm_kisan_verified")}
                  </span>
                </div>
                <p className="flex items-center gap-1 text-[11px] sm:text-xs text-slate-500 mt-1 truncate">
                  <MapPin className="size-3 text-emerald-600 shrink-0" />
                  <span className="truncate">{t("farmer_location")}</span>
                </p>
              </div>
            </div>

            {/* Live Financial & Trust Telemetry */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-3 text-xs w-full md:w-auto">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-2.5 sm:p-3 shadow-xs flex-1 min-w-[110px]">
                <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 block">{t("escrow_balance_label")}</span>
                <p className="text-base sm:text-lg font-black text-emerald-700">₹42,500</p>
                <span className="text-[9px] sm:text-[10px] text-emerald-600 truncate block">{t("locked_in_razorpay")}</span>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-2.5 sm:p-3 shadow-xs flex-1 min-w-[110px]">
                <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 block">{t("trust_rating_label")}</span>
                <p className="text-base sm:text-lg font-black text-slate-900">4.9 ★</p>
                <span className="text-[9px] sm:text-[10px] text-slate-500 truncate block">{t("ontime_dispatches")}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Core Showcase: Voice-to-Form & OpenCV Laser Scanner Grid */}
        <section className="grid gap-6 sm:gap-8 lg:grid-cols-12">
          {/* Left Column: Voice Intake & Crop Form (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass rounded-3xl border border-emerald-200/90 bg-white/95 p-4 sm:p-6 shadow-sm space-y-5">
              {/* Responsive Header with Non-Squishing Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-emerald-100 pb-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700">
                    <Sparkles className="size-3.5 sm:size-4" />
                    <span>{t("phase_tag")}</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1 leading-tight">
                    {t("engine_title")}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    {t("engine_sub")}
                  </p>
                </div>

                <span className="self-start sm:self-auto rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 shrink-0 whitespace-nowrap shadow-2xs border border-emerald-200">
                  {t("speech_api_badge")}
                </span>
              </div>

              {/* Quick Preset Speech Utterances (Responsive 2x2 Grid) */}
              <div className="space-y-2.5 rounded-2xl bg-emerald-50/70 p-3 sm:p-3.5 border border-emerald-100">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                  <span className="flex items-center gap-1">
                    <Zap className="size-3.5 text-amber-500" />
                    {t("voice_sim_title")}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold">{t("voice_sim_sub")}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      simulateVoiceToForm({
                        crop: "Rice",
                        variety: "Basmati Grade-A",
                        quantity: 60,
                        price: 55,
                        unit: "kg",
                      })
                    }
                    className="rounded-xl border border-emerald-200/80 bg-white px-3 py-2 text-left text-xs font-medium text-slate-700 shadow-2xs hover:bg-emerald-50 hover:border-emerald-300 transition-all active:scale-98 truncate"
                  >
                    {t("sim_rice")}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      simulateVoiceToForm({
                        crop: "Wheat",
                        variety: "Sharbati Golden",
                        quantity: 100,
                        price: 28,
                        unit: "kg",
                      })
                    }
                    className="rounded-xl border border-emerald-200/80 bg-white px-3 py-2 text-left text-xs font-medium text-slate-700 shadow-2xs hover:bg-emerald-50 hover:border-emerald-300 transition-all active:scale-98 truncate"
                  >
                    {t("sim_wheat")}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      simulateVoiceToForm({
                        crop: "Tomatoes",
                        variety: "Vine-Ripened Hybrid",
                        quantity: 50,
                        price: 40,
                        unit: "kg",
                      })
                    }
                    className="rounded-xl border border-emerald-200/80 bg-white px-3 py-2 text-left text-xs font-medium text-slate-700 shadow-2xs hover:bg-emerald-50 hover:border-emerald-300 transition-all active:scale-98 truncate"
                  >
                    {t("sim_tomatoes")}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      simulateVoiceToForm({
                        crop: "Nashik Red Onions",
                        variety: "Cured Export Grade",
                        quantity: 200,
                        price: 24,
                        unit: "kg",
                      })
                    }
                    className="rounded-xl border border-emerald-200/80 bg-white px-3 py-2 text-left text-xs font-medium text-slate-700 shadow-2xs hover:bg-emerald-50 hover:border-emerald-300 transition-all active:scale-98 truncate"
                  >
                    {t("sim_onions")}
                  </button>
                </div>
              </div>

              {/* Form with Real-time Auto-Typing Feedback */}
              <form onSubmit={handleAutoList} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="crop" className="text-xs font-bold text-slate-700">
                      {t("crop_name_label")}
                    </Label>
                    <div className="relative">
                      <Input
                        id="crop"
                        value={cropName}
                        onChange={(e) => setCropName(e.target.value)}
                        placeholder={t("crop_name_placeholder")}
                        required
                        className={`font-semibold text-slate-900 border-slate-200 ${
                          isTyping ? "border-emerald-500 ring-2 ring-emerald-200" : ""
                        }`}
                      />
                      {isTyping && (
                        <span className="absolute right-3 top-2.5 size-2 rounded-full bg-emerald-500 animate-ping" />
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="variety" className="text-xs font-bold text-slate-700">
                      {t("variety_label")}
                    </Label>
                    <Input
                      id="variety"
                      value={variety}
                      onChange={(e) => setVariety(e.target.value)}
                      placeholder={t("variety_placeholder")}
                      className="text-slate-900 border-slate-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="qty" className="text-xs font-bold text-slate-700">
                      {t("quantity_label")}
                    </Label>
                    <Input
                      id="qty"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value ? Number(e.target.value) : "")}
                      placeholder={t("quantity_placeholder")}
                      required
                      className="font-bold text-slate-900 border-slate-200 h-11 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="unit" className="text-xs font-bold text-slate-700">
                      {t("unit_label")}
                    </Label>
                    <select
                      id="unit"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="kg">{t("unit_kg")}</option>
                      <option value="quintal">{t("unit_quintal")}</option>
                      <option value="crates">{t("unit_crates")}</option>
                    </select>
                  </div>

                  <div className="col-span-2 sm:col-span-1 space-y-1.5">
                    <Label htmlFor="price" className="text-xs font-bold text-slate-700">
                      {t("floor_price_label")}
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-xs font-bold text-emerald-700">₹</span>
                      <Input
                        id="price"
                        type="number"
                        value={floorPrice}
                        onChange={(e) => setFloorPrice(e.target.value ? Number(e.target.value) : "")}
                        placeholder="40"
                        required
                        className="pl-7 font-bold text-emerald-700 border-slate-200 h-11 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                {/* Mandi Floor Comparison Insight Box */}
                {floorPrice && (
                  <div className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-3 sm:p-3.5 text-xs text-slate-700 space-y-1 animate-in fade-in">
                    <div className="flex flex-wrap items-center justify-between gap-1.5 font-bold text-emerald-900">
                      <span className="flex items-center gap-1.5">
                        <TrendingUp className="size-4 text-emerald-600 shrink-0" />
                        <span>{t("mandi_comparison_heading")}</span>
                      </span>
                      <span className="rounded-full bg-emerald-200 px-2 py-0.5 text-[10px] text-emerald-800 shrink-0">
                        {t("mandi_net_badge")}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {language === "hi" ? (
                        <span>
                          आपका न्यूनतम भाव <strong>₹{floorPrice}/{unit}</strong> है। पारंपरिक मंडी एजेंट कटौती के बाद ₹31/{unit} देते हैं। आपको अतिरिक्त <strong>₹{Math.round(Number(floorPrice) - 31)}/{unit}</strong> सीधे बैंक खाते में मिलते हैं!
                        </span>
                      ) : (
                        <span>
                          Your floor price is <strong>₹{floorPrice}/{unit}</strong>. Traditional Mandi agents offer ₹31/{unit} after deductions. You gain an extra <strong>₹{Math.round(Number(floorPrice) - 31)}/{unit}</strong> straight to your UPI account!
                        </span>
                      )}
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isTyping}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 rounded-xl gap-2 shadow-md active:scale-98 transition-all"
                >
                  <Plus className="size-4" />
                  <span>{t("list_harvest_btn")}</span>
                </Button>
              </form>

              {isListed && (
                <div className="rounded-2xl border border-emerald-400 bg-emerald-100/70 p-3 text-xs text-emerald-900 flex items-center justify-between animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                    <span>{t("broadcast_success")}</span>
                  </div>
                  <Button asChild size="sm" variant="outline" className="h-7 text-xs border-emerald-400 bg-white">
                    <Link href="/consumer">{t("view_consumer_feed")}</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: OpenCV Laser Scanner (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <OpenCVScan onScanComplete={handleScanComplete} />

            {/* Edge Computing Architecture Callout Box */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Scan className="size-4 text-emerald-600" />
                <span>{t("tech_advantage_title")}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t("tech_advantage_desc")}
              </p>
              <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-500">
                <span>{t("network_overhead")}</span>
                <span className="font-semibold text-emerald-700">{t("zero_gpu_bill")}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Live Active Listings from Farmer's Field */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {t("active_listings_title")}
              </h3>
              <p className="text-xs text-slate-500">
                {t("active_listings_sub")}
              </p>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
              {listings.length} {t("lots_active")}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((item) => (
              <div
                key={item.id}
                className="group rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-4 shadow-xs hover:shadow-md transition-all space-y-3"
              >
                <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-950">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 350px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 rounded-full bg-black/70 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs border border-white/20">
                    {item.category}
                  </div>
                  <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-emerald-600/95 px-2.5 py-0.5 text-[10px] font-extrabold text-white shadow-xs backdrop-blur-xs">
                    <Sparkles className="size-2.5 text-amber-300" />
                    <span>{item.matchScore}% {t("top_match")}</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-extrabold text-slate-900 text-sm truncate">{item.name}</h4>
                    <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                      {item.breakdown?.qualityGrade?.grade || "Grade A"}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between text-xs mt-1.5">
                    <div>
                      <span className="text-base font-black text-emerald-700">
                        ₹{item.farmGatePrice}
                      </span>
                      <span className="text-[11px] font-medium text-slate-500">/{item.unit}</span>
                    </div>
                    <span className="text-[11px] font-medium text-slate-500">
                      {t("available")} <strong className="text-slate-700">{item.quantityAvailable} {item.unit}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1 text-emerald-700 font-semibold truncate">
                    <CheckCircle2 className="size-3 shrink-0" />
                    <span className="truncate">{t("opencv_verified")}</span>
                  </span>
                  <span className="font-medium shrink-0 flex items-center gap-0.5">
                    <MapPin className="size-3 text-slate-400" />
                    <span>{item.distanceKm} km</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

    </div>
  );
}
