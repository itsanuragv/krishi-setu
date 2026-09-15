"use client";

import { useQuery } from "@tanstack/react-query";
import { matchApi } from "@/features/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MatchScore } from "@/components/shared/match-score";
import { formatInr, formatKg } from "@/lib/utils";

export default function MatchesPage() {
  const { data, isLoading } = useQuery({ queryKey: ["matches"], queryFn: () => matchApi.list() });
  const items = data?.items ?? [];

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl">Buyer matches</h1>
      <p className="text-sm text-muted-foreground">Scores are quantity, price, location, quality, and trust — shown openly.</p>
      {isLoading && <p>Finding buyers…</p>}
      {!isLoading && items.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>No match yet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Wait for nearby demand, update your price, or increase delivery distance.</p>
          </CardContent>
        </Card>
      )}
      <div className="grid gap-4 lg:grid-cols-2">
        {items.map((m) => (
          <Card key={m.id}>
            <CardHeader>
              <CardTitle>
                {m.buyerName} · {m.crop}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {formatKg(m.requestedKg)} at {formatInr(m.offeredPricePerKg)}/kg · {m.distanceKm} km
              </p>
            </CardHeader>
            <CardContent>
              <MatchScore score={m.score} breakdown={m.breakdown} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
