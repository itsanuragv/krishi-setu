"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BellPlus, BellRing, ShoppingBasket, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";
import {
  PortalShell,
  PortalHero,
  RadiusSelector,
} from "@/components/portals";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CONSUMER_PRODUCTS,
  WEEKLY_BASKET_FARMERS,
  HARVEST_ALERTS,
} from "@/lib/portal-mocks/consumer";
import { ConsumerProductCard } from "../_components/product-card";

export default function ConsumerDashboardPage() {
  const { t } = useLanguage();
  const [radius, setRadius] = useState(25);
  const [subscribed, setSubscribed] = useState<Set<string>>(new Set());

  const filtered = useMemo(
    () => CONSUMER_PRODUCTS.filter((p) => p.distanceKm <= radius),
    [radius]
  );

  const stats = useMemo(() => {
    const farmers = new Set(CONSUMER_PRODUCTS.map((p) => p.farmerName)).size;
    const avgSaving =
      CONSUMER_PRODUCTS.reduce((s, p) => s + (p.retailPricePerKg - p.pricePerKg), 0) /
      CONSUMER_PRODUCTS.length;
    return [
      { label: t("consumer_stat_listings"), value: String(CONSUMER_PRODUCTS.length) },
      { label: t("consumer_stat_farmers"), value: String(farmers) },
      { label: t("consumer_stat_saving"), value: `₹${avgSaving.toFixed(1)}` },
    ];
  }, [t]);

  function toggleSubscribe(farmerId: string) {
    setSubscribed((prev) => {
      const next = new Set(prev);
      if (next.has(farmerId)) {
        next.delete(farmerId);
        toast(t("consumer_toast_unsubscribed"));
      } else {
        next.add(farmerId);
        toast.success(t("consumer_toast_subscribed"));
      }
      return next;
    });
  }

  return (
    <PortalShell accent="consumer">
      <div className="space-y-8 pb-6">
        <PortalHero
          eyebrow={t("consumer_dash_eyebrow")}
          title={t("consumer_dash_title")}
          subtitle={t("consumer_dash_sub")}
          stats={stats}
        />

        {/* Hero radius filter — the organising principle of this portal */}
        <RadiusSelector value={radius} onChange={setRadius} />

        {/* Fresh near you */}
        <section aria-label={t("consumer_dash_fresh_title")}>
          <div className="mb-4 flex items-end justify-between">
            <h2 className="font-heading text-xl font-bold text-[#1F2937]">
              {t("consumer_dash_fresh_title")}
            </h2>
            <Link
              href="/consumer/search"
              className="inline-flex min-h-[44px] items-center gap-1 text-sm font-semibold text-[var(--portal-dark)]"
            >
              {t("consumer_search_title")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {filtered.length === 0 ? (
            <Card className="rounded-2xl border-dashed border-[#D1D5DB] bg-white/60">
              <CardContent className="flex flex-col items-center gap-2 px-6 py-10 text-center">
                <ShoppingBasket className="h-10 w-10 text-[#9CA3AF]" />
                <p className="text-sm font-medium text-[#4B5563]">
                  {t("consumer_dash_no_results")}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <ConsumerProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>

        {/* Weekly Basket */}
        <section aria-label={t("consumer_dash_basket_title")}>
          <div className="mb-1 flex items-center gap-2">
            <ShoppingBasket className="h-5 w-5 text-[var(--portal)]" />
            <h2 className="font-heading text-xl font-bold text-[#1F2937]">
              {t("consumer_dash_basket_title")}
            </h2>
          </div>
          <p className="mb-4 text-sm text-[#4B5563]">{t("consumer_dash_basket_sub")}</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {WEEKLY_BASKET_FARMERS.map((f) => {
              const active = subscribed.has(f.farmerId);
              return (
                <Card key={f.farmerId} className="rounded-2xl border-[#E5E7EB]">
                  <CardContent className="flex items-center gap-4 p-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={f.photo}
                      alt={f.name}
                      loading="lazy"
                      className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-[var(--portal-light)]"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[#1F2937]">{f.name}</p>
                      <p className="mt-0.5 truncate text-xs text-[#6B7280]">
                        {f.village} · {f.distanceKm} km · ★ {f.rating.toFixed(1)}
                      </p>
                      <p className="truncate text-xs text-[#6B7280]">{f.crops.join(" · ")}</p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => toggleSubscribe(f.farmerId)}
                      aria-pressed={active}
                      className={cn(
                        "h-11 shrink-0 gap-1.5 rounded-xl px-3 text-xs font-bold",
                        active
                          ? "bg-[var(--portal-light)] text-[var(--portal-dark)] hover:bg-[var(--portal-light)]"
                          : "bg-[var(--portal)] text-white hover:bg-[var(--portal-dark)]"
                      )}
                    >
                      {active ? (
                        <BellRing className="h-4 w-4" />
                      ) : (
                        <BellPlus className="h-4 w-4" />
                      )}
                      {active ? t("consumer_subscribed") : t("consumer_subscribe")}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Harvest alerts */}
        <section aria-label={t("consumer_dash_alerts_title")}>
          <h2 className="mb-4 font-heading text-xl font-bold text-[#1F2937]">
            {t("consumer_dash_alerts_title")}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {HARVEST_ALERTS.map((a) => (
              <Card
                key={a.id}
                className="rounded-2xl border-[var(--portal)]/30 bg-[var(--portal-soft)]"
              >
                <CardContent className="flex items-center gap-3 p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={a.photo}
                    alt={a.farmerName}
                    loading="lazy"
                    className="h-12 w-12 shrink-0 rounded-full object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#1F2937]">{a.crop}</p>
                    <p className="mt-0.5 text-xs text-[#6B7280]">
                      {a.farmerName} · {a.expectedDate} · {a.qtyAvailable}
                    </p>
                  </div>
                  <Link
                    href={`/consumer/product/${a.productId}`}
                    className="inline-flex h-11 shrink-0 items-center rounded-xl bg-white px-3 text-xs font-bold text-[var(--portal-dark)] ring-1 ring-[var(--portal)]/40 transition-colors hover:bg-[var(--portal-light)]"
                  >
                    {t("consumer_dash_alert_cta")}
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </PortalShell>
  );
}
