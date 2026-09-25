"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  Info,
  X,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Navbar } from "@/components/shared/Navbar";
import { OpenCVScan, type CropGradingData } from "@/components/shared/OpenCVScan";
import { useLanguage } from "@/context/LanguageContext";
import { MOCK_PRODUCE_LISTINGS, type ProduceListing } from "@/lib/mock-data";

// Crop quick presets organized by category - Focus on major Field Crops, Grains, Millets & Oilseeds
const CROP_PRESETS = [
  { 
    name: "शरबती गेहूं (Wheat)", 
    category: "Grains", 
    variety: "सीहोर 306 शरबती (Sehore Golden)", 
    defaultPrice: 3400, 
    unit: "quintal", 
    defaultQty: 100, 
    hint: "Wheat",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80"
  },
  { 
    name: "बासमती धान/चावल (Rice)", 
    category: "Grains", 
    variety: "Pusa 1121 Export Grade", 
    defaultPrice: 7200, 
    unit: "quintal", 
    defaultQty: 150, 
    hint: "Rice",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80"
  },
  { 
    name: "पीला सोयाबीन (Soyabean)", 
    category: "Grains", 
    variety: "JS-9560 / JS-2034 (बोल्ड दाना)", 
    defaultPrice: 4850, 
    unit: "quintal", 
    defaultQty: 120, 
    hint: "Soyabean",
    image: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=600&auto=format&fit=crop&q=80"
  },
  { 
    name: "देशी पीला मक्का (Corn)", 
    category: "Grains", 
    variety: "Pioneer 3302 Hybrid Yellow", 
    defaultPrice: 2350, 
    unit: "quintal", 
    defaultQty: 200, 
    hint: "Corn",
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&auto=format&fit=crop&q=80"
  },
  { 
    name: "संकर देशी बाजरा (Bajra)", 
    category: "Grains", 
    variety: "ProAgro Pearl Millet (श्री अन्न)", 
    defaultPrice: 2600, 
    unit: "quintal", 
    defaultQty: 80, 
    hint: "Bajra",
    image: "https://images.unsplash.com/photo-1600335895229-6e75511892c8?w=600&auto=format&fit=crop&q=80"
  },
  { 
    name: "मालदांडी सफेद ज्वार (Jowar)", 
    category: "Grains", 
    variety: "M-35-1 Maldandi (श्री अन्न)", 
    defaultPrice: 5200, 
    unit: "quintal", 
    defaultQty: 60, 
    hint: "Jowar",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80"
  },
  { 
    name: "मालवा डॉलर चना (Chickpea)", 
    category: "Grains", 
    variety: "Dollar Chana Extra Bold", 
    defaultPrice: 6800, 
    unit: "quintal", 
    defaultQty: 90, 
    hint: "Chana",
    image: "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=600&auto=format&fit=crop&q=80"
  },
  { 
    name: "देशी रागी / मडुआ (Ragi)", 
    category: "Grains", 
    variety: "GPU-28 Organic Millet", 
    defaultPrice: 4200, 
    unit: "quintal", 
    defaultQty: 50, 
    hint: "Millet",
    image: "https://images.unsplash.com/photo-1543158266-0066955047b1?w=600&auto=format&fit=crop&q=80"
  },
  { 
    name: "पीली सरसों (Mustard)", 
    category: "Grains", 
    variety: "Pusa Bold 42% Oil Content", 
    defaultPrice: 5600, 
    unit: "quintal", 
    defaultQty: 70, 
    hint: "Mustard",
    image: "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?w=600&auto=format&fit=crop&q=80"
  },
];

