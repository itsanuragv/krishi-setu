"use client";

import { useState, useEffect, useRef } from "react";
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
  Plus,
  Camera,
  Layers,
  Scale,
  Calendar,
  IndianRupee,
  Award,
  ChevronRight,
  Warehouse,
  ShoppingBag,
  ExternalLink,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Navbar } from "@/components/shared/Navbar";
import { OpenCVScan, type CropGradingData } from "@/components/shared/OpenCVScan";
import { useLanguage } from "@/context/LanguageContext";
import { MOCK_PRODUCE_LISTINGS, type ProduceListing } from "@/lib/mock-data";

// Crop quick presets organized by category
const CROP_PRESETS = [
  { name: "टमाटर (Tomatoes)", category: "Vegetables", variety: "Desi Hybrid (Abhinav)", defaultPrice: 40, unit: "kg", defaultQty: 50, hint: "Tomato" },
  { name: "प्याज (Onion)", category: "Vegetables", variety: "Nashik Red Garwa", defaultPrice: 28, unit: "kg", defaultQty: 100, hint: "Onion" },
  { name: "आलू (Potatoes)", category: "Vegetables", variety: "Kufri Jyoti / Pukhraj", defaultPrice: 22, unit: "kg", defaultQty: 150, hint: "Potato" },
  { name: "गेहूं (Wheat)", category: "Grains", variety: "MP Sharbati Golden", defaultPrice: 28, unit: "kg", defaultQty: 200, hint: "Wheat" },
  { name: "बासमती चावल (Rice)", category: "Grains", variety: "Pusa 1121 Long Grain", defaultPrice: 65, unit: "kg", defaultQty: 100, hint: "Rice" },
  { name: "हरी मिर्च (Chillies)", category: "Vegetables", variety: "G-4 Spicy Hybrid", defaultPrice: 45, unit: "kg", defaultQty: 30, hint: "Chilli" },
  { name: "शिमला मिर्च (Capsicum)", category: "Vegetables", variety: "Indra F1 Hybrid", defaultPrice: 50, unit: "kg", defaultQty: 40, hint: "Capsicum" },
  { name: "देशी लहसुन (Garlic)", category: "Vegetables", variety: "G-282 Safed", defaultPrice: 110, unit: "kg", defaultQty: 40, hint: "Garlic" },
];

