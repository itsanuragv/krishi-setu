"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Users, Plus, Sprout, ChevronRight } from "lucide-react";
import {
  PortalShell,
  VoiceFab,
  MandiCompareCard,
  PayoutCountdown,
} from "@/components/portals";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/shared/status-badge";
import { useLanguage } from "@/context/LanguageContext";
import {
  MOCK_PRODUCE_LISTINGS,
  MOCK_PAYOUT_SCHEDULE,
} from "@/lib/mock-data";
import {
  FARMER_PROFILE,
  FARMER_MATCHES,
  addFarmerListing,
  buildDraftListing,
  getFarmerListings,
  matchCountForListing,
  parseVoiceDraft,
  usePortalReady,
} from "@/lib/portal-mocks/farmer";
import { formatInr, cn } from "@/lib/utils";

interface Draft {
  crop: string;
  quantity: string;
  unit: string;
  price: string;
}

function ListingsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {[0, 1].map((i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white">
          <div className="aspect-video animate-pulse bg-[#E5E7EB]" />
          <div className="space-y-2 p-4">
            <div className="h-4 w-2/3 animate-pulse rounded bg-[#E5E7EB]" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-[#E5E7EB]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function FarmerDashboardPage() {
  const { t } = useLanguage();
  const ready = usePortalReady();
  const [draft, setDraft] = useState<Draft | null>(null);
  // Bumped after each publish so the module draft store is re-read.
  const [, setVersion] = useState(0);

  const listings = getFarmerListings(MOCK_PRODUCE_LISTINGS);
  const topCrops = MOCK_PRODUCE_LISTINGS.slice(0, 3);

  const incoming = MOCK_PAYOUT_SCHEDULE.filter((p) => p.status === "incoming");
  const payoutAmount = incoming.reduce((s, p) => s + p.amount, 0);
  const payoutDays = incoming.length ? Math.min(...incoming.map((p) => p.etaDays)) : 0;

  function handleVoice(transcript: string) {
    if (!transcript.trim()) {
      toast.error(t("farmer_dash_voice_missed"));
      return;
    }
    const parsed = parseVoiceDraft(transcript);
    setDraft({
      crop: parsed.crop,
      quantity: parsed.quantity ? String(parsed.quantity) : "",
      unit: parsed.unit,
      price: parsed.price ? String(parsed.price) : "",
    });
  }

  function publishDraft() {
    if (!draft) return;
    addFarmerListing(
      buildDraftListing({
        crop: draft.crop,
        quantity: Number(draft.quantity) || 0,
        unit: draft.unit,
        price: Number(draft.price) || 0,
      })
    );
    setDraft(null);
    setVersion((v) => v + 1);
    toast.success(t("farmer_dash_published"));
  }

  return (
    <PortalShell accent="farmer">
      <div className="mx-auto max-w-3xl space-y-6 pb-4">
        {/* Greeting */}
        <header className="pt-1">
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#1F2937]">
            {t("farmer_dash_greeting")}
          </h1>
          <p className="mt-1 text-sm text-[#4B5563]">{t("farmer_dash_sub")}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href="/farmer/listings/prod-1">
              <Badge className="cursor-pointer gap-1.5 bg-[var(--portal)] px-3 py-1.5 text-white hover:bg-[var(--portal-dark)]">
                {t("farmer_dash_stat_listings")}: {listings.length}
              </Badge>
            </Link>
            <Link href="/farmer/matches">
              <Badge className="cursor-pointer gap-1.5 bg-[var(--portal-light)] px-3 py-1.5 text-[var(--portal-dark)] hover:bg-[var(--portal-soft)]">
                <Users className="h-3.5 w-3.5" />
                {t("farmer_dash_stat_matches")}: {FARMER_MATCHES.length}
              </Badge>
            </Link>
            <Link href="/farmer/ratings">
              <Badge className="cursor-pointer gap-1.5 border border-[#E5E7EB] bg-white px-3 py-1.5 text-[#1F2937] hover:bg-[#F3F4F6]">
                {t("farmer_dash_stat_trust")}: {FARMER_PROFILE.trustScore}/100
              </Badge>
            </Link>
          </div>
        </header>

        {/* Voice-first sell */}
        <section className="flex flex-col items-center rounded-2xl border border-[#E5E7EB] bg-white px-4 py-6 shadow-sm">
          <VoiceFab onResult={handleVoice} hint={t("farmer_dash_voice_hint")} />
        </section>

        {/* Editable voice draft */}
        {draft && (
          <Card className="border-2 border-[var(--portal)] shadow-sm">
            <CardContent className="space-y-4 p-4 sm:p-5">
              <p className="font-heading text-base font-bold text-[#1F2937]">
                {t("farmer_dash_draft_title")}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 space-y-1.5">
                  <Label className="text-xs font-bold text-[#1F2937]">{t("farmer_dash_f_crop")}</Label>
                  <Input
                    value={draft.crop}
                    onChange={(e) => setDraft({ ...draft, crop: e.target.value })}
                    placeholder="Sharbati Wheat"
                    className="h-12 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#1F2937]">{t("farmer_dash_f_qty")}</Label>
                  <Input
                    type="number"
                    inputMode="numeric"
                    value={draft.quantity}
                    onChange={(e) => setDraft({ ...draft, quantity: e.target.value })}
                    placeholder="100"
                    className="h-12 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#1F2937]">{t("farmer_dash_f_unit")}</Label>
                  <Input
                    value={draft.unit}
                    onChange={(e) => setDraft({ ...draft, unit: e.target.value })}
                    placeholder="quintal"
                    className="h-12 rounded-xl"
                  />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label className="text-xs font-bold text-[#1F2937]">
                    {t("farmer_dash_f_price")} (₹/
                    {draft.unit === "kg" ? t("farmer_unit_kg") : t("farmer_unit_quintal")})
                  </Label>
                  <Input
                    type="number"
                    inputMode="numeric"
                    value={draft.price}
                    onChange={(e) => setDraft({ ...draft, price: e.target.value })}
                    placeholder="3400"
                    className="h-12 rounded-xl"
                  />
                </div>
              </div>
              <Button
                onClick={publishDraft}
                className="h-12 w-full rounded-xl bg-[var(--portal)] font-heading text-base font-bold text-white hover:bg-[var(--portal-dark)] active:scale-[0.99]"
              >
                {t("farmer_dash_publish")}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Payout countdown */}
        <PayoutCountdown
          amount={payoutAmount}
          daysLeft={payoutDays}
          upiLabel={FARMER_PROFILE.upiId}
        />

        {/* Mandi comparison */}
        <section className="space-y-3">
          <div>
            <h2 className="font-heading text-lg font-bold text-[#1F2937]">
              {t("farmer_dash_mandi_heading")}
            </h2>
            <p className="text-xs text-[#4B5563]">{t("farmer_dash_mandi_sub")}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {topCrops.map((c) => (
              <MandiCompareCard
                key={c.id}
                crop={c.name}
                mandiPrice={c.mandiBenchmarkPrice}
                yourPrice={c.farmGatePrice}
                unit={c.unit}
              />
            ))}
          </div>
        </section>

        {/* Listings */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-bold text-[#1F2937]">
              {t("farmer_dash_listings_heading")}
            </h2>
            <Link
              href="/farmer/sell"
              className="inline-flex min-h-[48px] items-center gap-1 rounded-xl bg-[var(--portal)] px-4 font-heading text-sm font-bold text-white hover:bg-[var(--portal-dark)] active:scale-95"
            >
              <Plus className="h-4 w-4" />
              {t("farmer_dash_sell_cta")}
            </Link>
          </div>

          {!ready ? (
            <ListingsSkeleton />
          ) : listings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--portal-light)]">
                  <Sprout className="h-7 w-7 text-[var(--portal-dark)]" />
                </span>
                <p className="text-sm text-[#4B5563]">{t("farmer_dash_listings_empty")}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {listings.map((l) => {
                const matched = matchCountForListing(l.id);
                return (
                  <Link
                    key={l.id}
                    href={`/farmer/listings/${l.id}`}
                    className="group overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-[#F3F4F6]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={l.imageUrl}
                        alt={l.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform group-hover:scale-[1.03]"
                      />
                      {matched > 0 && (
                        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-[var(--portal)] px-2.5 py-1 text-xs font-bold text-white shadow">
                          <Users className="h-3 w-3" />
                          {matched} {t("farmer_dash_matched_badge")}
                        </span>
                      )}
                      <span className="absolute right-3 top-3">
                        <StatusBadge status="listed" />
                      </span>
                    </div>
                    <div className="space-y-1.5 p-4">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-heading text-base font-bold leading-snug text-[#1F2937]">
                          {l.name}
                        </p>
                        <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-[#9CA3AF]" />
                      </div>
                      <p className="text-sm text-[#4B5563]">
                        {l.quantityAvailable.toLocaleString("en-IN")}{" "}
                        {l.unit === "kg" ? t("farmer_unit_kg") : t("farmer_unit_quintal")} ·{" "}
                        <span className={cn("font-bold text-[#1F2937]")}>
                          {formatInr(l.farmGatePrice)}
                          <span className="text-xs font-medium text-[#6B7280]">
                            /{l.unit === "kg" ? t("farmer_unit_kg") : t("farmer_unit_quintal")}
                          </span>
                        </span>
                      </p>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full bg-[var(--portal-light)] px-3 py-1 text-sm font-bold text-[var(--portal-dark)]"
                        )}
                      >
                        {t("farmer_dash_view")}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </PortalShell>
  );
}
