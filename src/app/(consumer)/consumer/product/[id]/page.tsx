"use client";

import { use } from "react";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  Camera,
  MapPin,
  Minus,
  Plus,
  ShieldCheck,
  Star,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { PortalShell, PriceJourney } from "@/components/portals";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatInr } from "@/lib/utils";
import { getConsumerProduct } from "@/lib/portal-mocks/consumer";

export default function ConsumerProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t } = useLanguage();
  const [qty, setQty] = useState(5);

  const product = getConsumerProduct(id);

  if (!product) {
    return (
      <PortalShell accent="consumer">
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-center">
          <p className="text-lg font-semibold text-[#1F2937]">{t("consumer_pd_not_found")}</p>
          <Link
            href="/consumer/dashboard"
            className="inline-flex h-12 items-center rounded-xl bg-[var(--portal)] px-5 text-sm font-bold text-white"
          >
            {t("consumer_cart_browse")}
          </Link>
        </div>
      </PortalShell>
    );
  }

  function step(delta: number) {
    setQty((q) => Math.min(100, Math.max(1, q + delta)));
  }

  return (
    <PortalShell accent="consumer">
      <div className="space-y-6 pb-28 lg:pb-6">
        <Link
          href="/consumer/dashboard"
          className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-[var(--portal-dark)]"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("consumer_dash_fresh_title")}
        </Link>

        {/* Big photo */}
        <div className="relative overflow-hidden rounded-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-64 w-full object-cover md:h-80"
          />
          <span className="absolute left-4 top-4">
            <Badge className="bg-white/95 text-[#1F2937] font-bold shadow-sm">
              {t("consumer_search_grade")} {product.grade}
            </Badge>
          </span>
        </div>

        {/* Title + price */}
        <div className="space-y-1.5">
          <h1 className="font-heading text-2xl font-bold text-[#1F2937] md:text-3xl">
            {product.name}
          </h1>
          <p className="text-sm text-[#6B7280]">{product.hindiName}</p>
          <p className="pt-1 text-2xl font-bold text-[#1F2937]">
            {formatInr(product.pricePerKg)}
            <span className="text-sm font-normal text-[#6B7280]">
              {t("consumer_pd_per_kg")}
            </span>
          </p>
        </div>

        {/* Full price journey */}
        <PriceJourney
          farmerPrice={product.pricePerKg}
          retailPrice={product.retailPricePerKg}
          unit="kg"
        />

        {/* Escrow explainer */}
        <div className="flex gap-3 rounded-2xl border border-[var(--portal)]/40 bg-[var(--portal-soft)] p-4">
          <ShieldCheck className="h-8 w-8 shrink-0 text-[var(--portal)]" />
          <div>
            <p className="font-heading text-sm font-bold text-[var(--portal-dark)]">
              {t("consumer_pd_escrow_title")}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-[#4B5563]">
              {t("consumer_pd_escrow_body")}
            </p>
          </div>
        </div>

        {/* Farmer story card */}
        <Card className="rounded-2xl border-[#E5E7EB]">
          <CardContent className="space-y-3 p-5">
            <p className="font-heading text-base font-bold text-[#1F2937]">
              {t("consumer_pd_farmer_story")}
            </p>
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.farmerPhoto}
                alt={product.farmerName}
                className="h-16 w-16 rounded-full object-cover ring-2 ring-[var(--portal-light)]"
              />
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-sm font-semibold text-[#1F2937]">
                  <span className="truncate">{product.farmerName}</span>
                  <BadgeCheck className="h-4 w-4 shrink-0 text-[#2E7D32]" />
                </p>
                <p className="mt-1 flex items-center gap-1 text-xs text-[#6B7280]">
                  <MapPin className="h-3.5 w-3.5" />
                  {product.village}, {product.district} · {product.distanceKm} km
                </p>
                <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-[#4B5563]">
                  <Star className="h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                  {product.rating.toFixed(1)}
                  <span className="font-normal text-[#9CA3AF]">· PM-KISAN verified</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grade & quality facts */}
        <Card className="rounded-2xl border-[#E5E7EB]">
          <CardContent className="space-y-3 p-5">
            <p className="font-heading text-base font-bold text-[#1F2937]">
              {t("consumer_pd_quality")}
            </p>
            <dl className="space-y-2.5 text-sm">
              <div className="flex items-start justify-between gap-4">
                <dt className="text-[#6B7280]">{t("consumer_search_grade")}</dt>
                <dd className="text-right font-semibold text-[#1F2937]">{product.gradeSpec}</dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-[#6B7280]">OpenCV</dt>
                <dd className="flex items-center gap-1.5 text-right font-semibold text-[#1B5E20]">
                  <Camera className="h-4 w-4" />
                  {product.openCvStatus}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-[#6B7280]">{t("consumer_qty_available")}</dt>
                <dd className="text-right font-semibold text-[#1F2937]">
                  {product.lotQuintal} quintal
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-[#6B7280]">{t("consumer_pd_escrow_title")}</dt>
                <dd className="text-right font-semibold text-[var(--portal-dark)]">
                  {t("consumer_cart_escrow_locked")}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Sticky CTA bar */}
        <div className="fixed inset-x-0 bottom-14 z-20 border-t border-[#E5E7EB] bg-white/95 p-4 backdrop-blur lg:static lg:border-0 lg:bg-transparent lg:p-0">
          <div className="mx-auto flex max-w-6xl items-center gap-3">
            <div className="flex items-center gap-1 rounded-xl border border-[#E5E7EB] bg-white p-1">
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Decrease quantity"
                className="flex h-11 w-11 items-center justify-center rounded-lg text-[#1F2937] transition-colors hover:bg-[#F3F4F6] active:scale-95"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-14 text-center text-sm font-bold text-[#1F2937]">
                {qty} kg
              </span>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Increase quantity"
                className="flex h-11 w-11 items-center justify-center rounded-lg text-[#1F2937] transition-colors hover:bg-[#F3F4F6] active:scale-95"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="hidden sm:block">
              <p className="text-xs text-[#6B7280]">{t("consumer_cart_total")}</p>
              <p className="text-lg font-bold text-[#1F2937]">
                {formatInr(product.pricePerKg * qty)}
              </p>
            </div>
            <Button
              asChild
              className="h-14 flex-1 rounded-xl bg-[var(--portal)] text-base font-bold text-white shadow-sm transition-colors hover:bg-[var(--portal-dark)]"
            >
              <Link href={`/consumer/cart-order?productId=${product.id}&qty=${qty}`}>
                <ShieldCheck className="mr-2 h-5 w-5" />
                {t("consumer_pd_buy")}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
