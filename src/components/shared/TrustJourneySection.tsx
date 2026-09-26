"use client";

import { useState, useEffect } from "react";
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
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const STEPS = [
  {
    image: "/journey/step1.jpg",
    alt: "Farmer listing produce with AI quality check",
    icon: ScanSearch,
    titleKey: "tj_step1_title",
    descKey: "tj_step1_desc",
    detailKey: "tj_step1_detail",
    tagKey: "tj_tag1",
    pillKey: "tj_pill1",
    href: "/farmer",
    iconBg: "bg-emerald-600",
  },
  {
    image: "/journey/step2.jpg",
    alt: "Smart match within 25 km",
    icon: MapPin,
    titleKey: "tj_step2_title",
    descKey: "tj_step2_desc",
    detailKey: "tj_step2_detail",
    tagKey: "tj_tag2",
    pillKey: "tj_pill2",
    href: "/consumer",
    iconBg: "bg-teal-600",
  },
  {
    image: "/journey/step3.jpg",
    alt: "Money locked in escrow",
    icon: Lock,
    titleKey: "tj_step3_title",
    descKey: "tj_step3_desc",
    detailKey: "tj_step3_detail",
    tagKey: "tj_tag3",
    pillKey: "tj_pill3",
    href: "/consumer",
    iconBg: "bg-amber-600",
  },
  {
    image: "/journey/step4.jpg",
    alt: "Delivery with 4-digit handover PIN",
    icon: KeyRound,
    titleKey: "tj_step4_title",
    descKey: "tj_step4_desc",
    detailKey: "tj_step4_detail",
    tagKey: "tj_tag4",
    pillKey: "tj_pill4",
    href: "/delivery",
    iconBg: "bg-cyan-700",
  },
  {
    image: "/journey/step5.jpg",
    alt: "Instant payout and trust rating",
    icon: BadgeCheck,
    titleKey: "tj_step5_title",
    descKey: "tj_step5_desc",
    detailKey: "tj_step5_detail",
    tagKey: "tj_tag5",
    pillKey: "tj_pill5",
    href: "/farmer/earnings",
    iconBg: "bg-lime-600",
  },
] as const;

const AUTOPLAY_MS = 4500;

