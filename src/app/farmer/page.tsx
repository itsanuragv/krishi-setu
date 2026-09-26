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
  Plus,
  Camera,
  IndianRupee,
  ChevronRight,
  ChevronLeft,
  X,
  ArrowRight,
  Mic,
  Rocket,
  Package,
  HandCoins,
  Truck,
  BadgeCheck,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Navbar } from "@/components/shared/Navbar";
import { OpenCVScan, type CropGradingData } from "@/components/shared/OpenCVScan";
import { useLanguage } from "@/context/LanguageContext";
import { MOCK_PRODUCE_LISTINGS, type ProduceListing } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

// Crop presets with photos - major field crops, grains, millets & oilseeds
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

type MyListing = ProduceListing & { status: "live" | "in_escrow" | "sold" };

const STEPS = [
  { id: 1, icon: Sprout },
  { id: 2, icon: IndianRupee },
  { id: 3, icon: Scan },
  { id: 4, icon: Rocket },
] as const;

export default function FarmerPortalPage() {
  const { t, language } = useLanguage();
  const hi = language === "hi";

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [published, setPublished] = useState(false);

  // Listing form state
  const [cropName, setCropName] = useState("");
  const [cropCategory, setCropCategory] = useState<"Vegetables" | "Fruits" | "Grains" | "Organic">("Grains");
  const [variety, setVariety] = useState("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [unit, setUnit] = useState("quintal");
  const [floorPrice, setFloorPrice] = useState<number | "">("");
  const [harvestDate] = useState(new Date().toISOString().slice(0, 10));
  const [isTyping, setIsTyping] = useState(false);
  const [customCrop, setCustomCrop] = useState("");

  // Photo & AI grade
  const [attachedPhoto, setAttachedPhoto] = useState<string>("");
  const [scannedGrade, setScannedGrade] = useState<CropGradingData | null>(null);

  // My listings
  const [listings, setListings] = useState<MyListing[]>(() =>
    MOCK_PRODUCE_LISTINGS.slice(0, 3).map((l, i) => ({
      ...l,
      status: (["live", "in_escrow", "sold"] as const)[i],
    }))
  );
  const listingsRef = useRef<HTMLDivElement | null>(null);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  const stepLabels = [
    hi ? "फसल चुनें" : "Pick crop",
    hi ? "मात्रा व भाव" : "Qty & price",
    hi ? "गुणवत्ता जांच" : "Quality check",
    hi ? "प्रकाशित करें" : "Publish",
  ];

  // ---- helpers ----
  const makeGradeFor = (name: string, varietyName: string, photo: string): CropGradingData => ({
    cropName: name,
    variety: varietyName,
    grade: "Grade A",
    gradeReason: hi ? `सत्यापित उच्च गुणवत्ता ${name}` : `Verified premium quality ${name}`,
    ripenessPct: 92,
    ripenessStage: hi ? "बाज़ार हेतु उपयुक्त" : "Optimal market grade",
    defectPct: 2,
    defectNotes: "Clean surface, zero rot.",
    shelfLifeDays: 180,
    marketFit: hi ? "सीधे खरीदार व थोक व्यापारी" : "Direct buyers & bulk traders",
    recommendedPriceDeltaPct: 14,
    feedbackEn: `Grade-A verified quality for ${name}.`,
    feedbackHi: `${name} ग्रेड-ए प्रमाणित। सीधे खरीदार को बिक्री हेतु तैयार।`,
    assayerVerificationId: `KS-QC-${Math.floor(100000 + Math.random() * 900000)}`,
  });

  const handlePresetSelect = (preset: typeof CROP_PRESETS[0]) => {
    setCropName(preset.name);
    setCropCategory(preset.category as "Grains");
    setVariety(preset.variety);
    setQuantity(preset.defaultQty);
    setUnit(preset.unit);
    setFloorPrice(preset.defaultPrice);
    if (preset.image) setAttachedPhoto(preset.image);
    setScannedGrade((prev) => ({
      ...makeGradeFor(preset.name, preset.variety, preset.image),
      assayerVerificationId: prev?.assayerVerificationId || `KS-QC-${Math.floor(100000 + Math.random() * 900000)}`,
    }));
    toast.success(`${hi ? "चुना गया: " : "Selected: "}${preset.name}`);
  };

  const handleCustomCrop = () => {
    if (!customCrop.trim()) return;
    const name = customCrop.trim();
    setCropName(name);
    setVariety("");
    setQuantity("");
    setFloorPrice("");
    setAttachedPhoto("");
    setScannedGrade(null);
    setCustomCrop("");
    toast.success(`${hi ? "फसल जोड़ी गई: " : "Crop added: "}${name}`);
  };

  // Voice-to-form: fills the form as if spoken, then jumps to step 2
  const simulateVoiceToForm = useCallback((targetData: {
    crop: string; variety: string; quantity: number; price: number; unit: string;
  }) => {
    setIsTyping(true);
    setPublished(false);
    setCropName("");
    setVariety("");
    setQuantity("");
    setFloorPrice("");
    const matchedPreset = CROP_PRESETS.find((p) =>
      p.hint.toLowerCase().includes(targetData.crop.toLowerCase()) ||
      p.name.toLowerCase().includes(targetData.crop.toLowerCase())
    );
    if (matchedPreset?.image) setAttachedPhoto(matchedPreset.image);
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
        setStep(2);
        toast.success(
          hi
            ? `वॉइस AI: ${targetData.quantity} ${targetData.unit} ${targetData.crop} @ ₹${targetData.price}`
            : `Voice AI: ${targetData.quantity} ${targetData.unit} ${targetData.crop} @ ₹${targetData.price}`
        );
        setVoiceNotice(
          hi
            ? `अब चरण 3 में फसल की फोटो जोड़ें या AI स्कैन करें — इससे बेहतर भाव मिलेगा!`
            : `Now add a crop photo or AI scan in step 3 — it earns a better price!`
        );
      }
    }, 35);
  }, [hi]);

  const handleApplyScanResult = (gradingData: CropGradingData, photoUrl: string) => {
    setScannedGrade(gradingData);
    setAttachedPhoto(photoUrl);
    if (gradingData.cropName) setCropName(gradingData.cropName);
    if (gradingData.variety) setVariety(gradingData.variety);
    toast.success(hi ? `AI ग्रेडिंग: ${gradingData.grade} — फॉर्म में जुड़ गया!` : `AI grading: ${gradingData.grade} — synced to form!`);
  };

  // Voice handoff from the global voice assistant
  useEffect(() => {
    const stored = typeof window !== "undefined" ? sessionStorage.getItem("krishi_pending_voice_crop") : null;
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        sessionStorage.removeItem("krishi_pending_voice_crop");
        simulateVoiceToForm({
          crop: parsed.crop || "शरबती गेहूं (Wheat)",
          variety: parsed.variety || "MP Sharbati Golden A+",
          quantity: parsed.quantityKg || 100,
          price: parsed.pricePerKg || 3400,
          unit: parsed.unit || "quintal",
        });
      } catch (err) {
        console.error("Failed to parse voice crop:", err);
      }
    }
  }, [simulateVoiceToForm]);

  useEffect(() => {
    const handleVoiceList = (e: Event) => {
      const d = (e as CustomEvent<{ crop: string; variety: string; quantityKg: number; pricePerKg: number; unit: string }>).detail;
      if (d) {
        simulateVoiceToForm({
          crop: d.crop,
          variety: d.variety || "Standard Grade-A",
          quantity: d.quantityKg,
          price: d.pricePerKg,
          unit: d.unit || "kg",
        });
      }
    };
    window.addEventListener("krishi-voice-list-crop", handleVoiceList);
    return () => window.removeEventListener("krishi-voice-list-crop", handleVoiceList);
  }, [simulateVoiceToForm]);

  // Demo voice fill
  const demoVoiceFill = () => {
    simulateVoiceToForm({
      crop: "शरबती गेहूं (Wheat)",
      variety: "सीहोर 306 शरबती (Sehore Golden)",
      quantity: 100,
      price: 3400,
      unit: "quintal",
    });
  };

  // ---- pricing math ----
  const priceNum = Number(floorPrice) || 0;
  const qtyNum = Number(quantity) || 0;
  const traditionalMandiNet = Math.round(priceNum * 0.74);
  const extraPerUnit = Math.max(0, priceNum - traditionalMandiNet);
  const totalExtra = Math.round(extraPerUnit * qtyNum);
  const lotValue = Math.round(priceNum * qtyNum);

  const canNext = (s: number) => {
    if (s === 1) return cropName.trim().length > 0;
    if (s === 2) return qtyNum > 0 && priceNum > 0;
    return true;
  };

  const handlePublish = () => {
    if (!cropName || !qtyNum || !priceNum) {
      toast.error(hi ? "फसल, मात्रा और भाव ज़रूरी है" : "Crop, quantity and price are required");
      return;
    }
    const grade = scannedGrade ?? makeGradeFor(cropName, variety || (hi ? "मानक" : "Standard"), attachedPhoto);
    const verif = grade.assayerVerificationId;
    const newListing: MyListing = {
      id: `prod-${Date.now()}`,
      name: `${cropName} (Fresh Farm Gate)`,
      hindiName: hi ? `${cropName} (ताजा फसल)` : `${cropName} (Farm Gate)`,
      category: cropCategory,
      farmerName: "रामेश्वर पाटिल (Rameshwar Patil)",
      farmerPhone: "+91 98221 45019",
      village: "Sanwer (सांवेर)",
      district: "Indore, Madhya Pradesh",
      distanceKm: 4.8,
      quantityAvailable: qtyNum,
      unit,
      farmGatePrice: priceNum,
      mandiBenchmarkPrice: Math.round(priceNum * 1.32),
      imageUrl: attachedPhoto || CROP_PRESETS[0].image,
      matchScore: 97,
      breakdown: {
        priceIndex: { score: 97, detail: hi ? "मंडी आढ़त से सीधी बचत" : "Direct saving over mandi markup" },
        distance: { score: 99, detail: "4.8 km hyperlocal farm radius" },
        qualityGrade: {
          score: grade.grade === "Grade A" ? 98 : 90,
          detail: `${grade.grade} OpenCV Assayed (${verif})`,
          grade: grade.grade,
        },
        quantityFit: { score: 95, detail: hi ? "थोक खरीदार हेतु उपयुक्त लॉट" : "Bulk-buyer friendly lot" },
        reliability: { score: 99, detail: "4.9★ PM-KISAN Verified Ledger", rating: 4.9 },
      },
      openCvMetrics: {
        blurScore: 95,
        brightnessPct: 90,
        resolution: "1080p Verified",
        status: `Assayed ${grade.grade} - Auto-Listed`,
      },
      status: "live",
    };
    setListings([newListing, ...listings]);
    setPublished(true);
    toast.success(hi ? "बधाई! फसल लाइव हो गई" : "Congratulations! Your listing is live");
  };

  const resetWizard = () => {
    setStep(1);
    setPublished(false);
    setCropName("");
    setVariety("");
    setQuantity("");
    setFloorPrice("");
    setAttachedPhoto("");
    setScannedGrade(null);
    setVoiceNotice(null);
  };

  const statusMeta = (s: MyListing["status"]) =>
    s === "live"
      ? { label: hi ? "लाइव" : "LIVE", cls: "bg-emerald-100 text-emerald-800 border-emerald-300" }
      : s === "in_escrow"
      ? { label: hi ? "एस्क्रो में" : "IN ESCROW", cls: "bg-amber-100 text-amber-800 border-amber-300" }
      : { label: hi ? "बिक गई" : "SOLD", cls: "bg-slate-200 text-slate-600 border-slate-300" };

  return (
    <div className="min-h-screen bg-[radial-gradient(at_top_left,#ecfdf5,#ffffff)] bg-grid-subtle">
      <Navbar />

      <main className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 pb-28 sm:pb-24">

        {/* 1. Farmer identity bar */}
        <section className="rounded-2xl sm:rounded-3xl border border-emerald-200/90 bg-white/95 py-3.5 px-4 sm:px-6 shadow-sm backdrop-blur-md">
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
                  </span>
                </div>
                <p className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5 truncate">
                  <MapPin className="size-3.5 text-emerald-600 shrink-0" />
                  <span>{t("farmer_location")}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 text-xs w-full md:w-auto">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 px-3 py-2 shadow-2xs flex-1 sm:flex-initial">
                <span className="text-[11px] font-semibold text-slate-600 block">{t("escrow_balance_label")}</span>
                <p className="text-sm sm:text-base font-black text-emerald-700">₹42,500</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 shadow-2xs flex-1 sm:flex-initial">
                <span className="text-[11px] font-semibold text-slate-600 block">{t("trust_rating_label")}</span>
                <p className="text-sm sm:text-base font-black text-slate-900">4.9 ★ <span className="text-[11px] font-normal text-slate-500">(99.4%)</span></p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 shadow-2xs flex-1 sm:flex-initial">
                <span className="text-[11px] font-semibold text-slate-600 block">{hi ? "इस माह आय" : "Month's income"}</span>
                <p className="text-sm sm:text-base font-black text-slate-900">₹1,18,400</p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Listing wizard */}
        <section className="overflow-hidden rounded-3xl border border-emerald-200/80 bg-white/95 shadow-sm backdrop-blur-md">
          {/* Wizard header + stepper */}
          <div className="border-b border-slate-100 p-4 sm:p-6 pb-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-emerald-700">
                  <Sparkles className="size-3.5" />
                  {hi ? "स्मार्ट लिस्टिंग स्टूडियो" : "Smart listing studio"}
                </p>
                <h2 className="mt-1 text-xl sm:text-2xl font-black text-slate-900">
                  {hi ? "अपनी फसल 2 मिनट में बेचें" : "Sell your harvest in 2 minutes"}
                </h2>
              </div>
              <Button
                onClick={demoVoiceFill}
                variant="outline"
                className="h-11 gap-2 rounded-2xl border-emerald-300 bg-emerald-50 px-4 text-xs font-black text-emerald-800 hover:bg-emerald-100"
              >
                <span className="flex size-7 items-center justify-center rounded-full bg-emerald-600 text-white">
                  <Mic className="size-3.5" />
                </span>
                {hi ? "बोलकर भरें" : "Fill by voice"}
              </Button>
            </div>

            {/* Stepper */}
            <div className="mt-5">
              <div className="flex items-center">
                {STEPS.map((s, i) => {
                  const done = s.id < step || published;
                  const current = s.id === step && !published;
                  const Icon = s.icon;
                  return (
                    <div key={s.id} className={cn("flex items-center", i < STEPS.length - 1 && "flex-1")}>
                      <div className="flex flex-col items-center gap-1.5">
                        <span className={cn(
                          "flex size-9 sm:size-10 items-center justify-center rounded-2xl border-2 transition-all",
                          done && "border-emerald-600 bg-emerald-600 text-white",
                          current && "border-emerald-600 bg-emerald-50 text-emerald-700 shadow-md scale-105",
                          !done && !current && "border-slate-200 bg-slate-50 text-slate-400"
                        )}>
                          {done ? <CheckCircle2 className="size-5" /> : <Icon className="size-4.5" />}
                        </span>
                        <span className={cn(
                          "whitespace-nowrap text-[10px] sm:text-[11px] font-bold",
                          done || current ? "text-emerald-800" : "text-slate-400"
                        )}>
                          {stepLabels[i]}
                        </span>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div className={cn("mx-1 sm:mx-2 mb-5 h-1 flex-1 rounded-full", s.id < step || published ? "bg-emerald-500" : "bg-slate-200")} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {voiceNotice && !published && (
              <div className="mb-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 p-3 text-xs text-white font-bold flex items-center justify-between shadow-md">
                <div className="flex items-center gap-2">
                  <Camera className="size-4 text-emerald-200 shrink-0" />
                  <span>{voiceNotice}</span>
                </div>
                <button type="button" onClick={() => setVoiceNotice(null)} className="p-1 text-white/80 hover:text-white rounded-lg hover:bg-white/20 shrink-0">
                  <X className="size-3.5" />
                </button>
              </div>
            )}

            {/* SUCCESS STATE */}
            {published ? (
              <div className="mx-auto max-w-2xl py-4 text-center">
                <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100">
                  <CheckCircle2 className="size-9 text-emerald-600" />
                </div>
                <h3 className="mt-4 text-xl sm:text-2xl font-black text-slate-900">
                  {hi ? "बधाई! आपकी फसल लाइव है" : "Congratulations! Your crop is live"}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {hi ? "25 किमी के दायरे के खरीदारों को सूचना भेज दी गई है" : "Buyers within 25 km have been notified"}
                </p>
                <div className="mt-6 space-y-0 text-left">
                  {[
                    { icon: Package, title: hi ? "लिस्टिंग लाइव" : "Listing live", sub: hi ? "अभी" : "Right now", done: true },
                    { icon: TrendingUp, title: hi ? "खरीदार मिलान (24 घंटे)" : "Buyer matching (24 hrs)", sub: hi ? "AI 5-फैक्टर स्कोर से" : "Via AI 5-factor score", done: false },
                    { icon: ShieldCheck, title: hi ? "एस्क्रो लॉक" : "Escrow lock", sub: hi ? "खरीदार पेमेंट सुरक्षित" : "Buyer payment secured", done: false },
                    { icon: Truck, title: hi ? "पिकअप + 4-अंकीय PIN" : "Pickup + 4-digit PIN", sub: hi ? "डिलीवरी पर भुगतान" : "Pay on delivery", done: false },
                    { icon: HandCoins, title: hi ? "तुरंत भुगतान" : "Instant payout", sub: hi ? "4 घंटे में UPI" : "UPI within 4 hours", done: false },
                  ].map((s, i, arr) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <span className={cn(
                          "flex size-9 items-center justify-center rounded-xl border",
                          s.done ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-200 bg-slate-50 text-slate-400"
                        )}>
                          {s.done ? <CheckCircle2 className="size-4.5" /> : <s.icon className="size-4" />}
                        </span>
                        {i < arr.length - 1 && <span className={cn("h-5 w-0.5", s.done ? "bg-emerald-400" : "bg-slate-200")} />}
                      </div>
                      <div className="pb-4">
                        <p className="text-sm font-black text-slate-900">{s.title}</p>
                        <p className="text-xs text-slate-500">{s.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex flex-col sm:flex-row gap-2.5 justify-center">
                  <Button onClick={resetWizard} className="h-12 rounded-2xl bg-emerald-700 px-6 text-sm font-black text-white hover:bg-emerald-800">
                    <Plus className="size-4" />
                    {hi ? "एक और फसल लिस्ट करें" : "List another crop"}
                  </Button>
                  <Button asChild variant="outline" className="h-12 rounded-2xl px-6 text-sm font-bold">
                    <Link href="/consumer">
                      {hi ? "बाज़ार में देखें" : "View in market"}
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {/* STEP 1: crop picker */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900">{hi ? "कौन सी फसल बेचनी है?" : "Which crop are you selling?"}</h3>
                      <p className="text-xs text-slate-500">{hi ? "फोटो पर टैप करें — बाकी विवरण खुद भर जाएगा" : "Tap a photo — the details fill in automatically"}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {CROP_PRESETS.map((preset) => {
                        const selected = cropName === preset.name;
                        return (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => handlePresetSelect(preset)}
                            className={cn(
                              "group overflow-hidden rounded-2xl border-2 text-left transition-all active:scale-98",
                              selected
                                ? "border-emerald-600 shadow-lg shadow-emerald-600/15 ring-2 ring-emerald-200"
                                : "border-slate-200 hover:border-emerald-300 hover:shadow-md"
                            )}
                          >
                            <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                              <Image src={preset.image} alt={preset.name} fill sizes="300px" className="object-cover transition-transform duration-300 group-hover:scale-105" />
                              {selected && (
                                <span className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-emerald-600 text-white shadow">
                                  <CheckCircle2 className="size-4" />
                                </span>
                              )}
                            </div>
                            <div className="p-2.5">
                              <p className="truncate text-xs font-black text-slate-900">{preset.name}</p>
                              <p className="truncate text-[10px] text-slate-500">{preset.variety}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={customCrop}
                        onChange={(e) => setCustomCrop(e.target.value)}
                        placeholder={hi ? "सूची में नहीं है? फसल का नाम लिखें…" : "Not listed? Type your crop name…"}
                        className="h-12 rounded-2xl text-sm font-semibold"
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleCustomCrop())}
                      />
                      <Button onClick={handleCustomCrop} variant="outline" className="h-12 shrink-0 rounded-2xl border-emerald-300 px-4 text-xs font-black text-emerald-800">
                        <Plus className="size-4" />
                        {hi ? "जोड़ें" : "Add"}
                      </Button>
                    </div>
                  </div>
                )}

                {/* STEP 2: qty & price */}
                {step === 2 && (
                  <div className="mx-auto max-w-2xl space-y-5">
                    <div className="text-center">
                      <h3 className="text-base sm:text-lg font-black text-slate-900">
                        {hi ? "मात्रा और भाव बताएं" : "Quantity & your price"}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {cropName || (hi ? "आपकी फसल" : "your crop")}
                        {variety ? ` • ${variety}` : ""}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700">{hi ? "मात्रा" : "Quantity"} *</Label>
                        <Input
                          type="number" min={1} value={quantity}
                          onChange={(e) => setQuantity(e.target.value ? Number(e.target.value) : "")}
                          placeholder="100"
                          className="h-14 rounded-2xl text-center text-xl font-black"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700">{hi ? "इकाई" : "Unit"}</Label>
                        <select
                          value={unit} onChange={(e) => setUnit(e.target.value)}
                          className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="quintal">{hi ? "क्विंटल (~100kg)" : "Quintal (~100kg)"}</option>
                          <option value="ton">{hi ? "टन" : "Metric Ton"}</option>
                          <option value="bori">{hi ? "बोरी (~50kg)" : "Bags (~50kg)"}</option>
                          <option value="kg">{hi ? "किलोग्राम" : "Kilogram"}</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-700">
                        {hi ? `आपका भाव (₹ प्रति ${unit})` : `Your price (₹ per ${unit})`} *
                      </Label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-black text-emerald-700">₹</span>
                        <Input
                          type="number" min={1} value={floorPrice}
                          onChange={(e) => setFloorPrice(e.target.value ? Number(e.target.value) : "")}
                          placeholder="3400"
                          className="h-14 rounded-2xl pl-9 text-center text-xl font-black text-emerald-700"
                        />
                      </div>
                      <p className="text-center text-[11px] text-slate-400">
                        {hi ? "टिप: मंडी भाव से थोड़ा कम रखें — जल्दी बिकेगा" : "Tip: price slightly below mandi — it sells faster"}
                      </p>
                    </div>

                    {/* Money motivator card */}
                    {priceNum > 0 && qtyNum > 0 && (
                      <div className="overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50/60 p-4 shadow-xs">
                        <div className="flex items-center justify-between">
                          <p className="flex items-center gap-1.5 text-xs font-black text-emerald-950">
                            <TrendingUp className="size-4 text-emerald-600" />
                            {hi ? "मंडी बनाम सीधी बिक्री" : "Mandi vs direct sale"}
                          </p>
                          <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-xs font-black text-white">
                            +{Math.round((extraPerUnit / (traditionalMandiNet || 1)) * 100)}% {hi ? "अधिक" : "more"}
                          </span>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <div className="rounded-xl border border-slate-200 bg-white p-3">
                            <p className="text-[10px] font-semibold text-slate-500">{hi ? "मंडी में (कटौती बाद)" : "At mandi (after cuts)"}</p>
                            <p className="text-base font-black text-slate-500">₹{traditionalMandiNet.toLocaleString("en-IN")}<span className="text-[10px] font-semibold">/{unit}</span></p>
                          </div>
                          <div className="rounded-xl border border-emerald-300 bg-emerald-100/70 p-3">
                            <p className="text-[10px] font-bold text-emerald-800">{hi ? "कृषि सेतु सीधा भाव" : "Krishi Setu direct"}</p>
                            <p className="text-base font-black text-emerald-800">₹{priceNum.toLocaleString("en-IN")}<span className="text-[10px] font-semibold">/{unit}</span></p>
                          </div>
                        </div>
                        <p className="mt-3 rounded-xl bg-emerald-600 p-3 text-center text-sm font-black text-white">
                          {hi ? `इस लॉट पर अतिरिक्त कमाई: ₹${totalExtra.toLocaleString("en-IN")}` : `Extra earnings on this lot: ₹${totalExtra.toLocaleString("en-IN")}`}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 3: quality */}
                {step === 3 && (
                  <div className="mx-auto max-w-3xl space-y-4">
                    <div className="text-center">
                      <h3 className="text-base sm:text-lg font-black text-slate-900">{hi ? "गुणवत्ता जांच" : "Quality check"}</h3>
                      <p className="text-xs text-slate-500">
                        {hi
                          ? "फसल की फोटो लें — AI ग्रेड देगा, अच्छी ग्रेड = बेहतर भाव"
                          : "Snap your crop — AI grades it, better grade = better price"}
                      </p>
                    </div>
                    <OpenCVScan
                      initialImage={attachedPhoto}
                      cropHint={cropName}
                      isVoiceHighlighted={false}
                      onApplyToForm={handleApplyScanResult}
                    />
                    {scannedGrade && (
                      <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                        <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-slate-900">
                          {attachedPhoto && <Image src={attachedPhoto} alt={cropName} fill className="object-cover" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <p className="truncate text-sm font-black text-slate-900">{cropName}</p>
                            <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-black text-white">{scannedGrade.grade}</span>
                          </div>
                          <p className="mt-0.5 truncate text-[11px] text-slate-500">
                            {hi ? "प्रमाणन: " : "Certification: "}
                            <span className="font-mono font-bold">{scannedGrade.assayerVerificationId}</span>
                          </p>
                        </div>
                        <BadgeCheck className="size-6 shrink-0 text-emerald-600" />
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 4: review */}
                {step === 4 && (
                  <div className="mx-auto max-w-2xl space-y-4">
                    <div className="text-center">
                      <h3 className="text-base sm:text-lg font-black text-slate-900">{hi ? "जांचें और प्रकाशित करें" : "Review & publish"}</h3>
                      <p className="text-xs text-slate-500">{hi ? "सब सही है? एक टैप में लाइव करें" : "All good? Go live in one tap"}</p>
                    </div>
                    <div className="overflow-hidden rounded-2xl border border-slate-200">
                      <div className="relative aspect-[16/8] w-full bg-slate-100">
                        {attachedPhoto ? (
                          <Image src={attachedPhoto} alt={cropName} fill className="object-cover" />
                        ) : (
                          <div className="flex size-full items-center justify-center text-slate-300">
                            <Camera className="size-10" />
                          </div>
                        )}
                        <span className="absolute left-3 top-3 rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-black text-white">
                          {scannedGrade?.grade ?? (hi ? "बिना स्कैन" : "Unscanned")}
                        </span>
                      </div>
                      <div className="space-y-2.5 p-4">
                        {[
                          { label: hi ? "फसल" : "Crop", value: `${cropName}${variety ? ` • ${variety}` : ""}` },
                          { label: hi ? "मात्रा" : "Quantity", value: `${qtyNum} ${unit}` },
                          { label: hi ? "आपका भाव" : "Your price", value: `₹${priceNum.toLocaleString("en-IN")} / ${unit}`, hot: true },
                          { label: hi ? "कुल लॉट मूल्य" : "Total lot value", value: `₹${lotValue.toLocaleString("en-IN")}`, hot: true },
                          { label: hi ? "मंडी से अतिरिक्त" : "Extra over mandi", value: `+₹${totalExtra.toLocaleString("en-IN")}` },
                          { label: hi ? "कटाई तिथि" : "Harvest date", value: harvestDate },
                        ].map((row) => (
                          <div key={row.label} className="flex items-center justify-between border-b border-dashed border-slate-100 pb-2 text-xs last:border-0 last:pb-0">
                            <span className="font-semibold text-slate-500">{row.label}</span>
                            <span className={cn("font-black", row.hot ? "text-emerald-700" : "text-slate-900")}>{row.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button
                      onClick={handlePublish}
                      className="h-14 w-full gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-base font-black text-white shadow-lg shadow-emerald-800/20 hover:from-emerald-500 hover:to-teal-600 active:scale-98"
                    >
                      <Rocket className="size-5" />
                      {hi ? "लिस्टिंग लाइव करें" : "Publish listing live"}
                    </Button>
                    <p className="text-center text-[11px] text-slate-400">
                      {hi
                        ? "प्रकाशित करते ही 0% कमीशन — पूरा पैसा सीधे आपको"
                        : "Zero commission on publish — the full amount comes to you"}
                    </p>
                  </div>
                )}

                {/* Wizard nav */}
                <div className="mx-auto mt-6 flex max-w-2xl items-center justify-between gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep((s) => (s > 1 ? ((s - 1) as typeof step) : s))}
                    disabled={step === 1}
                    className="h-12 rounded-2xl px-5 text-sm font-bold"
                  >
                    <ChevronLeft className="size-4" />
                    {hi ? "पीछे" : "Back"}
                  </Button>
                  {step < 4 ? (
                    <Button
                      onClick={() => setStep((s) => ((s + 1) as typeof step))}
                      disabled={!canNext(step) || isTyping}
                      className="h-12 flex-1 rounded-2xl bg-emerald-700 text-sm font-black text-white hover:bg-emerald-800 sm:flex-none sm:px-10"
                    >
                      {isTyping ? (hi ? "वॉइस भर रहा है…" : "Voice filling…") : step === 3 ? (hi ? "समीक्षा करें" : "Review") : (hi ? "आगे बढ़ें" : "Continue")}
                      <ChevronRight className="size-4" />
                    </Button>
                  ) : (
                    <span className="text-[11px] font-semibold text-slate-400">
                      {hi ? "ऊपर बटन से प्रकाशित करें" : "Use the button above to publish"}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        </section>

        {/* 3. My listings */}
        <section ref={listingsRef} className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">{hi ? "मेरी फसलें" : "My listings"}</h3>
              <p className="text-xs text-slate-500">{hi ? "लाइव, एस्क्रो और बिकी हुई फसलें" : "Live, in-escrow and sold harvests"}</p>
            </div>
            <span className="rounded-full bg-emerald-100 border border-emerald-300 px-3 py-1 text-xs font-black text-emerald-800">
              {listings.length} {hi ? "सक्रिय" : "active"}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((item) => {
              const meta = statusMeta(item.status);
              return (
                <div key={item.id} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs transition-all hover:shadow-lg">
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                    <Image src={item.imageUrl} alt={item.name} fill sizes="380px" className="object-cover transition-transform duration-300 group-hover:scale-105" />
                    <span className={cn("absolute left-2.5 top-2.5 rounded-full border px-2.5 py-0.5 text-[10px] font-black", meta.cls)}>
                      {meta.label}
                    </span>
                    <span className="absolute right-2.5 top-2.5 rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-black text-white">
                      {item.breakdown?.qualityGrade?.grade || "Grade A"}
                    </span>
                  </div>
                  <div className="space-y-2.5 p-4">
                    <h4 className="truncate text-sm font-black text-slate-900">{hi ? item.hindiName : item.name}</h4>
                    <div className="flex items-baseline justify-between">
                      <p className="text-lg font-black text-emerald-700">
                        ₹{item.farmGatePrice.toLocaleString("en-IN")}
                        <span className="text-[11px] font-semibold text-slate-500">/{item.unit}</span>
                      </p>
                      <span className="rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-700">
                        {item.quantityAvailable} {item.unit}
                      </span>
                    </div>
                    <div className="flex gap-2 border-t border-slate-100 pt-2.5">
                      <Button variant="outline" size="sm" className="h-9 flex-1 rounded-xl text-[11px] font-bold"
                        onClick={() => toast.success(hi ? "संपादन जल्द आ रहा है" : "Editing coming soon")}>
                        <Pencil className="size-3.5" />
                        {hi ? "बदलें" : "Edit"}
                      </Button>
                      <Button asChild size="sm" className="h-9 flex-1 rounded-xl bg-emerald-700 text-[11px] font-bold text-white hover:bg-emerald-800">
                        <Link href="/consumer">
                          {hi ? "बाज़ार में देखें" : "View in market"}
                          <ArrowRight className="size-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </main>
    </div>
  );
}
