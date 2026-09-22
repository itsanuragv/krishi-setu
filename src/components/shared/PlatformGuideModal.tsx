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
  Lock,
  ShoppingBag,
  Warehouse,
  Sprout,
  HeartHandshake
} from "lucide-react";
import { Button } from "@/components/ui/button";

const PLATFORM_PILLARS = [
  {
    step: 1,
    tabLabel: "🌾 Farmer (किसान)",
    title: "Farmer Voice Listing & Edge QC",
    hindiTitle: "किसान: बोलकर फसल लिस्टिंग एवं खेत पर ही एआई क्वालिटी जांच",
    route: "/farmer",
    icon: Sprout,
    color: "from-emerald-500 to-teal-700",
    badge: "Voice AI + OpenCV Edge",
    summary:
      "ग्रामीण किसानों को बिना टाइप किए अपनी स्थानीय भाषा (हिन्दी/अंग्रेज़ी) में बोलकर फसल लिस्ट करने और खेत पर ही मोबाइल कैमरे से ग्रेडिंग तय करने की सुविधा।",
    details: [
      "Vernacular Speech-to-Text: किसान बस बोलते हैं '50 किलो टमाटर बेचना है ₹40 में' और फॉर्म स्वतः भर जाता है।",
      "On-Device OpenCV Edge QC: खेत में बिना इंटरनेट भी कैमरे से इमेज शार्पनेस, प्रकाश और रेजोल्यूशन की जांच होती है।",
      "Direct Farm-Gate Selling: बिना किसी आढ़ती या बिचौलिये के 100% अपना तय किया हुआ भाव सीधे बैंक खाते में पाएं।",
    ],
    techStack: "Web Speech API • HTML5 Canvas OpenCV • Offline-First Edge Compute",
    ctaText: "किसान पोर्टल खोलें (Open Farmer Portal)",
  },
  {
    step: 2,
    tabLabel: "🛒 Consumer (उपभोक्ता)",
    title: "Consumer Direct Farm-to-Kitchen Marketplace",
    hindiTitle: "उपभोक्ता: खेत से सीधे ताज़ी उपज 30-40% कम दाम पर",
    route: "/consumer",
    icon: ShoppingBag,
    color: "from-teal-600 to-cyan-700",
    badge: "<25km Hyperlocal Freshness",
    summary:
      "शहरी परिवारों और उपभोक्ताओं को 25 किमी के दायरे में ताज़ा कटी फसल सीधे किसानों से 30-40% कम दामों पर प्राप्त करने की सुविधा — बिना किसी बिचौलिये या आढ़ती के।",
    details: [
      "Hyperlocal <25km Discovery: 12 से 24 घंटे पहले खेत से कटी ताज़ा फसलें सीधे आपके द्वार पर पहुंचती हैं।",
      "Transparent OpenCV Quality Grades: खरीदने से पहले सत्यापित ग्रेड A / B / C, ताजगी और शेल्फ लाइफ की स्पष्ट रिपोर्ट देखें।",
      "30% से 40% तक की सीधी बचत: सुपरमार्केट और खुदरा बिचौलियों के भारी मार्कअप को हटाकर सीधे फार्म-गेट भाव पर खरीदारी।",
      "Secure 4-Digit Handover PIN: डिलीवरी आने पर पहले सामान की जांच करें, संतुष्ट होने पर ही 4-अंकीय पिन देकर भुगतान पूरा करें।",
    ],
    techStack: "PostGIS Spatial Corridor Indexing • 5-Factor Algorithmic Match • Live Order Tracking",
    ctaText: "उपभोक्ता बाज़ार देखें (Shop Consumer Produce)",
  },
  {
    step: 3,
    tabLabel: "🏢 Bulk Buyer (थोक खरीदार)",
    title: "Bulk Buyers & Institutional B2B Procurement",
    hindiTitle: "थोक खरीदार: रेस्टोरेंट, होटल एवं FPO से सीधी संस्थागत खरीद",
    route: "/buyer/dashboard",
    icon: Warehouse,
    color: "from-indigo-600 to-blue-700",
    badge: "FPO Multi-Ton Batching",
    summary:
      "होटल, रेस्टोरेंट (HoReCa), रिटेल किराना चेन और खाद्य प्रसंस्करण इकाइयों के लिए सीधे किसान उत्पादक संगठनों (FPO) से थोक खरीद।",
    details: [
      "Multi-Tonnage Batch Orders: सीधे FPO समूहों से टन में उपज की खरीद, जिससे निरंतर आपूर्ति सुनिश्चित होती है।",
      "Digital Assayer Certificates: प्रत्येक थोक बैच के साथ प्रयोगशाला-सत्यापित क्वालिटी सर्टिफिकेट और डिजिटल जीएसटी चालान।",
      "Volume Discount Pricing: पारदर्शी थोक दरें और निर्धारित समय-सारणी के अनुसार सीधे गोदाम तक डिलीवरी।",
    ],
    techStack: "B2B Procurement Engine • FPO Cluster Aggregation • Digital GST Billing",
    ctaText: "थोक डैशबोर्ड खोलें (Open Bulk Buyer Portal)",
  },
  {
    step: 4,
    tabLabel: "🔒 Smart Escrow (सुरक्षित भुगतान)",
    title: "Zero-Fraud Escrow & 4-Digit Delivery PIN",
    hindiTitle: "सुरक्षित एस्क्रो: 100% सुरक्षित भुगतान एवं 4-अंकीय हैंडओवर पिन",
    route: "/consumer",
    icon: Lock,
    color: "from-amber-600 to-orange-700",
    badge: "100% Financial Protection",
    summary:
      "उपभोक्ता और किसान दोनों के पैसों की 100% सुरक्षा — डिलीवरी की सफल पुष्टि होने तक राशि एस्क्रो में सुरक्षित रहती है।",
    details: [
      "Buyer Protection: ऑर्डर करते समय पैसे सुरक्षित प्लेटफ़ॉर्म एस्क्रो में सुरक्षित रख लिए जाते हैं।",
      "Secret 4-Digit PIN: डिलीवरी के समय खरीदार के मोबाइल पर एक गोपनीय 4-अंकीय पिन भेजा जाता है।",
      "Instant UPI Settlement: उपभोक्ता द्वारा सामान देखकर पिन साझा करते ही भुगतान सीधे किसान के बैंक/यूपीआई खाते में ट्रांसफर हो जाता है।",
    ],
    techStack: "Smart Escrow Ledger • Instant UPI Transfer • Cryptographic PIN Auth",
    ctaText: "एस्क्रो सुरक्षा नियम देखें (View Escrow Rules)",
  },
  {
    step: 5,
    tabLabel: "🚚 Delivery (लॉजिस्टिक्स)",
    title: "Hyperlocal Logistics & Fleet VRP Routing",
    hindiTitle: "लॉजिस्टिक्स: खेतों से सीधी पिकअप एवं रूट ऑप्टिमाइजेशन",
    route: "/delivery",
    icon: Truck,
    color: "from-purple-600 to-indigo-700",
    badge: "OR-Tools Multi-Stop",
    summary:
      "खेतों से सीधी पिकअप और कम से कम समय में उपभोक्ताओं व दुकानों तक डिलीवरी के लिए ऑप्टिमाइज्ड रूटिंग।",
    details: [
      "Vehicle Routing Optimization: पास-पास स्थित खेतों के लॉट को एक ही वाहन में लोड करके परिवहन लागत 28% कम की जाती है।",
      "Compressed Transit: 48-72 घंटे की पारंपरिक ढुलाई को घटाकर 12-24 घंटे में बदला गया है, जिससे फसल खराब नहीं होती।",
      "Transparent Driver Payouts: ड्राइवरों को प्रति किलोमीटर पारदर्शी भाड़ा और तुरंत डिजिटल भुगतान मिलता है।",
    ],
    techStack: "Google OR-Tools VRP • OpenStreetMap / Leaflet Interactive Routing",
    ctaText: "डिलीवरी फ्लीट खोलें (Open Delivery Fleet)",
  },
  {
    step: 6,
    tabLabel: "🛡️ Admin (प्रशासन)",
    title: "Admin Dispute Mediation & DPDP 2023 Governance",
    hindiTitle: "प्रशासन: निष्पक्ष विवाद निवारण एवं DPDP 2023 डेटा सुरक्षा",
    route: "/admin",
    icon: ShieldCheck,
    color: "from-rose-600 to-red-700",
    badge: "DPDP Act 2023 Compliant",
    summary:
      "विवादों का निष्पक्ष डिजिटल निवारण और भारत के DPDP अधिनियम 2023 के तहत किसान व खरीदार डेटा की पूर्ण सुरक्षा।",
    details: [
      "Split-Screen Mediation: खेत से निकलते समय की फोटो और खरीदार के पास पहुंचे सामान की फोटो की तुलना करके निष्पक्ष फैसला।",
      "DPDP Act 2023 Compliance: किसानों और उपभोक्ताओं की निजी जानकारी और लोकेशन डेटा पूरी तरह एन्क्रिप्टेड और सुरक्षित।",
      "Full Audit Trails: प्लेटफ़ॉर्म पर हुए प्रत्येक लेन-देन और एस्क्रो भुगतान का पारदर्शी सरकारी ऑडिट लॉग।",
    ],
    techStack: "DPDP 2023 Compliance • Split-Screen Photo Verification • Immutable Audit Logs",
    ctaText: "प्रशासन नियंत्रण खोलें (Open Admin Panel)",
  },
];

