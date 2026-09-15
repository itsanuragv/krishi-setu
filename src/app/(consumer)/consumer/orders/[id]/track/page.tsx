"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { orderApi } from "@/features/api";
import { subscribeToOrder } from "@/lib/ws-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { MapView } from "@/components/shared/map-view";
import { ShieldCheck, Truck, AlertTriangle, KeyRound } from "lucide-react";

export default function TrackPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data } = useQuery({ queryKey: ["order", id], queryFn: () => orderApi.get(id) });
  const [liveStatus, setLiveStatus] = useState<string>();

  // Mock driver live movement
  const [driverLat, setDriverLat] = useState(19.25);
  const [driverLng, setDriverLng] = useState(73.81);

  useEffect(() => {
    return subscribeToOrder(id, (event) => {
      const payload = event.payload as { status?: string };
      if (payload.status) setLiveStatus(payload.status);
    });
  }, [id]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDriverLat((prev) => (prev > 18.6 ? prev - 0.04 : 19.25));
      setDriverLng((prev) => (prev < 73.84 ? prev + 0.01 : 73.81));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const order = data?.order;
  const status = liveStatus ?? order?.status ?? "in_delivery";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Live Delivery Tracking</h1>
          <p className="text-xs text-muted-foreground">Order #{id} · Direct Farm Dispatch</p>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Interactive Map View */}
      <MapView
        origin={{
          lat: 19.9975,
          lng: 73.7898,
          label: `${order?.farmerName ?? "Ramesh Yadav"} (Farm)`,
          details: "Niphad, Nashik",
          type: "farmer",
        }}
        destination={{
          lat: 18.5204,
          lng: 73.8567,
          label: "Your Address",
          details: "Pune, Maharashtra",
          type: "consumer",
        }}
        driver={{
          lat: driverLat,
          lng: driverLng,
          label: "Suresh (Delivery Vehicle)",
          type: "delivery",
        }}
        radiusKm={25}
        heightClass="h-80 sm:h-96"
      />

      {/* PIN & Escrow Card */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-amber-200 bg-amber-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base text-amber-900">
              <KeyRound className="size-4 text-amber-600" />
              Delivery Handoff PIN
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between rounded-xl bg-card p-3 border border-amber-200">
              <span className="text-xs text-muted-foreground">Share ONLY after inspecting produce</span>
              <span className="font-mono text-2xl font-bold tracking-widest text-primary">
                {order?.pickupCode ?? "4821"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Once the delivery partner enters this PIN, payment will be settled from Escrow to the farmer.
            </p>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base text-emerald-900">
              <ShieldCheck className="size-4 text-emerald-600" />
              100% Escrow Protection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-emerald-950">
            <p>
              ₹{order?.totalAmount ?? 480} is currently safely locked in Krishi Setu Escrow.
            </p>
            <p className="text-muted-foreground">
              Transit Window: &lt;12 Hours (Farm-to-Door). OR-Tools route optimization prevents spoilage.
            </p>
            <div className="pt-2 flex gap-2">
              <Link href="/consumer/disputes/new" className="w-full">
                <Button variant="outline" size="sm" className="w-full border-amber-300 text-amber-800 hover:bg-amber-100">
                  <AlertTriangle className="mr-1 size-3.5" />
                  Report Issue / Dispute
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transit Timeline */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Truck className="size-4 text-primary" />
            Transit Milestones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
            <div className="relative">
              <div className="absolute -left-6 top-0.5 size-3 rounded-full bg-emerald-600 ring-4 ring-emerald-100" />
              <p className="text-sm font-semibold">Harvest & Farm Dispatch</p>
              <p className="text-xs text-muted-foreground">Passed pre-dispatch image QC · Niphad Farm</p>
            </div>
            <div className="relative">
              <div className="absolute -left-6 top-0.5 size-3 rounded-full bg-amber-500 ring-4 ring-amber-100 animate-pulse" />
              <p className="text-sm font-semibold text-amber-700">In Transit via Local Partner</p>
              <p className="text-xs text-muted-foreground">Optimal route clustered within 25km corridor</p>
            </div>
            <div className="relative">
              <div className="absolute -left-6 top-0.5 size-3 rounded-full bg-muted-foreground/30 ring-4 ring-muted" />
              <p className="text-sm font-semibold text-muted-foreground">Doorstep Arrival & Quality Inspection</p>
              <p className="text-xs text-muted-foreground">Verify freshness before sharing PIN</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
