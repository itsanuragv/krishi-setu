"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Sprout, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  Languages, 
  Award,
  Sparkles,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { JudgingCheatSheet } from "./JudgingCheatSheet";

const NAV_ITEMS = [
  { href: "/", label: "Overview", icon: Sparkles },
  { href: "/farmer", label: "Farmer Intake", icon: Sprout, badge: "Voice + OpenCV" },
  { href: "/consumer", label: "Consumer Match", icon: ShoppingBag, badge: "<25km" },
  { href: "/delivery", label: "Delivery Fleet", icon: Truck, badge: "OR-Tools" },
  { href: "/admin", label: "Admin Control", icon: ShieldCheck, badge: "Escrow" },
];

export function Navbar() {
  const pathname = usePathname();
  const [cheatSheetOpen, setCheatSheetOpen] = useState(false);
  const [lang, setLang] = useState<"hi" | "en">("en");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    const nextLang = lang === "en" ? "hi" : "en";
    setLang(nextLang);
    toast.success(
      nextLang === "hi"
        ? "भाषा हिन्दी में बदली गई (Vernacular Voice Guidance Enabled)"
        : "Language switched to English"
    );
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-emerald-100/60 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-sm transition-transform group-hover:scale-105">
                <Sprout className="size-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg tracking-tight text-slate-900">
                    Krishi Setu
                  </span>
                  <span className="text-xs font-semibold text-emerald-600">
                    (कृषि सेतु)
                  </span>
                </div>
                <span className="text-[10px] font-medium text-slate-500">
                  SIH 2026 • Kisan Mitra
                </span>
              </div>
            </Link>

            {/* Live Cluster Pill */}
            <div className="hidden lg:flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50/80 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
              <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
              <span>LIVE CLUSTER: 24 FARMS (&lt;25KM)</span>
            </div>
          </div>

          {/* Desktop Navigation links */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    isActive
                      ? "bg-emerald-50 text-emerald-800 font-semibold shadow-xs"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`size-3.5 ${isActive ? "text-emerald-600" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="hidden xl:inline rounded-full bg-emerald-100 px-1.5 py-0.2 text-[9px] font-medium text-emerald-700">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              title="Toggle Vernacular Hindi / English"
            >
              <Languages className="size-3.5 text-emerald-600" />
              <span>{lang === "en" ? "हिन्दी" : "English"}</span>
            </button>

            {/* SIH Judging Cheat Sheet Button */}
            <Button
              onClick={() => setCheatSheetOpen(true)}
              size="sm"
              className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-sm text-xs font-semibold"
            >
              <Award className="size-3.5 text-amber-300" />
              <span>SIH Pitch Guide</span>
            </Button>

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="md:hidden rounded-lg p-1.5 text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-emerald-100 bg-white px-4 py-3 space-y-1 animate-in slide-in-from-top duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs font-semibold text-emerald-800">
              <span>Hyperlocal Cluster Status:</span>
              <span className="flex items-center gap-1 text-emerald-600">
                <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
                24 Active Farms (&lt;25KM)
              </span>
            </div>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium ${
                    isActive ? "bg-emerald-50 text-emerald-800" : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="size-4 text-emerald-600" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
            <div className="pt-2">
              <Button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setCheatSheetOpen(true);
                }}
                className="w-full bg-emerald-600 text-white text-xs"
              >
                Open SIH 2026 Pitch Guide
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Judging cheat sheet modal */}
      <JudgingCheatSheet
        isOpen={cheatSheetOpen}
        onClose={() => setCheatSheetOpen(false)}
      />
    </>
  );
}