export function PlatformGuideModal({
  isOpen,
  onClose,
  initialStep = 0,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialStep?: number;
}) {
  const [activeStep, setActiveStep] = useState(initialStep);

  if (!isOpen) return null;

  const currentPillar = PLATFORM_PILLARS[activeStep] || PLATFORM_PILLARS[0];
  const Icon = currentPillar.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-3 sm:p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-emerald-200 bg-white p-5 sm:p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                <Sparkles className="size-3.5 text-emerald-600" />
                Krishi Setu Guide (यह कैसे काम करता है)
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                Direct Farm-to-Buyer Highway
              </span>
            </div>
            <h2 className="mt-2 text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              प्लेटफ़ॉर्म कार्यप्रणाली गाइड (How It Works Tour)
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              जानिए कृषि सेतु किसानों, उपभोक्ताओं, थोक खरीदारों और लॉजिस्टिक्स को कैसे आपस में जोड़ता है।
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

        {/* Actor Quick Jump Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-slate-400 font-bold shrink-0 text-[11px] mr-1">भूमिका चुनें:</span>
          {PLATFORM_PILLARS.map((pillar, idx) => (
            <button
              key={pillar.step}
              type="button"
              onClick={() => setActiveStep(idx)}
              className={`shrink-0 rounded-xl px-3 py-1.5 font-bold transition-all text-xs border ${
                activeStep === idx
                  ? "bg-emerald-700 text-white border-emerald-700 shadow-xs"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50 hover:border-emerald-300"
              }`}
            >
              {pillar.tabLabel}
            </button>
          ))}
        </div>

        {/* Main Content Card */}
        <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className={`flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${currentPillar.color} text-white shadow-md`}>
                <Icon className="size-7" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-black text-slate-900">
                    {currentPillar.title}
                  </h3>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 border border-emerald-300">
                    {currentPillar.badge}
                  </span>
                </div>
                <p className="text-xs font-bold text-emerald-700 mt-0.5">
                  {currentPillar.hindiTitle}
                </p>
              </div>
            </div>

            <Button asChild size="sm" className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold gap-1.5 self-start sm:self-auto rounded-xl shadow-xs">
              <Link href={currentPillar.route} onClick={onClose}>
                <span>{currentPillar.ctaText}</span>
                <ExternalLink className="size-3.5" />
              </Link>
            </Button>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
            {currentPillar.summary}
          </p>

          {/* Key Architectural Details */}
          <div className="space-y-2 rounded-2xl bg-white p-4 sm:p-5 border border-slate-200/80 shadow-2xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              मुख्य विशेषताएं एवं कार्यप्रणाली (Key Steps & Features):
            </h4>
            <div className="space-y-2.5 pt-1.5">
              {currentPillar.details.map((detail, dIdx) => (
                <div key={dIdx} className="flex items-start gap-2.5 text-xs text-slate-800 leading-relaxed">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Blueprint Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl bg-slate-900 text-emerald-100 px-4 py-2.5 text-xs">
            <span className="font-bold text-emerald-400">तकनीकी स्टैक (Underlying Tech):</span>
            <span className="font-mono text-[11px] text-slate-200">{currentPillar.techStack}</span>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="text-xs font-bold text-slate-500">
            भाग {activeStep + 1} / {PLATFORM_PILLARS.length}: <span className="text-slate-800">{currentPillar.tabLabel}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={activeStep === 0}
              onClick={() => setActiveStep((p) => p - 1)}
              className="text-xs rounded-xl"
            >
              पिछला (Previous)
            </Button>
            {activeStep < PLATFORM_PILLARS.length - 1 ? (
              <Button
                size="sm"
                onClick={() => setActiveStep((p) => p + 1)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs gap-1 rounded-xl shadow-xs"
              >
                <span>अगला (Next)</span>
                <ArrowRight className="size-3.5" />
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={onClose}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs rounded-xl"
              >
                गाइड बंद करें (Close)
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
