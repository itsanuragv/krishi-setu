"use client";

import { MapPin, Sprout, BadgeCheck, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

interface TrustChipsProps {
  photo?: string;
  name: string;
  distanceKm: number;
  harvestDate: string;
  grade: string;
  rating?: number;
  verified?: boolean;
  className?: string;
}

/** Trust chips: farmer photo, distance, harvest date, grade ✓. */
export function TrustChips({
  photo,
  name,
  distanceKm,
  harvestDate,
  grade,
  rating,
  verified = true,
  className,
}: TrustChipsProps) {
  const { t } = useLanguage();
  return (
    <div className={cn("rounded-xl border border-[#E5E7EB] bg-white p-3", className)}>
      <div className="flex items-center gap-2.5">
        {photo ? (
          <img src={photo} alt={name} className="h-10 w-10 rounded-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--portal-light)] font-heading font-bold text-[var(--portal-dark)]">
            {name.charAt(0)}
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-1 text-sm font-semibold text-[#1F2937] truncate">
            <span className="truncate">{name}</span>
            {verified && <BadgeCheck className="h-4 w-4 shrink-0 text-[#2E7D32]" />}
          </div>
          {typeof rating === "number" && (
            <div className="flex items-center gap-1 text-xs text-[#6B7280]">
              <Star className="h-3 w-3 fill-[#F59E0B] text-[#F59E0B]" />
              {rating.toFixed(1)}
            </div>
          )}
        </div>
      </div>
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        <span className="inline-flex items-center gap-1 rounded-full bg-[#F3F4F6] px-2.5 py-1 text-xs font-medium text-[#4B5563]">
          <MapPin className="h-3 w-3" /> {distanceKm} km {t("kit_away")}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-[#F3F4F6] px-2.5 py-1 text-xs font-medium text-[#4B5563]">
          <Sprout className="h-3 w-3" /> {t("kit_harvested")}: {harvestDate}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--portal-light)] px-2.5 py-1 text-xs font-bold text-[var(--portal-dark)]">
          {t("kit_grade")} {grade} ✓
        </span>
      </div>
    </div>
  );
}
