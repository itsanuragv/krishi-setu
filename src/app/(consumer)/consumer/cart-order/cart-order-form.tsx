"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { orderApi, paymentApi, productApi } from "@/features/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatInr } from "@/lib/utils";

export function CartOrderForm() {
  const router = useRouter();
  const params = useSearchParams();
  const productId = params.get("productId") ?? "p-1";
  const mode = params.get("mode") === "offer" ? "offer" : "buy";
  const { data } = useQuery({ queryKey: ["product", productId], queryFn: () => productApi.get(productId) });
  const product = data?.product;
  const [qty, setQty] = useState(10);
  const [deliveryMode, setDeliveryMode] = useState<"pickup" | "platform_delivery">("platform_delivery");
  const [loading, setLoading] = useState(false);

  async function place() {
    if (!product) return;
    setLoading(true);
    try {
      const { order } = await orderApi.create({
        productId: product.id,
        quantityKg: qty,
        deliveryMode,
      });
      if (mode === "buy") {
        await paymentApi.create({ orderId: order.id, amount: order.totalAmount });
        await orderApi.patch(order.id, { status: "paid" });
        toast.success("Payment captured (Razorpay test mock)");
      } else {
        toast.success("Offer sent to farmer");
      }
      router.push("/consumer/orders");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not place order");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h1 className="font-display text-2xl">{mode === "offer" ? "Send offer" : "Confirm order"}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{product?.crop ?? "…"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Quantity (kg)</Label>
            <Input type="number" min={1} value={qty} onChange={(e) => setQty(Number(e.target.value))} />
          </div>
          <div className="space-y-2">
            <Label>Delivery</Label>
            <select
              className="h-11 w-full rounded-xl border border-input bg-card px-3"
              value={deliveryMode}
              onChange={(e) => setDeliveryMode(e.target.value as typeof deliveryMode)}
            >
              <option value="platform_delivery">Platform delivery</option>
              <option value="pickup">Farm pickup</option>
            </select>
          </div>
          <p className="text-lg font-semibold">
            Total {formatInr((product?.pricePerKg ?? 0) * qty)}
          </p>
          <Button className="w-full" onClick={place} disabled={loading || !product}>
            {loading ? "Processing…" : mode === "buy" ? "Pay & place order" : "Send offer"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
