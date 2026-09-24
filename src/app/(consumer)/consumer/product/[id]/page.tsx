"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { productApi } from "@/features/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatInr, formatKg } from "@/lib/utils";

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productApi.get(id),
  });
  const product = data?.product;

  if (isLoading) return <p>Loading lot…</p>;
  if (!product) return <p>Listing not found.</p>;

  return (
    <div className="space-y-4 pb-20">
      <div className="relative h-52 w-full overflow-hidden rounded-2xl md:h-72">
        <Image
          src={product.photos[0] || "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600"}
          alt={`${product.crop} ${product.variety} - Grade ${product.grade} farm produce`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 800px"
          className="object-cover"
        />
      </div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">{product.crop}</h1>
          <p className="text-muted-foreground">{product.variety}</p>
        </div>
        <Badge>Grade {product.grade}</Badge>
      </div>
      <p className="text-2xl font-semibold">
        {formatInr(product.pricePerKg)}
        <span className="text-sm font-normal text-muted-foreground"> / kg</span>
      </p>
      <p className="text-sm">{product.description}</p>
      <Card>
        <CardHeader>
          <CardTitle>Farmer</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <p className="font-medium">{product.farmerName}</p>
          <p className="text-muted-foreground">
            {product.location.area}, {product.location.district} · approximate area only
          </p>
          <p className="mt-1">Trust score {product.farmerTrustScore}</p>
          <p>{formatKg(product.availableKg)} available · harvested {product.harvestDate}</p>
        </CardContent>
      </Card>
      <div className="fixed inset-x-0 bottom-14 z-20 border-t border-border bg-card p-3 lg:static lg:border-0 lg:bg-transparent lg:p-0">
        <div className="mx-auto flex max-w-6xl gap-2">
          <Button asChild variant="outline" className="flex-1">
            <Link href={`/consumer/cart-order?productId=${product.id}&mode=offer`}>Send offer</Link>
          </Button>
          <Button asChild className="flex-1">
            <Link href={`/consumer/cart-order?productId=${product.id}&mode=buy`}>Buy now</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
