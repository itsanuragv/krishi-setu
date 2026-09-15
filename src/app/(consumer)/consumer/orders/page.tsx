"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { orderApi } from "@/features/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { RatingModal } from "@/components/shared/rating-modal";
import { formatInr, formatKg } from "@/lib/utils";
import { Navigation, Star, AlertTriangle, KeyRound, ShieldAlert } from "lucide-react";

export default function ConsumerOrdersPage() {
  const { data, refetch } = useQuery({ queryKey: ["orders"], queryFn: () => orderApi.list() });
  const items = data?.items ?? [];

  const [ratingOrder, setRatingOrder] = useState<{ id: string; farmerName: string; crop: string } | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Your Orders</h1>
          <p className="text-xs text-muted-foreground">Direct farm orders protected with Escrow PIN</p>
        </div>
        <Link href="/consumer/search">
          <Button size="sm" variant="outline">+ Browse Crops</Button>
        </Link>
      </div>

      {items.length === 0 ? (
        <Card className="py-12 text-center text-sm text-muted-foreground">
          No orders placed yet. Browse marketplace to connect directly with farmers.
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((o) => (
            <Card key={o.id} className="overflow-hidden border-border">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-base">{o.crop}</p>
                    <p className="text-xs text-muted-foreground">
                      Farmer: <span className="font-medium text-foreground">{o.farmerName}</span> · Order #{o.id}
                    </p>
                  </div>
                  <StatusBadge status={o.status} />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-muted/50 p-3 text-xs">
                  <div>
                    <span className="text-muted-foreground">Quantity:</span>{" "}
                    <span className="font-semibold">{formatKg(o.quantityKg)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Amount:</span>{" "}
                    <span className="font-bold text-emerald-800">{formatInr(o.totalAmount)}</span>
                  </div>
                  {o.pickupCode && (
                    <div className="flex items-center gap-1 font-mono font-bold text-primary">
                      <KeyRound className="size-3.5" />
                      <span>PIN: {o.pickupCode}</span>
                    </div>
                  )}
                </div>

                {/* Status Notice */}
                {o.status === "paid" && (
                  <div className="flex items-center gap-2 text-xs text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                    <ShieldAlert className="size-4 shrink-0 text-amber-600" />
                    <span>Payment held in Escrow. Share your PIN only upon satisfactory doorstep inspection.</span>
                  </div>
                )}

                {/* Actions Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Link href={`/consumer/orders/${o.id}/track`}>
                      <Button size="sm" className="h-8 gap-1.5 text-xs">
                        <Navigation className="size-3.5" />
                        Live Map Track
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 gap-1.5 text-xs"
                      onClick={() =>
                        setRatingOrder({
                          id: o.id,
                          farmerName: o.farmerName,
                          crop: o.crop,
                        })
                      }
                    >
                      <Star className="size-3.5 text-amber-500 fill-amber-500" />
                      Rate Produce
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link href={`/consumer/disputes/new`}>
                      <Button size="sm" variant="ghost" className="h-8 text-xs text-muted-foreground hover:text-destructive">
                        <AlertTriangle className="size-3.5 mr-1" />
                        Dispute
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Rating Modal */}
      {ratingOrder && (
        <RatingModal
          orderId={ratingOrder.id}
          farmerName={ratingOrder.farmerName}
          crop={ratingOrder.crop}
          isOpen={!!ratingOrder}
          onClose={() => setRatingOrder(null)}
          onSuccess={() => {
            refetch();
          }}
        />
      )}
    </div>
  );
}
