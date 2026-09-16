"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Trophy, 
  Clock, 
  ExternalLink, 
  Mic, 
  Scan, 
  Compass, 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  X,
  Sparkles,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    time: "0:00 - 0:45",
    section: "The Entry & Role Selector",
    route: "/",
    icon: Compass,
    color: "from-emerald-500/20 to-teal-500/10 border-emerald-300/40 text-emerald-700",
    points: [
      "Showcase the 'Live Cluster' floating badge (24 Active Farms within 25km radius).",
      "Explain the Problem Statement (SIH26033): 35-50% margins lost to 3-5 middlemen tiers.",
      "Show how easy role switching is across Farmer, Consumer, Transporter & Admin.",
    ],
    technicalBuzzword: "PostGIS ST_DWithin & Spatial GIST Indexing",
  },
  {
    time: "0:45 - 1:30",
    section: "Farmer Intake & OpenCV Pre-Check",
    route: "/farmer",
    icon: Mic,
    color: "from-amber-500/20 to-orange-500/10 border-amber-300/40 text-amber-700",
    points: [
      "Click the Vernacular Mic or sample prompt ('Selling 50kg Tomatoes at 40 rupees').",
      "Watch Crop, Quantity, and Floor Price auto-populate with smooth typing animation.",
      "Trigger the client-side OpenCV scan: note the laser sweep, blur/brightness/resolution meters.",
      "Highlight: Low-bandwidth edge image processing without stressing rural 3G/4G networks.",
    ],
    technicalBuzzword: "Web Speech API + Client-Side OpenCV Edge QC",
  },
  {
    time: "1:30 - 2:15",
    section: "Consumer 5-Factor Match & Escrow Lock",
    route: "/consumer",
    icon: Scan,
    color: "from-blue-500/20 to-cyan-500/10 border-blue-300/40 text-blue-700",
    points: [
      "Slide the Hyperlocal Proximity Slider from 5km to 25km to dynamically filter fresh lots.",
      "Click the 97% Match Score to open the 5-Factor modal (Price vs Mandi, Distance, Grade, Qty, Trust).",
      "Click 'Confirm Purchase' to trigger the Ledger Lock animation and generate the 4-digit Delivery PIN.",
    ],
    technicalBuzzword: "5-Factor Algorithmic Discovery + Smart Escrow",
  },
  {
    time: "2:15 - 2:45",
    section: "Logistics Timeline & PIN Settlement",
    route: "/delivery",
    icon: Truck,
    color: "from-purple-500/20 to-indigo-500/10 border-purple-300/40 text-purple-700",
    points: [
      "Inspect Google OR-Tools multi-stop route timeline (18.4 km saved, 28% fuel reduction).",
      "Enter the 4-digit consumer PIN (7429) at drop-off.",
      "Experience the 'Win Moment': Confetti explosion + instant UPI toast notification (₹14,500).",
    ],
    technicalBuzzword: "Google OR-Tools Multi-Stop VRP + Instant UPI Ledger",
  },
  {
    time: "2:45 - 3:00",
    section: "Admin Dispute Control & DPDP Compliance",
    route: "/admin",
    icon: ShieldCheck,
    color: "from-rose-500/20 to-pink-500/10 border-rose-300/40 text-rose-700",
    points: [
      "Review platform-wide Escrow GMV (₹18.4L) and Spoilage Saved (32.4%).",
      "Open the Split-Screen Dispute Workspace comparing dispatch photo vs buyer arrival photo.",
      "Mention DPDP Act 2023 compliance for smallholder biometric/Aadhaar and location privacy.",
    ],
    technicalBuzzword: "Digital Personal Data Protection (DPDP) Act 2023",
  },
];

export function JudgingCheatSheet({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [activeStep, setActiveStep] = useState(0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-emerald-300/60 bg-white/95 p-6 shadow-2xl sm:p-8">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-emerald-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                <Trophy className="size-3.5 text-emerald-600" />
                SIH 2026 Pitch Masterplan
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                Team Kisan Mitra (SIH26033)
              </span>
            </div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              Judges & Evaluators 3-Minute Walkthrough Cheat Sheet
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              Follow this timed walkthrough for the Smart India Hackathon jury to showcase every core innovation.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Timeline Navigation Tabs */}
        <div className="mt-6 flex flex-wrap gap-2 border-b border-slate-200 pb-4">
          {STEPS.map((step, idx) => (
            <button
              key={step.section}
              onClick={() => setActiveStep(idx)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                activeStep === idx
                  ? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600/30"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Clock className="size-3" />
              <span>{step.time}</span>
              <span className="hidden sm:inline">| {step.section.split(" ")[0]}</span>
            </button>
          ))}
        </div>

        {/* Active Step Details */}
        <div className="mt-6 space-y-6">
          {(() => {
            const step = STEPS[activeStep];
            const StepIcon = step.icon;
            return (
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                      <StepIcon className="size-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                        <Clock className="size-3.5" />
                        <span>Timeline: {step.time}</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">{step.section}</h3>
                    </div>
                  </div>

                  <Button asChild className="bg-emerald-600 hover:bg-emerald-700 self-start sm:self-auto">
                    <Link href={step.route} onClick={onClose} className="flex items-center gap-2">
                      <span>Jump to Live Demo</span>
                      <ExternalLink className="size-4" />
                    </Link>
                  </Button>
                </div>

                {/* Key Points */}
                <div className="mt-5 space-y-2.5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    What to demonstrate in this slot:
                  </p>
                  <ul className="space-y-2">
                    {step.points.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                        <CheckCircle2 className="size-4 shrink-0 text-emerald-600 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Buzzwords box */}
                <div className="mt-5 flex items-center justify-between rounded-xl bg-emerald-50/80 p-3 text-xs border border-emerald-100">
                  <div className="flex items-center gap-2 text-emerald-900 font-medium">
                    <Sparkles className="size-4 text-emerald-600" />
                    <span>Key Architecture Defense:</span>
                    <strong className="font-semibold text-emerald-800">{step.technicalBuzzword}</strong>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Footer Summary / Quick Jump */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 pt-5 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Award className="size-4 text-amber-500" />
            <span>Problem Statement SIH26033: Disintermediation of Agricultural Supply Chain</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={activeStep === 0}
              onClick={() => setActiveStep((p) => Math.max(0, p - 1))}
            >
              Previous
            </Button>
            <Button
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              disabled={activeStep === STEPS.length - 1}
              onClick={() => setActiveStep((p) => Math.min(STEPS.length - 1, p + 1))}
            >
              Next Step
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
