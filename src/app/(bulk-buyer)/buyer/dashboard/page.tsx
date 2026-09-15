"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { productApi } from "@/features/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatInr, formatKg } from "@/lib/utils";

export default function BuyerDashboardPage() {
  const { data } = useQuery({ queryKey: ["products"], queryFn: () => productApi.list() });

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl">Contract lots</h1>
      <p className="text-sm text-muted-foreground">FPO / bulk buyer view of farm-gate inventory.</p>
      <Button asChild>
        <Link href="/buyer/search">Browse contracts</Link>
      </Button>
      <div className="grid gap-3 sm:grid-cols-2">
        {(data?.items ?? []).map((p) => (
          <Card key={p.id}>
            <CardContent className="pt-4">
              <p className="font-semibold">{p.crop}</p>
              <p className="text-sm text-muted-foreground">
                {formatKg(p.availableKg)} · {formatInr(p.pricePerKg)}/kg · {p.location.district}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
