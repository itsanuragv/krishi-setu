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
  Award, 
  Compass, 
  CheckCircle2, 
  Mic, 
  Scan, 
  Layers 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/shared/Navbar";
import { JudgingCheatSheet } from "@/components/shared/JudgingCheatSheet";
import { cardHover, fadeInUp, staggerContainer } from "@/lib/animations";

export default function HomePage() {
  const [cheatSheetOpen, setCheatSheetOpen] = useState(false);

  const PRIMARY_ROLES = [
    {
      role: "farmer",
      title: "Farmer / Producer (किसान)",
      href: "/farmer",
      tagline: "Voice Listing + Client-Side OpenCV",
      description:
        "Speak in Hindi or English to auto-list crops. Instant camera pre-check for blur and brightness. Guaranteed UPI escrow payout upon delivery.",
      icon: Sprout,
      color: "from-emerald-500 to-teal-700",
      accentBg: "bg-emerald-50 text-emerald-800 border-emerald-200",
      features: ["Vernacular Voice-to-Form", "OpenCV Visual QC", "Direct Farm-Gate Price"],
    },
    {
      role: "consumer",
      title: "Consumer & Retail (उपभोक्ता)",
      href: "/consumer",
      tagline: "Hyperlocal Proximity (<25km) & 5-Factor Match",
      description:
        "Direct vine-to-kitchen farm produce harvested <8h ago. Algorithmic transparency evaluating price, distance, grade, and farmer trust score.",
      icon: ShoppingBag,
      color: "from-teal-600 to-cyan-700",
      accentBg: "bg-teal-50 text-teal-800 border-teal-200",
      features: ["PostGIS ST_DWithin Slider", "5-Factor Match Score", "Ledger-Locked Escrow"],
    },
    {
      role: "bulk_buyer",
      title: "Bulk Buyer & HoReCa (थोक खरीदार)",
      href: "/buyer/dashboard",
      tagline: "FPO Aggregation & Institutional Contracts",
      description:
        "Procure multi-quintal commercial lots directly from farmer collectives and FPOs with quality certificates and standardized pricing.",
      icon: Warehouse,
      color: "from-amber-600 to-orange-700",
      accentBg: "bg-amber-50 text-amber-800 border-amber-200",
      features: ["FPO Contract Pooling", "Pre-negotiated Forward Lots", "GST Invoice & Escrow"],
    },
  ];

  const SECONDARY_ROLES = [
    {
      role: "delivery",
      title: "Delivery Transporter (परिवहन)",
      href: "/delivery",
      ariaLabel: "Explore Delivery Options",
      tagline: "OR-Tools Optimized Multi-Stop Routing",
      description:
        "Multi-stop farm pickups and consumer drop-offs with distance optimization and instant 4-digit PIN verification settlement.",
      icon: Truck,
      color: "text-purple-700 bg-purple-100",
      badge: "VRP Multi-Stop",
    },
    {
      role: "admin",
      title: "Admin Dispute & Trust (प्रशासन)",
      href: "/admin",
      ariaLabel: "Explore Admin Panel",
      tagline: "Escrow GMV & Split-Screen Mediation",
      description:
        "Mediate crop disputes with side-by-side OpenCV farm photo vs consumer arrival photo. MeitY DPDP Act 2023 compliance monitor.",
      icon: ShieldCheck,
      color: "text-rose-700 bg-rose-100",
      badge: "DPDP Act 2023",
    },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(at_top_left,#ecfdf5,#ffffff)] bg-grid-subtle">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 space-y-16">
        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto space-y-6 pt-4 sm:pt-8">
          {/* Floating Live Cluster Badge (Masterplan Phase 2) */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-300/80 bg-white/90 px-4 py-1.5 shadow-sm backdrop-blur-md"
          >
            <span className="size-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs sm:text-sm font-bold tracking-tight text-emerald-900">
              🟢 LIVE CLUSTER: 24 ACTIVE FARMS (&lt;25KM) | AVG DISPATCH: 8.4 HRS
            </span>
          </motion.div>

          {/* Headline */}
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl sm:leading-[1.15]">
              Bharat&apos;s Direct{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 bg-clip-text text-transparent">
                Farm-to-Kitchen
              </span>{" "}
              Highway.
            </h1>
            <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-700">
              Disintermediating agricultural trade. Connect smallholder farmers directly with urban consumers,
              retail grocers, and HoReCa buyers with client-side OpenCV pre-checks, PostGIS proximity matching, and
              instant UPI escrow settlement.
            </p>
          </motion.div>

          {/* Quick CTA bar for Judges */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              size="lg"
              onClick={() => setCheatSheetOpen(true)}
              className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white hover:from-emerald-700 hover:to-teal-800 shadow-md gap-2 font-bold text-sm"
            >
              <Award className="size-4 text-amber-300" />
              <span>SIH 2026 Pitch Walkthrough Guide</span>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-emerald-300 text-emerald-800 hover:bg-emerald-50 gap-2 font-semibold text-sm">
              <Link href="/farmer">
                <Mic className="size-4 text-emerald-600" />
                <span>Test Voice & OpenCV Scanner</span>
              </Link>
            </Button>
          </div>

          {/* 360° Value Metrics Banner (SIH Presentation Deck) */}
          <div className="grid grid-cols-2 gap-3 pt-6 sm:grid-cols-4 max-w-4xl mx-auto">
            <div className="glass rounded-2xl p-3.5 border border-emerald-200/70 text-left">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                <TrendingUp className="size-3.5" />
                <span>Farmer Realization</span>
              </div>
              <p className="mt-1 text-2xl font-extrabold text-slate-900">+15% to +20%</p>
              <p className="text-[10px] text-slate-600">Recovers 35-50% middlemen cuts</p>
            </div>

            <div className="glass rounded-2xl p-3.5 border border-emerald-200/70 text-left">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-800">
                <Clock className="size-3.5" />
                <span>Compressed Transit</span>
              </div>
              <p className="mt-1 text-2xl font-extrabold text-slate-900">&lt;12 to 24 Hrs</p>
              <p className="text-[10px] text-slate-600">PostGIS radius &lt;25km matching</p>
            </div>

            <div className="glass rounded-2xl p-3.5 border border-emerald-200/70 text-left">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-800">
                <ShieldAlert className="size-3.5" />
                <span>Spoilage Saved</span>
              </div>
              <p className="mt-1 text-2xl font-extrabold text-slate-900">20% to 30%</p>
              <p className="text-[10px] text-slate-600">Direct farm-gate cold dispatch</p>
            </div>

            <div className="glass rounded-2xl p-3.5 border border-emerald-200/70 text-left">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800">
                <Layers className="size-3.5" />
                <span>Escrow Protection</span>
              </div>
              <p className="mt-1 text-2xl font-extrabold text-slate-900">100% Locked</p>
              <p className="text-[10px] text-slate-600">Released only upon PIN handover</p>
            </div>
          </div>
        </section>

        {/* Role Selector Section (Phase 2 Masterplan) */}
        <section className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Select Your Role to Experience the Platform
            </h2>
            <p className="text-sm text-slate-600">
              Seamlessly switch between ecosystem actors without auth friction
            </p>
          </div>

          {/* Primary Cards Grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid gap-6 md:grid-cols-3"
          >
            {PRIMARY_ROLES.map((card) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.role}
                  variants={cardHover}
                  initial="rest"
                  whileHover="hover"
                  className="glass flex flex-col justify-between rounded-3xl border border-emerald-200/80 bg-white/90 p-6 shadow-sm transition-all"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br ${card.color} text-white shadow-md`}>
                        <Icon className="size-6" />
                      </div>
                      <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${card.accentBg}`}>
                        {card.tagline.split(" ")[0]}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{card.title}</h3>
                      <p className="text-xs font-semibold text-emerald-800 mt-0.5">{card.tagline}</p>
                      <p className="text-xs text-slate-700 mt-2 leading-relaxed">
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
                    <Button asChild className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold gap-2 shadow-xs">
                      <Link href={card.href} aria-label={`Enter as ${card.title.split(" ")[0]}`}>
                        <span>Enter as {card.title.split(" ")[0]}</span>
                        <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Secondary Cards Grid (Delivery & Admin) */}
          <div className="grid gap-4 sm:grid-cols-2 pt-2">
            {SECONDARY_ROLES.map((card) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.role}
                  variants={cardHover}
                  initial="rest"
                  whileHover="hover"
                  className="glass flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-xs transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${card.color}`}>
                      <Icon className="size-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-slate-900">{card.title}</h4>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                          {card.badge}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-emerald-800 mt-0.5">{card.tagline}</p>
                      <p className="text-xs text-slate-700 mt-1 max-w-sm leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  </div>

                  <Button asChild variant="outline" size="sm" className="shrink-0 border-slate-300 text-slate-900 hover:bg-slate-100 gap-1.5 ml-2">
                    <Link href={card.href} aria-label={card.ariaLabel}>
                      <span>Explore</span>
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Live Architecture Highlights Banner for Judges */}
        <section className="glass rounded-3xl border border-emerald-300/80 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-600/10 p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-emerald-800">
                <Compass className="size-3.5 text-emerald-700" />
                Technical Competitor Matrix & Empirical Benchmarks
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                Why Krishi Setu Outperforms Traditional Mandis & e-NAM
              </h3>
            </div>
            <Button
              onClick={() => setCheatSheetOpen(true)}
              className="bg-slate-900 text-white hover:bg-slate-800 self-start sm:self-auto text-xs"
            >
              View 3-Minute Pitch Script
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 pt-2 text-xs">
            <div className="rounded-xl bg-white/90 p-4 border border-emerald-100 shadow-xs space-y-1">
              <strong className="text-slate-900 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-emerald-600" />
                Zero Intermediaries (Pure P2P)
              </strong>
              <p className="text-slate-600">
                Eliminates 3-5 tiers of commission agents. 100% direct farm-gate pickup within 12-24 hours.
              </p>
            </div>

            <div className="rounded-xl bg-white/90 p-4 border border-emerald-100 shadow-xs space-y-1">
              <strong className="text-slate-900 font-bold flex items-center gap-1.5">
                <Scan className="size-4 text-emerald-600" />
                Client-Side OpenCV Pre-QC
              </strong>
              <p className="text-slate-600">
                Instant blur, brightness & resolution validation at edge, eliminating manual assayer delays.
              </p>
            </div>

            <div className="rounded-xl bg-white/90 p-4 border border-emerald-100 shadow-xs space-y-1">
              <strong className="text-slate-900 font-bold flex items-center gap-1.5">
                <Sparkles className="size-4 text-emerald-600" />
                PostGIS ST_DWithin & Escrow
              </strong>
              <p className="text-slate-600">
                Fast spatial clustering (&lt;25km) coupled with Razorpay smart escrow released upon 4-digit PIN.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Judging cheat sheet modal */}
      <JudgingCheatSheet
        isOpen={cheatSheetOpen}
        onClose={() => setCheatSheetOpen(false)}
      />
    </div>
  );
}
