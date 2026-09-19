"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, 
  MapPin, 
  Sparkles, 
  Lock, 
  ShieldCheck, 
  CheckCircle2, 
  Sliders, 
  TrendingDown, 
  Truck, 
  Copy, 
  X,
  Mic,
  MicOff,
  Search,
  Radio
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Navbar } from "@/components/shared/Navbar";
import { MatchScoreModal } from "@/components/shared/MatchScoreModal";
import { MOCK_PRODUCE_LISTINGS, type ProduceListing } from "@/lib/mock-data";
import { cardHover, staggerContainer } from "@/lib/animations";
import { getSpeechRecognition, type SpeechRecognitionEvent } from "@/lib/speech-types";
import { useLanguage } from "@/context/LanguageContext";

export default function ConsumerPortalPage() {
  const { t, language } = useLanguage();
  const [maxDistance, setMaxDistance] = useState(25);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [selectedListingForModal, setSelectedListingForModal] = useState<ProduceListing | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Escrow Lock Simulation State
  const [escrowListing, setEscrowListing] = useState<ProduceListing | null>(null);
  const [escrowStep, setEscrowStep] = useState<"idle" | "locking" | "locked">("idle");
  const [generatedPin, setGeneratedPin] = useState("7429");

  const CATEGORIES = [
    { id: "All", label: t("cat_all") },
    { id: "Vegetables", label: t("cat_vegetables") },
    { id: "Fruits", label: t("cat_fruits") },
    { id: "Grains", label: t("cat_grains") },
  ];

  // Voice Search Direct Web Speech Handler
  const startVoiceSearch = () => {
    const SpeechRecognition = getSpeechRecognition();

    if (!SpeechRecognition) {
      window.dispatchEvent(new CustomEvent("open-voice-assistant"));
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "hi-IN";
      recognition.continuous = false;
      recognition.interimResults = false;

      setIsListening(true);
      toast.info("बोलिए... उपज का नाम जैसे 'टमाटर' या 'Mango'", { icon: "🎙️" });

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const text = event.results[0][0].transcript;
        // Clean query of trailing punctuation
        const clean = text.replace(/[.,!?]/g, "").trim();
        setSearchQuery(clean);
        setIsListening(false);
        toast.success(`खोजा गया: "${clean}"`);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Filter listings by dynamic PostGIS proximity slider, category, and voice/text search
  const filteredListings = MOCK_PRODUCE_LISTINGS.filter((item) => {
    const withinDistance = item.distanceKm <= maxDistance;
    const categoryMatches = selectedCategory === "All" || item.category === selectedCategory;
    const query = searchQuery.trim().toLowerCase();
    const searchMatches = !query || 
      item.name.toLowerCase().includes(query) ||
      (item.hindiName && item.hindiName.toLowerCase().includes(query)) ||
      item.farmerName.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      (query.includes("tamatar") && item.name.toLowerCase().includes("tomato")) ||
      (query.includes("टमाटर") && item.name.toLowerCase().includes("tomato")) ||
      (query.includes("aam") && item.name.toLowerCase().includes("mango")) ||
      (query.includes("आम") && item.name.toLowerCase().includes("mango")) ||
      (query.includes("pyaz") && item.name.toLowerCase().includes("onion")) ||
      (query.includes("प्याज") && item.name.toLowerCase().includes("onion")) ||
      (query.includes("gehun") && item.name.toLowerCase().includes("wheat")) ||
      (query.includes("गेहूं") && item.name.toLowerCase().includes("wheat"));
    return withinDistance && categoryMatches && searchMatches;
  });

  const openMatchBreakdown = (listing: ProduceListing) => {
    setSelectedListingForModal(listing);
    setIsModalOpen(true);
  };

  const handleInitiatePurchase = (listing: ProduceListing) => {
    setEscrowListing(listing);
    setEscrowStep("idle");
  };

  const triggerEscrowLock = () => {
    if (!escrowListing) return;
    setEscrowStep("locking");

    setTimeout(() => {
      setEscrowStep("locked");
      setGeneratedPin("7429");
      toast.success("₹" + (escrowListing.farmGatePrice * 50) + " Locked in Razorpay Escrow Ledger!");
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(at_top_left,#ecfdf5,#ffffff)] bg-grid-subtle">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Header Hero */}
        <section className="glass rounded-3xl border border-emerald-200 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-700 text-white shadow-md">
                <ShoppingBag className="size-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    {t("consumer_hub_title")}
                  </h1>
                  <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-bold text-teal-800">
                    <Sparkles className="size-3 text-teal-600" />
                    {t("match_engine_badge")}
                  </span>
                </div>
                <p className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                  <MapPin className="size-3 text-emerald-600" />
                  {t("delivery_zone")}
                </p>
              </div>
            </div>

            {/* Hyperlocal Filter Badge */}
            <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-white/80 px-4 py-2.5 shadow-xs text-xs">
              <span className="size-2.5 rounded-full bg-emerald-500 animate-ping" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">{t("postgis_query_badge")}</span>
                <p className="font-bold text-slate-900">
                  {language === "hi" ? `खोज दायरा: <${maxDistance} किमी` : `ST_DWithin: <${maxDistance} km Radius`}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Voice-First Search & Discovery Banner */}
        <section className="relative overflow-hidden rounded-3xl border border-emerald-300 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-6 text-white shadow-lg">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-lg">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                <Radio className="size-3.5 animate-pulse text-emerald-200" />
                <span>{t("voice_first_tag")}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black">
                {t("voice_search_banner_title")}
              </h2>
              <p className="text-xs text-emerald-100">
                {t("voice_search_banner_sub")}
              </p>
            </div>

            {/* Voice Search Input Group */}
            <div className="w-full md:w-96 space-y-2">
              <div className="relative flex items-center">
                <Search className="absolute left-3.5 size-5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("voice_search_placeholder")}
                  className="w-full rounded-2xl border-2 border-white/30 bg-white py-3 pl-10 pr-24 text-sm font-medium text-slate-900 placeholder:text-slate-400 shadow-inner focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
                <div className="absolute right-1.5 flex items-center gap-1">
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                      title="Clear search"
                    >
                      <X className="size-4" />
                    </button>
                  )}
                  <button
                    onClick={startVoiceSearch}
                    className={`flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-bold transition-all ${
                      isListening
                        ? "bg-red-600 text-white animate-pulse shadow-md"
                        : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs"
                    }`}
                    title="बोलकर खोजें (Voice Search)"
                  >
                    {isListening ? (
                      <>
                        <MicOff className="size-4 animate-spin" />
                        <span>{t("voice_search_listening")}</span>
                      </>
                    ) : (
                      <>
                        <Mic className="size-4" />
                        <span>{t("voice_search_btn_speak")}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Quick Prompt Chips */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-medium text-emerald-100">{t("voice_suggestions_label")}</span>
                {[
                  { label: "🍅 टमाटर", query: "टमाटर" },
                  { label: "🌾 गेहूँ", query: "गेहूं" },
                  { label: "🥭 आम", query: "आम" },
                  { label: "🧅 प्याज", query: "प्याज" }
                ].map((chip) => (
                  <button
                    key={chip.label}
                    onClick={() => setSearchQuery(chip.query)}
                    className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-semibold text-white hover:bg-white/30 transition-colors backdrop-blur-xs"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Hyperlocal Proximity Slider & Category Filters (Phase 4 Masterplan) */}
        <section className="glass rounded-3xl border border-emerald-200/90 bg-white/95 p-6 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-emerald-100 pb-5">
            {/* Proximity Slider */}
            <div className="flex-1 max-w-xl space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="proximity-slider"
                  className="flex items-center gap-2 text-sm font-bold text-slate-900 cursor-pointer"
                >
                  <Sliders className="size-4 text-emerald-600" />
                  <span>{t("proximity_radius_label")}</span>
                  <span className="rounded-lg bg-emerald-100 px-2 py-0.5 text-xs font-black text-emerald-800">
                    &lt; {maxDistance} {language === "hi" ? "किमी" : "km"}
                  </span>
                </label>
                <span className="text-[11px] text-slate-500">
                  {filteredListings.length} {t("farms_matched_count")}
                </span>
              </div>

              <input
                id="proximity-slider"
                type="range"
                min={5}
                max={40}
                step={1}
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                aria-label="Hyperlocal Proximity Radius in kilometers"
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-emerald-100 accent-emerald-600 focus:outline-none"
              />

              <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                <span>{t("ultra_local_label")}</span>
                <span className="text-emerald-700 font-bold">{t("optimal_freshness_label")}</span>
                <span>{t("district_corridor_label")}</span>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                    selectedCategory === cat.id
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Listings Feed Grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredListings.map((listing) => (
              <motion.div
                key={listing.id}
                variants={cardHover}
                initial="rest"
                whileHover="hover"
                className="glass flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all space-y-4"
              >
                <div className="space-y-3">
                  {/* Image & Match Badge */}
                  <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-100 shadow-inner">
                    <Image
                      src={listing.imageUrl}
                      alt={listing.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 380px"
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-xs">
                      {listing.category}
                    </div>

                    {/* Interactive 5-Factor Match Score Trigger Button */}
                    <button
                      onClick={() => openMatchBreakdown(listing)}
                      className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1 text-xs font-extrabold text-white shadow-md hover:bg-emerald-700 transition-transform active:scale-95"
                      title="Click to view 5-Factor Match Breakdown"
                    >
                      <Sparkles className="size-3.5 text-amber-300" />
                      <span>{listing.matchScore}{t("card_match_suffix")}</span>
                    </button>

                    <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-md bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 backdrop-blur-xs">
                      <MapPin className="size-3" />
                      <span>{listing.distanceKm} {t("card_away_suffix")}</span>
                    </div>
                  </div>

                  {/* Title & Farmer Details */}
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">
                      {language === "hi" && listing.hindiName ? listing.hindiName : listing.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {t("card_farmer_label")} {listing.farmerName} • {listing.village}
                    </p>
                  </div>

                  {/* Pricing Comparison: Farm Gate vs Mandi */}
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3 space-y-1">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-emerald-800">
                          {t("card_direct_price_label")}
                        </span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-black text-emerald-700">
                            ₹{listing.farmGatePrice}
                          </span>
                          <span className="text-xs text-slate-500">/{listing.unit}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] uppercase text-slate-400">{t("card_mandi_rate_label")}</span>
                        <p className="text-xs font-bold text-slate-400 line-through">
                          ₹{listing.mandiBenchmarkPrice}/{listing.unit}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 pt-0.5">
                      <TrendingDown className="size-3.5" />
                      <span>
                        {t("card_save_label")} ₹{listing.mandiBenchmarkPrice - listing.farmGatePrice}/{listing.unit} (
                        {Math.round(((listing.mandiBenchmarkPrice - listing.farmGatePrice) / listing.mandiBenchmarkPrice) * 100)}% {t("card_cheaper_label")})
                      </span>
                    </div>
                  </div>

                  {/* Quality & Reliability pills */}
                  <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1">
                    <span className="flex items-center gap-1 text-emerald-700 font-medium">
                      <CheckCircle2 className="size-3.5" />
                      {listing.openCvMetrics.status.split(" - ")[0]}
                    </span>
                    <span className="font-semibold text-amber-700">
                      {listing.breakdown.reliability.rating} ★ {t("card_trust_score")}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openMatchBreakdown(listing)}
                    className="text-xs border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    <span>{t("btn_view_match")}</span>
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleInitiatePurchase(listing)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5 shadow-xs"
                  >
                    <Lock className="size-3.5" />
                    <span>{t("btn_secure_escrow_order")}</span>
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* 5-Factor Match Score Breakdown Modal */}
        <MatchScoreModal
          listing={selectedListingForModal}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

        {/* Escrow Lock Simulation Sheet / Modal (Phase 4 Masterplan) */}
        <AnimatePresence>
          {escrowListing && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="glass relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-emerald-300 bg-white p-6 shadow-2xl space-y-6 sm:p-7">
                {/* Header */}
                <div className="flex items-start justify-between border-b border-emerald-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                      <Lock className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        Smart Escrow Funds Lock
                      </h3>
                      <p className="text-xs text-slate-500">
                        100% Buyer & Farmer Financial Protection
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setEscrowListing(null)}
                    aria-label="Close escrow modal"
                    className="rounded-full p-1 text-slate-500 hover:bg-slate-100"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                {/* Order Summary */}
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50 p-4 space-y-2 text-xs">
                  <div className="flex justify-between font-bold text-slate-900 text-sm">
                    <span>{escrowListing.name}</span>
                    <span>₹{escrowListing.farmGatePrice * 50}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Batch Size: 50 {escrowListing.unit}</span>
                    <span>Rate: ₹{escrowListing.farmGatePrice}/{escrowListing.unit}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Farmer: {escrowListing.farmerName}</span>
                    <span>Distance: {escrowListing.distanceKm} km</span>
                  </div>
                  <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-emerald-800">
                    <span>Total Escrow Hold:</span>
                    <span className="text-base font-extrabold">₹{escrowListing.farmGatePrice * 50}</span>
                  </div>
                </div>

                {/* Escrow Lock State Machine */}
                {escrowStep === "idle" && (
                  <div className="space-y-4">
                    <div className="rounded-2xl bg-emerald-50/80 p-3.5 border border-emerald-100 text-xs text-emerald-900 space-y-1">
                      <p className="font-bold flex items-center gap-1.5">
                        <ShieldCheck className="size-4 text-emerald-600" />
                        How Krishi Setu Escrow Protects You:
                      </p>
                      <p className="text-[11px] text-slate-600">
                        Funds are safely locked in a Razorpay Escrow ledger. The farmer is ONLY paid when you
                        physically inspect the produce at your door and provide your secret 4-digit PIN!
                      </p>
                    </div>

                    <Button
                      onClick={triggerEscrowLock}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 rounded-xl gap-2 shadow-md"
                    >
                      <Lock className="size-4" />
                      <span>Confirm Purchase & Lock Funds in Escrow</span>
                    </Button>
                  </div>
                )}

                {escrowStep === "locking" && (
                  <div className="py-8 text-center space-y-4">
                    <div className="relative mx-auto size-16">
                      <div className="size-16 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin" />
                      <Lock className="absolute inset-0 m-auto size-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        Locking Funds in Smart Escrow Ledger...
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Generating immutable cryptographic delivery token & PIN
                      </p>
                    </div>
                  </div>
                )}

                {escrowStep === "locked" && (
                  <div className="space-y-5 animate-in fade-in">
                    <div className="rounded-2xl border border-emerald-400 bg-emerald-50 p-4 text-center space-y-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-200 px-3 py-0.5 text-xs font-bold text-emerald-900">
                        <CheckCircle2 className="size-3.5 text-emerald-700" />
                        Funds Locked in Escrow (#KS-ESC-8921)
                      </span>
                      <p className="text-xs text-slate-600">
                        Your 4-Digit Handover Verification PIN:
                      </p>
                      <div className="mx-auto flex w-fit items-center gap-3 rounded-2xl bg-white px-6 py-3 shadow-md border border-emerald-300">
                        <span className="font-mono text-3xl font-black tracking-widest text-emerald-700">
                          {generatedPin}
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard?.writeText(generatedPin);
                            toast.success("PIN Copied to Clipboard!");
                          }}
                          aria-label="Copy secret delivery PIN"
                          className="rounded-lg p-1 text-slate-500 hover:text-emerald-700"
                        >
                          <Copy className="size-4" />
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-500 italic">
                        Share this PIN with the transporter ONLY upon physical inspection!
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Truck className="size-4 text-purple-600" />
                        <span>Ready to test Transporter Handover with PIN <strong>7429</strong>?</span>
                      </div>
                      <Button asChild size="sm" className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs">
                        <Link href="/delivery">Go to Transporter App</Link>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
