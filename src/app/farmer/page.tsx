"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Sprout, 
  Mic, 
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
import { OpenCVScan } from "@/components/shared/OpenCVScan";
import { VoiceModal } from "@/components/shared/VoiceModal";
import { useLanguage } from "@/context/LanguageContext";
import { MOCK_PRODUCE_LISTINGS, type ProduceListing } from "@/lib/mock-data";

export default function FarmerPortalPage() {
  const { t, language } = useLanguage();
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  
  // Listing Form State
  const [cropName, setCropName] = useState("");
  const [variety, setVariety] = useState("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [unit, setUnit] = useState("kg");
  const [floorPrice, setFloorPrice] = useState<number | "">("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListed, setIsListed] = useState(false);
  
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

  const handleAutoList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropName || !quantity || !floorPrice) {
      toast.error("Please fill or voice-populate crop details");
      return;
    }

    const newListing: ProduceListing = {
      id: `prod-${Date.now()}`,
      name: `${cropName} (Fresh Farm Gate)`,
      hindiName: language === "hi" ? `${cropName} (ताजा फसल)` : "ताजा फसल",
      category: cropName.toLowerCase().includes("rice") || cropName.toLowerCase().includes("wheat") || cropName.toLowerCase().includes("चावल") || cropName.toLowerCase().includes("गेहूं") ? "Grains" : "Vegetables",
      farmerName: "Rameshwar Patil",
      farmerPhone: "+91 98221 45019",
      village: "Khed Khurd",
      district: "Pune, Maharashtra",
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
        qualityGrade: { score: 99, detail: "Grade A OpenCV client pre-check passed", grade: "Grade A" },
        quantityFit: { score: 96, detail: "Direct fit for consumer & retail batch" },
        reliability: { score: 99, detail: "4.9★ PM-KISAN Verified Ledger", rating: 4.9 },
      },
      openCvMetrics: {
        blurScore: 94,
        brightnessPct: 88,
        resolution: "1080p Verified",
        status: "Passed Pre-Check - Auto-Listed",
      },
    };

    setListings([newListing, ...listings]);
    setIsListed(true);
    toast.success("Produce Successfully Auto-Listed in Hyperlocal PostGIS Feed!");
  };

  // Preload initial crop for quick evaluation
  useEffect(() => {
    simulateVoiceToForm({
      crop: "Rice",
      variety: "Basmati Grade-A",
      quantity: 50,
      price: 60,
      unit: "kg",
    });
  }, []);

  return (
    <div className="min-h-screen bg-[radial-gradient(at_top_left,#ecfdf5,#ffffff)] bg-grid-subtle">
      <Navbar />

      <main className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Farmer Profile & Ledger Bar */}
        <section className="glass rounded-3xl border border-emerald-200 p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex size-12 sm:size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md shrink-0">
                <Sprout className="size-6 sm:size-7" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-lg sm:text-2xl font-extrabold text-slate-900 leading-tight">
                    {t("farmer_name")}
                  </h1>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                    <ShieldCheck className="size-3.5 text-emerald-600" />
                    {t("pm_kisan_verified")}
                  </span>
                </div>
                <p className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                  <MapPin className="size-3 text-emerald-600 shrink-0" />
                  <span>{t("farmer_location")}</span>
                </p>
              </div>
            </div>

            {/* Live Financial & Trust Telemetry */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2.5 sm:gap-3 text-xs w-full md:w-auto">
              <div className="rounded-2xl border border-emerald-200 bg-white/90 p-3 shadow-xs flex-1 min-w-[120px]">
                <span className="text-[10px] uppercase font-bold text-slate-400">{t("escrow_balance_label")}</span>
                <p className="text-lg font-black text-emerald-700">₹42,500</p>
                <span className="text-[10px] text-emerald-600">{t("locked_in_razorpay")}</span>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-xs flex-1 min-w-[120px]">
                <span className="text-[10px] uppercase font-bold text-slate-400">{t("trust_rating_label")}</span>
                <p className="text-lg font-black text-slate-900">4.9 ★</p>
                <span className="text-[10px] text-slate-500">{t("ontime_dispatches")}</span>
              </div>
              <Button
                onClick={() => setVoiceModalOpen(true)}
                className="col-span-2 sm:col-span-1 w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 shadow-sm h-12 sm:h-14 px-4 sm:px-5 rounded-2xl touch-target"
              >
                <Mic className="size-5 animate-pulse" />
                <div className="text-left leading-tight">
                  <p className="text-xs">{t("vernacular_voice_btn")}</p>
                  <p className="text-[10px] text-emerald-100">{t("vernacular_voice_sub")}</p>
                </div>
              </Button>
            </div>
          </div>
        </section>

        {/* Core Showcase: Voice-to-Form & OpenCV Laser Scanner Grid */}
        <section className="grid gap-8 lg:grid-cols-12">
          {/* Left Column: Voice Intake & Crop Form (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass rounded-3xl border border-emerald-200/90 bg-white/95 p-6 sm:p-7 shadow-sm space-y-6">
              <div className="flex items-start justify-between border-b border-emerald-100 pb-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700">
                    <Sparkles className="size-4" />
                    <span>{t("phase_tag")}</span>
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                    {t("engine_title")}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {t("engine_sub")}
                  </p>
                </div>

                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                  {t("speech_api_badge")}
                </span>
              </div>

              {/* Quick Preset Speech Utterances */}
              <div className="space-y-2 rounded-2xl bg-emerald-50/70 p-3.5 border border-emerald-100">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                  <span className="flex items-center gap-1">
                    <Zap className="size-3.5 text-amber-500" />
                    {t("voice_sim_title")}
                  </span>
                  <span className="text-[10px] text-emerald-700">{t("voice_sim_sub")}</span>
                </div>
                <div className="flex flex-wrap gap-2">
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
                    className="rounded-xl border border-emerald-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-xs hover:bg-emerald-50 transition-colors"
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
                    className="rounded-xl border border-emerald-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-xs hover:bg-emerald-50 transition-colors"
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
                    className="rounded-xl border border-emerald-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-xs hover:bg-emerald-50 transition-colors"
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
                    className="rounded-xl border border-emerald-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-xs hover:bg-emerald-50 transition-colors"
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

                <div className="grid gap-4 sm:grid-cols-3">
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
                      className="font-bold text-slate-900 border-slate-200"
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
                      className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="kg">{t("unit_kg")}</option>
                      <option value="quintal">{t("unit_quintal")}</option>
                      <option value="crates">{t("unit_crates")}</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="price" className="text-xs font-bold text-slate-700">
                      {t("floor_price_label")}
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      value={floorPrice}
                      onChange={(e) => setFloorPrice(e.target.value ? Number(e.target.value) : "")}
                      placeholder="40"
                      required
                      className="font-bold text-emerald-700 border-slate-200"
                    />
                  </div>
                </div>

                {/* Mandi Floor Comparison Insight Box */}
                {floorPrice && (
                  <div className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-3.5 text-xs text-slate-700 space-y-1 animate-in fade-in">
                    <div className="flex items-center justify-between font-bold text-emerald-900">
                      <span className="flex items-center gap-1.5">
                        <TrendingUp className="size-4 text-emerald-600" />
                        {t("mandi_comparison_heading")}
                      </span>
                      <span className="rounded-full bg-emerald-200 px-2 py-0.5 text-[10px] text-emerald-800">
                        {t("mandi_net_badge")}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600">
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
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 rounded-xl gap-2 shadow-md"
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
            <OpenCVScan />

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
                className="glass rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs space-y-3"
              >
                <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-100">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 350px"
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-xs">
                    {item.category}
                  </div>
                  <div className="absolute bottom-2 right-2 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                    {item.matchScore}% {t("top_match")}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                  <div className="flex items-center justify-between text-xs mt-1">
                    <span className="font-extrabold text-emerald-700">
                      ₹{item.farmGatePrice}/{item.unit}
                    </span>
                    <span className="text-slate-500">
                      {t("available")} {item.quantityAvailable} {item.unit}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1 text-emerald-700 font-medium">
                    <CheckCircle2 className="size-3" />
                    {t("opencv_verified")}
                  </span>
                  <span>{t("radius")} {item.distanceKm} km</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Vernacular Voice Modal */}
      <VoiceModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        onExtractedData={(data) => {
          simulateVoiceToForm({
            crop: data.crop,
            variety: data.variety || "Verified Produce",
            quantity: data.quantity,
            price: data.price,
            unit: data.unit,
          });
        }}
      />
    </div>
  );
}
