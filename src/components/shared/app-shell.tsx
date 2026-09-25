"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-card/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            {/* Mobile hamburger menu */}
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              aria-label="Open mobile navigation menu"
              className="md:hidden rounded-lg p-1.5 text-muted-foreground hover:bg-muted touch-target flex items-center justify-center"
            >
              <Menu className="size-5" />
            </button>

            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
                <Sprout className="size-4" />
              </div>
              <span className="font-display text-base sm:text-lg font-bold text-primary tracking-tight">
                Krishi Setu
              </span>
            </Link>

            <span className="hidden sm:inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
              {ROLE_LABEL[role]}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            {/* Language Switcher */}
            <button
              onClick={handleLanguageToggle}
              aria-label="Toggle language"
              className="flex items-center gap-1 rounded-lg border border-border bg-muted/60 px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted transition-colors touch-target"
            >
              <Languages className="size-3.5 text-primary shrink-0" />
              <span>{language === "en" ? "हिन्दी" : "English"}</span>
            </button>

            {/* User details */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/40 px-2.5 py-1 rounded-lg border border-border/50">
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
        <aside className="sticky top-14 hidden md:flex md:w-16 lg:w-56 h-[calc(100vh-3.5rem)] shrink-0 flex-col justify-between border-r border-border p-2 lg:p-3 bg-card/50">
          <nav className="space-y-1">
            {items.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.label}
                  className={cn(
                    "flex min-h-10 items-center rounded-xl px-2.5 py-2 text-sm font-medium transition-colors",
                    "md:justify-center lg:justify-start gap-2.5",
                    active
                      ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="size-4.5 shrink-0" />
                  <span className="hidden lg:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-border pt-3">
            <Link
              href="/"
              className="flex items-center md:justify-center lg:justify-start gap-2 rounded-xl p-2 text-xs text-muted-foreground hover:bg-muted transition-colors"
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
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 backdrop-blur-md md:hidden pb-safe">
        <ul className="mx-auto flex w-full max-w-lg items-center justify-around overflow-x-auto no-scrollbar px-1 py-1">
          {items.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <li key={item.href} className="shrink-0 flex-1">
                <Link
                  href={item.href}
                  className={cn(
                    "flex min-h-[50px] flex-col items-center justify-center gap-1 rounded-lg px-1 py-1 text-[10px] font-semibold transition-colors",
                    active
                      ? "text-primary font-bold bg-primary/10"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className={cn("size-4.5 transition-transform", active && "scale-110")} />
                  <span className="truncate max-w-[60px] text-center leading-none">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Mobile Drawer (Accessible from header menu) */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-72 bg-card p-5 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-250">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Sprout className="size-4" />
                  </div>
                  <div>
                    <p className="font-bold text-sm leading-none">Krishi Setu</p>
                    <p className="text-[11px] text-primary font-semibold mt-0.5">
                      {ROLE_LABEL[role]}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* User profile card */}
              <div className="rounded-xl bg-muted/50 p-3 border border-border/80">
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Logged In User</p>
                <p className="font-bold text-sm text-foreground">{user?.name ?? ROLE_LABEL[role]}</p>
                <p className="text-xs text-muted-foreground">{user?.phone ?? "+91 98765 43210"}</p>
              </div>

              {/* Navigation Items */}
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-muted-foreground px-2">Navigation</p>
                {items.map((item) => {
                  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileDrawerOpen(false)}
                      className={cn(
                        "flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                        active
                          ? "bg-primary text-primary-foreground font-bold shadow-xs"
                          : "text-foreground hover:bg-muted"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="size-4 shrink-0" />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className="size-4 opacity-50" />
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-border pt-4 space-y-3">
              <button
                type="button"
                onClick={handleLanguageToggle}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-border bg-muted/40 p-2.5 text-xs font-bold text-foreground hover:bg-muted"
              >
                <Languages className="size-4 text-primary" />
                <span>{language === "en" ? "Switch to हिन्दी" : "Switch to English"}</span>
              </button>

              <Button
                variant="destructive"
                className="w-full text-xs font-bold"
                onClick={() => {
                  logout();
                  router.push("/");
                }}
              >
                <LogOut className="size-4 mr-1.5" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
