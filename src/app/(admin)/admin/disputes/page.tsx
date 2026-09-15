"use client";

import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { disputeApi } from "@/features/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";

export default function AdminDisputesPage() {
  const { data } = useQuery({ queryKey: ["disputes"], queryFn: () => disputeApi.list() });

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl">Dispute queue</h1>
      {(data?.items ?? []).map((d) => (
        <Card key={d.id}>
          <CardContent className="space-y-2 pt-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold">Order {d.orderId}</p>
              <StatusBadge status={d.status} />
            </div>
            <p className="text-sm">{d.reason}</p>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => {
                  if (confirm("Resolve this dispute and release/refund as per policy?")) {
                    toast.success("Resolution recorded (mock)");
                  }
                }}
              >
                Resolve
              </Button>
              <Button size="sm" variant="outline" onClick={() => toast.message("Needs more evidence")}>
                Request evidence
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
