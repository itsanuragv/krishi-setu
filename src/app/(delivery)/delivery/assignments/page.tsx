"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { PortalShell, PortalHero, BatchManifest, type BatchStop } from "@/components/portals";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import { DELIVERY_PARTNER, deliveryStops } from "@/lib/portal-mocks/delivery";
import { MOCK_DELIVERY_ROUTE } from "@/lib/mock-data";

export default function AssignmentsPage() {
  const { t } = useLanguage();
  const [stops, setStops] = useState<BatchStop[]>(() => deliveryStops());
  const [navArmed, setNavArmed] = useState(false);

  const currentIdx = stops.findIndex((s) => s.status === "current");

  function handleCurrentAction() {
    if (currentIdx === -1) return;
    if (!navArmed) {
      // First tap: navigate
      toast.info(t("delivery_toast_navigating"));
      setNavArmed(true);
      return;
    }
    // Second tap: mark arrived → advance the route
    toast.success(t("delivery_toast_arrived"));
    setNavArmed(false);
    setStops((prev) =>
      prev.map((s, i) =>
        i === currentIdx
          ? { ...s, status: "done" as const }
          : i === currentIdx + 1 && s.status === "upcoming"
            ? { ...s, status: "current" as const }
            : s
      )
    );
  }

  const manifestStops: BatchStop[] = stops.map((s, i) =>
    i === currentIdx
      ? {
          ...s,
          actionLabel: t(navArmed ? "delivery_mark_arrived" : "delivery_navigate"),
          onAction: handleCurrentAction,
        }
      : s
  );

  const done = stops.filter((s) => s.status === "done").length;

  return (
    <PortalShell accent="delivery">
      <div className="space-y-4">
        <PortalHero
          eyebrow={DELIVERY_PARTNER.routeId}
          title={t("delivery_route_title")}
          subtitle={t("delivery_route_sub")}
          stats={[
            { label: t("delivery_stats_stops"), value: `${done}/${stops.length}` },
            {
              label: t("delivery_stats_km"),
              value: `${MOCK_DELIVERY_ROUTE.totalDistanceKm} km`,
            },
          ]}
        />

        <BatchManifest stops={manifestStops} />

        {/* Big on-road CTA into the dual-verification money moment */}
        <Button
          asChild
          className="h-16 w-full bg-[#2E7D32] font-heading text-lg font-bold text-white shadow-md hover:bg-[#1B5E20]"
        >
          <Link
            href={`/delivery/active-delivery/${DELIVERY_PARTNER.routeId}`}
            className="flex items-center justify-center gap-2"
          >
            <ShieldCheck className="h-6 w-6" />
            {t("delivery_start_verify")}
          </Link>
        </Button>
      </div>
    </PortalShell>
  );
}
