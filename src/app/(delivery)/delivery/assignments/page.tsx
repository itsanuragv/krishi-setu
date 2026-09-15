"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { deliveryApi } from "@/features/api";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";

export default function AssignmentsPage() {
  const { data } = useQuery({ queryKey: ["deliveries"], queryFn: () => deliveryApi.list() });

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl">Assignments</h1>
      {(data?.items ?? []).map((d) => (
        <Link key={d.id} href={`/delivery/active-delivery/${d.id}`}>
          <Card>
            <CardContent className="flex items-center justify-between pt-4">
              <div>
                <p className="font-semibold">
                  {d.fromArea} → {d.toArea}
                </p>
                <p className="text-sm text-muted-foreground">Code {d.pickupCode}</p>
              </div>
              <StatusBadge status={d.status} />
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