export default function FarmerPortalPage() {
  const { t, language } = useLanguage();
  
  // Listing Form State - Defaulting to MP Sharbati Wheat crop
  const [cropName, setCropName] = useState("शरबती गेहूं (Wheat)");
  const [cropCategory, setCropCategory] = useState<"Vegetables" | "Fruits" | "Grains" | "Organic">("Grains");
  const [variety, setVariety] = useState("सीहोर 306 शरबती (Sehore Golden)");
  const [quantity, setQuantity] = useState<number | "">(100);
  const [unit, setUnit] = useState("quintal");
  const [floorPrice, setFloorPrice] = useState<number | "">(3400);
  const [harvestDate, setHarvestDate] = useState(new Date().toISOString().slice(0, 10));
  const [isTyping, setIsTyping] = useState(false);
  const [isListed, setIsListed] = useState(false);

  // Attached Photo & AI Quality Grade - Defaulted to Sharbati Wheat
  const [attachedPhoto, setAttachedPhoto] = useState<string>(
    "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80"
  );
  const [scannedGrade, setScannedGrade] = useState<CropGradingData | null>({
    cropName: "शरबती गेहूं (MP Sharbati Wheat)",
    variety: "सीहोर 306 शरबती (Sehore Golden)",
    grade: "Grade A",
    gradeReason: "10.4% नमी (मानक <12%), चमकदार सुनहरा दाना, उच्च प्रोटीन व शून्य कचरा।",
    ripenessPct: 95,
    ripenessStage: "Fully Matured Golden Grain (पूर्ण परिपक्व दाना)",
    defectPct: 1,
    defectNotes: "Clean harvested grain, zero pest infestation, uniform bold size.",
    shelfLifeDays: 365,
    marketFit: "Direct Flour Mills, Premium Atta Brands & Bulk Buyers",
    recommendedPriceDeltaPct: 18,
    feedbackEn: "Grade-A export quality Sharbati wheat. Low moisture (10.4%) and high test weight. Eligible for +18% premium over local Mandi.",
    feedbackHi: "ग्रेड-ए शरबती गेहूं। 10.4% नमी, चमकदार दाना और उच्च प्रोटीन। न्यूनतम समर्थन मूल्य (MSP) से 18% अधिक भाव के योग्य।",
    assayerVerificationId: "KS-QC-918234",
  });
  
  // Active listings list
  const [listings, setListings] = useState<ProduceListing[]>(MOCK_PRODUCE_LISTINGS.slice(0, 3));
  const activeListingsRef = useRef<HTMLDivElement | null>(null);

  // Scanner Voice Highlight & Notice State
  const [highlightScanner, setHighlightScanner] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  const triggerPhotoPrompt = useCallback((cropNameHint?: string) => {
    const textNotice = cropNameHint
      ? `📸 वॉइस AI: ${cropNameHint} का विवरण दर्ज हो गया है! अब कृपया दाईं ओर फसल की फोटो अपलोड करें या AI कैमरा स्कैन करें।`
      : "📸 वॉइस AI: फसल का विवरण दर्ज हो गया है! अब कृपया दाईं ओर फसल की फोटो अपलोड करें या AI कैमरा स्कैन करें।";
    setVoiceNotice(textNotice);
    setTimeout(() => {
      const scannerEl = document.getElementById("opencv-scanner");
      if (scannerEl) {
        scannerEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      setHighlightScanner(true);
      setTimeout(() => setHighlightScanner(false), 9000);
    }, 1200);
  }, []);

  // Handle Preset Click - Real-time sync with photo and grading to eliminate mismatch
  const handlePresetSelect = (preset: typeof CROP_PRESETS[0]) => {
    setCropName(preset.name);
    setCropCategory(preset.category as "Vegetables" | "Grains");
    setVariety(preset.variety);
    setQuantity(preset.defaultQty);
    setUnit(preset.unit);
    setFloorPrice(preset.defaultPrice);
    if (preset.image) {
      setAttachedPhoto(preset.image);
    }
    setScannedGrade((prev) => ({
      cropName: preset.name,
      variety: preset.variety,
      grade: prev?.grade || "Grade A",
      gradeReason: `सत्यापित उच्च गुणवत्ता ${preset.name}`,
      ripenessPct: 90,
      ripenessStage: "Optimal Market Grade",
      defectPct: 3,
      defectNotes: "Clean surface, zero rot.",
      shelfLifeDays: preset.category === "Grains" ? 180 : 7,
      marketFit: "Direct Consumer Kitchens & Verified Buyers",
      recommendedPriceDeltaPct: 12,
      feedbackEn: `Grade-A verified quality for ${preset.name}.`,
      feedbackHi: `${preset.name} ग्रेड-ए प्रमाणित। सीधे खरीदार को बिक्री हेतु तैयार।`,
      assayerVerificationId: prev?.assayerVerificationId || `KS-QC-${Math.floor(100000 + Math.random() * 900000)}`,
    }));
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

    // Find preset image if available
    const matchedPreset = CROP_PRESETS.find((p) => 
      p.hint.toLowerCase().includes(targetData.crop.toLowerCase()) || 
      p.name.toLowerCase().includes(targetData.crop.toLowerCase())
    );
    if (matchedPreset?.image) {
      setAttachedPhoto(matchedPreset.image);
    }

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
    toast.success(
      language === "hi"
        ? "🎉 बधाई! आपकी फसल कृषि सेतु डायरेक्ट बाज़ार में सफलतापूर्वक लिस्ट हो गई!"
        : "🎉 Congratulations! Your crop has been successfully published to Krishi Setu direct market!"
    );

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
          crop: parsed.crop || "सीहोर शरबती गेहूं (MP Sharbati Wheat)",
          variety: parsed.variety || "MP Sharbati Golden A+",
          quantity: parsed.quantityKg || 100,
          price: parsed.pricePerKg || 3400,
          unit: parsed.unit || "quintal",
        });
        triggerPhotoPrompt(parsed.crop || "फसल");
      } catch (err) {
        console.error("Failed to parse voice crop:", err);
      }
    }
  }, [triggerPhotoPrompt]);

  // Listen for real-time voice listing confirmed events & photo highlight
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
        triggerPhotoPrompt(customEvent.detail.crop);
      }
    };

    const handleVoiceHighlight = () => {
      triggerPhotoPrompt();
    };

    window.addEventListener("krishi-voice-list-crop", handleVoiceList);
    window.addEventListener("krishi-voice-highlight-photo", handleVoiceHighlight);
    return () => {
      window.removeEventListener("krishi-voice-list-crop", handleVoiceList);
      window.removeEventListener("krishi-voice-highlight-photo", handleVoiceHighlight);
    };
  }, [triggerPhotoPrompt]);

  // Calculate Mandi Price comparison delta
  const priceNum = Number(floorPrice) || 0;
  const traditionalMandiNet = Math.round(priceNum * 0.74); // After commission, wastage, weigh fees
  const extraGainPerUnit = Math.max(0, priceNum - traditionalMandiNet);
  const totalExtraProfit = Math.round(extraGainPerUnit * (Number(quantity) || 0));

  return (
    <div className="min-h-screen bg-[radial-gradient(at_top_left,#ecfdf5,#ffffff)] bg-grid-subtle">
      <Navbar />

      <main className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 pb-28 sm:pb-24">
        
        {/* 1. Farmer Profile & Verified Ledger Bar */}
        <section className="rounded-2xl sm:rounded-3xl border border-emerald-200/90 bg-white/95 py-3.5 px-4 sm:px-6 shadow-sm backdrop-blur-md mb-6 sm:mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-3.5">
              <div className="flex size-12 sm:size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 text-white shadow-sm shrink-0">
                <Sprout className="size-6 sm:size-7" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-base sm:text-xl font-black text-slate-900 leading-tight">
                    {t("farmer_name")}
                  </h1>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 text-xs font-bold text-emerald-800 shrink-0">
                    <ShieldCheck className="size-3.5 text-emerald-600" aria-hidden="true" />
                    <span>{t("pm_kisan_verified")}</span>
                    <span className="rounded bg-emerald-200/80 px-1.5 py-0.2 font-mono text-[11px] text-emerald-900">#IND-84920</span>
                  </span>
                </div>
                <p className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5 truncate">
                  <MapPin className="size-3.5 text-emerald-600 shrink-0" />
                  <span>{t("farmer_location")}</span>
                </p>
              </div>
            </div>

            {/* Financial Telemetry Pills */}
            <div className="flex items-center gap-2 sm:gap-3 text-xs w-full md:w-auto">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 px-3 py-2 shadow-2xs flex-1 sm:flex-initial">
                <span className="text-[11px] font-semibold text-slate-600 block">{t("escrow_balance_label")}</span>
                <p className="text-sm sm:text-base font-black text-emerald-700">₹42,500</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 shadow-2xs flex-1 sm:flex-initial">
                <span className="text-[11px] font-semibold text-slate-600 block">{t("trust_rating_label")}</span>
                <p className="text-sm sm:text-base font-black text-slate-900">4.9 ★ <span className="text-[11px] font-normal text-slate-500">(99.4%)</span></p>
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
              <div className="border-b border-slate-100 pb-4 space-y-2.5">
                {voiceNotice && (
                  <div className="rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 p-3 text-xs text-white font-bold flex items-center justify-between shadow-md animate-in fade-in slide-in-from-top-1">
                    <div className="flex items-center gap-2">
                      <Camera className="size-4 animate-bounce text-emerald-200 shrink-0" />
                      <span>{voiceNotice}</span>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setVoiceNotice(null)}
                      className="p-1 text-white/80 hover:text-white rounded-lg hover:bg-white/20 transition-colors shrink-0"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
                    <Sparkles className="size-4" />
                    <span>{t("farmer_studio_badge")}</span>
                  </div>
                  <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 border border-emerald-200">
                    {t("farmer_no_commission")}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  {t("farmer_studio_title")}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t("farmer_studio_sub")}
                </p>
              </div>

              {/* Quick Preset Crop Selector */}
              <div className="space-y-2.5 rounded-2xl bg-emerald-50/50 p-4 border border-emerald-100">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span className="flex items-center gap-1.5 text-emerald-900">
                    <Zap className="size-4 text-amber-500" />
                    <span>{t("farmer_quick_crops")}</span>
                  </span>
                  <span className="text-[11px] text-emerald-700 font-semibold">{t("farmer_autofill_tag")}</span>
                </div>

                <div className="flex flex-wrap gap-2.5 sm:gap-3 pt-1">
                  {CROP_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handlePresetSelect(preset)}
                      className={`min-h-[44px] inline-flex items-center justify-center rounded-full border px-4 py-2.5 text-xs font-bold transition-all truncate active:scale-95 ${
                        cropName.includes(preset.name.split(" ")[0])
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-xs ring-2 ring-emerald-300"
                          : "bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50"
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comprehensive Harvest Listing Form */}
              <form onSubmit={handlePublishListing} className="space-y-6">
                
                {/* 1. Crop Name & Variety */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="crop" className="text-xs font-bold text-slate-800 mb-1 block">
                      {t("crop_name_field")} <span className="text-rose-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="crop"
                        value={cropName}
                        onChange={(e) => setCropName(e.target.value)}
                        placeholder={t("crop_name_ph")}
                        required
                        className={`font-bold text-slate-900 h-12 text-sm rounded-xl ${
                          isTyping ? "border-emerald-500 ring-2 ring-emerald-200" : ""
                        }`}
                      />
                      {isTyping && (
                        <span className="absolute right-3 top-3.5 size-2 rounded-full bg-emerald-500 animate-ping" />
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="variety" className="text-xs font-bold text-slate-800 mb-1 block">
                      {t("variety_field")}
                    </Label>
                    <Input
                      id="variety"
                      value={variety}
                      onChange={(e) => setVariety(e.target.value)}
                      placeholder={t("variety_ph")}
                      className="text-slate-900 font-semibold h-12 text-sm rounded-xl"
                    />
                  </div>
                </div>

                {/* 2. Quantity, Unit & Bag Packaging */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="qty" className="text-xs font-bold text-slate-800 mb-1 block">
                      {t("quantity_field")} <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="qty"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value ? Number(e.target.value) : "")}
                      placeholder="100"
                      min={1}
                      required
                      className="font-bold text-slate-900 h-12 text-sm rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unit" className="text-xs font-bold text-slate-800 mb-1 block">
                      {t("unit_field")}
                    </Label>
                    <select
                      id="unit"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="quintal">{language === "hi" ? "क्विंटल (Quintal ~100kg)" : "Quintal (~100kg)"}</option>
                      <option value="ton">{language === "hi" ? "टन (Metric Ton)" : "Metric Ton (Ton)"}</option>
                      <option value="bori">{language === "hi" ? "बोरी / कट्टे (~50kg Bag)" : "Bori / Bags (~50kg)"}</option>
                      <option value="kg">{language === "hi" ? "किलोग्राम (kg)" : "Kilogram (kg)"}</option>
                    </select>
                  </div>

                  <div className="col-span-2 sm:col-span-1 space-y-2">
                    <Label htmlFor="price" className="text-xs font-bold text-slate-800 mb-1 block">
                      {t("floor_price_field")} (₹ / {unit}) <span className="text-rose-500">*</span>
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-3.5 text-xs font-black text-emerald-700">₹</span>
                      <Input
                        id="price"
                        type="number"
                        value={floorPrice}
                        onChange={(e) => setFloorPrice(e.target.value ? Number(e.target.value) : "")}
                        placeholder="40"
                        min={1}
                        required
                        className="pl-7 font-black text-emerald-700 text-base h-12 rounded-xl"
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
                        <span>{t("mandi_calc_heading")}</span>
                      </span>
                      <span className="rounded-full bg-emerald-600 text-white font-bold px-2.5 py-0.5 text-xs">
                        +{Math.round((extraGainPerUnit / (traditionalMandiNet || 1)) * 100)}% {t("mandi_extra_profit")}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-emerald-200/60">
                      <div className="bg-white/90 p-2.5 rounded-xl border border-slate-200">
                        <span className="text-slate-500 block text-[11px]">{t("mandi_after_deduction")}</span>
                        <p className="text-sm font-bold text-slate-700">₹{traditionalMandiNet} /{unit}</p>
                        <span className="text-xs text-rose-600 font-medium">{t("mandi_cut_note")}</span>
                      </div>
                      <div className="bg-emerald-100/70 p-2.5 rounded-xl border border-emerald-300">
                        <span className="text-emerald-800 font-semibold block text-[11px]">{t("krishi_farmgate_direct")}</span>
                        <p className="text-sm font-black text-emerald-800">₹{priceNum} /{unit}</p>
                        <span className="text-xs text-emerald-700 font-bold">{t("krishi_direct_payout")}</span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-emerald-950 font-bold leading-normal">
                      {t("calculator_lot_note_prefix")} {quantity || 0} {unit} {t("calculator_lot_note_middle")}{" "}
                      <span className="underline font-black text-emerald-800">₹{totalExtraProfit.toLocaleString("en-IN")}</span>{" "}
                      {t("calculator_lot_note_suffix")}
                    </p>
                  </div>
                )}

                {/* 4. Attached Quality Grade & Photo Status Card */}
                <div className="rounded-2xl border border-slate-200 p-3.5 bg-slate-50 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative size-12 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-300">
                      <Image
                        src={attachedPhoto}
                        alt={cropName || "Crop Preview"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-900 truncate">
                          {cropName || scannedGrade?.cropName || (language === "hi" ? "फसल" : "Crop Produce")}
                        </span>
                        <span className="rounded-full bg-emerald-600 text-white font-bold text-xs px-2.5 py-0.5">
                          {scannedGrade?.grade || "Grade A"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 truncate mt-0.5">
                        {t("verification_code_label")} {scannedGrade?.assayerVerificationId || "KS-QC-748291"}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                      <CheckCircle2 className="size-3.5 text-emerald-600" />
                      <span>{t("qc_verified_badge")}</span>
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
                  <span>{t("publish_harvest_btn")}</span>
                </Button>
              </form>

              {/* Success Banner */}
              {isListed && (
                <div className="rounded-2xl border border-emerald-400 bg-emerald-100/90 p-3.5 text-xs text-emerald-950 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
                    <span className="font-bold">{t("listing_live_banner")}</span>
                  </div>
                  <Button asChild size="sm" className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs shrink-0">
                    <Link href="/consumer">{t("view_in_market_btn")}</Link>
                  </Button>
                </div>
              )}

            </div>
          </div>

          {/* Right Column: AI Laser Scanner & Quality Lab (5 Columns) */}
          <div className="lg:col-span-5">
            {/* OpenCV Scanner Component */}
            <OpenCVScan 
              initialImage={attachedPhoto}
              cropHint={cropName}
              isVoiceHighlighted={highlightScanner}
              onApplyToForm={handleApplyScanResult}
            />
          </div>
        </section>

        {/* 3. Active Listings from Farmer's Field */}
        <section ref={activeListingsRef} className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                {t("active_listings_heading")}
              </h3>
              <p className="text-xs text-slate-500">
                {t("active_listings_subtitle")}
              </p>
            </div>
            <span className="self-start sm:self-auto rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 text-xs font-black">
              {listings.length} {t("active_listings_live_count")}
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
                    <span>{item.matchScore}% {t("market_demand")}</span>
                  </div>
                </div>

                {/* Crop Name & Rate */}
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-black text-slate-900 text-sm truncate">{item.name}</h4>
                  </div>
                  
                  <div className="flex items-baseline justify-between text-xs mt-2 w-full">
                    <div>
                      <span className="text-lg font-black text-emerald-700">
                        ₹{item.farmGatePrice}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">/{item.unit}</span>
                      <span className="ml-2 text-xs font-normal text-slate-400 line-through">
                        ₹{item.mandiBenchmarkPrice}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg shrink-0">
                      {item.quantityAvailable} {item.unit} {t("available_text")}
                    </span>
                  </div>
                </div>

                {/* Bottom Footer Info */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500 w-full">
                  <span className="flex items-center gap-1.5 text-emerald-700 font-bold truncate">
                    <CheckCircle2 className="size-3.5 shrink-0 text-emerald-600" />
                    <span>OpenCV Assayed</span>
                  </span>
                  <Link
                    href="/consumer"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 min-h-[38px] text-xs font-bold transition-all shadow-xs hover:shadow active:scale-95 group shrink-0"
                  >
                    <span>{t("inspect_market")}</span>
                    <ArrowRight className="size-3.5 text-white/90 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
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
