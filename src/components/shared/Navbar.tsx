"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md transition-all shadow-xs">
        <div className="mx-auto flex h-[72px] sm:h-[76px] max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8 border-b border-emerald-100/70">
          {/* Brand Logo with Krishi Setu Emblem */}
          <div className="flex items-center gap-2 sm:gap-3 shrink min-w-0">
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group touch-target min-w-0 overflow-visible">
              <KrishiSetuLogo size={42} className="size-9 sm:size-11 shrink-0" />
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

          {/* Desktop / Large Tablet Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-xs sm:text-[13px] transition-all duration-150 ${
                    isActive
                      ? "bg-emerald-600 text-white font-bold border border-emerald-600 shadow-xs shadow-emerald-700/20"
                      : "bg-slate-50/95 border border-slate-200/90 text-slate-800 font-semibold shadow-2xs hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-950 hover:shadow-xs hover:-translate-y-0.5"
                  }`}
                >
                  <span
                    className={`flex size-6 items-center justify-center rounded-lg transition-all ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-emerald-100/90 text-emerald-700 group-hover:bg-emerald-200 group-hover:scale-105"
                    }`}
                  >
                    <Icon className="size-3.5 shrink-0" />
                  </span>
                  <span className="whitespace-nowrap">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs: Separated & Subtle */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Utility Strip: Language + Helpline (Subtle & Separated from portal links) */}
            <div className="flex items-center gap-1 sm:gap-1.5 pl-2 sm:pl-3 border-l border-slate-200 shrink-0">
              {/* Functional Language Toggle - Subtle Style */}
              <button
                onClick={handleLanguageToggle}
                aria-label="Toggle language between Hindi and English"
                className="flex items-center justify-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium text-slate-500 hover:text-emerald-700 hover:bg-slate-100/90 transition-colors touch-target shrink-0"
                title="Toggle Vernacular Hindi / English"
              >
                <Languages className="size-3.5 text-slate-400 shrink-0" />
                <span className="font-semibold text-slate-700">{language === "en" ? "हिन्दी" : "Eng"}</span>
              </button>

              {/* Helpline quick link - Subtle Style */}
              <a
                href="tel:18001801551"
                className="hidden xl:flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs text-slate-400 hover:text-slate-800 hover:bg-slate-100/90 transition-colors shrink-0"
                title="Kisan Call Center: 1800-180-1551"
              >
                <PhoneCall className="size-3 text-slate-400" />
                <span className="font-medium text-slate-500">1800-180-1551</span>
              </a>
            </div>

            {/* Mobile / Tablet Menu Button */}
            <button
              onClick={() => setMobileMenuOpen((o) => !o)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              className="lg:hidden rounded-xl p-2 text-slate-700 hover:bg-slate-100 transition-colors touch-target shrink-0"
            >
              {mobileMenuOpen ? <X className="size-5 sm:size-6" /> : <Menu className="size-5 sm:size-6" />}
            </button>
          </div>
        </div>

        {/* Live Mandi Benchmark Utility Sub-Bar */}
        {!hideTicker && <MandiPriceTicker />}
      </header>

      {/* Modern Slide-over Mobile Navigation Sheet */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden animate-in fade-in duration-200">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Menu */}
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xs sm:max-w-sm bg-white p-5 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-250">
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
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close navigation"
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Ecosystem Portals Header */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-2">
                  {language === "hi" ? "इकोसिस्टम पोर्टल" : "Ecosystem Portals"}
                </p>
                <div className="space-y-1.5">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm transition-all ${
                          isActive
                            ? "bg-emerald-600 text-white font-bold border border-emerald-600 shadow-xs"
                            : "bg-slate-50 border border-slate-200/90 text-slate-800 font-semibold hover:bg-emerald-50 hover:border-emerald-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex size-8 items-center justify-center rounded-lg transition-colors ${
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
                    );
                  })}
                </div>
              </div>


              {/* Language Switch Card */}
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-950">
                  <span className="flex items-center gap-1.5">
                    <Languages className="size-4 text-emerald-600" />
                    <span>{language === "en" ? "Change Language" : "भाषा बदलें"}</span>
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700">
                    {language === "en" ? "Current: English" : "वर्तमान: हिन्दी"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleLanguageToggle}
                  className="w-full rounded-xl bg-white px-3 py-2 text-xs font-bold text-emerald-800 shadow-xs border border-emerald-200 hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Languages className="size-3.5 text-emerald-600" />
                  <span>{language === "en" ? "हिन्दी में चलाएं (Switch to Hindi)" : "Switch to English (अंग्रेज़ी)"}</span>
                </button>
              </div>
            </div>

            {/* Drawer Footer & Helpline */}
            <div className="border-t border-slate-100 pt-4 mt-6 space-y-3">
              <a
                href="tel:18001801551"
                className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-xs text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200"
              >
                <div className="flex items-center gap-2.5">
                  <PhoneCall className="size-4 text-emerald-600" />
                  <div>
                    <p className="font-bold text-slate-900 leading-none">Kisan Call Center</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Toll-Free 24x7 Support</p>
                  </div>
                </div>
                <span className="font-bold text-emerald-700">1800-180-1551</span>
              </a>

              <p className="text-center text-[10px] text-slate-400">
                Krishi Setu v1.0 • Bharat Digital Agri Network
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
