"use client";

import type { ReactNode } from "react";
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
} from "lucide-react";
import { ROLE_LABEL, type Role } from "@/lib/auth/roles";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { VoiceAssistant } from "@/components/shared/voice-assistant";

const NAV: Record<Role, { href: string; label: string; icon: typeof Sprout }[]> = {
  farmer: [
    { href: "/farmer/dashboard", label: "Home", icon: LayoutDashboard },
    { href: "/farmer/sell", label: "Sell", icon: Sprout },
    { href: "/farmer/matches", label: "Matches", icon: Scale },
    { href: "/farmer/orders", label: "Orders", icon: Package },
    { href: "/farmer/earnings", label: "Earnings", icon: Wallet },
    { href: "/farmer/ratings", label: "Trust & Ratings", icon: Award },
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
  const items = NAV[role];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-card/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href={items[0].href} className="font-display text-lg font-semibold text-primary">
            Krishi Setu
          </Link>
          <div className="flex items-center gap-2 text-sm">
            <span className="hidden text-muted-foreground sm:inline">
              {user?.name ?? ROLE_LABEL[role]}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                logout();
                router.push("/");
              }}
            >
              <LogOut className="size-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl">
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-56 shrink-0 border-r border-border p-3 lg:block">
          <nav className="space-y-1">
            {items.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-medium",
                    active ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted",
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-5 pb-24 lg:pb-8">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card lg:hidden">
        <ul className="mx-auto grid max-w-lg grid-cols-3 sm:grid-cols-5">
          {items.slice(0, 5).map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex min-h-14 flex-col items-center justify-center gap-1 text-[11px] font-medium",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <Icon className="size-5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <VoiceAssistant />
    </div>
  );
}
