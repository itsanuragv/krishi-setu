"use client";

import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminApi } from "@/features/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ResponsiveDataView } from "@/components/shared/responsive-data-view";
import { Badge } from "@/components/ui/badge";
import { maskPhone } from "@/lib/utils";

export default function AdminUsersPage() {
  const { data } = useQuery({ queryKey: ["admin-users"], queryFn: () => adminApi.users() });
  const items = data?.items ?? [];

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl">Users</h1>
      <ResponsiveDataView
        items={items}
        keyFn={(u) => u.id}
        columns={[
          { header: "Name", cell: (u) => u.name },
          { header: "Role", cell: (u) => u.role },
          { header: "Phone", cell: (u) => maskPhone(u.phone) },
          { header: "District", cell: (u) => u.district ?? "—" },
          {
            header: "Action",
            cell: (u) => (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  if (confirm(`Ban ${u.name}? This cannot be undone from the demo UI.`)) {
                    toast.message("Ban queued — backend RBAC will enforce this.");
                  }
                }}
              >
                Ban
              </Button>
            ),
          },
        ]}
        renderCard={(u) => (
          <Card>
            <CardContent className="space-y-2 pt-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold">{u.name}</p>
                <Badge>{u.role}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {maskPhone(u.phone)} · {u.district}
              </p>
            </CardContent>
          </Card>
        )}
      />
    </div>
  );
}
