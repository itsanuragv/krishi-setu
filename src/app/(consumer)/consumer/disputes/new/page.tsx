"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { disputeApi } from "@/features/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewDisputePage() {
  const router = useRouter();
  const [orderId, setOrderId] = useState("o-1");
  const [reason, setReason] = useState("");

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h1 className="font-display text-2xl">Raise a dispute</h1>
      <Card>
        <CardHeader>
          <CardTitle>Evidence & reason</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Order ID</Label>
            <Input value={orderId} onChange={(e) => setOrderId(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>What went wrong?</Label>
            <Textarea value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Photos (JPEG/PNG, compressed later)</Label>
            <Input type="file" accept="image/jpeg,image/png,image/webp" />
          </div>
          <Button
            className="w-full"
            onClick={async () => {
              await disputeApi.create({ orderId, reason, evidenceUrls: [] });
              toast.success("Dispute opened for admin review");
              router.push("/consumer/orders");
            }}
          >
            Submit dispute
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
