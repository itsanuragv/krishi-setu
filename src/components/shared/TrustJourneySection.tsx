"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ScanSearch,
  MapPin,
  Lock,
  KeyRound,
  BadgeCheck,
  ArrowRight,
  Sprout,
  ShoppingBag,
  Play,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { scrollStaggerContainer, scrollCardItem } from "@/lib/animations";

const STEPS = [
  {
    image: "/journey/step1.jpg",
    alt: "Farmer listing produce with AI quality check",
    icon: ScanSearch,
    titleKey: "tj_step1_title",
    descKey: "tj_step1_desc",
    detailKey: "tj_step1_detail",
    ring: "hover:border-emerald-300",
    activeRing: "border-emerald-400 ring-2 ring-emerald-200",
    iconBg: "bg-emerald-600",
  },
  {
    image: "/journey/step2.jpg",
    alt: "Smart match within 25 km",
    icon: MapPin,
    titleKey: "tj_step2_title",
    descKey: "tj_step2_desc",
    detailKey: "tj_step2_detail",
    ring: "hover:border-teal-300",
    activeRing: "border-teal-400 ring-2 ring-teal-200",
    iconBg: "bg-teal-600",
  },
  {
    image: "/journey/step3.jpg",
    alt: "Money locked in escrow",
    icon: Lock,
    titleKey: "tj_step3_title",
    descKey: "tj_step3_desc",
    detailKey: "tj_step3_detail",
    ring: "hover:border-amber-300",
    activeRing: "border-amber-400 ring-2 ring-amber-200",
    iconBg: "bg-amber-600",
  },
  {
    image: "/journey/step4.jpg",
    alt: "Delivery with 4-digit handover PIN",
    icon: KeyRound,
    titleKey: "tj_step4_title",
    descKey: "tj_step4_desc",
    detailKey: "tj_step4_detail",
    ring: "hover:border-cyan-300",
    activeRing: "border-cyan-400 ring-2 ring-cyan-200",
    iconBg: "bg-cyan-700",
  },
  {
    image: "/journey/step5.jpg",
    alt: "Instant payout and trust rating",
    icon: BadgeCheck,
    titleKey: "tj_step5_title",
    descKey: "tj_step5_desc",
    detailKey: "tj_step5_detail",
    ring: "hover:border-lime-300",
    activeRing: "border-lime-400 ring-2 ring-lime-200",
    iconBg: "bg-lime-600",
  },
] as const;

export function TrustJourneySection() {
  const { t } = useLanguage();
  const [active, setActive] = useState<number>(0);

  return (
    <section id="trust-journey" className="space-y-5 pt-2 scroll-mt-24">
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/90 px-3 py-1 text-xs font-bold text-emerald-900 border border-emerald-200">
          <Play className="size-3.5 text-emerald-700 fill-emerald-700" />
          <span>{t("tj_badge")}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
          {t("tj_title")}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          {t("tj_sub")}
        </p>
      </div>

      <motion.div
        variants={scrollStaggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5"
      >
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isActive = active === idx;
          return (
            <motion.button
              key={step.titleKey}
              type="button"
              variants={scrollCardItem}
              whileHover={{ y: -4 }}
              onClick={() => setActive(isActive ? -1 : idx)}
              aria-expanded={isActive}
              className={`text-left rounded-3xl border bg-white/95 shadow-xs overflow-hidden transition-all duration-300 cursor-pointer ${
                isActive ? step.activeRing : `border-slate-200 ${step.ring}`
              } hover:shadow-lg`}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={step.image}
                  alt={step.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                  className="object-cover"
                />
                <span className="absolute top-2.5 left-2.5 flex size-8 items-center justify-center rounded-xl bg-slate-900/80 text-white font-black text-sm backdrop-blur-xs">
                  {idx + 1}
                </span>
                <span
                  className={`absolute bottom-2.5 left-2.5 flex size-9 items-center justify-center rounded-xl ${step.iconBg} text-white shadow-md`}
                >
                  <Icon className="size-4.5" />
                </span>
              </div>

              <div className="p-4 space-y-1.5">
                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {t(step.titleKey)}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {t(step.descKey)}
                </p>
                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden text-xs text-emerald-900 font-medium leading-relaxed border-t border-emerald-100 pt-2 mt-1"
                    >
                      {t(step.detailKey)}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Live demo CTA band */}
      <motion.div
        variants={scrollCardItem}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="glass rounded-3xl border border-emerald-200/90 bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md"
      >
        <p className="text-white font-bold text-sm sm:text-base text-center sm:text-left">
          {t("tj_cta_title")}
        </p>
        <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
          <Link
            href="/farmer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-emerald-900 font-bold text-xs sm:text-sm px-5 h-11 hover:bg-emerald-50 transition-colors"
          >
            <Sprout className="size-4 text-emerald-700" />
            <span>{t("tj_cta_farmer")}</span>
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/consumer"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/40 text-white font-bold text-xs sm:text-sm px-5 h-11 hover:bg-white/10 transition-colors"
          >
            <ShoppingBag className="size-4" />
            <span>{t("tj_cta_consumer")}</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
