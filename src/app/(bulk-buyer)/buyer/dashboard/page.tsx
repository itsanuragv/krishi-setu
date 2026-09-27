"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CalendarClock,
  CheckCircle2,
  Clock,
  Repeat2,
  ShoppingCart,
  Truck,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";
import { MOCK_PRODUCE_LISTINGS } from "@/lib/mock-data";
import { PortalShell, PortalHero, SlotPicker } from "@/components/portals";
import { cn, formatInr } from "@/lib/utils";
import {
  KITCHEN_SLOTS,
  MONTH_SPEND,
  QUICK_ORDER_LISTS,
  STANDING_ORDERS,
  TODAY_DELIVERIES,
  slabsForListing,
  slabPriceFor,
  useCart,
} from "@/lib/portal-mocks/buyer";

const DELIVERY_STATUS_STYLE: Record<string, string> = {
  arrived: "bg-emerald-100 text-emerald-800",
  in_transit: "bg-amber-100 text-amber-800",
  scheduled: "bg-slate-100 text-slate-600",
};

export default function BuyerDashboardPage() {
  const { t } = useLanguage();
  const { add, count } = useCart();
  const [slot, setSlot] = useState<string | undefined>();

  const stats = [
    { label: t("buyer_dash_stat_spend"), value: formatInr(MONTH_SPEND.total) },
    { label: t("buyer_dash_stat_active_pos"), value: String(MONTH_SPEND.activePos) },
    { label: t("buyer_dash_stat_today"), value: String(TODAY_DELIVERIES.length) },
    { label: t("buyer_dash_stat_standing"), value: String(STANDING_ORDERS.length) },
  ];

  const reorderList = (listId: string) => {
    const list = QUICK_ORDER_LISTS.find((l) => l.id === listId);
    if (!list) return;
    let added = 0;
    for (const item of list.items) {
      const listing = MOCK_PRODUCE_LISTINGS.find((l) => l.id === item.listingId);
      if (!listing) continue;
      const slabs = slabsForListing(listing);
      add({
        listingId: listing.id,
        name: listing.name,
        farmerName: listing.farmerName,
        qtyKg: item.qtyKg,
        unitPrice: slabPriceFor(slabs, item.qtyKg),
        unit: "kg",
      });
      added += 1;
    }
    toast.success(`${list.name}: ${t("buyer_dash_reordered")}`);
  };

  return (
    <PortalShell accent="buyer">
      <div className="space-y-5 sm:space-y-6">
        <PortalHero
          eyebrow={t("buyer_dash_eyebrow")}
          title={t("buyer_dash_title")}
          subtitle={t("buyer_dash_sub")}
          stats={stats.map((s) => ({ label: s.label, value: s.value }))}
          actions={
            <>
              <Button
                asChild
                className="min-h-[48px] rounded-xl bg-white font-heading font-bold text-[var(--portal-dark)] hover:bg-white/90"
              >
                <Link href="/buyer/search">
                  {t("buyer_dash_go_search")}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="min-h-[48px] rounded-xl border-white/40 bg-transparent font-heading font-bold text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/buyer/requirements/new">{t("buyer_dash_go_requirements")}</Link>
              </Button>
            </>
          }
        />

        {/* Today's delivery slots */}
        <section
          aria-label={t("buyer_dash_slots_title")}
          className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm sm:p-5"
        >
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--portal-light)] text-[var(--portal-dark)]">
              <CalendarClock className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-heading text-base font-bold text-[#1F2937] sm:text-lg">
                {t("buyer_dash_slots_title")}
              </h2>
              <p className="text-xs text-[#6B7280] sm:text-sm">{t("buyer_dash_slots_sub")}</p>
            </div>
          </div>

          <ul className="mt-4 space-y-2.5">
            {TODAY_DELIVERIES.map((d) => (
              <li
                key={d.id}
                className="flex items-center gap-3 rounded-xl border border-[#F3F4F6] bg-[#F9FAFB] px-3 py-2.5"
              >
                <Truck className="h-5 w-5 shrink-0 text-[var(--portal)]" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#1F2937]">
                    {d.crop} · {d.qtyKg} kg
                  </p>
                  <p className="flex items-center gap-1 text-xs text-[#6B7280]">
                    <Clock className="h-3 w-3" />
                    {d.slot}
                    <span className="truncate">· {d.vendor}</span>
                  </p>
                </div>
                <span
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold",
                    DELIVERY_STATUS_STYLE[d.status]
                  )}
                >
                  {d.status === "arrived" ? (
                    <CheckCircle2 className="h-3 w-3" />
                  ) : (
                    <Clock className="h-3 w-3" />
                  )}
                  {d.status === "arrived"
                    ? t("buyer_dash_status_arrived")
                    : d.status === "in_transit"
                      ? t("buyer_dash_status_in_transit")
                      : t("buyer_dash_status_scheduled")}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-4">
            <SlotPicker
              slots={KITCHEN_SLOTS}
              value={slot}
              onChange={(id) => {
                setSlot(id);
                toast.success(t("buyer_dash_slot_booked"));
              }}
            />
          </div>
        </section>

        {/* Standing orders due */}
        <section
          aria-label={t("buyer_dash_standing_title")}
          className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm sm:p-5"
        >
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--portal-light)] text-[var(--portal-dark)]">
              <Repeat2 className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-heading text-base font-bold text-[#1F2937] sm:text-lg">
                {t("buyer_dash_standing_title")}
              </h2>
              <p className="text-xs text-[#6B7280] sm:text-sm">{t("buyer_dash_standing_sub")}</p>
            </div>
          </div>

          <ul className="mt-4 divide-y divide-[#F3F4F6]">
            {STANDING_ORDERS.map((so) => (
              <li key={so.id} className="flex items-center gap-3 py-3 first:pt-1 last:pb-0">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-[#1F2937]">{so.crop}</p>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[11px] font-bold",
                        so.due === "today"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-slate-100 text-slate-600"
                      )}
                    >
                      {so.due === "today" ? t("buyer_dash_due_today") : t("buyer_dash_due_tomorrow")}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-[#6B7280]">
                    {so.qtyKg} kg · {so.frequency} · {so.vendor}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => toast.success(t("buyer_dash_standing_repeated"))}
                  className="min-h-[44px] shrink-0 rounded-xl border-[var(--portal)] font-semibold text-[var(--portal-dark)] hover:bg-[var(--portal-light)]"
                >
                  <Repeat2 className="mr-1.5 h-4 w-4" />
                  {t("buyer_dash_repeat")}
                </Button>
              </li>
            ))}
          </ul>
        </section>

        {/* Quick order lists */}
        <section
          aria-label={t("buyer_dash_lists_title")}
          className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm sm:p-5"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--portal-light)] text-[var(--portal-dark)]">
                <CheckCircle2 className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-heading text-base font-bold text-[#1F2937] sm:text-lg">
                  {t("buyer_dash_lists_title")}
                </h2>
                <p className="text-xs text-[#6B7280] sm:text-sm">{t("buyer_dash_lists_sub")}</p>
              </div>
            </div>
            {count > 0 && (
              <Link
                href="/buyer/search#cart"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[var(--portal)] px-3.5 py-2 text-xs font-bold text-white"
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                {count}
              </Link>
            )}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {QUICK_ORDER_LISTS.map((list) => (
              <div
                key={list.id}
                className="flex flex-col rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-heading text-sm font-bold text-[#1F2937]">{list.name}</p>
                    <p className="mt-0.5 text-xs text-[#6B7280]">
                      {list.items.length} {t("buyer_dash_items")} · {t("buyer_dash_weekly")}
                    </p>
                  </div>
                </div>
                <ul className="mt-2.5 flex-1 space-y-1">
                  {list.items.map((item) => {
                    const listing = MOCK_PRODUCE_LISTINGS.find((l) => l.id === item.listingId);
                    return (
                      <li key={item.listingId + item.qtyKg} className="text-xs text-[#4B5563]">
                        • {listing ? listing.name : item.listingId} — {item.qtyKg} kg
                      </li>
                    );
                  })}
                </ul>
                <Button
                  onClick={() => reorderList(list.id)}
                  className="mt-3 min-h-[48px] w-full rounded-xl bg-[var(--portal)] font-heading font-bold text-white hover:bg-[var(--portal-dark)]"
                >
                  <Repeat2 className="mr-2 h-4 w-4" />
                  {t("buyer_dash_reorder")}
                </Button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PortalShell>
  );
}
