"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Plus, Award, Scale, Package, Wallet, Eye } from "lucide-react";
import { matchApi, orderApi, productApi } from "@/features/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatInr, formatKg } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";

export default function FarmerDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const products = useQuery({ queryKey: ["products"], queryFn: () => productApi.list() });
  const matches = useQuery({ queryKey: ["matches"], queryFn: () => matchApi.list() });
  const orders = useQuery({ queryKey: ["orders"], queryFn: () => orderApi.list() });

  const mine = products.data?.items.filter((p) => !user || p.farmerId === user.id) ?? products.data?.items ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">
            Namaste{user?.name ? `, ${user.name.split(" ")[0]}` : ""} 🙏
          </h1>
          <p className="text-xs text-muted-foreground">
            Direct Farm-to-Buyer Portal · Hyperlocal PostGIS matching active (&lt;25km)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/farmer/ratings">
            <Badge className="bg-emerald-700 text-white hover:bg-emerald-800 cursor-pointer gap-1 px-3 py-1.5">
              <Award className="size-4" />
              Trust Score: {user?.trustScore ?? 86}/100
            </Badge>
          </Link>
          <Button asChild size="sm">
            <Link href="/farmer/sell">
              <Plus className="size-4 mr-1" />
              Sell Produce
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Link href="/farmer/dashboard">
          <Card className="hover:border-primary/50 transition-colors">
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-medium text-muted-foreground">Active Listings</CardTitle>
            </CardHeader>
            <CardContent className="font-display text-2xl font-bold">{mine.length}</CardContent>
          </Card>
        </Link>

        <Link href="/farmer/matches">
          <Card className="hover:border-primary/50 transition-colors">
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                <span>Matched Buyers</span>
                <Scale className="size-3.5 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent className="font-display text-2xl font-bold text-primary">
              {matches.data?.items.length ?? "2"}
            </CardContent>
          </Card>
        </Link>

        <Link href="/farmer/orders">
          <Card className="hover:border-primary/50 transition-colors">
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                <span>Active Orders</span>
                <Package className="size-3.5 text-amber-600" />
              </CardTitle>
            </CardHeader>
            <CardContent className="font-display text-2xl font-bold">
              {orders.data?.items.length ?? "1"}
            </CardContent>
          </Card>
        </Link>

        <Link href="/farmer/earnings">
          <Card className="hover:border-primary/50 transition-colors">
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                <span>Net Earnings</span>
                <Wallet className="size-3.5 text-emerald-600" />
              </CardTitle>
            </CardHeader>
            <CardContent className="font-display text-2xl font-bold text-emerald-800">
              ₹14,480
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Active Listings Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Your Crop Listings</h2>
          <Link href="/farmer/matches" className="text-xs text-primary font-medium flex items-center gap-1">
            Check buyer matches <ArrowRight className="size-3" />
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {mine.map((p) => (
            <Link key={p.id} href={`/farmer/listings/${p.id}`}>
              <Card className="hover:border-primary transition-all hover:shadow-sm">
                <CardContent className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-base">{p.crop}</p>
                      <Badge variant="outline" className="text-[10px]">Grade {p.grade}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatKg(p.availableKg)} available · <span className="font-bold text-foreground">{formatInr(p.pricePerKg)}/kg</span>
                    </p>
                    <div className="pt-1">
                      <StatusBadge status={p.status} />
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <p className="text-xs text-muted-foreground">{p.location.area}</p>
                    <Button size="sm" variant="ghost" className="h-7 text-xs gap-1 text-primary">
                      <Eye className="size-3.5" />
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