export default function FarmerPortalPage() {
  const { t, language } = useLanguage();
  
  // Listing Form State
  const [cropName, setCropName] = useState("टमाटर (Tomatoes)");
  const [cropCategory, setCropCategory] = useState<"Vegetables" | "Fruits" | "Grains" | "Organic">("Vegetables");
  const [variety, setVariety] = useState("Desi Hybrid (Abhinav)");
  const [quantity, setQuantity] = useState<number | "">(50);
  const [unit, setUnit] = useState("kg");
  const [floorPrice, setFloorPrice] = useState<number | "">(40);
  const [harvestDate, setHarvestDate] = useState(new Date().toISOString().slice(0, 10));
  const [isTyping, setIsTyping] = useState(false);
  const [isListed, setIsListed] = useState(false);

  // Attached Photo & AI Quality Grade
  const [attachedPhoto, setAttachedPhoto] = useState<string>(
    "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80"
  );
  const [scannedGrade, setScannedGrade] = useState<CropGradingData | null>({
    cropName: "टमाटर (Tomatoes)",
    variety: "Desi Hybrid (Abhinav)",
    grade: "Grade A",
    gradeReason: "Uniform crimson pigmentation (>85%), firm calyx, zero rot.",
    ripenessPct: 88,
    ripenessStage: "Firm Breaker Ripe",
    defectPct: 4,
    defectNotes: "Clean surface, <5% superficial solar blush.",
    shelfLifeDays: 6,
    marketFit: "Direct Consumer Kitchens & Quick Commerce Hubs",
    recommendedPriceDeltaPct: 14,
    feedbackEn: "Grade-A table quality. Qualifies for +14% farmgate premium.",
    feedbackHi: "ग्रेड-ए टेबल क्वालिटी। 14% तक बेहतर मंडी भाव संभव।",
    assayerVerificationId: "KS-QC-748291",
  });
  
  // Active listings list
  const [listings, setListings] = useState<ProduceListing[]>(MOCK_PRODUCE_LISTINGS.slice(0, 3));
  const activeListingsRef = useRef<HTMLDivElement | null>(null);

  // Handle Preset Click
  const handlePresetSelect = (preset: typeof CROP_PRESETS[0]) => {
    setCropName(preset.name);
    setCropCategory(preset.category as "Vegetables" | "Grains");
    setVariety(preset.variety);
    setQuantity(preset.defaultQty);
    setUnit(preset.unit);
    setFloorPrice(preset.defaultPrice);
    toast.success(`चुना गया: ${preset.name}`);
  };

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
    }, 40);
  };

  // Callback when OpenCV scan completes or user clicks "Apply to Form"
  const handleApplyScanResult = (gradingData: CropGradingData, photoUrl: string) => {
    setScannedGrade(gradingData);
    setAttachedPhoto(photoUrl);
    setCropName(gradingData.cropName);
    if (gradingData.variety) {
      setVariety(gradingData.variety);
    }
    toast.success(
      language === "hi"
        ? `एआई ग्रेडिंग लागू: ${gradingData.cropName} (${gradingData.grade}) फॉर्म में सेट हो गया!`
        : `AI Grading applied: ${gradingData.cropName} (${gradingData.grade}) synced to form!`
    );
  };

  // Handle Listing Submission
  const handlePublishListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropName || !quantity || !floorPrice) {
      toast.error("कृपया फसल का नाम, मात्रा और भाव भरें");
      return;
    }

    const appliedGrade = scannedGrade?.grade || "Grade A";
    const appliedVerif = scannedGrade?.assayerVerificationId || `KS-QC-${Math.floor(100000 + Math.random() * 900000)}`;

    const newListing: ProduceListing = {
      id: `prod-${Date.now()}`,
      name: `${cropName} (Fresh Farm Gate)`,
      hindiName: language === "hi" ? `${cropName} (ताजा फसल)` : `${cropName} (Farm Gate)`,
      category: cropCategory,
      farmerName: "रामेश्वर पाटिल (Rameshwar Patil)",
      farmerPhone: "+91 98221 45019",
      village: "Sanwer (सांवेर)",
      district: "Indore, Madhya Pradesh",
      distanceKm: 4.8,
      quantityAvailable: Number(quantity),
      unit: unit,
      farmGatePrice: Number(floorPrice),
      mandiBenchmarkPrice: Math.round(Number(floorPrice) * 1.38),
      imageUrl: attachedPhoto,
      matchScore: 99,
      breakdown: {
        priceIndex: { score: 98, detail: "32% below traditional Mandi markup" },
        distance: { score: 99, detail: "4.8 km hyperlocal farm radius" },
        qualityGrade: { 
          score: appliedGrade === "Grade A" ? 99 : appliedGrade === "Grade B" ? 92 : 82, 
          detail: `${appliedGrade} Gemini Vision Assayed (${appliedVerif})`, 
          grade: appliedGrade 
        },
        quantityFit: { score: 96, detail: "Direct match for verified retail buyer batch" },
        reliability: { score: 99, detail: "4.9★ PM-KISAN Verified Ledger", rating: 4.9 },
      },
      openCvMetrics: {
        blurScore: 95,
        brightnessPct: 90,
        resolution: "1080p Verified",
        status: `Assayed ${appliedGrade} - Auto-Listed`,
      },
    };

    setListings([newListing, ...listings]);
    setIsListed(true);
    toast.success("🎉 बधाई! आपकी फसल कृषि सेतु डायरेक्ट बाज़ार में सफलतापूर्वक लिस्ट हो गई!");

    // Smooth scroll down to active listings
    setTimeout(() => {
      activeListingsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  // Preload initial crop or handle incoming voice listing
  useEffect(() => {
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
      } catch (err) {
        console.error("Failed to parse voice crop:", err);
      }
    }
  }, []);

  // Listen for real-time voice listing confirmed events
  useEffect(() => {
    const handleVoiceList = (e: Event) => {
      const customEvent = e as CustomEvent<{
        crop: string;
        variety: string;
        quantityKg: number;
        pricePerKg: number;
        unit: string;
      }>;
      if (customEvent.detail) {
        simulateVoiceToForm({
          crop: customEvent.detail.crop,
          variety: customEvent.detail.variety || "Standard Grade-A",
          quantity: customEvent.detail.quantityKg,
          price: customEvent.detail.pricePerKg,
          unit: customEvent.detail.unit || "kg",
        });
      }
    };

    window.addEventListener("krishi-voice-list-crop", handleVoiceList);
    return () => {
      window.removeEventListener("krishi-voice-list-crop", handleVoiceList);
    };
  }, []);

  // Calculate Mandi Price comparison delta
  const priceNum = Number(floorPrice) || 0;
  const traditionalMandiNet = Math.round(priceNum * 0.74); // After commission, wastage, weigh fees
  const extraGainPerUnit = Math.max(0, priceNum - traditionalMandiNet);
  const totalExtraProfit = Math.round(extraGainPerUnit * (Number(quantity) || 0));

  return (
    <div className="min-h-screen bg-[radial-gradient(at_top_left,#ecfdf5,#ffffff)] bg-grid-subtle">
      <Navbar />

      <main className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        
        {/* 1. Farmer Profile & Verified Ledger Bar */}
        <section className="rounded-3xl border border-emerald-200/90 bg-white/95 p-4 sm:p-6 shadow-sm backdrop-blur-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 sm:gap-4">
              <div className="flex size-14 sm:size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 text-white shadow-md shrink-0">
                <Sprout className="size-7 sm:size-8" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-lg sm:text-2xl font-black text-slate-900 leading-tight">
                    रामेश्वर पाटिल (Rameshwar Patil)
                  </h1>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 text-[11px] sm:text-xs font-bold text-emerald-800 shrink-0">
                    <ShieldCheck className="size-3.5 text-emerald-600" />
                    PM-KISAN सत्यापित • PMK-IND-84920
                  </span>
                </div>
                <p className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 truncate">
                  <MapPin className="size-3.5 text-emerald-600 shrink-0" />
                  <span>सांवेर क्लस्टर, इंदौर जिला, मध्य प्रदेश (Sanwer, Indore, MP)</span>
                </p>
              </div>
            </div>

            {/* Financial Telemetry Pills */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-3 text-xs w-full md:w-auto">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-3 shadow-2xs flex-1 min-w-[120px]">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">सुरक्षित एस्क्रो बैलेंस</span>
                <p className="text-base sm:text-xl font-black text-emerald-700">₹42,500</p>
                <span className="text-[10px] text-emerald-600 font-semibold block">रेज़रपे एस्क्रो में सुरक्षित</span>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 shadow-2xs flex-1 min-w-[120px]">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">विश्वसनीयता रेटिंग</span>
                <p className="text-base sm:text-xl font-black text-slate-900">4.9 ★</p>
                <span className="text-[10px] text-slate-500 font-semibold block">99.4% समय पर प्रेषण</span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Main Two-Column Listing Studio */}
        <section className="grid gap-6 lg:grid-cols-12 items-start">
          
          {/* Left Column: Smart Crop Listing Studio (7 Columns) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-3xl border border-emerald-200/90 bg-white/95 p-5 sm:p-7 shadow-sm backdrop-blur-md space-y-6">
              
              {/* Studio Header */}
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
                    <Sparkles className="size-4" />
                    <span>फसल लिस्टिंग स्टूडियो (Produce Intake Studio)</span>
                  </div>
                  <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 border border-emerald-200">
                    0% आढ़ती कमीशन
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  अपनी ताज़ा फसल सीधे खरीदार को बेचें
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  फार्म-गेट पर सीधी बिक्री, तुरंत यूपीआई भुगतान और डिजिटल वजन सत्यापन
                </p>
              </div>

              {/* Quick Preset Crop Selector */}
              <div className="space-y-2 rounded-2xl bg-emerald-50/50 p-3.5 border border-emerald-100">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span className="flex items-center gap-1.5 text-emerald-900">
                    <Zap className="size-4 text-amber-500" />
                    <span>त्वरित फसल चुनें (Quick Pick Crop):</span>
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold">1-टैप ऑटोफिल</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1">
                  {CROP_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handlePresetSelect(preset)}
                      className={`rounded-xl border px-2.5 py-2 text-left text-xs font-semibold transition-all truncate ${
                        cropName.includes(preset.name.split(" ")[0])
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                          : "bg-white text-slate-700 border-emerald-200/80 hover:bg-emerald-50 hover:border-emerald-300"
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comprehensive Harvest Listing Form */}
              <form onSubmit={handlePublishListing} className="space-y-5">
                
                {/* 1. Crop Name & Variety */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="crop" className="text-xs font-bold text-slate-800">
                      फसल का नाम (Crop Name) <span className="text-rose-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="crop"
                        value={cropName}
                        onChange={(e) => setCropName(e.target.value)}
                        placeholder="जैसे: टमाटर, प्याज, आलू, गेहूं..."
                        required
                        className={`font-bold text-slate-900 h-11 rounded-xl ${
                          isTyping ? "border-emerald-500 ring-2 ring-emerald-200" : ""
                        }`}
                      />
                      {isTyping && (
                        <span className="absolute right-3 top-3 size-2 rounded-full bg-emerald-500 animate-ping" />
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="variety" className="text-xs font-bold text-slate-800">
                      किस्म / प्रजाति (Variety)
                    </Label>
                    <Input
                      id="variety"
                      value={variety}
                      onChange={(e) => setVariety(e.target.value)}
                      placeholder="जैसे: देसी हाइब्रिड, शरबती, कुफरी ज्योति"
                      className="text-slate-900 font-semibold h-11 rounded-xl"
                    />
                  </div>
                </div>

                {/* 2. Quantity, Unit & Bag Packaging */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="qty" className="text-xs font-bold text-slate-800">
                      उपलब्ध मात्रा (Quantity) <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="qty"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value ? Number(e.target.value) : "")}
                      placeholder="50"
                      min={1}
                      required
                      className="font-bold text-slate-900 h-11 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="unit" className="text-xs font-bold text-slate-800">
                      इकाई (Unit)
                    </Label>
                    <select
                      id="unit"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="kg">किलोग्राम (kg)</option>
                      <option value="quintal">क्विंटल (Quintal ~100kg)</option>
                      <option value="crates">क्रेट्स (Crates ~25kg)</option>
                    </select>
                  </div>

                  <div className="col-span-2 sm:col-span-1 space-y-1.5">
                    <Label htmlFor="price" className="text-xs font-bold text-slate-800">
                      फार्म-गेट भाव (₹ / {unit}) <span className="text-rose-500">*</span>
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-xs font-black text-emerald-700">₹</span>
                      <Input
                        id="price"
                        type="number"
                        value={floorPrice}
                        onChange={(e) => setFloorPrice(e.target.value ? Number(e.target.value) : "")}
                        placeholder="40"
                        min={1}
                        required
                        className="pl-7 font-black text-emerald-700 text-base h-11 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Interactive Mandi vs Direct Farm-Gate Comparison */}
                {priceNum > 0 && (
                  <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-teal-50/60 to-white p-4 text-xs text-slate-800 space-y-2 shadow-xs animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-black text-emerald-950">
                        <TrendingUp className="size-4 text-emerald-600" />
                        <span>पारंपरिक मंडी बनाम कृषि सेतु बचत कैलकुलेटर:</span>
                      </span>
                      <span className="rounded-full bg-emerald-600 text-white font-bold px-2.5 py-0.5 text-[10px]">
                        +{Math.round((extraGainPerUnit / (traditionalMandiNet || 1)) * 100)}% अतिरिक्त लाभ
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-emerald-200/60">
                      <div className="bg-white/90 p-2.5 rounded-xl border border-slate-200">
                        <span className="text-slate-500 block">पारंपरिक मंडी एजेंट कटौती बाद:</span>
                        <p className="text-sm font-bold text-slate-700">₹{traditionalMandiNet} /{unit}</p>
                        <span className="text-[10px] text-rose-500 font-medium">(आढ़त, तुलाई, ढुलाई नुकसान)</span>
                      </div>
                      <div className="bg-emerald-100/70 p-2.5 rounded-xl border border-emerald-300">
                        <span className="text-emerald-800 font-semibold block">कृषि सेतु डायरेक्ट फार्म-गेट:</span>
                        <p className="text-sm font-black text-emerald-800">₹{priceNum} /{unit}</p>
                        <span className="text-[10px] text-emerald-700 font-bold">100% बैंक/यूपीआई में भुगतान</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-emerald-950 font-bold">
                      💡 इस {quantity || 0} {unit} लॉट पर आपको सीधे <span className="underline font-black text-emerald-800">₹{totalExtraProfit.toLocaleString("en-IN")} अतिरिक्त शुद्ध मुनाफा</span> मिलेगा!
                    </p>
                  </div>
                )}

                {/* 4. Attached Quality Grade & Photo Status Card */}
                <div className="rounded-2xl border border-slate-200 p-3.5 bg-slate-50 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative size-12 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-300">
                      <Image
                        src={attachedPhoto}
                        alt="Crop Thumbnail"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-900 truncate">
                          {scannedGrade?.cropName || cropName}
                        </span>
                        <span className="rounded-full bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.2">
                          {scannedGrade?.grade || "Grade A"}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">
                        सत्यापन कोड: {scannedGrade?.assayerVerificationId || "KS-QC-748291"}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                      <CheckCircle2 className="size-3.5 text-emerald-600" />
                      <span>QC सत्यापित</span>
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isTyping}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-sm h-12 rounded-2xl gap-2 shadow-lg shadow-emerald-800/20 active:scale-98 transition-all"
                >
                  <Plus className="size-5" />
                  <span>🌾 फसल तुरंत लिस्ट करें (Publish Live Listing)</span>
                </Button>
              </form>

              {/* Success Banner */}
              {isListed && (
                <div className="rounded-2xl border border-emerald-400 bg-emerald-100/90 p-3.5 text-xs text-emerald-950 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
                    <span className="font-bold">फसल लाइव हो चुकी है! खरीदार अब सीधे आपसे संपर्क कर सकते हैं।</span>
                  </div>
                  <Button asChild size="sm" className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs shrink-0">
                    <Link href="/consumer">बाज़ार में देखें</Link>
                  </Button>
                </div>
              )}

            </div>
          </div>

          {/* Right Column: AI Laser Scanner & Quality Lab (5 Columns) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* OpenCV Scanner Component */}
            <OpenCVScan 
              initialImage={attachedPhoto}
              cropHint={cropName}
              onApplyToForm={handleApplyScanResult}
            />

            {/* Quality Assurance Certificate Info Box */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <ShieldCheck className="size-4 text-emerald-600" />
                <span>कृषि सेतु AI Assayer गुणवत्ता गारंटी</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                हमारा OpenCV और Gemini 2.0 विज़न मॉडल हर फसल की ताजगी, सतह के दोष, आकार एकरूपता और रंग का सटीक विश्लेषण करता है, जिससे खरीदारों को 100% विश्वास मिलता है और आपको उच्च प्रीमियम भाव मिलता है।
              </p>
              <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 text-[11px]">
                <div>
                  <span className="text-slate-400 block">गुणवत्ता विवाद:</span>
                  <strong className="text-emerald-700 font-bold">&lt; 0.2%</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">औसत भुगतान समय:</span>
                  <strong className="text-emerald-700 font-bold">डिलीवरी के 15 मिनट में</strong>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 3. Active Listings from Farmer's Field */}
        <section ref={activeListingsRef} className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                आपकी सक्रिय फसल लिस्टिंग्स (Active Harvest Lots)
              </h3>
              <p className="text-xs text-slate-500">
                सीधे बाज़ार में लाइव हैं और आस-पास के उपभोक्ता व थोक खरीदारों को दिख रही हैं
              </p>
            </div>
            <span className="self-start sm:self-auto rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 text-xs font-black">
              {listings.length} फसलें सक्रिय (Live)
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((item) => (
              <div
                key={item.id}
                className="group rounded-3xl border border-slate-200 bg-white p-4 shadow-xs hover:shadow-lg transition-all space-y-3"
              >
                {/* Crop Photo with Badges */}
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-950">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 380px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5 rounded-full bg-slate-950/80 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-md border border-white/20">
                    {item.category}
                  </div>
                  <div className="absolute top-2.5 right-2.5 rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-black text-white shadow-md">
                    {item.breakdown?.qualityGrade?.grade || "Grade A"}
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 backdrop-blur-md">
                    <Sparkles className="size-2.5 text-amber-300" />
                    <span>{item.matchScore}% बाज़ार मांग</span>
                  </div>
                </div>

                {/* Crop Name & Rate */}
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-black text-slate-900 text-sm truncate">{item.name}</h4>
                  </div>
                  
                  <div className="flex items-baseline justify-between text-xs mt-2">
                    <div>
                      <span className="text-lg font-black text-emerald-700">
                        ₹{item.farmGatePrice}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">/{item.unit}</span>
                      <span className="ml-2 text-[10px] text-slate-400 line-through">
                        ₹{item.mandiBenchmarkPrice}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg">
                      {item.quantityAvailable} {item.unit} उपलब्ध
                    </span>
                  </div>
                </div>

                {/* Bottom Footer Info */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1 text-emerald-700 font-bold truncate">
                    <CheckCircle2 className="size-3.5 shrink-0" />
                    <span>OpenCV Assayed</span>
                  </span>
                  <Link
                    href="/consumer"
                    className="flex items-center gap-1 font-bold text-slate-700 hover:text-emerald-700 transition-colors"
                  >
                    <span>बाज़ार देखें</span>
                    <ExternalLink className="size-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
