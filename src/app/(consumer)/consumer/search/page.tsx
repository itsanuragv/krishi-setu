"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search as SearchIcon, SearchX } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { PortalShell, RadiusSelector } from "@/components/portals";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CONSUMER_PRODUCTS } from "@/lib/portal-mocks/consumer";
import { ConsumerProductCard } from "../_components/product-card";

const CATEGORY_KEYS = [
  { value: "All", labelKey: "consumer_search_all" },
  { value: "Vegetables", labelKey: "consumer_cat_vegetables" },
  { value: "Fruits", labelKey: "consumer_cat_fruits" },
  { value: "Grains", labelKey: "consumer_cat_grains" },
  { value: "Organic", labelKey: "consumer_cat_organic" },
] as const;

const GRADE_OPTIONS = ["", "A", "B", "C"];

function SearchContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [radius, setRadius] = useState(25);
  const [category, setCategory] = useState<string>("All");
  const [grade, setGrade] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CONSUMER_PRODUCTS.filter((p) => {
      if (p.distanceKm > radius) return false;
      if (category !== "All" && p.category !== category) return false;
      if (grade && p.grade !== grade) return false;
      if (q) {
        const hay = `${p.name} ${p.hindiName} ${p.farmerName} ${p.village}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [query, radius, category, grade]);

  return (
    <PortalShell accent="consumer">
      <div className="space-y-6 pb-6">
        {/* Header */}
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#1F2937]">
            {t("consumer_search_title")}
          </h1>
          <p className="mt-1 text-sm text-[#4B5563]">{t("consumer_search_sub")}</p>
        </div>

        {/* Search input */}
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9CA3AF]" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("consumer_search_placeholder")}
            aria-label={t("consumer_search_title")}
            className="h-14 rounded-2xl border-[#E5E7EB] bg-white pl-12 pr-4 text-base shadow-sm placeholder:text-[#9CA3AF] focus-visible:ring-[var(--portal)]"
          />
        </div>

        {/* Radius filter */}
        <RadiusSelector value={radius} onChange={setRadius} />

        {/* Category chips */}
        <div>
          <p className="mb-2.5 text-sm font-semibold text-[#1F2937] font-heading">
            {t("consumer_search_category")}
          </p>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_KEYS.map((c) => {
              const active = category === c.value;
              return (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setCategory(c.value)}
                  aria-pressed={active}
                  className={cn(
                    "min-h-[44px] rounded-full border-2 px-4 text-sm font-semibold transition-all active:scale-95",
                    active
                      ? "border-[var(--portal)] bg-[var(--portal-light)] text-[var(--portal-dark)]"
                      : "border-[#E5E7EB] bg-white text-[#4B5563] hover:border-[var(--portal)]/50"
                  )}
                >
                  {t(c.labelKey)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grade filter */}
        <div>
          <p className="mb-2.5 text-sm font-semibold text-[#1F2937] font-heading">
            {t("consumer_search_grade")}
          </p>
          <div className="flex flex-wrap gap-2">
            {GRADE_OPTIONS.map((g) => {
              const active = grade === g;
              return (
                <button
                  key={g || "any"}
                  type="button"
                  onClick={() => setGrade(g)}
                  aria-pressed={active}
                  className={cn(
                    "min-h-[44px] rounded-full border-2 px-4 text-sm font-semibold transition-all active:scale-95",
                    active
                      ? "border-[var(--portal)] bg-[var(--portal)] text-white"
                      : "border-[#E5E7EB] bg-white text-[#4B5563] hover:border-[var(--portal)]/50"
                  )}
                >
                  {g ? `${t("consumer_search_grade")} ${g}` : t("consumer_search_any_grade")}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results */}
        <div>
          <p className="mb-4 text-sm font-medium text-[#4B5563]">
            <span className="font-bold text-[#1F2937]">{results.length}</span>{" "}
            {t("consumer_search_results")}
          </p>
          {results.length === 0 ? (
            <Card className="rounded-2xl border-dashed border-[#D1D5DB] bg-white/60">
              <CardContent className="flex flex-col items-center gap-2 px-6 py-12 text-center">
                <SearchX className="h-10 w-10 text-[#9CA3AF]" />
                <p className="max-w-xs text-sm font-medium text-[#4B5563]">
                  {t("consumer_search_none")}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((p) => (
                <ConsumerProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </PortalShell>
  );
}

export default function ConsumerSearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D97706] border-t-transparent" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
