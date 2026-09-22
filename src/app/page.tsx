"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Sprout, 
  ShoppingBag, 
  Warehouse, 
  Truck, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  ShieldAlert, 
  Compass, 
  CheckCircle2, 
  Lock, 
  PhoneCall, 
  Star,
  Scan,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/shared/Navbar";
import { PlatformGuideModal } from "@/components/shared/PlatformGuideModal";
import { cardHover, fadeInUp, staggerContainer } from "@/lib/animations";
import { useLanguage } from "@/context/LanguageContext";
import { KrishiSetuLogo } from "@/components/shared/KrishiSetuLogo";
import { RATING_CONFIG } from "@/config/rating-config";

export default function HomePage() {
  const { language, t } = useLanguage();
  const [guideModalOpen, setGuideModalOpen] = useState(false);

  const LIVE_TICKER_ITEMS = [
    { crop: t("crop_wheat"), farmGate: "₹3,400/q", mandi: "₹2,850/q", saving: language === "hi" ? "+19% अधिक लाभ" : "+19% Realization" },
    { crop: t("crop_soyabean"), farmGate: "₹4,850/q", mandi: "₹4,200/q", saving: language === "hi" ? "+15% अधिक आय" : "+15% Realization" },
    { crop: t("crop_rice"), farmGate: "₹7,200/q", mandi: "₹6,100/q", saving: language === "hi" ? "+18% अधिक लाभ" : "+18% Realization" },
    { crop: t("crop_corn"), farmGate: "₹2,350/q", mandi: "₹1,950/q", saving: language === "hi" ? "+20% अधिक आय" : "+20% Realization" },
    { crop: t("crop_bajra"), farmGate: "₹2,600/q", mandi: "₹2,150/q", saving: language === "hi" ? "+21% अधिक लाभ" : "+21% Realization" },
    { crop: t("crop_jowar"), farmGate: "₹5,200/q", mandi: "₹4,400/q", saving: language === "hi" ? "+18% अधिक आय" : "+18% Realization" },
  ];

  const PRIMARY_ROLES = [
    {
      role: "farmer",
      title: t("role_farmer_title"),
      href: "/farmer",
      tagline: t("role_farmer_tagline"),
      description: t("role_farmer_desc"),
      icon: Sprout,
      color: "from-emerald-500 to-teal-700",
      accentBg: "bg-emerald-50 text-emerald-800 border-emerald-200",
      features: [t("role_farmer_f1"), t("role_farmer_f2"), t("role_farmer_f3")],
      ctaText: t("role_farmer_cta"),
    },
    {
      role: "consumer",
      title: t("role_consumer_title"),
      href: "/consumer",
      tagline: t("role_consumer_tagline"),
      description: t("role_consumer_desc"),
      icon: ShoppingBag,
      color: "from-teal-600 to-cyan-700",
      accentBg: "bg-teal-50 text-teal-800 border-teal-200",
      features: [t("role_consumer_f1"), t("role_consumer_f2"), t("role_consumer_f3")],
      ctaText: t("role_consumer_cta"),
    },
    {
      role: "bulk_buyer",
      title: t("role_buyer_title"),
      href: "/buyer/dashboard",
      tagline: t("role_buyer_tagline"),
      description: t("role_buyer_desc"),
      icon: Warehouse,
      color: "from-amber-600 to-orange-700",
      accentBg: "bg-amber-50 text-amber-800 border-amber-200",
      features: [t("role_buyer_f1"), t("role_buyer_f2"), t("role_buyer_f3")],
      ctaText: t("role_buyer_cta"),
    },
  ];

  const SECONDARY_ROLES = [
    {
      role: "delivery",
      title: t("role_delivery_title"),
      href: "/delivery",
      ariaLabel: "Explore Delivery Portal",
      tagline: t("role_delivery_tagline"),
      description: t("role_delivery_desc"),
      icon: Truck,
      color: "text-purple-700 bg-purple-100",
      badge: t("role_delivery_badge"),
      ctaText: t("role_delivery_cta"),
    },
    {
      role: "admin",
      title: t("role_admin_title"),
      href: "/admin",
      ariaLabel: "Explore Admin Panel",
      tagline: t("role_admin_tagline"),
      description: t("role_admin_desc"),
      icon: ShieldCheck,
      color: "text-rose-700 bg-rose-100",
      badge: t("role_admin_badge"),
      ctaText: t("role_admin_cta"),
    },
  ];

  const TESTIMONIALS = [
    {
      name: t("test_1_name"),
      role: t("test_1_role"),
      crop: t("test_1_crop"),
      badge: t("badge_pmkisan_verified"),
      text: t("test_1_text"),
      rating: 5,
    },
    {
      name: t("test_2_name"),
      role: t("test_2_role"),
      crop: t("test_2_crop"),
      badge: t("badge_buyer_verified"),
      text: t("test_2_text"),
      rating: 5,
    },
    {
      name: t("test_3_name"),
      role: t("test_3_role"),
      crop: t("test_3_crop"),
      badge: t("badge_institutional_partner"),
      text: t("test_3_text"),
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-clip bg-[radial-gradient(at_top_left,#ecfdf5,#ffffff)] bg-grid-subtle flex flex-col justify-between">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl min-w-0 px-3 sm:px-6 lg:px-8 py-5 sm:py-10 space-y-10 sm:space-y-20 flex-1 overflow-x-clip">
        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto w-full min-w-0 space-y-5 sm:space-y-6 pt-1 sm:pt-6">
          {/* Live Cluster Proximity Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-300/80 bg-white/95 px-3 sm:px-4 py-1.5 shadow-xs backdrop-blur-md max-w-full"
          >
            <span className="size-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
            <span className="text-[10px] sm:text-xs font-bold tracking-tight text-emerald-900 truncate">
              {t("live_cluster_badge")}
            </span>
          </motion.div>

          {/* Headline & Value Proposition */}
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="space-y-3 sm:space-y-4 w-full min-w-0">
            <h1 className="text-2xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-tight sm:leading-[1.12] break-words">
              {t("hero_headline_prefix")}{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 bg-clip-text text-transparent">
                {t("hero_headline_gradient")}
              </span>{" "}
              {t("hero_headline_suffix")}
            </h1>
            <p className="text-xs sm:text-base font-semibold text-emerald-800 break-words">
              {t("hero_subheadline")}
            </p>
            <p className="mx-auto max-w-2xl text-xs sm:text-base text-slate-600 leading-relaxed px-1">
              {t("hero_description")}
            </p>
          </motion.div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 pt-2 w-full max-w-sm sm:max-w-none mx-auto">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white shadow-md gap-2 font-bold text-sm px-6 h-12 rounded-xl"
            >
              <Link href="/farmer">
                <Sprout className="size-4.5 shrink-0" />
                <span>{t("btn_start_selling")}</span>
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-emerald-300 text-emerald-900 hover:bg-emerald-50 gap-2 font-bold text-sm px-6 h-12 rounded-xl"
            >
              <Link href="/consumer">
                <ShoppingBag className="size-4.5 text-emerald-700 shrink-0" />
                <span>{t("btn_shop_produce")}</span>
              </Link>
            </Button>

            <Button
              size="lg"
              variant="ghost"
              onClick={() => setGuideModalOpen(true)}
              className="w-full sm:w-auto text-slate-700 hover:bg-slate-100 gap-2 font-semibold text-xs sm:text-sm h-12 rounded-xl"
            >
              <Compass className="size-4 text-emerald-700 shrink-0" />
              <span>{t("btn_how_it_works")}</span>
            </Button>
          </div>

          {/* Production 4-Pillar Value Telemetry Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 pt-4 sm:pt-6 max-w-4xl mx-auto w-full min-w-0">
            <div className="glass rounded-2xl p-2.5 sm:p-4 border border-emerald-200/80 text-left min-w-0 overflow-hidden">
              <div className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-bold text-emerald-800 truncate">
                <TrendingUp className="size-3 sm:size-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">{t("stat_farmer_realization")}</span>
              </div>
              <p className="mt-1 text-lg sm:text-2xl font-black text-slate-900 truncate">{t("stat_farmer_realization_val")}</p>
              <p className="text-[9px] sm:text-xs text-slate-600 line-clamp-2 leading-tight">{t("stat_farmer_realization_sub")}</p>
            </div>

            <div className="glass rounded-2xl p-2.5 sm:p-4 border border-emerald-200/80 text-left min-w-0 overflow-hidden">
              <div className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-bold text-teal-800 truncate">
                <Clock className="size-3 sm:size-3.5 text-teal-600 shrink-0" />
                <span className="truncate">{t("stat_transit")}</span>
              </div>
              <p className="mt-1 text-lg sm:text-2xl font-black text-slate-900 truncate">{t("stat_transit_val")}</p>
              <p className="text-[9px] sm:text-xs text-slate-600 line-clamp-2 leading-tight">{t("stat_transit_sub")}</p>
            </div>

            <div className="glass rounded-2xl p-2.5 sm:p-4 border border-emerald-200/80 text-left min-w-0 overflow-hidden">
              <div className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-bold text-blue-800 truncate">
                <ShieldAlert className="size-3 sm:size-3.5 text-blue-600 shrink-0" />
                <span className="truncate">{t("stat_spoilage")}</span>
              </div>
              <p className="mt-1 text-lg sm:text-2xl font-black text-slate-900 truncate">{t("stat_spoilage_val")}</p>
              <p className="text-[9px] sm:text-xs text-slate-600 line-clamp-2 leading-tight">{t("stat_spoilage_sub")}</p>
            </div>

            <div className="glass rounded-2xl p-2.5 sm:p-4 border border-emerald-200/80 text-left min-w-0 overflow-hidden">
              <div className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-bold text-amber-800 truncate">
                <Lock className="size-3 sm:size-3.5 text-amber-600 shrink-0" />
                <span className="truncate">{t("stat_escrow")}</span>
              </div>
              <p className="mt-1 text-lg sm:text-2xl font-black text-slate-900 truncate">{t("stat_escrow_val")}</p>
              <p className="text-[9px] sm:text-xs text-slate-600 line-clamp-2 leading-tight">{t("stat_escrow_sub")}</p>
            </div>
          </div>
        </section>

        {/* Live Mandi Benchmark vs Farm-Gate Comparison Ticker */}
        <section className="w-full max-w-full min-w-0 overflow-hidden rounded-2xl border border-emerald-200/80 bg-white/90 p-3 sm:p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-2 px-1">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 truncate">
              {t("ticker_title")}
            </h3>
          </div>
          <div className="w-full max-w-full min-w-0 overflow-x-auto no-scrollbar py-1">
            <div className="flex items-center gap-2.5 sm:gap-3 w-max">
              {LIVE_TICKER_ITEMS.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 shrink-0 rounded-xl bg-slate-50 border border-slate-200/70 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs"
                >
                  <span className="font-bold text-slate-800">{item.crop}</span>
                  <div className="flex items-center gap-1 text-[11px]">
                    <span className="text-emerald-700 font-bold">{item.farmGate}</span>
                    <span className="text-slate-400 line-through">{item.mandi}</span>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    {item.saving}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How Krishi Setu Works: 3-Pillar Direct Highway (Farmer, Consumer, Logistics) */}
        <section id="how-it-works" className="space-y-5 pt-2">
          <div className="text-center space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/90 px-3 py-1 text-xs font-bold text-emerald-900 border border-emerald-200">
              <Compass className="size-3.5 text-emerald-700" />
              <span>{language === "hi" ? "कार्यप्रणाली (How It Works)" : "How It Works"}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              {language === "hi" ? "खेत से रसोई तक: सीधा डिजिटल मार्ग" : "From Farm Gate to Kitchen in 3 Steps"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
              {language === "hi" 
                ? "बिना बिचौलियों के — किसान, उपभोक्ता और डिलीवरी नेटवर्क कैसे आपस में जुड़ते हैं"
                : "Connecting farmers, consumers, and delivery partners with zero middlemen markups"}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {/* Step 1: Farmer */}
            <div className="rounded-3xl border border-emerald-200 bg-white/95 p-5 shadow-xs space-y-3 relative overflow-hidden group hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 font-black text-sm">
                  1
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  🌾 किसान (Farmer)
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900">बोलकर लिस्टिंग व एआई क्वालिटी जांच</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                किसान अपनी भाषा में बोलकर फसल, मात्रा और भाव तय करते हैं। मोबाइल कैमरे से ऑन-डिवाइस OpenCV ग्रेड A/B/C की तुरंत जांच होती है।
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <Link href="/farmer" className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-800">
                  <span>किसान पोर्टल</span>
                  <ArrowRight className="size-3.5" />
                </Link>
                <span className="text-[10px] text-emerald-600 font-semibold">0% आढ़त कटौती</span>
              </div>
            </div>

            {/* Step 2: Consumer */}
            <div className="rounded-3xl border border-teal-200 bg-white/95 p-5 shadow-xs space-y-3 relative overflow-hidden group hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="flex size-9 items-center justify-center rounded-xl bg-teal-100 text-teal-800 font-black text-sm">
                  2
                </span>
                <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                  🛒 उपभोक्ता (Consumer)
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900">&lt;25km ताज़ा खोज व 30-40% बचत</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                उपभोक्ता अपने पास के खेतों से 12 घंटे में कटी ताज़ा फसलें सीधे फार्म-गेट भाव पर खरीदते हैं। खरीदने से पहले एआई ग्रेड व शेल्फ लाइफ दिखती है।
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <Link href="/consumer" className="inline-flex items-center gap-1 font-bold text-teal-700 hover:text-teal-800">
                  <span>उपभोक्ता बाज़ार</span>
                  <ArrowRight className="size-3.5" />
                </Link>
                <span className="text-[10px] text-teal-600 font-semibold">30-40% सीधी बचत</span>
              </div>
            </div>

            {/* Step 3: Delivery & Escrow */}
            <div className="rounded-3xl border border-amber-200 bg-white/95 p-5 shadow-xs space-y-3 relative overflow-hidden group hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="flex size-9 items-center justify-center rounded-xl bg-amber-100 text-amber-800 font-black text-sm">
                  3
                </span>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  🔒 सुरक्षित एस्क्रो व डिलीवरी
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900">4-अंकीय पिन से सुरक्षित हैंडओवर</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                रुपये सुरक्षित एस्क्रो में रहते हैं। उपभोक्ता द्वारा दरवाज़े पर सामान देखकर 4-अंकीय पिन साझा करने पर ही किसान को तुरंत यूपीआई भुगतान मिलता है।
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => setGuideModalOpen(true)}
                  className="inline-flex items-center gap-1 font-bold text-amber-700 hover:text-amber-800"
                >
                  <span>विस्तृत गाइड देखें</span>
                  <ArrowRight className="size-3.5" />
                </button>
                <span className="text-[10px] text-amber-600 font-semibold">100% सुरक्षित भुगतान</span>
              </div>
            </div>
          </div>
        </section>

        {/* Ecosystem Portals (5 Core Role Gateways) */}
        <section className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {t("ecosystem_title")}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              {t("ecosystem_sub")}
            </p>
          </div>

          {/* Primary Role Cards (Farmer, Consumer, Bulk Buyer) */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full min-w-0"
          >
            {PRIMARY_ROLES.map((card) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.role}
                  variants={cardHover}
                  initial="rest"
                  whileHover="hover"
                  className="glass flex flex-col justify-between rounded-3xl border border-emerald-200/80 bg-white/95 p-4 sm:p-6 shadow-xs transition-all min-w-0 overflow-hidden"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br ${card.color} text-white shadow-md`}>
                        <Icon className="size-6" />
                      </div>
                      <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${card.accentBg}`}>
                        {card.tagline.split(" ")[0]}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900">{card.title}</h3>
                      <p className="text-xs font-semibold text-emerald-800 mt-0.5">{card.tagline}</p>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        {card.description}
                      </p>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      {card.features.map((feat) => (
                        <div key={feat} className="flex items-center gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6">
                    <Button asChild className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold gap-2 shadow-xs h-11 rounded-xl">
                      <Link href={card.href} aria-label={`Enter as ${card.title}`}>
                        <span>{card.ctaText}</span>
                        <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Secondary Role Cards (Transporter & Admin) */}
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 pt-2 w-full min-w-0">
            {SECONDARY_ROLES.map((card) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.role}
                  variants={cardHover}
                  initial="rest"
                  whileHover="hover"
                  className="glass flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 rounded-2xl border border-slate-200/80 bg-white/90 p-4 sm:p-5 shadow-xs transition-all min-w-0 overflow-hidden"
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${card.color}`}>
                      <Icon className="size-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-slate-900">{card.title}</h4>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                          {card.badge}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-emerald-800 mt-0.5">{card.tagline}</p>
                      <p className="text-xs text-slate-600 mt-1 max-w-sm leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  </div>

                  <Button asChild variant="outline" size="sm" className="shrink-0 border-slate-300 text-slate-900 hover:bg-slate-100 gap-1.5 self-start sm:self-center h-10 rounded-xl">
                    <Link href={card.href} aria-label={card.ariaLabel}>
                      <span>{card.ctaText}</span>
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Technology & Trust Innovation Grid */}
        <section className="glass rounded-3xl border border-emerald-200/90 bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/70 p-5 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-emerald-800">
                <Sparkles className="size-3.5 text-emerald-700" />
                {t("tech_infra_tag")}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                {t("tech_infra_title")}
              </h3>
            </div>
            <Button
              onClick={() => setGuideModalOpen(true)}
              className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs gap-1.5 self-start sm:self-auto rounded-xl"
            >
              <Compass className="size-3.5" />
              <span>{t("btn_arch_tour")}</span>
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 pt-2 text-xs">
            <div className="rounded-2xl bg-white/95 p-4 sm:p-5 border border-emerald-100 shadow-xs space-y-2">
              <strong className="text-slate-900 font-bold flex items-center gap-2 text-sm">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                {t("tech_card1_title")}
              </strong>
              <p className="text-slate-600 leading-relaxed">
                {t("tech_card1_desc")}
              </p>
            </div>

            <div className="rounded-2xl bg-white/95 p-4 sm:p-5 border border-emerald-100 shadow-xs space-y-2">
              <strong className="text-slate-900 font-bold flex items-center gap-2 text-sm">
                <Scan className="size-4 text-emerald-600 shrink-0" />
                {t("tech_card2_title")}
              </strong>
              <p className="text-slate-600 leading-relaxed">
                {t("tech_card2_desc")}
              </p>
            </div>

            <div className="rounded-2xl bg-white/95 p-4 sm:p-5 border border-emerald-100 shadow-xs space-y-2">
              <strong className="text-slate-900 font-bold flex items-center gap-2 text-sm">
                <Lock className="size-4 text-emerald-600 shrink-0" />
                {t("tech_card3_title")}
              </strong>
              <p className="text-slate-600 leading-relaxed">
                {t("tech_card3_desc")}
              </p>
            </div>
          </div>
        </section>

        {/* Verified Farmer & Buyer Testimonials */}
        <section className="space-y-6">
          <div className="text-center space-y-1.5">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                {t("testimonials_title")}
              </h2>
              {RATING_CONFIG.SHOW_PROTOTYPE_DISCLAIMER && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200/90 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 shadow-2xs">
                  <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
                  {t("dummy_rating_disclaimer")}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-600">
              {t("testimonials_sub")}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {TESTIMONIALS.map((tItem, idx) => (
              <div
                key={idx}
                className="glass flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    {RATING_CONFIG.SHOW_STAR_RATINGS && (
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center gap-0.5 text-amber-500">
                          {[...Array(tItem.rating)].map((_, rIdx) => (
                            <Star key={rIdx} className="size-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        {RATING_CONFIG.SHOW_DUMMY_RATING_BADGE && (
                          <span className="rounded bg-amber-50 border border-amber-200 px-1.5 py-0.5 text-[9px] font-bold text-amber-800 tracking-wide">
                            {t("dummy_rating_badge")}
                          </span>
                        )}
                      </div>
                    )}
                    <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                      {tItem.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 italic leading-relaxed">
                    &ldquo;{tItem.text}&rdquo;
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <p className="font-bold text-xs text-slate-900">{tItem.name}</p>
                  <p className="text-[11px] text-slate-500">{tItem.role}</p>
                  <p className="text-[10px] font-semibold text-emerald-700 mt-0.5">{tItem.crop}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Regulatory & Institutional Trust Badges */}
        <section className="rounded-2xl border border-slate-200 bg-white/70 p-5 sm:p-6 shadow-xs">
          <div className="flex flex-wrap items-center justify-around gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <ShieldCheck className="size-8 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold text-xs sm:text-sm text-slate-900">{t("compliance_dpdp")}</p>
                <p className="text-[10px] text-slate-500">{t("compliance_dpdp_sub")}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Award className="size-8 text-teal-600 shrink-0" />
              <div>
                <p className="font-bold text-xs sm:text-sm text-slate-900">{t("compliance_pmkisan")}</p>
                <p className="text-[10px] text-slate-500">{t("compliance_pmkisan_sub")}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Lock className="size-8 text-amber-600 shrink-0" />
              <div>
                <p className="font-bold text-xs sm:text-sm text-slate-900">{t("compliance_escrow")}</p>
                <p className="text-[10px] text-slate-500">{t("compliance_escrow_sub")}</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Production Multi-Column Footer */}
      <footer className="w-full max-w-[100vw] overflow-x-clip border-t border-emerald-100 bg-white/95 mt-12 sm:mt-16 text-slate-600 text-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 w-full min-w-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 w-full min-w-0">
            {/* Column 1: Brand Info */}
            <div className="col-span-1 sm:col-span-2 space-y-3 min-w-0">
              <div className="flex items-center gap-2.5">
                <KrishiSetuLogo size={36} className="size-9 shrink-0" />
                <span className="font-extrabold text-base text-slate-900 truncate">Krishi Setu (कृषि सेतु)</span>
              </div>
              <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                {t("footer_tagline")}
              </p>
              <div className="flex items-center gap-2 pt-1 text-emerald-800 font-semibold text-[11px] sm:text-xs">
                <PhoneCall className="size-3.5 text-emerald-600 shrink-0" />
                <span>{t("footer_helpline")}</span>
              </div>
            </div>

            {/* Column 2: Portals */}
            <div className="space-y-2 min-w-0">
              <p className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">{t("footer_portals")}</p>
              <ul className="space-y-1.5 text-slate-600">
                <li><Link href="/farmer" className="hover:text-emerald-700 transition-colors">{t("footer_link_farmer")}</Link></li>
                <li><Link href="/consumer" className="hover:text-emerald-700 transition-colors">{t("footer_link_consumer")}</Link></li>
                <li><Link href="/buyer/dashboard" className="hover:text-emerald-700 transition-colors">{t("footer_link_buyer")}</Link></li>
                <li><Link href="/delivery" className="hover:text-emerald-700 transition-colors">{t("footer_link_delivery")}</Link></li>
                <li><Link href="/admin" className="hover:text-emerald-700 transition-colors">{t("footer_link_admin")}</Link></li>
              </ul>
            </div>

            {/* Column 3: Platform Features */}
            <div className="space-y-2 min-w-0">
              <p className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">{t("footer_innovations")}</p>
              <ul className="space-y-1.5 text-slate-600">
                <li><Link href="/farmer" className="hover:text-emerald-700 transition-colors">{t("footer_link_voice")}</Link></li>
                <li><Link href="/farmer" className="hover:text-emerald-700 transition-colors">{t("footer_link_opencv")}</Link></li>
                <li><Link href="/consumer" className="hover:text-emerald-700 transition-colors">{t("footer_link_proximity")}</Link></li>
                <li><Link href="/consumer" className="hover:text-emerald-700 transition-colors">{t("footer_link_match")}</Link></li>
                <li><button onClick={() => setGuideModalOpen(true)} className="hover:text-emerald-700 transition-colors text-left">{t("footer_link_arch")}</button></li>
              </ul>
            </div>

            {/* Column 4: Legal & Compliance */}
            <div className="space-y-2 min-w-0">
              <p className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">{t("footer_compliance")}</p>
              <ul className="space-y-1.5 text-slate-600">
                <li><span className="text-slate-700 font-medium">{t("footer_legal_dpdp")}</span></li>
                <li><span className="text-slate-700 font-medium">{t("footer_legal_pmkisan")}</span></li>
                <li><span className="text-slate-700 font-medium">{t("footer_legal_escrow")}</span></li>
                <li><span className="text-slate-700 font-medium">{t("footer_legal_gst")}</span></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100 pt-6 text-[11px] text-slate-500">
            <p>{t("footer_copyright")}</p>
            <div className="flex items-center gap-4">
              <span>{t("footer_node")}</span>
              <span>Language: {language === "en" ? "English" : "हिन्दी"}</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Interactive Platform Architecture Guide Modal */}
      <PlatformGuideModal
        isOpen={guideModalOpen}
        onClose={() => setGuideModalOpen(false)}
      />
    </div>
  );
}
