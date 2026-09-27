"use client";

import { CheckCircle2, Clock3, Wallet, Landmark } from "lucide-react";
import { PortalShell, PayoutCountdown } from "@/components/portals";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";
import { MOCK_PAYOUT_SCHEDULE } from "@/lib/mock-data";
import {
  FARMER_PROFILE,
  FARMER_UPI_HISTORY,
  usePortalReady,
} from "@/lib/portal-mocks/farmer";
import { formatInr, cn } from "@/lib/utils";

function EarningsSkeleton() {
  return (
    <div className="space-y-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center justify-between rounded-2xl border border-[#E5E7EB] bg-white p-4">
          <div className="space-y-2">
            <div className="h-4 w-40 animate-pulse rounded bg-[#E5E7EB]" />
            <div className="h-3 w-24 animate-pulse rounded bg-[#E5E7EB]" />
          </div>
          <div className="h-6 w-20 animate-pulse rounded bg-[#E5E7EB]" />
        </div>
      ))}
    </div>
  );
}

export default function FarmerEarningsPage() {
  const { t } = useLanguage();
  const ready = usePortalReady();

  const incoming = MOCK_PAYOUT_SCHEDULE.filter((p) => p.status === "incoming");
  const released = MOCK_PAYOUT_SCHEDULE.filter((p) => p.status === "released");
  const payoutAmount = incoming.reduce((s, p) => s + p.amount, 0);
  const payoutDays = incoming.length ? Math.min(...incoming.map((p) => p.etaDays)) : 0;
  const totalEarned =
    released.reduce((s, p) => s + p.amount, 0) +
    FARMER_UPI_HISTORY.reduce((s, u) => s + u.amount, 0);

  return (
    <PortalShell accent="farmer">
      <div className="mx-auto max-w-2xl space-y-5 pb-4">
        <header className="pt-1">
          <h1 className="font-heading text-2xl font-bold text-[#1F2937]">
            {t("farmer_earn_title")}
          </h1>
          <p className="mt-1 text-sm text-[#4B5563]">{t("farmer_earn_sub")}</p>
        </header>

        <PayoutCountdown
          amount={payoutAmount}
          daysLeft={payoutDays}
          upiLabel={FARMER_PROFILE.upiId}
        />

        {/* Total earned */}
        <div className="flex items-center justify-between rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
          <span className="flex items-center gap-2 text-sm font-semibold text-[#4B5563]">
            <Wallet className="h-5 w-5 text-[var(--portal)]" />
            {t("farmer_earn_total")}
          </span>
          <span className="font-heading text-2xl font-bold text-[var(--portal-dark)]">
            {formatInr(totalEarned)}
          </span>
        </div>

        {/* Payout schedule */}
        <section className="space-y-3">
          <h2 className="font-heading text-lg font-bold text-[#1F2937]">
            {t("farmer_earn_schedule")}
          </h2>
          {!ready ? (
            <EarningsSkeleton />
          ) : MOCK_PAYOUT_SCHEDULE.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-sm text-[#4B5563]">
                {t("farmer_earn_empty")}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2.5">
              {MOCK_PAYOUT_SCHEDULE.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className={cn(
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
                        p.status === "released"
                          ? "bg-[#E8F5E9] text-[#2E7D32]"
                          : "bg-[#FFF3E0] text-[#F57C00]"
                      )}
                    >
                      {p.status === "released" ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <Clock3 className="h-5 w-5" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-heading text-sm font-bold text-[#1F2937]">
                        {p.label}
                      </p>
                      <p className="mt-0.5 text-xs text-[#6B7280]">
                        {p.etaDays <= 0
                          ? t("farmer_earn_today")
                          : t("farmer_earn_in_days").replace("{days}", String(p.etaDays))}
                        {" · "}
                        {p.status === "released" ? t("farmer_earn_released") : t("farmer_earn_incoming")}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 font-heading text-base font-bold text-[#1F2937]">
                    {formatInr(p.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* UPI history */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-bold text-[#1F2937]">
              {t("farmer_earn_upi_history")}
            </h2>
            <Badge variant="outline" className="gap-1 text-[11px]">
              <Landmark className="h-3 w-3" />
              {t("farmer_earn_upi_id")}: {FARMER_PROFILE.upiId}
            </Badge>
          </div>
          <Card className="overflow-hidden shadow-sm">
            <CardContent className="divide-y divide-[#F3F4F6] p-0">
              {FARMER_UPI_HISTORY.map((u) => (
                <div key={u.id} className="flex items-center justify-between gap-3 p-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-[#2E7D32]" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#1F2937]">{u.label}</p>
                      <p className="text-xs text-[#6B7280]">{u.date}</p>
                    </div>
                  </div>
                  <span className="shrink-0 font-heading text-sm font-bold text-[#2E7D32]">
                    +{formatInr(u.amount)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>
    </PortalShell>
  );
}
