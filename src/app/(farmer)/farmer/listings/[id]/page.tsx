"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { productApi, matchApi } from "@/features/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { MatchScore } from "@/components/shared/match-score";
import { formatInr } from "@/lib/utils";
import { MapPin, Calendar, Scale, ArrowLeft, Share2 } from "lucide-react";

export default function FarmerListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: productData, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productApi.get(id),
  });

  const { data: matchesData } = useQuery({
    queryKey: ["matches", id],
    queryFn: () => matchApi.list(id),
  });

  const product = productData?.product;
  const matches = matchesData?.items ?? [];

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 w-32 rounded bg-muted" />
        <div className="h-64 rounded-2xl bg-muted" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-12 text-center space-y-3">
        <p className="text-muted-foreground">Listing not found.</p>
        <Link href="/farmer/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/farmer/dashboard" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" />
          Back to Listings
        </Link>
        <Button
          variant="outline"
          size="sm"
          className="gap-1 text-xs"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Listing link copied to clipboard");
          }}
        >
          <Share2 className="size-3.5" />
          Share Listing
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Photos & Basic Info */}
        <div className="space-y-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-muted">
            {product.photos[0] ? (
              <Image
                src={product.photos[0]}
                alt={product.crop}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">No image</div>
            )}
            <div className="absolute top-3 left-3">
              <StatusBadge status={product.status} />
            </div>
            <div className="absolute top-3 right-3">
              <Badge className="bg-emerald-700 text-white font-semibold">Grade {product.grade}</Badge>
            </div>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="font-display text-2xl">{product.crop}</CardTitle>
                <span className="font-display text-2xl font-bold text-primary">
                  {formatInr(product.pricePerKg)}
                  <span className="text-sm font-normal text-muted-foreground">/kg</span>
                </span>
              </div>
              {product.variety && <p className="text-xs text-muted-foreground">Variety: {product.variety}</p>}
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted/50 p-3">
                <div>
                  <span className="text-muted-foreground">Initial Stock:</span>
                  <p className="font-semibold text-sm">{product.quantityKg} kg</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Available to Match:</span>
                  <p className="font-semibold text-sm text-emerald-800">{product.availableKg} kg</p>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="size-3.5" />
                  <span>{product.location.area}, {product.location.district}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="size-3.5" />
                  <span>Harvest: {product.harvestDate}</span>
                </div>
              </div>

              {product.description && (
                <p className="text-muted-foreground leading-relaxed pt-1">{product.description}</p>
              )}

              <div className="pt-2 flex gap-2">
                <Button variant="outline" className="flex-1 text-xs" onClick={() => toast.info("Price update requested")}>
                  Update Floor Price
                </Button>
                <Button variant="outline" className="flex-1 text-xs border-destructive/40 text-destructive" onClick={() => toast.success("Listing marked as paused")}>
                  Pause Listing
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Automatic Matching Section (Module 3/7) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold flex items-center gap-2">
              <Scale className="size-4 text-primary" />
              Automatic Buyer Matches
            </h2>
            <Badge variant="outline">{matches.length} Candidates</Badge>
          </div>

          {matches.length === 0 ? (
            <Card className="p-6 text-center space-y-2">
              <p className="text-sm font-medium">Scanning for buyers within 25km…</p>
              <p className="text-xs text-muted-foreground">
                Celery sweep runs continuously to pair your harvest with nearby consumers & FPOs.
              </p>
              <Link href="/farmer/matches">
                <Button size="sm" variant="outline" className="mt-2">
                  View All Global Matches
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-3">
              {matches.map((m) => (
                <Card key={m.id} className="overflow-hidden">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-sm">{m.buyerName}</p>
                        <p className="text-xs text-muted-foreground">
                          {m.buyerType === "bulk_buyer" ? "🏢 FPO / Institutional" : "🛒 Urban Consumer"} · {m.distanceKm} km away
                        </p>
                      </div>
                      <Badge className="bg-primary text-white font-bold">{m.score}/100 Match</Badge>
                    </div>

                    <div className="flex justify-between items-center rounded-lg bg-muted/50 px-3 py-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Wants: </span>
                        <span className="font-semibold">{m.requestedKg} kg</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Offered: </span>
                        <span className="font-semibold text-emerald-800">{formatInr(m.offeredPricePerKg)}/kg</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total: </span>
                        <span className="font-bold">{formatInr(m.offeredPricePerKg * m.requestedKg)}</span>
                      </div>
                    </div>

                    <MatchScore score={m.score} breakdown={m.breakdown} />

                    <div className="flex gap-2 pt-1">
                      <Link href={`/farmer/orders`} className="flex-1">
                        <Button size="sm" className="w-full text-xs">Accept & Lock Escrow</Button>
                      </Link>
                      <Button size="sm" variant="outline" className="text-xs" onClick={() => toast.info("Counter offer sent")}>
                        Counter
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
