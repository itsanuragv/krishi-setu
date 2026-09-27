"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { PriceJourney, TrustChips } from "@/components/portals";
import { Card, CardContent } from "@/components/ui/card";
import { formatInr } from "@/lib/utils";
import type { ConsumerProduct } from "@/lib/portal-mocks/consumer";

/** Consumer produce card: photo, trust chips, compact price journey. */
export function ConsumerProductCard({ product }: { product: ConsumerProduct }) {
  const { t } = useLanguage();
  return (
    <Link
      href={`/consumer/product/${product.id}`}
      className="group block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--portal)]"
    >
      <Card className="h-full overflow-hidden rounded-2xl border-[#E5E7EB] transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md group-hover:border-[var(--portal)]/50">
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            className="h-44 w-full object-cover"
          />
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-[#1F2937] shadow-sm">
            <MapPin className="h-3 w-3 text-[var(--portal)]" />
            {product.distanceKm} km
          </span>
        </div>
        <CardContent className="space-y-3 p-4">
          <div>
            <p className="font-heading text-base font-semibold leading-snug text-[#1F2937]">
              {product.name}
            </p>
            <p className="mt-0.5 text-xs text-[#6B7280]">
              {product.district} · {formatInr(product.pricePerKg)}
              <span className="text-[#9CA3AF]">{t("consumer_pd_per_kg")}</span>
            </p>
          </div>
          <TrustChips
            photo={product.farmerPhoto}
            name={product.farmerName}
            distanceKm={product.distanceKm}
            harvestDate={product.harvestDate}
            grade={product.grade}
            rating={product.rating}
            verified={product.verified}
          />
          <PriceJourney
            compact
            farmerPrice={product.pricePerKg}
            retailPrice={product.retailPricePerKg}
            unit="kg"
          />
        </CardContent>
      </Card>
    </Link>
  );
}
