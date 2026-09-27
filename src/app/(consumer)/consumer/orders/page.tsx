"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, KeyRound, Lock, LockOpen, Navigation, PackageOpen } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { orderApi } from "@/features/api";
import { PortalShell } from "@/components/portals";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatInr, formatKg } from "@/lib/utils";
import {
  MOCK_CONSUMER_ORDERS,
  escrowFromStatus,
  type ConsumerOrder,
} from "@/lib/portal-mocks/consumer";

function OrderSkeleton() {
  return (
    <div className="space-y-3" aria-hidden>
      {[0, 1].map((i) => (
        <Card key={i} className="rounded-2xl border-[#E5E7EB]">
          <CardContent className="space-y-3 p-4">
            <div className="h-5 w-2/3 animate-pulse rounded bg-[#E5E7EB]" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-[#E5E7EB]" />
            <div className="h-12 animate-pulse rounded-xl bg-[#F3F4F6]" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function ConsumerOrdersPage() {
  const { t } = useLanguage();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: () => orderApi.list(),
    retry: 1,
  });

  const orders: ConsumerOrder[] =
    data && data.items.length > 0
      ? data.items.map((o) => ({
          id: o.id,
          crop: o.crop,
          farmerName: o.farmerName,
          quantityKg: o.quantityKg,
          totalAmount: o.totalAmount,
          status: o.status,
          pickupCode: o.pickupCode,
          escrow: escrowFromStatus(o.status),
          createdAt: o.createdAt,
        }))
      : isError
        ? MOCK_CONSUMER_ORDERS
        : [];

  return (
    <PortalShell accent="consumer">
      <div className="space-y-6 pb-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="font-heading text-2xl font-bold text-[#1F2937]">
              {t("consumer_orders_title")}
            </h1>
            <p className="mt-1 text-sm text-[#4B5563]">{t("consumer_orders_sub")}</p>
          </div>
          <Button
            asChild
            variant="outline"
            className="h-11 shrink-0 rounded-xl border-[var(--portal)] text-[var(--portal-dark)] hover:bg-[var(--portal-light)]"
          >
            <Link href="/consumer/search">{t("consumer_cart_browse")}</Link>
          </Button>
        </div>

        {isLoading ? (
          <OrderSkeleton />
        ) : orders.length === 0 ? (
          <Card className="rounded-2xl border-dashed border-[#D1D5DB] bg-white/60">
            <CardContent className="flex flex-col items-center gap-3 px-6 py-12 text-center">
              <PackageOpen className="h-12 w-12 text-[#9CA3AF]" />
              <p className="max-w-xs text-sm font-medium text-[#4B5563]">
                {t("consumer_orders_empty")}
              </p>
              <Button
                asChild
                className="h-12 rounded-xl bg-[var(--portal)] px-5 text-sm font-bold text-white hover:bg-[var(--portal-dark)]"
              >
                <Link href="/consumer/dashboard">{t("consumer_dash_fresh_title")}</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <Card key={o.id} className="overflow-hidden rounded-2xl border-[#E5E7EB]">
                <CardContent className="space-y-3.5 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-heading text-base font-semibold text-[#1F2937]">
                        {o.crop}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-[#6B7280]">
                        {o.farmerName} · #{o.id}
                      </p>
                    </div>
                    <StatusBadge status={o.status} />
                  </div>

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl bg-[#F9FAFB] p-3 text-xs">
                    <div>
                      <span className="text-[#6B7280]">{t("consumer_pd_qty")}: </span>
                      <span className="font-bold text-[#1F2937]">{formatKg(o.quantityKg)}</span>
                    </div>
                    <div>
                      <span className="text-[#6B7280]">{t("consumer_cart_total")}: </span>
                      <span className="font-bold text-[#1F2937]">{formatInr(o.totalAmount)}</span>
                    </div>
                    {o.pickupCode && o.escrow === "locked" && (
                      <div className="flex items-center gap-1.5 font-mono text-sm font-bold text-[var(--portal-dark)]">
                        <KeyRound className="h-4 w-4" />
                        PIN: {o.pickupCode}
                      </div>
                    )}
                    <span
                      className={
                        o.escrow === "locked"
                          ? "inline-flex items-center gap-1 rounded-full bg-[var(--portal-light)] px-2.5 py-1 font-bold text-[var(--portal-dark)]"
                          : "inline-flex items-center gap-1 rounded-full bg-[#E8F5E9] px-2.5 py-1 font-bold text-[#1B5E20]"
                      }
                    >
                      {o.escrow === "locked" ? (
                        <Lock className="h-3.5 w-3.5" />
                      ) : (
                        <LockOpen className="h-3.5 w-3.5" />
                      )}
                      {o.escrow === "locked"
                        ? t("consumer_escrow_locked")
                        : t("consumer_escrow_released")}
                    </span>
                  </div>

                  {o.escrow === "locked" && (
                    <p className="rounded-xl border border-[var(--portal)]/30 bg-[var(--portal-soft)] p-3 text-xs leading-relaxed text-[#92400E]">
                      {t("consumer_orders_pin_hint")}
                    </p>
                  )}

                  <div className="flex items-center justify-between gap-2 border-t border-[#F3F4F6] pt-3">
                    <Button
                      asChild
                      size="sm"
                      className="h-10 rounded-xl bg-[var(--portal)] px-4 text-xs font-bold text-white hover:bg-[var(--portal-dark)]"
                    >
                      <Link href={`/consumer/orders/${o.id}/track`}>
                        <Navigation className="mr-1.5 h-3.5 w-3.5" />
                        {t("consumer_orders_track")}
                      </Link>
                    </Button>
                    <Link
                      href={`/consumer/disputes/new?orderId=${o.id}`}
                      className="inline-flex min-h-[44px] items-center gap-1 px-2 text-xs font-semibold text-[#6B7280] hover:text-[#DC2626]"
                    >
                      <AlertTriangle className="h-3.5 w-3.5" />
                      {t("consumer_orders_dispute")}
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PortalShell>
  );
}
