"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  ShieldCheck, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  FileCheck, 
  Sparkles, 
  Lock, 
  UserCheck 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Navbar } from "@/components/shared/Navbar";
import { ADMIN_KPIS, MOCK_DISPUTE, type DisputeCase } from "@/lib/mock-data";

export default function AdminGovernancePage() {
  const [dispute, setDispute] = useState<DisputeCase>(MOCK_DISPUTE);
  const [resolutionStatus, setResolutionStatus] = useState<string | null>(null);

  const resolveDispute = (actionText: string, statusText: "Resolved - Payout Completed" | "Split Mediated") => {
    setResolutionStatus(actionText);
    setDispute((prev) => ({ ...prev, status: statusText }));
    toast.success(`Mediation Order Executed: ${actionText}`);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(at_top_left,#ecfdf5,#ffffff)] bg-grid-subtle">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Header & DPDP Act 2023 Compliance Pill */}
        <section className="glass rounded-3xl border border-rose-200/80 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-600 to-red-800 text-white shadow-md">
                <ShieldCheck className="size-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    Admin Governance & Dispute Mediation Control Room
                  </h1>
                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-800">
                    Super-Admin
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time escrow oversight, automated AI evidence mediation, and DPDP Act 2023 compliance
                </p>
              </div>
            </div>

            {/* DPDP Act Compliance Badge */}
            <div className="flex items-center gap-2 rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-2.5 shadow-xs text-xs">
              <FileCheck className="size-4 text-emerald-600" />
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-800">Data Governance</span>
                <p className="font-bold text-slate-900">DPDP Act 2023 Compliant</p>
              </div>
            </div>
          </div>
        </section>

        {/* Phase 6 Metrics Dashboard (Glass Cards Grid) */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="glass rounded-3xl border border-emerald-200 p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Total Escrow GMV</span>
              <Lock className="size-4 text-emerald-600" />
            </div>
            <p className="text-3xl font-black text-slate-900">{ADMIN_KPIS.totalEscrowGmv}</p>
            <p className="text-xs font-semibold text-emerald-700">100% Financial Protection</p>
          </div>

          <div className="glass rounded-3xl border border-teal-200 p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Perishable Spoilage Saved</span>
              <TrendingUp className="size-4 text-teal-600" />
            </div>
            <p className="text-3xl font-black text-slate-900">{ADMIN_KPIS.spoilageReductionPct}</p>
            <p className="text-xs font-semibold text-teal-700">&lt;12h Farm-Gate Transit</p>
          </div>

          <div className="glass rounded-3xl border border-blue-200 p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Active Proximity Nodes</span>
              <Sparkles className="size-4 text-blue-600" />
            </div>
            <p className="text-3xl font-black text-slate-900">{ADMIN_KPIS.activeProximityNodes}</p>
            <p className="text-xs font-semibold text-blue-700">PostGIS Hyperlocal Clusters</p>
          </div>

          <div className="glass rounded-3xl border border-purple-200 p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Avg Dispatch Speed</span>
              <Clock className="size-4 text-purple-600" />
            </div>
            <p className="text-3xl font-black text-slate-900">{ADMIN_KPIS.avgDispatchHours}</p>
            <p className="text-xs font-semibold text-purple-700">Farm-to-Fork Direct</p>
          </div>
        </section>

        {/* Phase 6 Dispute Workspace: Split-Screen View */}
        <section className="glass rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-800">
                  Case #{dispute.id}
                </span>
                <span className="text-xs text-slate-500">
                  Order: {dispute.orderNumber} • {dispute.cropName}
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                Visual Evidence Dispute Workspace
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-900">
                Escrow Locked: ₹{dispute.escrowAmount.toLocaleString("en-IN")}
              </span>
              <span className={`rounded-xl px-3 py-1.5 text-xs font-bold ${
                dispute.status === "Pending Mediation"
                  ? "bg-rose-100 text-rose-800"
                  : "bg-emerald-100 text-emerald-800"
              }`}>
                {dispute.status}
              </span>
            </div>
          </div>

          {/* Split-Screen Image Comparison Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Left Screen: Farmer's OpenCV Pre-Check Dispatch Photo */}
            <div className="rounded-2xl border border-emerald-300 bg-emerald-50/40 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold text-slate-900 uppercase">
                    Farmer Farm-Gate Dispatch (OpenCV Scan)
                  </span>
                </div>
                <span className="rounded-full bg-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-900">
                  {dispute.farmerOpenCvStats.grade}
                </span>
              </div>

              <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-900 shadow-inner">
                <Image
                  src={dispute.farmerDispatchPhoto}
                  alt="Farmer dispatch photo"
                  fill
                  sizes="(max-width: 768px) 100vw, 450px"
                  className="object-cover"
                />
                <div className="absolute bottom-2 left-2 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-mono text-emerald-300">
                  Blur Score: {dispute.farmerOpenCvStats.blurScore} | Illum: {dispute.farmerOpenCvStats.colorUniformity}%
                </div>
              </div>

              <div className="space-y-1 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-500">Producer:</span>
                  <strong className="text-slate-800">{dispute.farmer.name}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Trust Score:</span>
                  <span className="font-bold text-emerald-700">{dispute.farmer.trustScore}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Registered UPI:</span>
                  <span className="font-mono text-[11px]">{dispute.farmer.bankAccount}</span>
                </div>
              </div>
            </div>

            {/* Right Screen: Consumer's Complaint Photo */}
            <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-rose-500" />
                  <span className="text-xs font-bold text-slate-900 uppercase">
                    Consumer Unloading Photo
                  </span>
                </div>
                <span className="rounded-full bg-rose-200 px-2 py-0.5 text-[10px] font-bold text-rose-900">
                  Bruising Reported
                </span>
              </div>

              <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-900 shadow-inner">
                <Image
                  src={dispute.buyerReportedPhoto}
                  alt="Consumer reported photo"
                  fill
                  sizes="(max-width: 768px) 100vw, 450px"
                  className="object-cover"
                />
                <div className="absolute bottom-2 left-2 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-mono text-rose-300">
                  Transit Vibration Impact: ~7.5%
                </div>
              </div>

              <div className="space-y-1 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-500">Buyer:</span>
                  <strong className="text-slate-800">{dispute.buyer.name} ({dispute.buyer.business})</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Complaint:</span>
                  <span className="text-slate-800">{dispute.buyerComplaint}</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Discrepancy Edge Detection Analysis */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
              <Sparkles className="size-4 text-emerald-600" />
              <span>AI Computer Vision Edge Discrepancy Analysis:</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {dispute.aiDiscrepancyAnalysis}
            </p>
            <div className="border-t border-emerald-200/60 pt-2 text-xs font-bold text-emerald-800">
              Recommended Algorithm Verdict: {dispute.recommendedAction}
            </div>
          </div>

          {/* Instant Mediation Action Controls */}
          <div className="space-y-3 pt-2">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Admin Discretion & Ledger Settlement:
            </p>

            <div className="grid gap-3 sm:grid-cols-3">
              <Button
                onClick={() =>
                  resolveDispute(
                    "Split Settlement: 92% (₹6,992) released to Farmer UPI + 8% (₹608) credited to Buyer",
                    "Split Mediated"
                  )
                }
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-11 shadow-xs"
              >
                Execute 92/8 Fair Split (Recommended)
              </Button>

              <Button
                onClick={() =>
                  resolveDispute(
                    "Full 100% Escrow (₹7,600) released to Farmer. Transit damage waived by platform.",
                    "Resolved - Payout Completed"
                  )
                }
                variant="outline"
                className="border-emerald-300 text-emerald-800 hover:bg-emerald-50 text-xs h-11"
              >
                Release 100% to Farmer
              </Button>

              <Button
                onClick={() =>
                  resolveDispute(
                    "100% Escrow refunded to Buyer. Quality mismatch confirmed.",
                    "Resolved - Payout Completed"
                  )
                }
                variant="outline"
                className="border-rose-300 text-rose-800 hover:bg-rose-50 text-xs h-11"
              >
                Full Refund to Buyer
              </Button>
            </div>

            {resolutionStatus && (
              <div className="rounded-xl border border-emerald-400 bg-emerald-100 p-3 text-xs font-semibold text-emerald-900 flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                <span>{resolutionStatus}</span>
              </div>
            )}
          </div>
        </section>

        {/* DPDP Act 2023 Smallholder Data Privacy Section */}
        <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <UserCheck className="size-4 text-emerald-600" />
            <span>Digital Personal Data Protection (DPDP) Act 2023 Compliance Framework</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 text-xs text-slate-600">
            <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 space-y-1">
              <strong className="text-slate-900 font-bold">1. Zero Raw Aadhaar Storage</strong>
              <p>
                Farmer identification is verified through PM-KISAN UIDAI hash tokens with zero biometric or national ID persistence.
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 space-y-1">
              <strong className="text-slate-900 font-bold">2. Differential GPS Bounding</strong>
              <p>
                Farm coordinates are fuzz-clustered to 200m centroids on public feeds to protect smallholder land boundary privacy.
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 space-y-1">
              <strong className="text-slate-900 font-bold">3. Verifiable Consent Receipts</strong>
              <p>
                Every produce listing generates an immutable consent record for photo AI analysis and buyer price discovery.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
