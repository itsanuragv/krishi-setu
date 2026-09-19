"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ExternalLink, 
  Mic, 
  Scan, 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  X,
  Sparkles,
  ArrowRight,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";

const PLATFORM_PILLARS = [
  {
    step: 1,
    title: "Farmer Voice Listing & Edge QC",
    hindiTitle: "किसान वॉइस लिस्टिंग एवं कंप्यूटर विज़न",
    route: "/farmer",
    icon: Mic,
    color: "from-emerald-500 to-teal-700",
    badge: "Web Speech + OpenCV Edge",
    summary:
      "Empowers rural farmers to list crops hands-free in Hindi or English, backed by on-device camera quality pre-check.",
    details: [
      "Vernacular speech-to-text regex parser auto-populates crop, quantity, and floor price.",
      "Client-side OpenCV Laplacian variance edge analysis checks blur, brightness, and resolution before upload.",
      "Zero reliance on heavy server uploads — runs smoothly on 2G/3G/4G budget Android phones.",
    ],
    techStack: "Web Speech API • HTML5 Canvas OpenCV • ITU-R BT.601 Grayscale",
  },
  {
    step: 2,
    title: "Hyperlocal Proximity (<25km) & 5-Factor Match",
    hindiTitle: "हाइपरलोकल निकटता एवं 5-फ़ैक्टर मैचिंग",
    route: "/consumer",
    icon: Scan,
    color: "from-teal-600 to-cyan-700",
    badge: "PostGIS ST_DWithin",
    summary:
      "Direct vine-to-kitchen discovery delivering farm harvest <12h old with algorithmic fairness.",
    details: [
      "Spatial radius filtering prioritizes farms within 25km corridor to guarantee maximum freshness.",
      "Transparent 5-factor scoring model: evaluates Price fit, Distance, OpenCV Grade, Quantity fit, and Farmer Trust Score.",
      "Direct farm-gate rates eliminate 3-5 tiers of commission agents (APMC middlemen).",
    ],
    techStack: "PostGIS Spatial GIST Indexing • Algorithmic Matching Score",
  },
  {
    step: 3,
    title: "Ledger-Backed Escrow & 4-Digit Delivery PIN",
    hindiTitle: "सुरक्षित एस्क्रो एवं 4-अंकीय हैंडओवर पिन",
    route: "/consumer",
    icon: Lock,
    color: "from-amber-600 to-orange-700",
    badge: "Zero-Fraud Escrow",
    summary:
      "Complete financial safety for both farmer and buyer through platform escrow.",
    details: [
      "Buyer funds are locked in platform escrow at order confirmation.",
      "Delivery generates a secure 4-digit PIN sent exclusively to the recipient's phone.",
      "Only upon physical inspection and PIN entry is payment instantly credited to the farmer's UPI ledger.",
    ],
    techStack: "Smart Escrow Ledger • Instant UPI Settlement • 4-Digit Handover Auth",
  },
  {
    step: 4,
    title: "Logistics Optimization & Fleet VRP",
    hindiTitle: "लॉजिस्टिक्स रूटिंग एवं व्हीकल रूटिंग",
    route: "/delivery",
    icon: Truck,
    color: "from-purple-600 to-indigo-700",
    badge: "OR-Tools Multi-Stop",
    summary:
      "Consolidates fragmented rural farm pickups into optimal delivery corridors.",
    details: [
      "Google OR-Tools Vehicle Routing Problem (VRP) algorithms optimize multi-stop pickup and drop schedules.",
      "Compresses average farm-to-kitchen transit from 48-72h down to under 12-24 hours.",
      "Reduces perishable spoilage by 25-30% and lowers transporter fuel costs by 28%.",
    ],
    techStack: "Vehicle Routing Optimization • Interactive Leaflet/OSM Mapping",
  },
  {
    step: 5,
    title: "Admin Dispute Mediation & DPDP Governance",
    hindiTitle: "विवाद निवारण एवं DPDP 2023 डेटा सुरक्षा",
    route: "/admin",
    icon: ShieldCheck,
    color: "from-rose-600 to-red-700",
    badge: "DPDP Act 2023 Compliant",
    summary:
      "Enterprise governance, dispute resolution, and legal compliance monitoring.",
    details: [
      "Split-screen mediation workspace compares farm dispatch photo against buyer arrival photo.",
      "Full compliance with India's Digital Personal Data Protection (DPDP) Act 2023 for farmer biometric and location privacy.",
      "Auditable ledger tracking total platform Gross Merchandise Value (GMV) and trust scores.",
    ],
    techStack: "DPDP Act 2023 • Split-Screen Visual Verification • Automated Audit Logs",
  },
];

