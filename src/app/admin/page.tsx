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
import { useLanguage } from "@/context/LanguageContext";
import { ADMIN_KPIS, MOCK_DISPUTE, type DisputeCase } from "@/lib/mock-data";

export default function AdminGovernancePage() {
  const { t, language } = useLanguage();
  const [dispute, setDispute] = useState<DisputeCase>(MOCK_DISPUTE);
  const [resolutionStatus, setResolutionStatus] = useState<string | null>(null);

  const resolveDispute = (actionText: string, statusText: "Resolved - Payout Completed" | "Split Mediated") => {
    setResolutionStatus(actionText);
    setDispute((prev) => ({ ...prev, status: statusText }));
    toast.success(
      language === "hi"
        ? `मध्यस्थता आदेश निष्पादित: ${actionText}`
        : `Mediation Order Executed: ${actionText}`
    );
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(at_top_left,#ecfdf5,#ffffff)] bg-grid-subtle">
      <Navbar />

      <main className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Header & DPDP Act 2023 Compliance Pill */}
        <section className="apple-glass rounded-3xl p-4 sm:p-6 shadow-xs rim-light border border-rose-500/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex size-12 sm:size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-600 to-red-800 text-white shadow-md shrink-0 rim-light">
                <ShieldCheck className="size-6 sm:size-7" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-lg sm:text-2xl font-extrabold text-slate-900 leading-tight">
                    {t("admin_room_title")}
                  </h1>
                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-800">
                    {t("admin_super_badge")}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {t("admin_room_sub")}
                </p>
              </div>
            </div>

            {/* DPDP Act Compliance Badge */}
            <div className="flex items-center gap-2 rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-2.5 shadow-xs text-xs self-start md:self-auto rim-light">
              <FileCheck className="size-4 text-emerald-600 shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-800">{t("admin_data_governance")}</span>
                <p className="font-bold text-slate-900">{t("admin_dpdp_badge")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Governance & Impact Metrics Dashboard */}
        <section className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
          <div className="apple-glass rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xs rim-light space-y-1.5 sm:space-y-2 hover:scale-[1.015] transition-all">
            <div className="flex items-center justify-between text-[11px] sm:text-xs font-bold text-slate-500">
              <span>{t("admin_kpi_gmv_title")}</span>
              <Lock className="size-3.5 sm:size-4 text-emerald-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900">{ADMIN_KPIS.totalEscrowGmv}</p>
            <p className="text-[11px] sm:text-xs font-semibold text-emerald-700">{t("admin_kpi_gmv_sub")}</p>
          </div>

          <div className="apple-glass rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xs rim-light space-y-1.5 sm:space-y-2 hover:scale-[1.015] transition-all">
            <div className="flex items-center justify-between text-[11px] sm:text-xs font-bold text-slate-500">
              <span>{t("admin_kpi_spoilage_title")}</span>
              <TrendingUp className="size-3.5 sm:size-4 text-teal-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900">{ADMIN_KPIS.spoilageReductionPct}</p>
            <p className="text-[11px] sm:text-xs font-semibold text-teal-700">{t("admin_kpi_spoilage_sub")}</p>
          </div>

          <div className="apple-glass rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xs rim-light space-y-1.5 sm:space-y-2 hover:scale-[1.015] transition-all">
            <div className="flex items-center justify-between text-[11px] sm:text-xs font-bold text-slate-500">
              <span>{t("admin_kpi_nodes_title")}</span>
              <Sparkles className="size-3.5 sm:size-4 text-blue-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900">{ADMIN_KPIS.activeProximityNodes}</p>
            <p className="text-[11px] sm:text-xs font-semibold text-blue-700">{t("admin_kpi_nodes_sub")}</p>
          </div>

          <div className="apple-glass rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xs rim-light space-y-1.5 sm:space-y-2 hover:scale-[1.015] transition-all">
            <div className="flex items-center justify-between text-[11px] sm:text-xs font-bold text-slate-500">
              <span>{t("admin_kpi_speed_title")}</span>
              <Clock className="size-3.5 sm:size-4 text-purple-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900">{ADMIN_KPIS.avgDispatchHours}</p>
            <p className="text-[11px] sm:text-xs font-semibold text-purple-700">{t("admin_kpi_speed_sub")}</p>
          </div>
        </section>

        {/* Dispute Workspace: Split-Screen Evidence View */}
        <section className="apple-glass-elevated rounded-3xl p-5 sm:p-8 shadow-xs space-y-6 rim-light-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-800">
                  {t("admin_case_label")} #{dispute.id}
                </span>
                <span className="text-xs text-slate-500">
                  {t("admin_order_label")} {dispute.orderNumber} • {dispute.cropName}
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                {t("admin_dispute_workspace")}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-900">
                {t("admin_escrow_locked_label")} ₹{dispute.escrowAmount.toLocaleString("en-IN")}
              </span>
              <span className={`rounded-xl px-3 py-1.5 text-xs font-bold ${
                dispute.status === "Pending Mediation"
                  ? "bg-rose-100 text-rose-800"
                  : "bg-emerald-100 text-emerald-800"
              }`}>
                {dispute.status === "Pending Mediation"
                  ? language === "hi" ? "मध्यस्थता लंबित (Pending)" : "Pending Mediation"
                  : dispute.status === "Split Mediated"
                  ? language === "hi" ? "निपटान संपन्न (Split Mediated)" : "Split Mediated"
                  : language === "hi" ? "समाधान संपन्न (Resolved)" : dispute.status}
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
                    {t("admin_farmer_dispatch_header")}
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
                  {t("admin_blur_score")}: {dispute.farmerOpenCvStats.blurScore} | {t("admin_illumination")}: {dispute.farmerOpenCvStats.colorUniformity}%
                </div>
              </div>

              <div className="space-y-1 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-500">{t("admin_producer_label")}</span>
                  <strong className="text-slate-800">{dispute.farmer.name}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t("admin_trust_score")}</span>
                  <span className="font-bold text-emerald-700">{dispute.farmer.trustScore}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t("admin_reg_upi_label")}</span>
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
                    {t("admin_consumer_unloading_header")}
                  </span>
                </div>
                <span className="rounded-full bg-rose-200 px-2 py-0.5 text-[10px] font-bold text-rose-900">
                  {t("admin_bruising_reported")}
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
                  {t("admin_transit_vibration")}
                </div>
              </div>

              <div className="space-y-1 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-500">{t("admin_buyer_label")}</span>
                  <strong className="text-slate-800">{dispute.buyer.name} ({dispute.buyer.business})</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t("admin_complaint_label")}</span>
                  <span className="text-slate-800">
                    {language === "hi" 
                      ? "हाईवे परिवहन के दौरान ऊपर की 2 बोरियों में मामूली नमी रिसाव। नमी की पुनः जांच की मांग।" 
                      : dispute.buyerComplaint}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Discrepancy Edge Detection Analysis */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
              <Sparkles className="size-4 text-emerald-600" />
              <span>{t("admin_ai_analysis_header")}</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {language === "hi"
                ? "ओपनसीवी ग्रेन एज जांच एवं स्पेक्ट्रोफोटोमेट्री से सत्यापित हुआ कि मुख्य लॉट की नमी 10.6% है (जो सुरक्षित भंडारण मानक 12% से काफी नीचे है)। हेक्टोलीटर वजन >82 kg/hl है। कुल 98.8% लॉट उत्तम ग्रेड-ए शरबती गेहूं है।"
                : dispute.aiDiscrepancyAnalysis}
            </p>
            <div className="border-t border-emerald-200/60 pt-2 text-xs font-bold text-emerald-800">
              {t("admin_rec_algorithm_verdict")}{" "}
              {language === "hi"
                ? "किसान के खाते में तुरंत 98% (₹3,33,200) UPI भुगतान जारी करें; लॉजिस्टिक्स बफर से 2% (₹6,800) नमी/छनाई छूट खरीदार को दें।"
                : dispute.recommendedAction}
            </div>
          </div>

          {/* Instant Mediation Action Controls */}
          <div className="space-y-3 pt-2">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t("admin_discretion_heading")}
            </p>

            <div className="grid gap-3 sm:grid-cols-3">
              <Button
                onClick={() =>
                  resolveDispute(
                    language === "hi"
                      ? "न्यायसंगत बंटवारा: किसान को 92% (₹6,992) UPI भुगतान + खरीदार को 8% (₹608) रिफंड"
                      : "Split Settlement: 92% (₹6,992) released to Farmer UPI + 8% (₹608) credited to Buyer",
                    "Split Mediated"
                  )
                }
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-11 shadow-xs"
              >
                {t("admin_btn_split")}
              </Button>

              <Button
                onClick={() =>
                  resolveDispute(
                    language === "hi"
                      ? "किसान को पूरा 100% एस्क्रो (₹7,600) जारी किया गया। परिवहन क्षति प्लेटफ़ॉर्म द्वारा वहन।"
                      : "Full 100% Escrow (₹7,600) released to Farmer. Transit damage waived by platform.",
                    "Resolved - Payout Completed"
                  )
                }
                variant="outline"
                className="border-emerald-300 text-emerald-800 hover:bg-emerald-50 text-xs h-11"
              >
                {t("admin_btn_farmer_100")}
              </Button>

              <Button
                onClick={() =>
                  resolveDispute(
                    language === "hi"
                      ? "खरीदार को 100% एस्क्रो राशि वापस लौटाई गई। गुणवत्ता बेमेल की पुष्टि हुई।"
                      : "100% Escrow refunded to Buyer. Quality mismatch confirmed.",
                    "Resolved - Payout Completed"
                  )
                }
                variant="outline"
                className="border-rose-300 text-rose-800 hover:bg-rose-50 text-xs h-11"
              >
                {t("admin_btn_buyer_100")}
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
            <span>{t("admin_dpdp_framework_title")}</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 text-xs text-slate-600">
            <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 space-y-1">
              <strong className="text-slate-900 font-bold">{t("admin_dpdp_pillar1_title")}</strong>
              <p>{t("admin_dpdp_pillar1_desc")}</p>
            </div>

            <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 space-y-1">
              <strong className="text-slate-900 font-bold">{t("admin_dpdp_pillar2_title")}</strong>
              <p>{t("admin_dpdp_pillar2_desc")}</p>
            </div>

            <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 space-y-1">
              <strong className="text-slate-900 font-bold">{t("admin_dpdp_pillar3_title")}</strong>
              <p>{t("admin_dpdp_pillar3_desc")}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
