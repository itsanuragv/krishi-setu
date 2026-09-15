"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { deliveryApi } from "@/features/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { MapView } from "@/components/shared/map-view";
import { Navigation, CheckCircle2, ShieldCheck, PhoneCall } from "lucide-react";

export default function ActiveDeliveryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data } = useQuery({ queryKey: ["deliveries"], queryFn: () => deliveryApi.list() });
  const job = data?.items.find((d) => d.id === id) ?? data?.items[0];

  const [enteredPin, setEnteredPin] = useState("");
  const [verifying, setVerifying] = useState(false);

  function handleVerifyAndComplete() {
    if (!job) return;
    if (enteredPin.trim() !== job.pickupCode) {
      toast.error("Incorrect verification PIN. Please verify with consumer.");
      return;
    }
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      toast.success("PIN Verified! Delivery completed & ₹480 settled to farmer.");
      router.push("/delivery/assignments");
    }, 800);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Active Delivery Run</h1>
          <p className="text-xs text-muted-foreground">Order ID: {job?.orderId ?? "o-1"}</p>
        </div>
        {job && <StatusBadge status={job.status} />}
      </div>

      {/* Map View */}
      <MapView
        origin={{
          lat: 19.9975,
          lng: 73.7898,
          label: `Pickup: ${job?.fromArea ?? "Niphad Farm"}`,
          type: "farmer",
        }}
        destination={{
          lat: 18.5204,
          lng: 73.8567,
          label: `Drop-off: ${job?.toArea ?? "Pune Camp"}`,
          type: "consumer",
        }}
        driver={{
          lat: 19.1,
          lng: 73.82,
          label: "Your Position",
          type: "delivery",
        }}
        radiusKm={25}
        heightClass="h-72 sm:h-80"
      />

      {/* Navigation & Call CTA */}
      <div className="grid grid-cols-2 gap-3">
        <a
          href="https://www.google.com/maps/dir/?api=1&destination=Pune+Camp"
          target="_blank"
          rel="noreferrer"
        >
          <Button variant="outline" className="w-full gap-2">
            <Navigation className="size-4 text-primary" />
            Turn-by-Turn GPS
          </Button>
        </a>
        <Button variant="outline" className="w-full gap-2" onClick={() => toast.info("Calling consumer: +91 9876543211")}>
          <PhoneCall className="size-4 text-primary" />
          Call Buyer
        </Button>
      </div>

      {/* PIN Verification Box */}
      <Card className="border-primary/30 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle2 className="size-4 text-primary" />
            Consumer Handover PIN Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Ask the consumer for their 4-digit handover PIN after handing over and inspecting produce.
          </p>
          <div className="space-y-2">
            <Input
              type="text"
              maxLength={4}
              placeholder="Enter 4-digit PIN (e.g. 4821)"
              className="text-center font-mono text-xl tracking-widest"
              value={enteredPin}
              onChange={(e) => setEnteredPin(e.target.value)}
            />
          </div>
          <Button
            className="w-full gap-2"
            disabled={verifying || enteredPin.length !== 4}
            onClick={handleVerifyAndComplete}
          >
            <ShieldCheck className="size-4" />
            {verifying ? "Verifying & Settling…" : "Confirm Delivery & Release Escrow"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
