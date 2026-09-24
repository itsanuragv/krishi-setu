"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { productApi } from "@/features/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatInr, formatKg } from "@/lib/utils";

export default function ConsumerDashboardPage() {
  const { data } = useQuery({ queryKey: ["products"], queryFn: () => productApi.list() });
  const items = data?.items ?? [];

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl">Nearby harvest</h1>
      <p className="text-sm text-muted-foreground">Hyperlocal lots from verified farms. Search to filter crop, budget, and grade.</p>
      <Button asChild className="w-full sm:w-auto">
        <Link href="/consumer/search">Search produce</Link>
      </Button>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.slice(0, 4).map((p) => (
          <Link key={p.id} href={`/consumer/product/${p.id}`}>
            <Card className="overflow-hidden">
              <div className="relative h-36 w-full overflow-hidden">
                <Image
                  src={p.photos[0] || "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600"}
                  alt={`${p.crop} fresh harvest`}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <CardContent className="pt-3">
                <p className="font-semibold">{p.crop}</p>
                <p className="text-sm text-muted-foreground">
                  {formatKg(p.availableKg)} · {formatInr(p.pricePerKg)}/kg · {p.location.area}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
