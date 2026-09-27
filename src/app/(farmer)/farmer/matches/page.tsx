"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { MapPin, SearchX, Handshake, ChevronDown } from "lucide-react";
import { PortalShell } from "@/components/portals";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FarmerMatchBreakdown } from "../../_components/farmer-match-breakdown";
import { useLanguage } from "@/context/LanguageContext";
import { FARMER_MATCHES, usePortalReady } from "@/lib/portal-mocks/farmer";
import { formatInr, formatKg, cn } from "@/lib/utils";

function MatchesSkeleton() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {[0, 1].map((i) => (
        <div key={i} className="space-y-3 rounded-2xl border border-[#E5E7EB] bg-white p-4">
          <div className="h-5 w-2/3 animate-pulse rounded bg-[#E5E7EB]" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-[#E5E7EB]" />
          <div className="h-2 w-full animate-pulse rounded-full bg-[#E5E7EB]" />
          <div className="h-2 w-full animate-pulse rounded-full bg-[#E5E7EB]" />
        </div>
      ))}
    </div>
  );
}

export default function FarmerMatchesPage() {
  const { t } = useLanguage();
  const ready = usePortalReady();
  const [accepted, setAccepted] = useState<Set<string>>(new Set());

  function accept(id: string) {
    setAccepted((s) => new Set(s).add(id));
    toast.success(t("farmer_match_accepted_toast"));
  }

  return (
    <PortalShell accent="farmer">
      <div className="mx-auto max-w-4xl space-y-5 pb-4">
        <header className="pt-1">
          <h1 className="font-heading text-2xl font-bold text-[#1F2937]">
            {t("farmer_match_title")}
          </h1>
          <p className="mt-1 text-sm text-[#4B5563]">{t("farmer_match_sub")}</p>
        </header>

        {!ready ? (
          <MatchesSkeleton />
        ) : FARMER_MATCHES.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--portal-light)]">
                <SearchX className="h-7 w-7 text-[var(--portal-dark)]" />
              </span>
              <p className="text-sm text-[#4B5563]">{t("farmer_match_empty")}</p>
              <Link href="/farmer/sell">
                <Button className="h-12 rounded-xl bg-[var(--portal)] font-heading font-bold text-white hover:bg-[var(--portal-dark)]">
                  {t("farmer_match_empty_cta")}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {FARMER_MATCHES.map((m) => {
              const isAccepted = accepted.has(m.id);
              return (
                <Card key={m.id} className="overflow-hidden shadow-sm">
                  <CardContent className="space-y-4 p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="flex items-center gap-1.5 font-heading text-base font-bold text-[#1F2937]">
                          <Handshake className="h-4 w-4 shrink-0 text-[var(--portal)]" />
                          <span className="truncate">{m.buyerName}</span>
                        </p>
                        <p className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-[#4B5563]">
                          <span className="font-medium text-[#1F2937]">{m.crop}</span>
                          <span className="inline-flex items-center gap-0.5">
                            <MapPin className="h-3 w-3" />
                            {m.distanceKm} {t("farmer_match_away")}
                          </span>
                        </p>
                        <Badge
                          variant="outline"
                          className="mt-1.5 text-[10px]"
                        >
                          {m.buyerType === "bulk_buyer"
                            ? t("farmer_match_type_bulk")
                            : t("farmer_match_type_consumer")}
                        </Badge>
                      </div>
                      <span className="shrink-0 rounded-full bg-[var(--portal)] px-3 py-1.5 font-heading text-sm font-bold text-white">
                        {m.score}/100
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 rounded-xl bg-[#F9FAFB] p-3 text-center">
                      <div>
                        <p className="text-[11px] text-[#6B7280]">{t("farmer_match_wants")}</p>
                        <p className="font-heading text-sm font-bold text-[#1F2937]">
                          {formatKg(m.requestedKg)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] text-[#6B7280]">{t("farmer_match_offered")}</p>
                        <p className="font-heading text-sm font-bold text-[#1F2937]">
                          {formatInr(m.offeredPricePerKg)}/{t("farmer_unit_kg")}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] text-[#6B7280]">{t("farmer_match_total")}</p>
                        <p className="font-heading text-sm font-bold text-[var(--portal-dark)]">
                          {formatInr(m.offeredPricePerKg * m.requestedKg)}
                        </p>
                      </div>
                    </div>

                    <details className="group rounded-xl border border-[#E5E7EB]">
                      <summary className="flex h-12 cursor-pointer list-none items-center justify-between px-4 text-sm font-bold text-[#1F2937] [&::-webkit-details-marker]:hidden">
                        {t("farmer_match_breakdown")}
                        <ChevronDown className="h-5 w-5 text-[#9CA3AF] transition-transform group-open:rotate-180" />
                      </summary>
                      <div className="border-t border-[#F3F4F6] px-4 py-3">
                        <FarmerMatchBreakdown breakdown={m.breakdown} />
                      </div>
                    </details>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => accept(m.id)}
                        disabled={isAccepted}
                        className={cn(
                          "h-12 flex-1 rounded-xl font-heading text-sm font-bold",
                          isAccepted
                            ? "bg-[#E8F5E9] text-[#1B5E20] hover:bg-[#E8F5E9]"
                            : "bg-[var(--portal)] text-white hover:bg-[var(--portal-dark)]"
                        )}
                      >
                        {isAccepted ? t("farmer_match_accepted") : t("farmer_match_accept")}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => toast.info(t("farmer_match_counter_toast"))}
                        className="h-12 rounded-xl px-5 font-heading text-sm font-bold"
                      >
                        {t("farmer_match_counter")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </PortalShell>
  );
}
