"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
import { 
  appleSpring, 
  appleSpringSnappy, 
  tabLayoutTransition, 
  modalSpringVariants 
} from "@/lib/animations";

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
      "Vernacular Speech-to-Text: किसान बस बोलते हैं '100 क्विंटल सीहोर शरबती गेहूं बेचना है ₹3,400 में' और फॉर्म स्वतः भर जाता है।",
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
    ctaText: "उपभोक्ता बाज़ार खोलें (Open Consumer Store)",
  },
  {
    step: 3,
    tabLabel: "🏢 Bulk Buyer (थोक खरीदार)",
    title: "Institutional Bulk Buyer Contracting & Escrow",
    hindiTitle: "थोक खरीदार: बड़े अनुबंध, सुरक्षित एस्क्रो और गुणवत्ता गारंटी",
    route: "/buyer/dashboard",
    icon: Warehouse,
    color: "from-amber-600 to-orange-700",
    badge: "Smart Escrow + Digital Contracts",
    summary:
      "प्रोसेसर्स, रिटेल चेन और HoReCa खरीदारों के लिए पारदर्शी मूल्य पर सीधे किसानों से थोक आपूर्ति अनुबंध और एस्क्रो पेमेंट सुरक्षा।",
    details: [
      "Multi-Farmer Lot Pooling: बड़ी मांग होने पर कई किसानों की उपज को मिलाकर एक सुसंगत बड़ा लॉट तैयार करने की सुविधा।",
      "Tri-Party Smart Escrow: डिलीवरी स्वीकार होने और क्वालिटी पास होने तक खरीदार का पैसा सुरक्षित ट्रस्ट खाते में रहता है।",
      "Digital Legal Contract: डिजिटल रूप से हस्ताक्षरित स्पष्ट नियम, जिसमें विवाद की स्थिति में स्वचालित मध्यस्थता का प्रावधान है।",
    ],
    techStack: "Smart Escrow Vaults • Multi-Lot Pooling Engine • Digital Bill of Lading",
    ctaText: "थोक खरीदार पोर्टल खोलें (Open Buyer Portal)",
  },
  {
    step: 4,
    tabLabel: "⚡ Direct Matching (एआई मिलान)",
    title: "5-Factor Real-time Algorithmic Matching",
    hindiTitle: "एआई मिलान: दूरी, गुणवत्ता, भाव और साख का सटीक विश्लेषण",
    route: "/farmer/matches",
    icon: Sparkles,
    color: "from-blue-600 to-indigo-700",
    badge: "5-Factor Algorithm",
    summary:
      "किसान और खरीदार के बीच केवल दूरी नहीं, बल्कि 5 वैज्ञानिक कारकों (दूरी 30%, गुणवत्ता 25%, मूल्य 20%, साख 15%, मात्रा 10%) का विश्लेषण कर सबसे उपयुक्त मिलान।",
    details: [
      "Distance & Corridor Optimization (30% Weight): न्यूनतम परिवहन लागत और समय के आधार पर पास के खरीदार।",
      "Quality Compatibility (25% Weight): खरीदार की आवश्यकता और किसान के OpenCV ग्रेड का सटीक मिलान।",
      "Dynamic Pricing Overlap (20% Weight): मंडी भाव और दोनों पक्षों की सहमत रेंज का स्वतः तालमेल।",
    ],
    techStack: "Spatial Haversine Matching • Multi-Criteria Scoring (0-100) • Automated Push Alerts",
    ctaText: "मैचिंग स्कोर देखें (View Match Engine)",
  },
  {
    step: 5,
    tabLabel: "🚚 Fleet (लॉजिस्टिक्स)",
    title: "Rural-Urban Hyperlocal Delivery Fleet",
    hindiTitle: "लॉजिस्टिक्स: ग्रामीण से शहरी आपूर्ति और लाइव जीपीएस ट्रैकिंग",
    route: "/delivery",
    icon: Truck,
    color: "from-purple-600 to-violet-700",
    badge: "Hyperlocal Fleet Corridor",
    summary:
      "ग्रामीण पिकअप से लेकर शहरी उपभोक्ता के घर तक सुरक्षित और समयबद्ध डिलीवरी सुनिश्चित करने वाला एकीकृत लॉजिस्टिक्स नेटवर्क।",
    details: [
      "Dynamic Route Optimization: कई खेतों से पिकअप करके एक ही ट्रिप में अधिकतम दक्षता के साथ डिलीवरी।",
      "Live GPS & Status Milestones: 'खेत से लोड हुआ' -> 'ट्रांजिट में' -> 'डोरस्टेप पर' की रीयल-टाइम ट्रैकिंग।",
      "Cryptographic Handover Verification: 4-अंकीय गुप्त पिन की पुष्टि के बिना डिलीवरी पूरी नहीं मानी जाती।",
    ],
    techStack: "Leaflet OpenStreetMap Routing • Cryptographic Delivery Handshake • Fleet Dispatch API",
    ctaText: "डिलीवरी पोर्टल खोलें (Open Delivery Portal)",
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Surface Window: Apple VisionOS Layering */}
      <motion.div
        variants={modalSpringVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-black/[0.08] dark:border-white/[0.12] bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl p-5 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.18),inset_0_1px_1.5px_rgba(255,255,255,0.7)] space-y-6 z-10"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-black/[0.06] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-500/20 shadow-2xs backdrop-blur-md">
                <Sparkles className="size-3.5 text-emerald-600" />
                Krishi Setu Guide (यह कैसे काम करता है)
              </span>
              <span className="rounded-full bg-black/[0.04] px-2.5 py-0.5 text-xs font-semibold text-slate-600">
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
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            transition={appleSpringSnappy}
            onClick={onClose}
            aria-label="Close platform guide"
            className="rounded-xl p-2 text-slate-400 hover:bg-black/[0.04] hover:text-slate-700 transition-colors touch-target cursor-pointer"
          >
            <X className="size-5" />
          </motion.button>
        </div>

        {/* Actor Quick Jump Chips with Framer Motion layoutId Gliding Highlight */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-slate-400 font-bold shrink-0 text-[11px] mr-1">भूमिका चुनें:</span>
          {PLATFORM_PILLARS.map((pillar, idx) => {
            const isSelected = activeStep === idx;
            return (
              <button
                key={pillar.step}
                type="button"
                onClick={() => setActiveStep(idx)}
                className={`relative shrink-0 rounded-xl px-3.5 py-1.5 font-bold text-xs select-none transition-colors duration-200 cursor-pointer ${
                  isSelected
                    ? "text-white"
                    : "text-slate-700 hover:text-slate-900 hover:bg-black/[0.03]"
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="guideModalActiveTab"
                    className="absolute inset-0 rounded-xl bg-emerald-700 shadow-[0_2px_10px_rgba(5,150,105,0.3),inset_0_1px_1px_rgba(255,255,255,0.35)] -z-10"
                    transition={tabLayoutTransition}
                  />
                )}
                <span>{pillar.tabLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Main Content Card with Apple Spring Motion */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPillar.step}
            initial={{ opacity: 0, y: 10, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.99 }}
            transition={appleSpring}
            className="rounded-3xl border border-black/[0.06] bg-slate-50/80 p-5 sm:p-6 space-y-5 shadow-xs"
          >
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
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 border border-emerald-300 shadow-2xs">
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

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-black/[0.04] shadow-2xs">
              {currentPillar.summary}
            </p>

            {/* Key Architectural Details */}
            <div className="space-y-2 rounded-2xl bg-white/90 backdrop-blur-md p-4 sm:p-5 border border-black/[0.04] shadow-2xs">
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl bg-slate-900 text-emerald-100 px-4 py-2.5 text-xs shadow-inner">
              <span className="font-bold text-emerald-400">तकनीकी स्टैक (Underlying Tech):</span>
              <span className="font-mono text-[11px] text-slate-200">{currentPillar.techStack}</span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between border-t border-black/[0.06] pt-4">
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
      </motion.div>
    </div>
  );
}
