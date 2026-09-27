"use client";

import Link from "next/link";
import { Check, PackageSearch, Truck } from "lucide-react";
import { PortalShell } from "@/components/portals";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { useLanguage } from "@/context/LanguageContext";
import { FARMER_ORDERS, usePortalReady, type EscrowOrder } from "@/lib/portal-mocks/farmer";
import { formatInr, formatKg, cn } from "@/lib/utils";

function OrdersSkeleton() {
  return (
    <div className="space-y-4">
      {[0, 1].map((i) => (
        <div key={i} className="space-y-3 rounded-2xl border border-[#E5E7EB] bg-white p-4">
          <div className="h-5 w-1/2 animate-pulse rounded bg-[#E5E7EB]" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-[#E5E7EB]" />
          <div className="space-y-2 pl-1">
            {[0, 1, 2].map((j) => (
              <div key={j} className="flex items-center gap-3">
                <div className="h-8 w-8 animate-pulse rounded-full bg-[#E5E7EB]" />
                <div className="h-3 w-1/3 animate-pulse rounded bg-[#E5E7EB]" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function EscrowTimeline({ order, t }: { order: EscrowOrder; t: (k: string) => string }) {
  const stages = [
    { title: t("farmer_order_stage_locked"), sub: t("farmer_order_stage_locked_sub") },
    { title: t("farmer_order_stage_transit"), sub: t("farmer_order_stage_transit_sub") },
    { title: t("farmer_order_stage_pin"), sub: t("farmer_order_stage_pin_sub") },
    { title: t("farmer_order_stage_released"), sub: t("farmer_order_stage_released_sub") },
  ];
  return (
    <ol className="mt-1">
      {stages.map((s, i) => {
        const done = i < order.escrowStage;
        const current = i === order.escrowStage;
        return (
          <li key={s.title} className="relative flex gap-4 pb-6 last:pb-0">
            {i < stages.length - 1 && (
              <span
                aria-hidden
                className={cn(
                  "absolute bottom-0 left-[15px] top-9 w-0.5",
                  i < order.escrowStage ? "bg-[var(--portal)]" : "bg-[#E5E7EB]"
                )}
              />
            )}
            <span
              className={cn(
                "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 font-heading text-xs font-bold",
                done && "border-[var(--portal)] bg-[var(--portal)] text-white",
                current && "border-[var(--portal)] bg-white text-[var(--portal-dark)]",
                !done && !current && "border-[#E5E7EB] bg-[#F3F4F6] text-[#9CA3AF]"
              )}
            >
              {done ? (
                <Check className="h-4 w-4" strokeWidth={3} />
              ) : current ? (
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--portal)] opacity-60" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-[var(--portal)]" />
                </span>
              ) : (
                i + 1
              )}
            </span>
            <div className="min-w-0 pt-0.5">
              <p
                className={cn(
                  "font-heading text-sm font-bold",
                  done || current ? "text-[#1F2937]" : "text-[#9CA3AF]"
                )}
              >
                {s.title}
              </p>
              {(done || current) && <p className="mt-0.5 text-xs text-[#4B5563]">{s.sub}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default function FarmerOrdersPage() {
  const { t } = useLanguage();
  const ready = usePortalReady();

  return (
    <PortalShell accent="farmer">
      <div className="mx-auto max-w-2xl space-y-5 pb-4">
        <header className="pt-1">
          <h1 className="font-heading text-2xl font-bold text-[#1F2937]">
            {t("farmer_order_title")}
          </h1>
          <p className="mt-1 text-sm text-[#4B5563]">{t("farmer_order_sub")}</p>
        </header>

        {!ready ? (
          <OrdersSkeleton />
        ) : FARMER_ORDERS.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--portal-light)]">
                <PackageSearch className="h-7 w-7 text-[var(--portal-dark)]" />
              </span>
              <p className="text-sm text-[#4B5563]">{t("farmer_order_empty")}</p>
              <Link href="/farmer/matches">
                <Button className="h-12 rounded-xl bg-[var(--portal)] font-heading font-bold text-white hover:bg-[var(--portal-dark)]">
                  {t("farmer_dash_stat_matches")}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {FARMER_ORDERS.map((o) => (
              <Card key={o.id} className="shadow-sm">
                <CardContent className="space-y-4 p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="flex items-center gap-1.5 font-heading text-base font-bold text-[#1F2937]">
                        <Truck className="h-4 w-4 shrink-0 text-[var(--portal)]" />
                        <span className="truncate">{o.crop}</span>
                      </p>
                      <p className="mt-1 text-xs text-[#4B5563]">
                        {o.buyerName} · {formatKg(o.quantityKg)} × {formatInr(o.pricePerKg)}/
                        {t("farmer_unit_kg")}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <StatusBadge status={o.status} />
                      <span className="font-heading text-lg font-bold text-[#1F2937]">
                        {formatInr(o.totalAmount)}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-[#F9FAFB] p-4">
                    <EscrowTimeline order={o} t={t} />
                  </div>

                  <p className="text-xs font-semibold text-[var(--portal-dark)]">
                    {o.escrowStage >= 3
                      ? t("farmer_order_eta_done")
                      : o.etaDays <= 0
                        ? t("farmer_order_eta_today")
                        : t("farmer_order_eta_days").replace("{days}", String(o.etaDays))}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PortalShell>
  );
}
