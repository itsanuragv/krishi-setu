"use client";

import { use, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, Share2, MapPin, CalendarDays, Handshake, Pause, Play } from "lucide-react";
import {
  PortalShell,
  TrustChips,
  MandiCompareCard,
} from "@/components/portals";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { FarmerMatchBreakdown } from "../../../_components/farmer-match-breakdown";
import { useLanguage } from "@/context/LanguageContext";
import { MOCK_PRODUCE_LISTINGS, FARMER_PHOTOS } from "@/lib/mock-data";
import {
  findFarmerListing,
  matchesForListing,
  usePortalReady,
} from "@/lib/portal-mocks/farmer";
import { formatInr, cn } from "@/lib/utils";

function gradeOf(gradeSpec?: string): string {
  const m = gradeSpec?.match(/Grade\s*([ABC])/i);
  return m ? m[1].toUpperCase() : "A";
}

function DetailSkeleton() {
  return (
    <div className="space-y-4">
      <div className="aspect-video animate-pulse rounded-2xl bg-[#E5E7EB]" />
      <div className="h-24 animate-pulse rounded-2xl bg-[#E5E7EB]" />
      <div className="h-32 animate-pulse rounded-2xl bg-[#E5E7EB]" />
    </div>
  );
}

export default function FarmerListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { t } = useLanguage();
  const ready = usePortalReady();
  const [paused, setPaused] = useState(false);

  const listing = findFarmerListing(MOCK_PRODUCE_LISTINGS, id);
  const matches = matchesForListing(id);

  function share() {
    try {
      navigator.clipboard.writeText(window.location.href);
    } catch {
      /* clipboard unavailable — still confirm */
    }
    toast.success(t("farmer_list_shared"));
  }

  return (
    <PortalShell accent="farmer">
      <div className="mx-auto max-w-3xl space-y-5 pb-4">
        <div className="flex items-center justify-between pt-1">
          <Link
            href="/farmer/dashboard"
            className="inline-flex min-h-[48px] items-center gap-1.5 rounded-xl px-2 text-sm font-semibold text-[#4B5563] hover:text-[#1F2937]"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("farmer_list_back")}
          </Link>
          <Button
            variant="outline"
            onClick={share}
            className="h-12 gap-1.5 rounded-xl px-4 font-heading text-sm font-bold"
          >
            <Share2 className="h-4 w-4" />
            {t("farmer_list_share")}
          </Button>
        </div>

        {!ready ? (
          <DetailSkeleton />
        ) : !listing ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
              <p className="text-sm text-[#4B5563]">{t("farmer_list_not_found")}</p>
              <Link href="/farmer/dashboard">
                <Button className="h-12 rounded-xl bg-[var(--portal)] font-heading font-bold text-white hover:bg-[var(--portal-dark)]">
                  {t("farmer_list_back_dash")}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Photo */}
            <div className="relative overflow-hidden rounded-2xl border border-[#E5E7EB] bg-[#F3F4F6] shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={listing.imageUrl}
                alt={listing.name}
                className="aspect-video w-full object-cover"
              />
              <div className="absolute left-3 top-3">
                {paused ? (
                  <span className="inline-flex rounded-full bg-[#F3F4F6]/95 px-2.5 py-0.5 text-xs font-bold text-[#4B5563]">
                    {t("farmer_list_paused_badge")}
                  </span>
                ) : (
                  <StatusBadge status="listed" />
                )}
              </div>
              <div className="absolute right-3 top-3">
                <Badge className="bg-[var(--portal)] font-bold text-white hover:bg-[var(--portal)]">
                  {t("kit_grade")} {gradeOf(listing.gradeSpec)}
                </Badge>
              </div>
            </div>

            {/* Title + key facts */}
            <Card className="shadow-sm">
              <CardContent className="space-y-4 p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h1 className="font-heading text-xl font-bold leading-snug text-[#1F2937] sm:text-2xl">
                      {listing.name}
                    </h1>
                    {listing.hindiName !== listing.name && (
                      <p className="mt-0.5 text-sm text-[#4B5563]">{listing.hindiName}</p>
                    )}
                  </div>
                  <p className="shrink-0 text-right font-heading text-2xl font-bold text-[var(--portal-dark)]">
                    {formatInr(listing.farmGatePrice)}
                    <span className="block text-xs font-medium text-[#6B7280]">
                      /{listing.unit === "kg" ? t("farmer_unit_kg") : t("farmer_unit_quintal")}
                    </span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="rounded-xl bg-[#F9FAFB] p-3">
                    <p className="text-[11px] font-medium text-[#6B7280]">{t("farmer_list_stock")}</p>
                    <p className="font-heading text-base font-bold text-[#1F2937]">
                      {listing.quantityAvailable.toLocaleString("en-IN")} {listing.unit}
                    </p>
                  </div>
                  <div className="rounded-xl bg-[var(--portal-soft)] p-3">
                    <p className="text-[11px] font-medium text-[var(--portal-dark)]">
                      {t("farmer_list_available")}
                    </p>
                    <p className="font-heading text-base font-bold text-[var(--portal-dark)]">
                      {listing.quantityAvailable.toLocaleString("en-IN")} {listing.unit}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-xl bg-[#F9FAFB] p-3 text-xs text-[#4B5563]">
                    <MapPin className="h-4 w-4 shrink-0 text-[var(--portal)]" />
                    <span className="truncate">
                      {listing.village}, {listing.district}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-xl bg-[#F9FAFB] p-3 text-xs text-[#4B5563]">
                    <CalendarDays className="h-4 w-4 shrink-0 text-[var(--portal)]" />
                    <span>
                      {t("farmer_list_harvest")}: {listing.harvestDate ?? "—"}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => toast.success(t("farmer_list_price_updated"))}
                    className="h-12 flex-1 rounded-xl font-heading text-sm font-bold"
                  >
                    {t("farmer_list_update_price")}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setPaused((p) => !p);
                      toast.success(t(paused ? "farmer_list_resumed" : "farmer_list_paused"));
                    }}
                    className={cn(
                      "h-12 flex-1 gap-1.5 rounded-xl font-heading text-sm font-bold",
                      paused ? "border-[var(--portal)] text-[var(--portal-dark)]" : "text-[#B91C1C]"
                    )}
                  >
                    {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                    {paused ? t("farmer_list_resume") : t("farmer_list_pause")}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Trust chips */}
            <TrustChips
              photo={listing.farmerPhoto ?? FARMER_PHOTOS[0]}
              name={listing.farmerName}
              distanceKm={listing.distanceKm}
              harvestDate={listing.harvestDate ?? "—"}
              grade={gradeOf(listing.gradeSpec)}
              rating={4.8}
              verified
            />

            {/* Mandi comparison */}
            <MandiCompareCard
              crop={listing.name}
              mandiPrice={listing.mandiBenchmarkPrice}
              yourPrice={listing.farmGatePrice}
              unit={listing.unit}
            />

            {/* Matches */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-[#1F2937]">
                  <Handshake className="h-5 w-5 text-[var(--portal)]" />
                  {t("farmer_list_matches_title")}
                </h2>
                <Badge variant="outline">{matches.length}</Badge>
              </div>
              {matches.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center text-sm text-[#4B5563]">
                    {t("farmer_list_no_matches")}
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {matches.map((m) => (
                    <Card key={m.id} className="shadow-sm">
                      <CardContent className="space-y-3 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate font-heading text-sm font-bold text-[#1F2937]">
                              {m.buyerName}
                            </p>
                            <p className="mt-0.5 text-xs text-[#4B5563]">
                              {formatInr(m.offeredPricePerKg)}/{t("farmer_unit_kg")} × {m.requestedKg.toLocaleString("en-IN")} {t("farmer_unit_kg")}
                              {" · "}
                              <span className="font-bold text-[#1F2937]">
                                {formatInr(m.offeredPricePerKg * m.requestedKg)}
                              </span>
                            </p>
                          </div>
                          <Badge className="shrink-0 bg-[var(--portal)] font-bold text-white hover:bg-[var(--portal)]">
                            {m.score}/100
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs font-bold text-[#6B7280]">
                            {t("farmer_bd_breakup")}
                          </p>
                          <FarmerMatchBreakdown breakdown={m.breakdown} />
                        </div>
                        <div className="flex gap-2">
                          <Link href="/farmer/orders" className="flex-1">
                            <Button className="h-12 w-full rounded-xl bg-[var(--portal)] font-heading text-sm font-bold text-white hover:bg-[var(--portal-dark)]">
                              {t("farmer_match_accept")}
                            </Button>
                          </Link>
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
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </PortalShell>
  );
}
