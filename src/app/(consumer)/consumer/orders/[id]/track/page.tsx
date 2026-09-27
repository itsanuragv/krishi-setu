"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Check, KeyRound, ShieldCheck, Truck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { orderApi } from "@/features/api";
import { subscribeToOrder } from "@/lib/ws-client";
import { PortalShell } from "@/components/portals";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { cn, formatInr } from "@/lib/utils";
import {
  ORDER_TIMELINE,
  mockConsumerOrder,
  timelineIndexForStatus,
} from "@/lib/portal-mocks/consumer";

export default function ConsumerTrackPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t } = useLanguage();
  const { data, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: () => orderApi.get(id),
    retry: 1,
  });
  const [liveStatus, setLiveStatus] = useState<string>();

  useEffect(() => {
    return subscribeToOrder(id, (event) => {
      const payload = event.payload as { status?: string };
      if (payload.status) setLiveStatus(payload.status);
    });
  }, [id]);

  const fallback = mockConsumerOrder(id);
  const order = data?.order;
  const status = liveStatus ?? order?.status ?? fallback.status;
  const crop = order?.crop ?? fallback.crop;
  const farmerName = order?.farmerName ?? fallback.farmerName;
  const totalAmount = order?.totalAmount ?? fallback.totalAmount;
  const pickupCode = order?.pickupCode ?? fallback.pickupCode ?? "4821";

  const currentStep = timelineIndexForStatus(status);
  const done = currentStep < 0; // disputed/cancelled — timeline halts

  return (
    <PortalShell accent="consumer">
      <div className="space-y-6 pb-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="font-heading text-2xl font-bold text-[#1F2937]">
              {t("consumer_track_title")}
            </h1>
            <p className="mt-1 text-sm text-[#4B5563]">
              #{id} · {crop} · {farmerName}
            </p>
          </div>
          <StatusBadge status={status} />
        </div>

        {isLoading ? (
          <Card className="rounded-2xl border-[#E5E7EB]">
            <CardContent className="space-y-3 p-5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-12 animate-pulse rounded-xl bg-[#F3F4F6]" />
              ))}
            </CardContent>
          </Card>
        ) : (
          <>
            {/* PIN & Escrow cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="rounded-2xl border-[var(--portal)]/40 bg-[var(--portal-soft)]">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base text-[var(--portal-dark)]">
                    <KeyRound className="h-4 w-4" />
                    {t("consumer_track_pin_title")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-[var(--portal)]/30 bg-white p-3.5">
                    <span className="text-xs leading-snug text-[#6B7280]">
                      {t("consumer_track_pin_hint")}
                    </span>
                    <span className="font-mono text-2xl font-bold tracking-[0.2em] text-[var(--portal-dark)]">
                      {pickupCode}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-[#6B7280]">
                    {t("consumer_track_pin_note")}
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-[#2E7D32]/30 bg-[#F1F8E9]">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base text-[#1B5E20]">
                    <ShieldCheck className="h-4 w-4" />
                    {t("consumer_track_escrow_title")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  <p className="text-sm font-bold text-[#1F2937]">
                    {formatInr(totalAmount)}{" "}
                    <span className="text-xs font-semibold text-[#4B5563]">
                      · {t("consumer_escrow_locked")}
                    </span>
                  </p>
                  <p className="text-xs leading-relaxed text-[#4B5563]">
                    {t("consumer_track_escrow_body")}
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="h-10 w-full rounded-xl border-[#DC2626]/40 text-[#DC2626] hover:bg-red-50"
                  >
                    <Link href={`/consumer/disputes/new?orderId=${id}`}>
                      <AlertTriangle className="mr-1.5 h-3.5 w-3.5" />
                      {t("consumer_track_report")}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Delivery timeline */}
            <Card className="rounded-2xl border-[#E5E7EB]">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base text-[#1F2937]">
                  <Truck className="h-4 w-4 text-[var(--portal)]" />
                  {t("consumer_track_title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <ol className="relative space-y-1 border-l-2 border-[#E5E7EB] pl-0">
                  {ORDER_TIMELINE.map((step, i) => {
                    const isCurrent = !done && i === currentStep;
                    const isPast = !done && i < currentStep;
                    return (
                      <li key={step.key} className="relative flex gap-4 pb-6 pl-8 last:pb-0">
                        <span
                          aria-hidden
                          className={cn(
                            "absolute -left-[15px] top-0.5 flex h-7 w-7 items-center justify-center rounded-full ring-4",
                            isPast && "bg-[#2E7D32] text-white ring-[#E8F5E9]",
                            isCurrent &&
                              "animate-pulse bg-[var(--portal)] text-white ring-[var(--portal-light)]",
                            !isPast && !isCurrent && "bg-[#E5E7EB] text-[#9CA3AF] ring-[#F3F4F6]"
                          )}
                        >
                          {isPast ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <span className="text-xs font-bold">{i + 1}</span>
                          )}
                        </span>
                        <div className={cn(!isPast && !isCurrent && "opacity-60")}>
                          <p
                            className={cn(
                              "text-sm font-bold",
                              isCurrent ? "text-[var(--portal-dark)]" : "text-[#1F2937]"
                            )}
                          >
                            {t(step.labelKey)}
                          </p>
                          <p className="mt-0.5 text-xs text-[#6B7280]">{t(step.subKey)}</p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </PortalShell>
  );
}
