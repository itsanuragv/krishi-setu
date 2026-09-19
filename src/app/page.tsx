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

export default function HomePage() {
  const { language } = useLanguage();
  const [guideModalOpen, setGuideModalOpen] = useState(false);

  const LIVE_TICKER_ITEMS = [
    { crop: "Fresh Desi Tomatoes", farmGate: "₹40/kg", mandi: "₹58/kg", saving: "31% Lower" },
    { crop: "Basmati Paddy Rice", farmGate: "₹60/kg", mandi: "₹88/kg", saving: "+46% Realization" },
    { crop: "Nashik Red Onions", farmGate: "₹24/kg", mandi: "₹36/kg", saving: "33% Lower" },
    { crop: "Sharbati Golden Wheat", farmGate: "₹28/kg", mandi: "₹39/kg", saving: "+39% Realization" },
    { crop: "Green Bell Capsicum", farmGate: "₹45/kg", mandi: "₹68/kg", saving: "34% Lower" },
    { crop: "Desi Jyoti Potatoes", farmGate: "₹18/kg", mandi: "₹26/kg", saving: "30% Lower" },
  ];

  const PRIMARY_ROLES = [
    {
      role: "farmer",
      title: "Farmer / Producer (किसान)",
      href: "/farmer",
      tagline: "Voice Listing + On-Device Quality QC",
      description:
        "Speak in Hindi or English to list crops instantly. On-device camera pre-check tests blur and brightness. Guaranteed UPI escrow payout upon delivery.",
      icon: Sprout,
      color: "from-emerald-500 to-teal-700",
      accentBg: "bg-emerald-50 text-emerald-800 border-emerald-200",
      features: ["Vernacular Voice-to-Form AI", "OpenCV Edge Quality QC", "Direct Farm-Gate UPI Payout"],
      ctaText: "Enter Farmer Portal",
    },
    {
      role: "consumer",
      title: "Consumer & Retail (उपभोक्ता)",
      href: "/consumer",
      tagline: "Hyperlocal Proximity (<25km) & 5-Factor Match",
      description:
        "Direct vine-to-kitchen farm produce harvested <12h ago. Algorithmic transparency evaluating price, distance, grade, and farmer trust score.",
      icon: ShoppingBag,
      color: "from-teal-600 to-cyan-700",
      accentBg: "bg-teal-50 text-teal-800 border-teal-200",
      features: ["PostGIS <25km Proximity Slider", "5-Factor Match Scoring", "Ledger-Locked Escrow PIN"],
      ctaText: "Shop Fresh Harvest",
    },
    {
      role: "bulk_buyer",
      title: "Bulk Buyer & HoReCa (थोक खरीदार)",
      href: "/buyer/dashboard",
      tagline: "FPO Aggregation & Commercial Lots",
      description:
        "Procure multi-quintal commercial lots directly from farmer collectives and FPOs with digital quality verification and standardized tax invoices.",
      icon: Warehouse,
      color: "from-amber-600 to-orange-700",
      accentBg: "bg-amber-50 text-amber-800 border-amber-200",
      features: ["FPO Forward Contracts", "Direct Multi-Quintal Lots", "GST Invoicing & Escrow"],
      ctaText: "Institutional Procurement",
    },
  ];

  const SECONDARY_ROLES = [
    {
      role: "delivery",
      title: "Delivery Transporter (परिवहन नेटवर्क)",
      href: "/delivery",
      ariaLabel: "Explore Delivery Portal",
      tagline: "OR-Tools Optimized Multi-Stop Routing",
      description:
        "Multi-stop farm pickups and consumer drop-offs with distance optimization, vehicle routing algorithms, and instant 4-digit PIN verification settlement.",
      icon: Truck,
      color: "text-purple-700 bg-purple-100",
      badge: "VRP Multi-Stop",
    },
    {
      role: "admin",
      title: "Governance & Mediation (प्रशासन व निगरानी)",
      href: "/admin",
      ariaLabel: "Explore Admin Panel",
      tagline: "Escrow GMV & Split-Screen Dispute Resolution",
      description:
        "Mediate produce quality disputes with side-by-side OpenCV farm photo vs consumer arrival photo. MeitY DPDP Act 2023 compliance monitor.",
      icon: ShieldCheck,
      color: "text-rose-700 bg-rose-100",
      badge: "DPDP Act 2023",
    },
  ];

  const TESTIMONIALS = [
    {
      name: "Rameshwar Patil",
      role: "Smallholder Farmer (पुणे, महाराष्ट्र)",
      crop: "Tomatoes & Basmati Rice",
      badge: "PM-KISAN Verified",
      text: "Pehle APMC Mandi mein aadhitiye 30-40% commission kaat lete the. Krishi Setu par maine bolkar listing daali, aur agle hi din direct payment mere bank account mein aa gaya.",
      rating: 5,
    },
    {
      name: "Priya Sharma",
      role: "Urban Retail Consumer (बाणेर, पुणे)",
      crop: "Weekly Organic Kitchen Basket",
      badge: "Verified Buyer",
      text: "Getting fresh vegetables harvested under 12 hours ago directly from farmers within 20km is incredible. The 4-digit delivery PIN gives complete peace of mind that my money is safe.",
      rating: 5,
    },
    {
      name: "Siddharth Verma",
      role: "Procurement Lead (Hotel Annapurna)",
      crop: "Bulk Onions & Vegetables",
      badge: "Institutional Partner",
      text: "We procure 300kg weekly directly from FPO collectives. Consistent OpenCV quality grading and GST compliant escrow settlement saved our restaurant chain 22% in procurement costs.",
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
              🟢 LIVE CLUSTER: 24 ACTIVE FARMS (&lt;25KM) • AVG DISPATCH: 8.4 HRS
            </span>
          </motion.div>

          {/* Headline & Value Proposition */}
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="space-y-3 sm:space-y-4 w-full min-w-0">
            <h1 className="text-2xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-tight sm:leading-[1.12] break-words">
              Bharat&apos;s Direct{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 bg-clip-text text-transparent">
                Farm-to-Kitchen
              </span>{" "}
              Highway.
            </h1>
            <p className="text-xs sm:text-base font-semibold text-emerald-800 break-words">
              भारत का अपना डिजिटल कृषि सेतु • किसान से सीधे उपभोक्ता एवं थोक बाज़ार तक
            </p>
            <p className="mx-auto max-w-2xl text-xs sm:text-base text-slate-600 leading-relaxed px-1">
              Disintermediating agricultural trade. Connect smallholder farmers directly with urban consumers,
              retail grocers, and HoReCa buyers with vernacular voice AI, on-device OpenCV quality pre-check,
              PostGIS hyperlocal matching, and guaranteed UPI escrow settlement.
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
                <span>Start Selling (फसल बेचें)</span>
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
                <span>Shop Fresh Produce (उपज खरीदें)</span>
              </Link>
            </Button>

            <Button
              size="lg"
              variant="ghost"
              onClick={() => setGuideModalOpen(true)}
              className="w-full sm:w-auto text-slate-700 hover:bg-slate-100 gap-2 font-semibold text-xs sm:text-sm h-12 rounded-xl"
            >
              <Compass className="size-4 text-emerald-700 shrink-0" />
              <span>How It Works (गाइड)</span>
            </Button>
          </div>

          {/* Production 4-Pillar Value Telemetry Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 pt-4 sm:pt-6 max-w-4xl mx-auto w-full min-w-0">
            <div className="glass rounded-2xl p-2.5 sm:p-4 border border-emerald-200/80 text-left min-w-0 overflow-hidden">
              <div className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-bold text-emerald-800 truncate">
                <TrendingUp className="size-3 sm:size-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">Farmer Realization</span>
              </div>
              <p className="mt-1 text-lg sm:text-2xl font-black text-slate-900 truncate">+15% to +20%</p>
              <p className="text-[9px] sm:text-xs text-slate-600 line-clamp-2 leading-tight">Recovers 35-50% middlemen cuts</p>
            </div>

            <div className="glass rounded-2xl p-2.5 sm:p-4 border border-emerald-200/80 text-left min-w-0 overflow-hidden">
              <div className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-bold text-teal-800 truncate">
                <Clock className="size-3 sm:size-3.5 text-teal-600 shrink-0" />
                <span className="truncate">Compressed Transit</span>
              </div>
              <p className="mt-1 text-lg sm:text-2xl font-black text-slate-900 truncate">&lt;12 to 24 Hrs</p>
              <p className="text-[9px] sm:text-xs text-slate-600 line-clamp-2 leading-tight">PostGIS radius &lt;25km matching</p>
            </div>

            <div className="glass rounded-2xl p-2.5 sm:p-4 border border-emerald-200/80 text-left min-w-0 overflow-hidden">
              <div className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-bold text-blue-800 truncate">
                <ShieldAlert className="size-3 sm:size-3.5 text-blue-600 shrink-0" />
                <span className="truncate">Perishable Spoilage</span>
              </div>
              <p className="mt-1 text-lg sm:text-2xl font-black text-slate-900 truncate">-25% to -30%</p>
              <p className="text-[9px] sm:text-xs text-slate-600 line-clamp-2 leading-tight">Direct farm-gate cold dispatch</p>
            </div>

            <div className="glass rounded-2xl p-2.5 sm:p-4 border border-emerald-200/80 text-left min-w-0 overflow-hidden">
              <div className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-bold text-amber-800 truncate">
                <Lock className="size-3 sm:size-3.5 text-amber-600 shrink-0" />
                <span className="truncate">Smart Escrow</span>
              </div>
              <p className="mt-1 text-lg sm:text-2xl font-black text-slate-900 truncate">100% Protected</p>
              <p className="text-[9px] sm:text-xs text-slate-600 line-clamp-2 leading-tight">Released upon delivery PIN</p>
            </div>
          </div>
        </section>

        {/* Live Mandi Benchmark vs Farm-Gate Comparison Ticker */}
        <section className="w-full max-w-full min-w-0 overflow-hidden rounded-2xl border border-emerald-200/80 bg-white/90 p-3 sm:p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-2 px-1">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 truncate">
              Live Mandi Price Benchmark vs Krishi Setu Farm-Gate Rates:
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

        {/* Ecosystem Portals (5 Core Role Gateways) */}
        <section className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Ecosystem Portals & Actor Gateways
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Select your role to access dedicated tools engineered for farmers, buyers, fleet partners, and administrators
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
                      <span>Explore Portal</span>
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
                Decentralized Agritech Infrastructure
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                How Krishi Setu Disintermediates Agricultural Trade
              </h3>
            </div>
            <Button
              onClick={() => setGuideModalOpen(true)}
              className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs gap-1.5 self-start sm:self-auto rounded-xl"
            >
              <Compass className="size-3.5" />
              <span>Interactive Architecture Guide</span>
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 pt-2 text-xs">
            <div className="rounded-2xl bg-white/95 p-4 sm:p-5 border border-emerald-100 shadow-xs space-y-2">
              <strong className="text-slate-900 font-bold flex items-center gap-2 text-sm">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                Zero Intermediaries (Pure P2P)
              </strong>
              <p className="text-slate-600 leading-relaxed">
                Eliminates multiple commission agent cuts. Direct farm-gate pickup completed within 12-24 hours.
              </p>
            </div>

            <div className="rounded-2xl bg-white/95 p-4 sm:p-5 border border-emerald-100 shadow-xs space-y-2">
              <strong className="text-slate-900 font-bold flex items-center gap-2 text-sm">
                <Scan className="size-4 text-emerald-600 shrink-0" />
                Edge OpenCV Pre-QC
              </strong>
              <p className="text-slate-600 leading-relaxed">
                Instant blur, brightness & resolution validation at the device edge, eliminating manual assayer delays.
              </p>
            </div>

            <div className="rounded-2xl bg-white/95 p-4 sm:p-5 border border-emerald-100 shadow-xs space-y-2">
              <strong className="text-slate-900 font-bold flex items-center gap-2 text-sm">
                <Lock className="size-4 text-emerald-600 shrink-0" />
                PostGIS & UPI Smart Escrow
              </strong>
              <p className="text-slate-600 leading-relaxed">
                Hyperlocal proximity (&lt;25km) matching coupled with escrow release exclusively upon 4-digit handover PIN.
              </p>
            </div>
          </div>
        </section>

        {/* Verified Farmer & Buyer Testimonials */}
        <section className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Verified Farmer & Buyer Impact Stories
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Real-world results from farmers, grocers, and consumers across Maharashtra
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
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(tItem.rating)].map((_, rIdx) => (
                        <Star key={rIdx} className="size-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
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
                <p className="font-bold text-xs sm:text-sm text-slate-900">DPDP Act 2023 Compliant</p>
                <p className="text-[10px] text-slate-500">Digital Personal Data Protection for farmers</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Award className="size-8 text-teal-600 shrink-0" />
              <div>
                <p className="font-bold text-xs sm:text-sm text-slate-900">PM-KISAN ID Verified</p>
                <p className="text-[10px] text-slate-500">Authentic smallholder farmer verification</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Lock className="size-8 text-amber-600 shrink-0" />
              <div>
                <p className="font-bold text-xs sm:text-sm text-slate-900">256-Bit Escrow Protection</p>
                <p className="text-[10px] text-slate-500">Razorpay / UPI delivery-locked settlement</p>
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
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-xs shrink-0">
                  <Sprout className="size-4" />
                </div>
                <span className="font-extrabold text-base text-slate-900 truncate">Krishi Setu (कृषि सेतु)</span>
              </div>
              <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                Bharat&apos;s direct farm-to-buyer digital highway empowering smallholder farmers, local retail grocers, and commercial buyers with transparent pricing and escrow safety.
              </p>
              <div className="flex items-center gap-2 pt-1 text-emerald-800 font-semibold text-[11px] sm:text-xs">
                <PhoneCall className="size-3.5 text-emerald-600 shrink-0" />
                <span>Kisan Helpline: 1800-180-1551 (Toll Free 24x7)</span>
              </div>
            </div>

            {/* Column 2: Portals */}
            <div className="space-y-2 min-w-0">
              <p className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Ecosystem Portals</p>
              <ul className="space-y-1.5 text-slate-600">
                <li><Link href="/farmer" className="hover:text-emerald-700 transition-colors">Farmer Intake Engine</Link></li>
                <li><Link href="/consumer" className="hover:text-emerald-700 transition-colors">Consumer Discovery</Link></li>
                <li><Link href="/buyer/dashboard" className="hover:text-emerald-700 transition-colors">FPO Bulk Contracts</Link></li>
                <li><Link href="/delivery" className="hover:text-emerald-700 transition-colors">Logistics & Fleet</Link></li>
                <li><Link href="/admin" className="hover:text-emerald-700 transition-colors">Governance & Escrow</Link></li>
              </ul>
            </div>

            {/* Column 3: Platform Features */}
            <div className="space-y-2 min-w-0">
              <p className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Core Innovations</p>
              <ul className="space-y-1.5 text-slate-600">
                <li><Link href="/farmer" className="hover:text-emerald-700 transition-colors">Vernacular Voice AI</Link></li>
                <li><Link href="/farmer" className="hover:text-emerald-700 transition-colors">OpenCV Edge QC</Link></li>
                <li><Link href="/consumer" className="hover:text-emerald-700 transition-colors">PostGIS Proximity (&lt;25km)</Link></li>
                <li><Link href="/consumer" className="hover:text-emerald-700 transition-colors">5-Factor Match Algorithm</Link></li>
                <li><button onClick={() => setGuideModalOpen(true)} className="hover:text-emerald-700 transition-colors text-left">Architecture Tour</button></li>
              </ul>
            </div>

            {/* Column 4: Legal & Compliance */}
            <div className="space-y-2 min-w-0">
              <p className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Compliance</p>
              <ul className="space-y-1.5 text-slate-600">
                <li><span className="text-slate-700 font-medium">DPDP Act 2023 Compliant</span></li>
                <li><span className="text-slate-700 font-medium">PM-KISAN Verified Ledger</span></li>
                <li><span className="text-slate-700 font-medium">UPI 2.0 Escrow Settlement</span></li>
                <li><span className="text-slate-700 font-medium">GST Invoicing for HoReCa</span></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100 pt-6 text-[11px] text-slate-500">
            <p>© 2026 Krishi Setu Network (कृषि सेतु). Built for Indian Agriculture (Kisan Mitra).</p>
            <div className="flex items-center gap-4">
              <span>Hyperlocal Proximity: Baner / Pune Node</span>
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
