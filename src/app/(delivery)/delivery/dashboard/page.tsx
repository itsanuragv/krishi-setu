"use client";

import { useQuery } from "@tanstack/react-query";
import { deliveryApi } from "@/features/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DeliveryDashboardPage() {
  const { data } = useQuery({ queryKey: ["deliveries"], queryFn: () => deliveryApi.list() });
  const job = data?.items[0];

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl">Today&apos;s route</h1>
      {job ? (
        <Card>
          <CardHeader>
            <CardTitle>
              {job.fromArea} → {job.toArea}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <StatusBadge status={job.status} />
            <p className="text-sm">Pickup code: {job.pickupCode}</p>
            <p className="text-sm text-muted-foreground">ETA ~{job.etaMinutes} min</p>
            <Button asChild className="w-full">
              <Link href={`/delivery/active-delivery/${job.id}`}>Open live delivery</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <p className="text-muted-foreground">No assignment yet.</p>
      )}
    </div>
  );
}
