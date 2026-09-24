"use client";

import { 
  X, 
  TrendingDown, 
  MapPin, 
  Sparkles, 
  CheckCircle, 
  Star, 
  ShieldCheck 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { modalSpringVariants, appleSpringSnappy } from "@/lib/animations";
import type { ProduceListing } from "@/lib/mock-data";

interface MatchScoreModalProps {
  listing: ProduceListing | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MatchScoreModal({ listing, isOpen, onClose }: MatchScoreModalProps) {
  if (!isOpen || !listing) return null;

  const { breakdown, matchScore } = listing;

  const FACTORS = [
    {
      key: "priceIndex",
      title: "1. Price Index vs. Mandi",
      score: breakdown.priceIndex.score,
      icon: TrendingDown,
      color: "text-emerald-700 bg-emerald-100",
      barColor: "bg-emerald-500",
      detail: breakdown.priceIndex.detail,
      metric: `₹${listing.farmGatePrice}/kg vs APMC ₹${listing.mandiBenchmarkPrice}/kg`,
      sub: "Eliminates 3-5 middleman cuts directly",
    },
    {
      key: "distance",
      title: "2. Proximity & Freshness (<25km)",
      score: breakdown.distance.score,
      icon: MapPin,
      color: "text-blue-700 bg-blue-100",
      barColor: "bg-blue-500",
      detail: breakdown.distance.detail,
      metric: `${listing.distanceKm} km from buyer delivery zone`,
      sub: "PostGIS ST_DWithin certified direct farm-gate radius",
    },
    {
      key: "qualityGrade",
      title: "3. OpenCV Quality Grade",
      score: breakdown.qualityGrade.score,
      icon: Sparkles,
      color: "text-purple-700 bg-purple-100",
      barColor: "bg-purple-500",
      detail: breakdown.qualityGrade.detail,
      metric: `${breakdown.qualityGrade.grade || "Grade A"} (${listing.openCvMetrics.resolution})`,
      sub: "Validated via client-side Laplacian blur & illumination pre-check",
    },
    {
      key: "quantityFit",
      title: "4. Quantity Fit & Lot Size",
      score: breakdown.quantityFit.score,
      icon: CheckCircle,
      color: "text-amber-700 bg-amber-100",
      barColor: "bg-amber-500",
      detail: breakdown.quantityFit.detail,
      metric: `${listing.quantityAvailable} ${listing.unit} immediate harvest lot`,
      sub: "Exact batch alignment without fragmented pooling delays",
    },
    {
      key: "reliability",
      title: "5. Farmer Reliability & Trust Score",
      score: breakdown.reliability.score,
      icon: Star,
      color: "text-orange-700 bg-orange-100",
      barColor: "bg-orange-500",
      detail: breakdown.reliability.detail,
      metric: `${breakdown.reliability.rating ?? 4.9}★ Trust Rating (PM-KISAN Verified)`,
      sub: "Calculated via historical on-time dispatch & zero-dispute ledger",
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md"
    >
      <motion.div 
        variants={modalSpringVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="apple-glass-elevated relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl p-6 shadow-2xl space-y-6 sm:p-7 rim-light-lg apple-scrollbar"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-black/[0.05] dark:border-white/[0.08] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                5-Factor Smart Matching Engine
              </span>
              <span className="text-xs text-slate-500 dark:text-zinc-400">
                PostGIS + Algorithmic Scoring
              </span>
            </div>
            <h2 className="mt-2 text-xl font-extrabold text-slate-900 dark:text-white">
              {listing.name} ({listing.hindiName})
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Farmer: {listing.farmerName} • {listing.village}, {listing.district}
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close match score details"
            className="rounded-full p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors active:scale-90"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Overall Composite Score Hero */}
        <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 p-5 text-white shadow-md rim-light">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-100">
              Composite Match Score
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-extrabold">{matchScore}%</span>
              <span className="text-xs font-medium text-emerald-100">
                / 100 Optimal Match
              </span>
            </div>
            <p className="text-xs text-emerald-100/90 mt-1 max-w-xs">
              Direct match meets top criteria across pricing, distance, verified grade & reliability.
            </p>
          </div>

          <div className="flex size-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 rim-light">
            <ShieldCheck className="size-8 text-white" />
          </div>
        </div>

        {/* 5 Factors Breakdown */}
        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
            Algorithmic Factor Breakdown
          </p>

          <div className="space-y-3.5">
            {FACTORS.map((factor) => {
              const Icon = factor.icon;
              return (
                <div
                  key={factor.key}
                  className="rounded-2xl border border-black/[0.05] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.03] p-3.5 space-y-2 backdrop-blur-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`flex size-7 items-center justify-center rounded-lg ${factor.color}`}>
                        <Icon className="size-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {factor.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                        {factor.score}
                      </span>
                      <span className="text-[10px] text-slate-400">/ 100</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 w-full overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
                    <div
                      className={`h-full rounded-full ${factor.barColor} transition-all duration-500`}
                      style={{ width: `${factor.score}%` }}
                    />
                  </div>

                  {/* Detail Text */}
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                      {factor.metric}
                    </span>
                    <span className="text-slate-500 dark:text-zinc-400">{factor.detail}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-black/[0.05] dark:border-white/[0.08] pt-4 text-xs text-slate-500 dark:text-zinc-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
            <span>DPDP Act 2023 Compliant & Razorpay Smart Escrow Verified</span>
          </div>
          <motion.button
            whileTap={{ scale: 0.96 }}
            transition={appleSpringSnappy}
            onClick={onClose}
            className="rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 px-4 py-2 text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-xs"
          >
            Done
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
