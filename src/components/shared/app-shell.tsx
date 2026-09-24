"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  LayoutDashboard,
  LogOut,
  Package,
  Scale,
  Search,
  ShoppingBag,
  Sprout,
  Truck,
  Users,
  Wallet,
  Award,
  Languages,
  Menu,
  X,
  User,
  ChevronRight
} from "lucide-react";
import { ROLE_LABEL, type Role } from "@/lib/auth/roles";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "sonner";
import { 
  appleSpring, 
  appleSpringSnappy, 
  tabLayoutTransition 
} from "@/lib/animations";

const NAV: Record<Role, { href: string; label: string; icon: typeof Sprout }[]> = {
  farmer: [
    { href: "/farmer/dashboard", label: "Home", icon: LayoutDashboard },
    { href: "/farmer/sell", label: "Sell", icon: Sprout },
    { href: "/farmer/matches", label: "Matches", icon: Scale },
    { href: "/farmer/orders", label: "Orders", icon: Package },
    { href: "/farmer/earnings", label: "Earnings", icon: Wallet },
    { href: "/farmer/ratings", label: "Ratings", icon: Award },
  ],
  consumer: [
    { href: "/consumer/dashboard", label: "Home", icon: LayoutDashboard },
    { href: "/consumer/search", label: "Search", icon: Search },
    { href: "/consumer/orders", label: "Orders", icon: ShoppingBag },
  ],
  delivery: [
    { href: "/delivery/dashboard", label: "Home", icon: LayoutDashboard },
    { href: "/delivery/assignments", label: "Jobs", icon: Truck },
  ],
  admin: [
    { href: "/admin/dashboard", label: "Home", icon: LayoutDashboard },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/disputes", label: "Disputes", icon: Scale },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  ],
  bulk_buyer: [
    { href: "/buyer/dashboard", label: "Home", icon: LayoutDashboard },
    { href: "/buyer/search", label: "Contracts", icon: Search },
    { href: "/buyer/orders", label: "Orders", icon: Package },
  ],
};

export function AppShell({
  role,
  children,
}: {
  role: Role;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { language, toggleLanguage } = useLanguage();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const items = NAV[role];

  const handleLanguageToggle = () => {
    const nextLang = language === "en" ? "hi" : "en";
    toggleLanguage();
    toast.success(
      nextLang === "hi" ? "भाषा हिन्दी में बदली गई" : "Language switched to English"
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Header: Apple Glass Surface */}
      <header className="sticky top-0 z-30 border-b border-black/[0.06] dark:border-white/[0.08] bg-white/80 dark:bg-zinc-900/75 backdrop-blur-xl shadow-[0_2px_12px_rgba(0,0,0,0.02),inset_0_1px_1px_rgba(255,255,255,0.7)] transition-all">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            {/* Mobile hamburger menu */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.92 }}
              onClick={() => setMobileDrawerOpen(true)}
              aria-label="Open mobile navigation menu"
              className="md:hidden rounded-xl p-1.5 text-muted-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.06] touch-target flex items-center justify-center cursor-pointer"
            >
              <Menu className="size-5" />
            </motion.button>

            <Link href="/" className="flex items-center gap-2 group">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex size-7.5 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-[0_2px_8px_rgba(5,150,105,0.3)]"
              >
                <Sprout className="size-4" />
              </motion.div>
              <span className="font-display text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Krishi Setu
              </span>
            </Link>

            <span className="hidden sm:inline-flex items-center rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 shadow-2xs backdrop-blur-md">
              {ROLE_LABEL[role]}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            {/* Language Switcher */}
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={handleLanguageToggle}
              aria-label="Toggle language"
              className="flex items-center gap-1 rounded-full border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.03] dark:bg-white/[0.04] px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-black/[0.06] transition-colors touch-target cursor-pointer"
            >
              <Languages className="size-3.5 text-primary shrink-0" />
              <span>{language === "en" ? "हिन्दी" : "English"}</span>
            </motion.button>

            {/* User details */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground bg-black/[0.02] dark:bg-white/[0.03] px-2.5 py-1 rounded-xl border border-black/[0.04]">
              <User className="size-3.5 text-primary" />
              <span className="font-medium text-foreground">
                {user?.name ?? ROLE_LABEL[role]}
              </span>
            </div>

            {/* Logout button */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2.5 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
              onClick={() => {
                logout();
                router.push("/");
              }}
            >
              <LogOut className="size-3.5" />
              <span className="hidden xs:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Body with Adaptive Sidebar for Tablet & Desktop */}
      <div className="mx-auto flex w-full max-w-7xl flex-1">
        {/* Tablet (Compact Rail) & Desktop (Full Sidebar) */}
        <aside className="sticky top-14 hidden md:flex md:w-16 lg:w-56 h-[calc(100vh-3.5rem)] shrink-0 flex-col justify-between border-r border-black/[0.06] dark:border-white/[0.08] p-2 lg:p-3 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl">
          <nav className="space-y-1 relative">
            {items.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.label}
                  className="relative block"
                >
                  <motion.div
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ x: 2 }}
                    transition={appleSpringSnappy}
                    className={cn(
                      "relative flex min-h-10 items-center rounded-xl px-2.5 py-2 text-sm font-medium transition-colors select-none",
                      "md:justify-center lg:justify-start gap-2.5",
                      active
                        ? "text-white font-bold"
                        : "text-muted-foreground hover:text-foreground hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
                    )}
                  >
                    {/* Active Morphing Spring Bubble */}
                    {active && (
                      <motion.div
                        layoutId="appShellActiveTab"
                        className="absolute inset-0 rounded-xl bg-emerald-600 shadow-[0_2px_10px_rgba(5,150,105,0.28),inset_0_1px_1px_rgba(255,255,255,0.35)] -z-10"
                        transition={tabLayoutTransition}
                      />
                    )}

                    <Icon className="size-4.5 shrink-0" />
                    <span className="hidden lg:inline">{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-black/[0.06] dark:border-white/[0.08] pt-3">
            <Link
              href="/"
              className="flex items-center md:justify-center lg:justify-start gap-2 rounded-xl p-2 text-xs text-muted-foreground hover:bg-black/[0.04] transition-colors"
              title="Back to Platform Overview"
            >
              <Sprout className="size-4 text-primary shrink-0" />
              <span className="hidden lg:inline">Platform Home</span>
            </Link>
          </div>
        </aside>

        {/* Content View */}
        <main className="min-w-0 flex-1 px-3 py-4 sm:px-6 sm:py-6 pb-24 md:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile Floating Bottom Bar (<768px): Seamless touch navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-black/[0.06] dark:border-white/[0.08] bg-white/85 dark:bg-zinc-900/85 backdrop-blur-xl md:hidden pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <ul className="mx-auto flex w-full max-w-lg items-center justify-around overflow-x-auto no-scrollbar px-1 py-1.5">
          {items.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <li key={item.href} className="shrink-0 flex-1">
                <Link
                  href={item.href}
                  className="relative block"
                >
                  <motion.div
                    whileTap={{ scale: 0.94 }}
                    className={cn(
                      "relative flex min-h-[48px] flex-col items-center justify-center gap-1 rounded-xl px-1 py-1 text-[10px] font-semibold transition-colors select-none",
                      active
                        ? "text-emerald-700 dark:text-emerald-400 font-bold"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {active && (
                      <motion.div
                        layoutId="appShellMobileActiveTab"
                        className="absolute inset-0 rounded-xl bg-emerald-500/15 border border-emerald-500/25 -z-10 shadow-2xs"
                        transition={tabLayoutTransition}
                      />
                    )}
                    <Icon className={cn("size-4.5 transition-transform", active && "scale-105")} />
                    <span className="truncate max-w-[60px] text-center leading-none">{item.label}</span>
                  </motion.div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Mobile Drawer (Accessible from header menu) */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
              onClick={() => setMobileDrawerOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "-100%" }}
              transition={appleSpring}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl p-5 shadow-2xl flex flex-col justify-between overflow-y-auto border-r border-black/[0.08]"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
                      <Sprout className="size-4" />
                    </div>
                    <div>
                      <p className="font-bold text-sm leading-none">Krishi Setu</p>
                      <p className="text-[11px] text-primary font-semibold mt-0.5">
                        {ROLE_LABEL[role]}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="rounded-xl p-1.5 text-muted-foreground hover:bg-muted"
                  >
                    <X className="size-5" />
                  </motion.button>
                </div>

                {/* User profile card */}
                <div className="rounded-2xl bg-muted/50 p-3.5 border border-border/80 shadow-2xs">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">Logged In User</p>
                  <p className="font-bold text-sm text-foreground">{user?.name ?? ROLE_LABEL[role]}</p>
                  <p className="text-xs text-muted-foreground">{user?.phone ?? "+91 98765 43210"}</p>
                </div>

                {/* Navigation Items */}
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground px-2">Navigation</p>
                  {items.map((item, idx) => {
                    const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ ...appleSpring, delay: idx * 0.03 }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setMobileDrawerOpen(false)}
                          className={cn(
                            "flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                            active
                              ? "bg-primary text-primary-foreground font-bold shadow-xs"
                              : "text-foreground hover:bg-muted active:scale-[0.98]"
                          )}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className="size-4 shrink-0" />
                            <span>{item.label}</span>
                          </div>
                          <ChevronRight className="size-4 opacity-50" />
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-border pt-4 space-y-3">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={handleLanguageToggle}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-border bg-muted/40 p-2.5 text-xs font-bold text-foreground hover:bg-muted cursor-pointer"
                >
                  <Languages className="size-4 text-primary" />
                  <span>{language === "en" ? "Switch to हिन्दी" : "Switch to English"}</span>
                </motion.button>

                <Button
                  variant="destructive"
                  className="w-full text-xs font-bold rounded-xl"
                  onClick={() => {
                    logout();
                    router.push("/");
                  }}
                >
                  <LogOut className="size-4 mr-1.5" />
                  Logout
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
