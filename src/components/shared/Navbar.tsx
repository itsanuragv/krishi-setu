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
  Sparkles, 
  Menu, 
  X,
  PhoneCall,
  Warehouse,
  ChevronRight,
  Mic
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";

export function Navbar() {
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
    { href: "/", label: t("nav_overview"), icon: Sparkles },
    { href: "/farmer", label: t("nav_farmer"), icon: Sprout, badge: t("nav_badge_farmer") },
    { href: "/consumer", label: t("nav_consumer"), icon: ShoppingBag, badge: "<25km" },
    { href: "/buyer/dashboard", label: "Bulk Buyers", icon: Warehouse, badge: "FPO" },
    { href: "/delivery", label: t("nav_delivery"), icon: Truck, badge: "Fleet" },
    { href: "/admin", label: t("nav_admin"), icon: ShieldCheck, badge: "Escrow" },
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
      <header className="sticky top-0 z-40 w-full border-b border-emerald-100/70 bg-white/90 backdrop-blur-md transition-all shadow-xs">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3.5 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink min-w-0">
            <Link href="/" className="flex items-center gap-2 group touch-target min-w-0">
              <div className="flex size-8 sm:size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-sm transition-transform group-hover:scale-105">
                <Sprout className="size-4.5 sm:size-6" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1 min-w-0">
                  <span className="font-extrabold text-sm sm:text-lg tracking-tight text-slate-900 leading-none truncate">
                    {t("brand_title")}
                  </span>
                  <span className="text-[10px] sm:text-xs font-semibold text-emerald-600 hidden xs:inline shrink-0">
                    {t("brand_hindi")}
                  </span>
                </div>
                <span className="text-[9px] sm:text-[10px] font-medium text-slate-500 tracking-tight leading-none mt-0.5 hidden sm:inline truncate">
                  {t("brand_subtitle")}
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop / Large Tablet Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                    isActive
                      ? "bg-emerald-50 text-emerald-800 font-bold shadow-xs"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`size-3.5 ${isActive ? "text-emerald-600" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="rounded-full bg-emerald-100 px-1.5 py-0.2 text-[9px] font-semibold text-emerald-700">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Quick Voice Assistant Mic Trigger */}
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new CustomEvent("open-voice-assistant"));
                }
              }}
              aria-label="Open Kisan Voice Assistant"
              className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-300 bg-gradient-to-r from-emerald-600 to-teal-700 p-2 sm:px-3 sm:py-1.5 text-xs font-bold text-white shadow-xs hover:from-emerald-700 hover:to-teal-800 transition-all touch-target active:scale-95 shrink-0"
              title="Kisan Voice Saathi (किसान वाणी)"
            >
              <Mic className="size-4 sm:size-3.5 text-amber-300 animate-pulse shrink-0" />
              <span className="hidden md:inline">{language === "hi" ? "बोलकर खोजें" : "Voice AI"}</span>
            </button>

            {/* Functional Language Toggle */}
            <button
              onClick={handleLanguageToggle}
              aria-label="Toggle language between Hindi and English"
              className="flex items-center justify-center gap-1 rounded-xl border border-emerald-200/80 bg-emerald-50/70 px-2 py-1.5 sm:px-3 text-xs font-bold text-emerald-900 hover:bg-emerald-100 transition-colors shadow-xs touch-target shrink-0"
              title="Toggle Vernacular Hindi / English"
            >
              <Languages className="size-3.5 text-emerald-600 shrink-0" />
              <span className="text-[11px] sm:text-xs">{language === "en" ? "हिन्दी" : "Eng"}</span>
            </button>

            {/* Helpline quick link (Tablet/Desktop) */}
            <a
              href="tel:18001801551"
              className="hidden md:flex items-center gap-1 rounded-xl border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors shrink-0"
              title="Kisan Call Center: 1800-180-1551"
            >
              <PhoneCall className="size-3 text-emerald-600" />
              <span className="text-[11px] font-semibold">1800-180-1551</span>
            </a>

            {/* Mobile / Tablet Menu Button */}
            <button
              onClick={() => setMobileMenuOpen((o) => !o)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              className="lg:hidden rounded-xl p-2 text-slate-700 hover:bg-slate-100 transition-colors touch-target shrink-0"
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
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
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
                    <Sprout className="size-4" />
                  </div>
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
                <div className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                          isActive
                            ? "bg-emerald-50 text-emerald-900 font-bold border border-emerald-200"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`flex size-8 items-center justify-center rounded-lg ${isActive ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                            <Icon className="size-4" />
                          </div>
                          <span>{item.label}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {item.badge && (
                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                              {item.badge}
                            </span>
                          )}
                          <ChevronRight className="size-4 text-slate-400" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Kisan Voice Saathi Shortcut Card */}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (typeof window !== "undefined") {
                    window.dispatchEvent(new CustomEvent("open-voice-assistant"));
                  }
                }}
                className="w-full flex items-center justify-between rounded-2xl border border-emerald-300 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-3.5 text-white shadow-md active:scale-98 transition-all"
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-white/20 text-white">
                    <Mic className="size-5 animate-pulse" />
                  </div>
                  <div>
                    <p className="font-extrabold text-xs leading-none">
                      {language === "hi" ? "किसान वाणी (Voice AI)" : "Kisan Voice Saathi"}
                    </p>
                    <p className="text-[10px] text-emerald-100 mt-1">
                      {language === "hi" ? "बोलकर फसल बेचें या खोजें" : "Speak to sell or search produce"}
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[9px] font-black text-slate-900">
                  TAP
                </span>
              </button>

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
