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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-emerald-200 bg-white p-6 shadow-2xl space-y-6 sm:p-7">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-emerald-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                5-Factor Smart Matching Engine
              </span>
              <span className="text-xs text-slate-500">
                PostGIS + Algorithmic Scoring
              </span>
            </div>
            <h2 className="mt-2 text-xl font-extrabold text-slate-900">
              {listing.name} ({listing.hindiName})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Farmer: {listing.farmerName} • {listing.village}, {listing.district}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Overall Composite Score Hero */}
        <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 p-5 text-white shadow-md">
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

          <div className="flex size-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md border border-white/20">
            <ShieldCheck className="size-8 text-white" />
          </div>
        </div>

        {/* 5 Factors Breakdown */}
        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Algorithmic Factor Breakdown
          </p>

          <div className="space-y-3.5">
            {FACTORS.map((factor) => {
              const Icon = factor.icon;
              return (
                <div
                  key={factor.key}
                  className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`flex size-7 items-center justify-center rounded-lg ${factor.color}`}>
                        <Icon className="size-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-900">
                        {factor.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-extrabold text-slate-900">
                        {factor.score}
                      </span>
                      <span className="text-[10px] text-slate-400">/ 100</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className={`h-full rounded-full ${factor.barColor} transition-all duration-500`}
                      style={{ width: `${factor.score}%` }}
                    />
                  </div>

                  {/* Detail Text */}
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-emerald-700">
                      {factor.metric}
                    </span>
                    <span className="text-slate-500">{factor.detail}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="size-4 text-emerald-600" />
            <span>DPDP Act 2023 Compliant & Razorpay Smart Escrow Verified</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