export function PlatformGuideModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [activeStep, setActiveStep] = useState(0);

  if (!isOpen) return null;

  const currentPillar = PLATFORM_PILLARS[activeStep];
  const Icon = currentPillar.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 sm:p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-emerald-200 bg-white p-5 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                <Sparkles className="size-3.5 text-emerald-600" />
                Krishi Setu Platform Architecture
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                Kisan Mitra Digital Highway
              </span>
            </div>
            <h2 className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
              Interactive Platform Architecture & Workflow Tour
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              Explore how Krishi Setu connects smallholders, consumers, and logistics with verifiable trust, OpenCV quality pre-check, and smart escrow.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close platform guide"
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors touch-target"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Step Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {PLATFORM_PILLARS.map((pillar, idx) => {
            const StepIcon = pillar.icon;
            const isActive = activeStep === idx;
            return (
              <button
                key={pillar.step}
                onClick={() => setActiveStep(idx)}
                className={`flex items-center gap-2 shrink-0 rounded-2xl px-3.5 py-2.5 text-xs font-bold transition-all border ${
                  isActive
                    ? "bg-emerald-700 text-white border-emerald-700 shadow-md scale-102"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <div className={`flex size-6 items-center justify-center rounded-lg ${isActive ? "bg-white/20 text-white" : "bg-white text-slate-700"}`}>
                  <StepIcon className="size-3.5" />
                </div>
                <span>Step {pillar.step}: {pillar.title.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Main Content Card */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${currentPillar.color} text-white shadow-md`}>
                <Icon className="size-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">
                    {currentPillar.title}
                  </h3>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 border border-emerald-200">
                    {currentPillar.badge}
                  </span>
                </div>
                <p className="text-xs font-semibold text-emerald-700 mt-0.5">
                  {currentPillar.hindiTitle}
                </p>
              </div>
            </div>

            <Button asChild size="sm" className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold gap-1.5 self-start sm:self-auto">
              <Link href={currentPillar.route} onClick={onClose}>
                <span>Open Live Portal</span>
                <ExternalLink className="size-3.5" />
              </Link>
            </Button>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            {currentPillar.summary}
          </p>

          {/* Key Architectural Details */}
          <div className="space-y-2 rounded-xl bg-white p-4 border border-slate-200/80 shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              System Capabilities & Engineering Rigor:
            </h4>
            <div className="space-y-2 pt-1">
              {currentPillar.details.map((detail, dIdx) => (
                <div key={dIdx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Blueprint Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl bg-emerald-900 text-emerald-100 px-4 py-2.5 text-xs">
            <span className="font-semibold text-emerald-300">Underlying Stack:</span>
            <span className="font-mono text-[11px] text-white">{currentPillar.techStack}</span>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="text-xs font-semibold text-slate-500">
            Step {activeStep + 1} of {PLATFORM_PILLARS.length}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={activeStep === 0}
              onClick={() => setActiveStep((p) => p - 1)}
              className="text-xs"
            >
              Previous
            </Button>
            {activeStep < PLATFORM_PILLARS.length - 1 ? (
              <Button
                size="sm"
                onClick={() => setActiveStep((p) => p + 1)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs gap-1"
              >
                <span>Next Feature</span>
                <ArrowRight className="size-3.5" />
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={onClose}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs"
              >
                Close Guide
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
