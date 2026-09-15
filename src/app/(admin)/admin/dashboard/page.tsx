"use client";

import { useQuery } from "@tanstack/react-query";
import { adminApi, disputeApi } from "@/features/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatInr } from "@/lib/utils";

export default function AdminDashboardPage() {
  const kpis = useQuery({ queryKey: ["admin-kpis"], queryFn: () => adminApi.kpis() });
  const disputes = useQuery({ queryKey: ["disputes"], queryFn: () => disputeApi.list() });
  const k = kpis.data;

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl">Admin console</h1>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {[
          ["Users", k?.users],
          ["Listings", k?.activeListings],
          ["Disputes", k?.openDisputes],
          ["GMV today", k ? formatInr(k.gmvToday) : "—"],
          ["Fraud flags", k?.fraudFlags],
        ].map(([label, value]) => (
          <Card key={String(label)}>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
            </CardHeader>
            <CardContent className="font-display text-2xl">{value ?? "—"}</CardContent>
          </Card>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        Destructive actions (ban, force refund) will require an extra confirm step. MFA UI can land with backend TOTP.
      </p>
      <p className="text-sm">Open disputes in queue: {disputes.data?.items.length ?? 0}</p>
    </div>
  );
}
