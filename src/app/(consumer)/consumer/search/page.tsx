"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { productApi } from "@/features/api";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatInr, formatKg } from "@/lib/utils";

export default function SearchPage() {
  const [crop, setCrop] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [grade, setGrade] = useState("");
  const query = useQuery({
    queryKey: ["products", crop, maxPrice, grade],
    queryFn: () =>
      productApi.list({
        ...(crop ? { crop } : {}),
        ...(maxPrice ? { maxPrice } : {}),
        ...(grade ? { grade } : {}),
      }),
  });
  const items = query.data?.items ?? [];

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl">Search</h1>
      <div className="grid gap-2 sm:grid-cols-3">
        <Input placeholder="Crop (tomato, onion…)" value={crop} onChange={(e) => setCrop(e.target.value)} />
        <Input placeholder="Max ₹ / kg" inputMode="numeric" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
        <select
          className="h-11 rounded-xl border border-input bg-card px-3"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
        >
          <option value="">Any grade</option>
          <option value="A">Grade A</option>
          <option value="B">Grade B</option>
          <option value="C">Grade C</option>
        </select>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <Link key={p.id} href={`/consumer/product/${p.id}`}>
            <Card className="h-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.photos[0]} alt="" className="h-36 w-full object-cover" />
              <CardContent className="space-y-1 pt-3">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{p.crop}</p>
                  <Badge>Grade {p.grade}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatKg(p.availableKg)} · {formatInr(p.pricePerKg)}/kg
                </p>
                <p className="text-xs text-muted-foreground">{p.location.district} · trust {p.farmerTrustScore}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