export function TrustJourneySection() {
  const { t, language } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const stageCount = STEPS.length;

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % stageCount);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [isAutoPlaying, stageCount]);

  const goTo = (idx: number) => setActiveIndex(idx);
  const next = () => setActiveIndex((p) => (p + 1) % stageCount);
  const prev = () => setActiveIndex((p) => (p - 1 + stageCount) % stageCount);

  return (
    <section id="trust-journey" className="space-y-4 pt-2 scroll-mt-24">
      {/* Header + pill switcher */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3">
        <div className="text-center lg:text-left space-y-1.5">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/90 px-3 py-1 text-xs font-bold text-emerald-900 border border-emerald-200">
            <Play className="size-3.5 text-emerald-700 fill-emerald-700" />
            <span>{t("tj_badge")}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            {t("tj_title")}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto lg:mx-0">
            {t("tj_hint")}
          </p>
        </div>

        <div className="flex items-center justify-center lg:justify-end gap-1.5 overflow-x-auto pb-1 max-w-full">
          {STEPS.map((s, idx) => {
            const isActive = activeIndex === idx;
            return (
              <button
                key={s.pillKey}
                type="button"
                onClick={() => goTo(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                  isActive
                    ? "bg-emerald-700 text-white border-emerald-700 shadow-md shadow-emerald-700/25"
                    : "bg-white text-slate-600 border-slate-200 hover:border-emerald-300 hover:text-emerald-800"
                }`}
              >
                {t(s.pillKey)}
              </button>
            );
          })}
          <div className="flex items-center gap-1 pl-1">
            <button
              type="button"
              onClick={prev}
              title="Previous stage"
              aria-label="Previous stage"
              className="size-7 rounded-lg flex items-center justify-center bg-white border border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-700 transition-colors cursor-pointer"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={next}
              title="Next stage"
              aria-label="Next stage"
              className="size-7 rounded-lg flex items-center justify-center bg-white border border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-700 transition-colors cursor-pointer"
            >
              <ChevronRight className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsAutoPlaying((v) => !v)}
              title={isAutoPlaying ? "Pause auto-rotation" : "Resume auto-rotation"}
              aria-label={isAutoPlaying ? "Pause auto-rotation" : "Resume auto-rotation"}
              className="size-7 rounded-lg flex items-center justify-center bg-white border border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-700 transition-colors cursor-pointer"
            >
              {isAutoPlaying ? (
                <Pause className="size-3.5 text-emerald-700" />
              ) : (
                <Play className="size-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Expanding accordion image gallery */}
      <div className="flex flex-col md:flex-row gap-3 h-auto md:h-[520px] w-full">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isActive = activeIndex === idx;
          return (
            <div
              key={step.titleKey}
              onClick={() => goTo(idx)}
              className={`relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group ${
                isActive
                  ? "md:flex-[5] h-[440px] md:h-full border-2 border-emerald-400 shadow-xl shadow-emerald-900/20"
                  : "md:flex-[1] h-20 md:h-full hover:md:flex-[1.6] border border-slate-200 shadow-xs"
              }`}
            >
              <Image
                src={step.image}
                alt={step.alt}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className={`object-cover transition-all duration-700 ${
                  isActive ? "scale-105" : "scale-100 group-hover:scale-105 opacity-70"
                }`}
              />
              <div
                className="absolute inset-0 transition-opacity duration-500"
                style={{
                  background: isActive
                    ? "linear-gradient(to top, rgba(6,40,28,0.96) 0%, rgba(6,40,28,0.72) 45%, rgba(6,40,28,0.25) 100%)"
                    : "linear-gradient(to top, rgba(6,40,28,0.88) 0%, rgba(6,40,28,0.45) 100%)",
                }}
              />

              {isActive ? (
                <div className="relative z-10 h-full p-5 sm:p-7 flex flex-col justify-between text-white">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-400 text-emerald-950 shadow">
                      {language === "hi"
                        ? `चरण ${idx + 1} / 05`
                        : `Stage ${idx + 1} of 05`}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/10 text-emerald-100 border border-white/20 backdrop-blur-xs">
                      {t(step.tagKey)}
                    </span>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`content-${idx}-${language}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-3 max-w-2xl"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`flex size-10 items-center justify-center rounded-xl ${step.iconBg} text-white shadow-md shrink-0`}
                        >
                          <Icon className="size-5" />
                        </span>
                        <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight leading-tight">
                          {t(step.titleKey)}
                        </h3>
                      </div>
                      <p
                        className="text-xs sm:text-sm leading-relaxed text-emerald-50/90"
                        style={{ textShadow: "0 1px 2px rgba(0,0,0,0.6)" }}
                      >
                        {t(step.descKey)}
                      </p>
                      <p className="text-xs leading-relaxed text-emerald-100/95 bg-white/10 border border-white/15 rounded-xl px-3.5 py-2.5 backdrop-blur-xs">
                        {t(step.detailKey)}
                      </p>
                      <div className="pt-1">
                        <Link
                          href={step.href}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-400 text-emerald-950 hover:bg-emerald-300 transition-colors shadow-lg"
                        >
                          <span>{t("tj_step_cta")}</span>
                          <ArrowRight className="size-3.5" />
                        </Link>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {isAutoPlaying && (
                    <div className="absolute bottom-0 inset-x-0 h-1 bg-black/40">
                      <motion.div
                        key={`prog-${activeIndex}`}
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }}
                        className="h-full bg-emerald-400"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative z-10 h-full p-3 flex md:flex-col justify-between items-center text-white">
                  <span className="font-extrabold text-xs px-2 py-1 rounded-lg bg-black/50 border border-white/20 text-emerald-200">
                    0{idx + 1}
                  </span>
                  <div className="hidden md:flex flex-col items-center justify-center flex-1">
                    <span
                      className="whitespace-nowrap font-bold text-xs tracking-wider uppercase text-emerald-50/90"
                      style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                    >
                      {t(step.titleKey)}
                    </span>
                  </div>
                  <div className="md:hidden flex flex-col items-start flex-1 px-3">
                    <span className="font-bold text-xs">{t(step.titleKey)}</span>
                    <span className="text-[10px] text-emerald-100/70">{t(step.tagKey)}</span>
                  </div>
                  <div className="w-6 h-6 rounded-full hidden md:flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity bg-black/50 border border-white/20">
                    <ArrowRight className="size-3 text-emerald-300" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Live demo CTA band */}
      <div className="rounded-3xl border border-emerald-200/90 bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
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
      </div>
    </section>
  );
}
