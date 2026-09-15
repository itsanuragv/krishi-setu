"use client";

import { useQuery } from "@tanstack/react-query";
import { orderApi } from "@/features/api";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { ResponsiveDataView } from "@/components/shared/responsive-data-view";
import { formatInr, formatKg } from "@/lib/utils";

export default function FarmerOrdersPage() {
  const { data } = useQuery({ queryKey: ["orders"], queryFn: () => orderApi.list() });
  const items = data?.items ?? [];

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl">Orders</h1>
      <ResponsiveDataView
        items={items}
        keyFn={(o) => o.id}
        columns={[
          { header: "Crop", cell: (o) => o.crop },
          { header: "Buyer", cell: (o) => o.buyerName },
          { header: "Qty", cell: (o) => formatKg(o.quantityKg) },
          { header: "Amount", cell: (o) => formatInr(o.totalAmount) },
          { header: "Status", cell: (o) => <StatusBadge status={o.status} /> },
        ]}
        renderCard={(o) => (
          <Card>
            <CardContent className="space-y-1 pt-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold">{o.crop}</p>
                <StatusBadge status={o.status} />
              </div>
              <p className="text-sm text-muted-foreground">
                {o.buyerName} · {formatKg(o.quantityKg)} · {formatInr(o.totalAmount)}
              </p>
            </CardContent>
          </Card>
        )}
      />
    </div>
  );
}
