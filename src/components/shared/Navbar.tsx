"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sprout, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  Languages, 
  Menu, 
  X, 
  PhoneCall, 
  Warehouse, 
  ChevronRight 
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";
import { KrishiSetuLogo } from "@/components/shared/KrishiSetuLogo";
import { MandiPriceTicker } from "@/components/shared/MandiPriceTicker";
import { 
  appleSpring, 
  appleSpringSnappy, 
  tabLayoutTransition 
} from "@/lib/animations";

export function Navbar({ hideTicker = false }: { hideTicker?: boolean }) {
  const pathname = usePathname();
  const { language, toggleLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  // Close menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navItems = [
    { href: "/farmer", label: t("nav_farmer"), icon: Sprout },
    { href: "/consumer", label: t("nav_consumer"), icon: ShoppingBag },
    { href: "/buyer/dashboard", label: t("nav_buyer"), icon: Warehouse },
    { href: "/delivery", label: t("nav_delivery"), icon: Truck },
    { href: "/admin", label: t("nav_admin"), icon: ShieldCheck },
  ];

  const handleLanguageToggle = () => {
    const nextLang = language === "en" ? "hi" : "en";
    toggleLanguage();
    toast.success(
      nextLang === "hi"
        ? "भाषा हिन्दी में बदली गई"
        : "Language switched to English"
    );
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/80 dark:bg-zinc-900/75 border-b border-black/[0.06] dark:border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.03),inset_0_1px_1px_rgba(255,255,255,0.7)] transition-all">
        <div className="mx-auto flex h-[72px] sm:h-[76px] max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
          {/* Brand Logo with Krishi Setu Emblem */}
          <div className="flex items-center gap-2 sm:gap-3 shrink min-w-0">
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group touch-target min-w-0 overflow-visible">
              <motion.div
                whileHover={{ scale: 1.04, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                transition={appleSpringSnappy}
              >
                <KrishiSetuLogo size={42} className="size-9 sm:size-11 shrink-0 filter drop-shadow-xs" />
              </motion.div>
              <div className="flex flex-col min-w-0 justify-center py-1 overflow-visible">
                <div className="flex items-center gap-1.5 min-w-0 overflow-visible">
                  <span className="font-black text-base sm:text-xl text-slate-900 leading-normal py-0.5 tracking-normal whitespace-nowrap overflow-visible">
                    {t("brand_title")}
                  </span>
                  <span className="text-[11px] sm:text-xs font-bold text-emerald-700 leading-normal py-0.5 hidden xs:inline shrink-0 overflow-visible">
                    {t("brand_hindi")}
                  </span>
                </div>
                <span className="text-xs font-medium text-slate-500 tracking-normal leading-normal hidden sm:inline truncate">
                  {t("brand_subtitle")}
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop / Large Tablet Navigation with Seamless Sliding Indicator (layoutId) */}
          <nav className="hidden lg:flex items-center gap-1.5 p-1 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.06]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative"
                >
                  <motion.div
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    transition={appleSpringSnappy}
                    className={`relative flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs sm:text-[13px] select-none transition-colors duration-200 ${
                      isActive
                        ? "text-white font-bold"
                        : "text-slate-700 hover:text-slate-900 font-semibold"
                    }`}
                  >
                    {/* Active Morphing Spring Bubble */}
                    {isActive && (
                      <motion.div
                        layoutId="navbarActiveIndicator"
                        className="absolute inset-0 rounded-xl bg-emerald-600 shadow-[0_2px_12px_rgba(5,150,105,0.3),inset_0_1px_1px_rgba(255,255,255,0.35)] -z-10"
                        transition={tabLayoutTransition}
                      />
                    )}

                    <span
                      className={`flex size-5.5 items-center justify-center rounded-lg transition-colors ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-emerald-100/80 text-emerald-700"
                      }`}
                    >
                      <Icon className="size-3.5 shrink-0" />
                    </span>
                    <span className="whitespace-nowrap">{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs: Separated & Subtle */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Utility Strip: Language + Helpline */}
            <div className="flex items-center gap-1 sm:gap-1.5 pl-2 sm:pl-3 border-l border-black/[0.08] shrink-0">
              {/* Functional Language Toggle */}
              <motion.button
                onClick={handleLanguageToggle}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                transition={appleSpringSnappy}
                aria-label="Toggle language between Hindi and English"
                className="flex items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-emerald-700 bg-black/[0.03] hover:bg-emerald-50 border border-black/[0.05] hover:border-emerald-200 transition-colors touch-target shrink-0"
                title="Toggle Vernacular Hindi / English"
              >
                <Languages className="size-3.5 text-emerald-600 shrink-0" />
                <span className="font-semibold text-slate-800">{language === "en" ? "हिन्दी" : "Eng"}</span>
              </motion.button>

              {/* Helpline quick link */}
              <motion.a
                href="tel:18001801551"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                transition={appleSpringSnappy}
                className="hidden xl:flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-slate-500 hover:text-slate-900 bg-black/[0.02] hover:bg-black/[0.05] border border-black/[0.04] transition-colors shrink-0"
                title="Kisan Call Center: 1800-180-1551"
              >
                <PhoneCall className="size-3 text-slate-400" />
                <span className="font-medium text-slate-600">1800-180-1551</span>
              </motion.a>
            </div>

            {/* Mobile / Tablet Menu Button */}
            <motion.button
              onClick={() => setMobileMenuOpen((o) => !o)}
              whileTap={{ scale: 0.92 }}
              transition={appleSpringSnappy}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              className="lg:hidden rounded-xl p-2 text-slate-700 hover:bg-black/[0.05] transition-colors touch-target shrink-0"
            >
              {mobileMenuOpen ? <X className="size-5 sm:size-6" /> : <Menu className="size-5 sm:size-6" />}
            </motion.button>
          </div>
        </div>

        {/* Live Mandi Benchmark Utility Sub-Bar */}
        {!hideTicker && <MandiPriceTicker />}
      </header>

      {/* Modern Slide-over Mobile Navigation Sheet with Apple Spring Motion */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Drawer Menu */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "100%" }}
              transition={appleSpring}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-xs sm:max-w-sm bg-white/95 backdrop-blur-2xl p-5 shadow-2xl flex flex-col justify-between overflow-y-auto border-l border-black/[0.08]"
            >
              <div className="space-y-5">
                {/* Drawer Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <KrishiSetuLogo size={32} className="size-8 shrink-0" />
                    <div>
                      <p className="font-extrabold text-sm text-slate-900 leading-none">
                        {t("brand_title")}
                      </p>
                      <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                        {t("brand_subtitle")}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close navigation"
                    className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  >
                    <X className="size-5" />
                  </motion.button>
                </div>

                {/* Ecosystem Portals Header */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-2">
                    {language === "hi" ? "इकोसिस्टम पोर्टल" : "Ecosystem Portals"}
                  </p>
                  <div className="space-y-1.5">
                    {navItems.map((item, idx) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      return (
                        <motion.div
                          key={item.href}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ ...appleSpring, delay: idx * 0.04 }}
                        >
                          <Link
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center justify-between rounded-2xl px-3.5 py-3 text-sm transition-all ${
                              isActive
                                ? "bg-emerald-600 text-white font-bold shadow-[0_4px_16px_rgba(5,150,105,0.3),inset_0_1px_1px_rgba(255,255,255,0.35)]"
                                : "bg-slate-50/80 border border-slate-200/80 text-slate-800 font-semibold hover:bg-emerald-50 hover:border-emerald-200 active:scale-[0.98]"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex size-8 items-center justify-center rounded-xl transition-colors ${
                                  isActive
                                    ? "bg-white/20 text-white"
                                    : "bg-white border border-slate-200 text-emerald-600 shadow-2xs"
                                }`}
                              >
                                <Icon className="size-4" />
                              </div>
                              <span>{item.label}</span>
                            </div>
                            <ChevronRight
                              className={`size-4 ${
                                isActive ? "text-white/80" : "text-slate-400"
                              }`}
                            />
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Language Switch Card */}
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-3.5 space-y-2.5 backdrop-blur-md shadow-2xs">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-950">
                    <span className="flex items-center gap-1.5">
                      <Languages className="size-4 text-emerald-600" />
                      <span>{language === "en" ? "Change Language" : "भाषा बदलें"}</span>
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-700">
                      {language === "en" ? "Current: English" : "वर्तमान: हिन्दी"}
                    </span>
                  </div>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    transition={appleSpringSnappy}
                    onClick={handleLanguageToggle}
                    className="w-full rounded-xl bg-white px-3 py-2 text-xs font-bold text-emerald-800 shadow-xs border border-emerald-200 hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Languages className="size-3.5 text-emerald-600" />
                    <span>{language === "en" ? "हिन्दी में चलाएं (Switch to Hindi)" : "Switch to English (अंग्रेज़ी)"}</span>
                  </motion.button>
                </div>
              </div>

              {/* Drawer Footer & Helpline */}
              <div className="border-t border-slate-100 pt-4 mt-6 space-y-3">
                <motion.a
                  href="tel:18001801551"
                  whileTap={{ scale: 0.97 }}
                  transition={appleSpringSnappy}
                  className="flex items-center justify-between rounded-2xl bg-slate-50/80 p-3 text-xs text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200"
                >
                  <div className="flex items-center gap-2.5">
                    <PhoneCall className="size-4 text-emerald-600" />
                    <div>
                      <p className="font-bold text-slate-900 leading-none">Kisan Call Center</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Toll-Free 24x7 Support</p>
                    </div>
                  </div>
                  <span className="font-bold text-emerald-700">1800-180-1551</span>
                </motion.a>

                <p className="text-center text-[10px] text-slate-400">
                  Krishi Setu v1.0 • Bharat Digital Agri Network
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
