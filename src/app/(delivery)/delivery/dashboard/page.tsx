"use client";

import { useState } from "react";
import Link from "next/link";
import { PortalShell, PortalHero } from "@/components/portals";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatInr } from "@/lib/utils";
import {
  Power,
  Wallet,
  Route as RouteIcon,
  CheckCircle2,
  ChevronRight,
  Star,
  Truck,
} from "lucide-react";
import {
  DELIVERY_PARTNER,
  DELIVERY_EARNINGS,
  DELIVERY_COMPLETED_TODAY,
  deliveryStops,
} from "@/lib/portal-mocks/delivery";
import { MOCK_DELIVERY_ROUTE } from "@/lib/mock-data";

export default function DeliveryDashboardPage() {
  const { t } = useLanguage();
  const [duty, setDuty] = useState(true);
  const stops = deliveryStops();
  const stopsLeft = stops.filter((s) => s.status !== "done").length;

  return (
    <PortalShell accent="delivery">
      <div className="space-y-4">
        <PortalHero
          eyebrow={t("delivery_dash_eyebrow")}
          title={t("delivery_dash_title")}
          subtitle={t("delivery_dash_hello").replace("{name}", DELIVERY_PARTNER.name)}
        />

        {/* Duty toggle — big on-road target */}
        <button
          type="button"
          role="switch"
          aria-checked={duty}
          onClick={() => setDuty((d) => !d)}
          className={cn(
            "flex min-h-[72px] w-full items-center justify-between rounded-2xl px-5 shadow-sm transition-colors",
            duty
              ? "bg-[#2E7D32] text-white"
              : "border-2 border-[#E5E7EB] bg-white text-[#1F2937]"
          )}
        >
          <span className="flex items-center gap-3">
            <span
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full",
                duty ? "bg-white/20" : "bg-[#F3F4F6]"
              )}
            >
              <Power className={cn("h-6 w-6", duty ? "text-white" : "text-[#6B7280]")} />
            </span>
            <span className="text-left font-heading text-lg font-bold leading-tight">
              {t(duty ? "delivery_duty_on" : "delivery_duty_off")}
            </span>
          </span>
          <span
            className={cn(
              "relative h-9 w-16 shrink-0 rounded-full transition-colors",
              duty ? "bg-white/30" : "bg-[#E5E7EB]"
            )}
          >
            <span
              className={cn(
                "absolute top-1 h-7 w-7 rounded-full bg-white shadow transition-all",
                duty ? "left-8" : "left-1"
              )}
            />
          </span>
        </button>

        {/* Earnings ticker */}
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-[var(--portal)]" />
              <span className="font-heading text-base font-bold text-[#1F2937]">
                {t("delivery_earnings")}
              </span>
              <Badge className="ml-auto bg-[var(--portal-light)] text-[var(--portal-dark)] hover:bg-[var(--portal-light)]">
                <Star className="mr-1 h-3.5 w-3.5" /> {DELIVERY_PARTNER.rating}
              </Badge>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-[var(--portal-soft)] p-3">
                <div className="font-heading text-xl font-extrabold text-[var(--portal-dark)]">
                  {formatInr(DELIVERY_EARNINGS.today)}
                </div>
                <div className="mt-0.5 text-xs font-medium text-[#4B5563]">
                  {t("delivery_earn_today")}
                </div>
              </div>
              <div className="rounded-xl bg-[var(--portal-soft)] p-3">
                <div className="font-heading text-xl font-extrabold text-[var(--portal-dark)]">
                  {formatInr(DELIVERY_EARNINGS.week)}
                </div>
                <div className="mt-0.5 text-xs font-medium text-[#4B5563]">
                  {t("delivery_earn_week")}
                </div>
              </div>
              <div className="rounded-xl bg-[var(--portal-soft)] p-3">
                <div className="font-heading text-xl font-extrabold text-[var(--portal-dark)]">
                  {formatInr(DELIVERY_EARNINGS.perDelivery)}
                </div>
                <div className="mt-0.5 text-xs font-medium text-[#4B5563]">
                  {t("delivery_earn_per")}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active batch */}
        <Card className="border-[var(--portal)]">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--portal)] text-white">
                <RouteIcon className="h-6 w-6" />
              </span>
              <div>
                <div className="font-heading text-base font-bold text-[#1F2937]">
                  {t("delivery_batch_title")}
                </div>
                <div className="text-sm text-[#4B5563]">
                  {t("delivery_batch_stops")
                    .replace("{n}", String(stops.length))
                    .replace("{km}", String(MOCK_DELIVERY_ROUTE.totalDistanceKm))}
                  {" · "}
                  {t("delivery_stops_left").replace("{n}", String(stopsLeft))}
                </div>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-[#6B7280]">
              <Truck className="h-3.5 w-3.5" />
              {DELIVERY_PARTNER.vehicle}
            </div>
            <Button
              asChild
              className="mt-4 h-14 w-full bg-[var(--portal)] font-heading text-base font-bold text-white hover:bg-[var(--portal-dark)]"
            >
              <Link href="/delivery/assignments" className="flex items-center justify-center gap-2">
                {t("delivery_view_manifest")}
                <ChevronRight className="h-5 w-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Completed today */}
        <div>
          <h2 className="font-heading text-lg font-bold text-[#1F2937]">
            {t("delivery_done_today")} · {DELIVERY_COMPLETED_TODAY.length}
          </h2>
          <div className="mt-2 space-y-2">
            {DELIVERY_COMPLETED_TODAY.length === 0 ? (
              <Card className="border-dashed border-2">
                <CardContent className="py-8 text-center">
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--portal-soft)]">
                    <CheckCircle2 className="h-7 w-7 text-[var(--portal)]" />
                  </span>
                  <p className="mt-3 text-sm font-medium text-[#4B5563]">
                    {t("delivery_empty_done")}
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    className="mt-4 h-12 border-[var(--portal)] font-heading font-bold text-[var(--portal-dark)]"
                  >
                    <Link href="/delivery/assignments">{t("delivery_empty_done_cta")}</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              DELIVERY_COMPLETED_TODAY.map((d) => (
                <Card key={d.id}>
                  <CardContent className="flex items-center gap-3 py-3">
                    <CheckCircle2 className="h-6 w-6 shrink-0 text-[#16A34A]" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold text-[#1F2937]">
                        {d.title}
                      </div>
                      <div className="text-xs text-[#6B7280]">
                        {d.area} · {d.time}
                      </div>
                    </div>
                    <span className="shrink-0 rounded-full bg-[#E8F5E9] px-2.5 py-1 text-xs font-bold text-[#1B5E20]">
                      {t("delivery_fee_earned").replace("{amount}", formatInr(d.amount))}
                    </span>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
