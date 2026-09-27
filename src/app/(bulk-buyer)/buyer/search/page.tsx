"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Minus, Plus, Search, ShoppingCart, Trash2, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";
import { MOCK_PRODUCE_LISTINGS, type ProduceListing } from "@/lib/mock-data";
import { PortalShell, PortalHero, SlabTable, SlotPicker, TrustChips } from "@/components/portals";
import { cn, formatInr } from "@/lib/utils";
import { extractGrade } from "@/lib/buyer-mock";
import {
  KITCHEN_SLOTS,
  groupCartByVendor,
  slabPriceFor,
  slabsForListing,
  useCart,
} from "@/lib/portal-mocks/buyer";

/* ---------- Listing card ---------- */

function ListingCard({ listing }: { listing: ProduceListing }) {
  const { t } = useLanguage();
  const { add } = useCart();
  const [qtyKg, setQtyKg] = useState(50);

  const slabs = useMemo(() => slabsForListing(listing), [listing]);
  const unitPrice = slabPriceFor(slabs, qtyKg);
  const grade = extractGrade(listing.breakdown?.qualityGrade?.detail ?? "");
  const gradeSpec = listing.gradeSpec ?? listing.breakdown?.qualityGrade?.detail;

  const step = (delta: number) =>
    setQtyKg((q) => Math.min(2000, Math.max(10, q + delta)));

  const handleAdd = () => {
    add({
      listingId: listing.id,
      name: listing.name,
      farmerName: listing.farmerName,
      qtyKg,
      unitPrice,
      unit: "kg",
    });
    toast.success(`${listing.name} · ${qtyKg} kg ${t("buyer_search_added")}`);
  };

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
      <div className="relative h-40 w-full bg-[#F3F4F6]">
        <Image
          src={listing.imageUrl}
          alt={listing.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 50vw"
          loading="lazy"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-[#1F2937] shadow-sm">
          {listing.distanceKm} km
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="font-heading text-base font-bold leading-snug text-[#1F2937]">
            {listing.name}
          </h3>
          {gradeSpec && (
            <span className="mt-1.5 inline-block rounded-full bg-[var(--portal-light)] px-2.5 py-1 text-[11px] font-semibold text-[var(--portal-dark)]">
              {gradeSpec}
            </span>
          )}
        </div>

        <TrustChips
          photo={listing.farmerPhoto}
          name={listing.farmerName}
          distanceKm={listing.distanceKm}
          harvestDate={listing.harvestDate ?? "—"}
          grade={grade.replace("Grade ", "")}
          rating={listing.breakdown?.reliability?.rating}
        />

        <SlabTable slabs={slabs} unit="kg" activeQty={qtyKg} />

        <div className="flex items-center justify-between gap-3 rounded-xl bg-[#F9FAFB] px-3 py-2.5">
          <span className="text-xs font-semibold text-[#4B5563]">{t("buyer_search_qty")}</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="decrease quantity"
              onClick={() => step(-10)}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E5E7EB] bg-white text-[#1F2937] transition-all hover:border-[var(--portal)] active:scale-95"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="min-w-[64px] text-center font-heading text-base font-bold text-[#1F2937]">
              {qtyKg}
            </span>
            <button
              type="button"
              aria-label="increase quantity"
              onClick={() => step(10)}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E5E7EB] bg-white text-[#1F2937] transition-all hover:border-[var(--portal)] active:scale-95"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs text-[#6B7280]">
            {t("buyer_search_slab_line")}:{" "}
            <span className="font-bold text-[var(--portal-dark)]">
              {formatInr(unitPrice)}/kg
            </span>
          </p>
          <p className="font-heading text-lg font-bold text-[#1F2937]">
            {formatInr(unitPrice * qtyKg)}
          </p>
        </div>

        <Button
          onClick={handleAdd}
          className="min-h-[48px] w-full rounded-xl bg-[var(--portal)] font-heading font-bold text-white hover:bg-[var(--portal-dark)]"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {t("buyer_search_add")}
        </Button>
      </div>
    </article>
  );
}

/* ---------- Cart section ---------- */

function CartSection() {
  const { t } = useLanguage();
  const { items, remove, clear, subtotal, totalQtyKg, count } = useCart();
  const [slot, setSlot] = useState<string | undefined>();

  const groups = useMemo(() => groupCartByVendor(items), [items]);

  const checkout = () => {
    if (items.length === 0) return;
    if (!slot) {
      toast.error(t("buyer_search_pick_slot"));
      return;
    }
    toast.success(`${groups.length} ${t("buyer_search_raised")}`);
    clear();
    setSlot(undefined);
  };

  if (items.length === 0) {
    return (
      <section
        id="cart"
        aria-label={t("buyer_search_cart_title")}
        className="rounded-2xl border border-dashed border-[#D1D5DB] bg-white p-6 text-center sm:p-8"
      >
        <ShoppingCart className="mx-auto h-10 w-10 text-[#9CA3AF]" />
        <h2 className="mt-3 font-heading text-base font-bold text-[#1F2937]">
          {t("buyer_search_cart_title")}
        </h2>
        <p className="mx-auto mt-1 max-w-sm text-sm text-[#6B7280]">
          {t("buyer_search_cart_empty")}
        </p>
      </section>
    );
  }

  return (
    <section
      id="cart"
      aria-label={t("buyer_search_cart_title")}
      className="scroll-mt-24 rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm sm:p-5"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-heading text-base font-bold text-[#1F2937] sm:text-lg">
          {t("buyer_search_cart_title")} · {count} · {totalQtyKg} kg
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            clear();
            toast(t("buyer_search_cart_cleared"));
          }}
          className="min-h-[44px] text-xs font-semibold text-[#6B7280] hover:text-[#DC2626]"
        >
          <Trash2 className="mr-1 h-3.5 w-3.5" />
          {t("buyer_search_clear")}
        </Button>
      </div>

      {/* Vendor groups */}
      <div className="mt-4 space-y-3">
        {groups.map((g) => (
          <div key={g.vendor} className="rounded-xl border border-[#E5E7EB] p-3.5">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-sm font-bold text-[#1F2937]">{g.vendor}</p>
              <span className="shrink-0 rounded-full bg-[var(--portal-light)] px-2.5 py-1 text-[11px] font-bold text-[var(--portal-dark)]">
                {g.qtyKg} kg
              </span>
            </div>
            <ul className="mt-2.5 space-y-2">
              {g.items.map((item) => (
                <li
                  key={item.listingId}
                  className="flex items-center justify-between gap-2 rounded-lg bg-[#F9FAFB] px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-[#1F2937]">{item.name}</p>
                    <p className="text-[11px] text-[#6B7280]">
                      {item.qtyKg} kg × {formatInr(item.unitPrice)}/kg
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-sm font-bold text-[#1F2937]">
                      {formatInr(item.qtyKg * item.unitPrice)}
                    </span>
                    <button
                      type="button"
                      aria-label={`${t("buyer_search_remove")} ${item.name}`}
                      onClick={() => remove(item.listingId)}
                      className="flex h-10 w-10 items-center justify-center rounded-lg text-[#9CA3AF] hover:bg-red-50 hover:text-[#DC2626]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-2.5 flex items-center justify-between border-t border-[#F3F4F6] pt-2.5">
              <span className="text-xs font-semibold text-[#4B5563]">
                {t("buyer_search_vendor_po")}
              </span>
              <span className="font-heading text-sm font-bold text-[var(--portal-dark)]">
                {formatInr(g.total)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* PO split preview */}
      <div className="mt-4 rounded-xl bg-[var(--portal-soft)] p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-[var(--portal-dark)]">
          {t("buyer_search_po_preview")}
        </p>
        <p className="mt-1 text-sm text-[#4B5563]">
          {groups.length} {t("buyer_search_vendor_po")} · {totalQtyKg} kg ·{" "}
          <span className="font-heading font-bold text-[#1F2937]">{formatInr(subtotal)}</span>
        </p>
      </div>

      {/* Slot picker */}
      <div className="mt-4">
        <p className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-[#1F2937]">
          <Truck className="h-4 w-4 text-[var(--portal)]" />
          {t("buyer_search_slot_label")}
        </p>
        <p className="mb-2 text-xs text-[#6B7280]">{t("buyer_search_slot_hint")}</p>
        <SlotPicker slots={KITCHEN_SLOTS} value={slot} onChange={setSlot} />
      </div>

      <Button
        onClick={checkout}
        className="mt-4 min-h-[52px] w-full rounded-xl bg-[var(--portal)] font-heading text-base font-bold text-white hover:bg-[var(--portal-dark)]"
      >
        {t("buyer_search_raise")} · {formatInr(subtotal)}
      </Button>
    </section>
  );
}

/* ---------- Page ---------- */

export default function BuyerSearchPage() {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [grade, setGrade] = useState("all");
  const { count } = useCart();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_PRODUCE_LISTINGS.filter((l) => {
      if (q && !(l.name.toLowerCase().includes(q) || l.hindiName.includes(query.trim())))
        return false;
      if (grade !== "all") {
        const g = extractGrade(l.breakdown?.qualityGrade?.detail ?? "");
        if (!g.toLowerCase().includes(grade.toLowerCase())) return false;
      }
      return true;
    });
  }, [query, grade]);

  return (
    <PortalShell accent="buyer">
      <div className="space-y-5 sm:space-y-6">
        <PortalHero
          eyebrow={t("buyer_search_eyebrow")}
          title={t("buyer_search_title")}
          subtitle={t("buyer_search_sub")}
          actions={
            count > 0 ? (
              <Button
                onClick={() =>
                  document.getElementById("cart")?.scrollIntoView({ behavior: "smooth" })
                }
                className="min-h-[48px] rounded-xl bg-white font-heading font-bold text-[var(--portal-dark)] hover:bg-white/90"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                {t("buyer_search_view_cart")} ({count})
              </Button>
            ) : undefined
          }
        />

        {/* Filters */}
        <div className="space-y-3 rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("buyer_search_placeholder")}
              className="h-12 rounded-xl border-[#E5E7EB] pl-10 text-sm font-medium"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-[#4B5563]">{t("buyer_search_grade")}:</span>
            {["all", "Grade A", "Grade B"].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGrade(g)}
                className={cn(
                  "min-h-[40px] rounded-full border px-4 text-xs font-bold transition-all",
                  grade === g
                    ? "border-[var(--portal)] bg-[var(--portal)] text-white"
                    : "border-[#E5E7EB] bg-white text-[#4B5563] hover:border-[var(--portal)]"
                )}
              >
                {g === "all" ? t("buyer_search_all") : g}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {results.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#D1D5DB] bg-white p-8 text-center">
            <Search className="mx-auto h-10 w-10 text-[#9CA3AF]" />
            <p className="mt-3 text-sm font-semibold text-[#4B5563]">
              {t("buyer_search_no_results")}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        )}

        <CartSection />
      </div>
    </PortalShell>
  );
}
