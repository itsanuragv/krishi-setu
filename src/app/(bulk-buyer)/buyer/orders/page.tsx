"use client";

import { useMemo, useState } from "react";
import { BadgeCheck, CalendarClock, Eye, EyeOff, Lock, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";
import { MOCK_CONTRACTS, type BuyerContract } from "@/lib/buyer-mock";
import { PortalShell, PortalHero } from "@/components/portals";
import { EscrowStages } from "@/components/buyer/EscrowStages";
import { cn, formatInr } from "@/lib/utils";

const STATUS_STYLE: Record<BuyerContract["status"], string> = {
  active: "bg-sky-100 text-sky-800",
  in_transit: "bg-amber-100 text-amber-800",
  qc_pending: "bg-violet-100 text-violet-800",
  settled: "bg-emerald-100 text-emerald-800",
};

function statusLabel(t: (k: string) => string, s: BuyerContract["status"]) {
  switch (s) {
    case "active":
      return t("buyer_orders_status_active");
    case "in_transit":
      return t("buyer_orders_status_in_transit");
    case "qc_pending":
      return t("buyer_orders_status_qc_pending");
    case "settled":
      return t("buyer_orders_status_settled");
  }
}

interface VendorGroup {
  vendor: string;
  vendorType: "FPO" | "Farmer";
  contracts: BuyerContract[];
  totalValue: number;
  totalSaved: number;
}

export default function BuyerOrdersPage() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<"all" | "active" | "settled">("all");
  const [showPin, setShowPin] = useState<Record<string, boolean>>({});

  const groups = useMemo<VendorGroup[]>(() => {
    const filtered = MOCK_CONTRACTS.filter((c) =>
      filter === "all" ? true : filter === "settled" ? c.status === "settled" : c.status !== "settled"
    );
    const map = new Map<string, VendorGroup>();
    for (const c of filtered) {
      const g = map.get(c.counterparty) ?? {
        vendor: c.counterparty,
        vendorType: c.counterpartyType,
        contracts: [],
        totalValue: 0,
        totalSaved: 0,
      };
      g.contracts.push(c);
      g.totalValue += c.quantity * c.agreedPrice;
      g.totalSaved += (c.mandiPrice - c.agreedPrice) * c.quantity;
      map.set(c.counterparty, g);
    }
    return [...map.values()];
  }, [filter]);

  return (
    <PortalShell accent="buyer">
      <div className="space-y-5 sm:space-y-6">
        <PortalHero
          eyebrow={t("buyer_orders_eyebrow")}
          title={t("buyer_orders_title")}
          subtitle={t("buyer_orders_sub")}
          stats={[
            {
              label: t("buyer_orders_vendor_pos"),
              value: String(MOCK_CONTRACTS.length),
            },
            {
              label: t("buyer_orders_escrow"),
              value: formatInr(MOCK_CONTRACTS.reduce((s, c) => s + c.escrowAmount, 0)),
            },
          ]}
          actions={
            <div className="flex gap-1.5 rounded-xl bg-white/15 p-1.5">
              {(["all", "active", "settled"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={cn(
                    "min-h-[44px] rounded-lg px-4 text-xs font-bold transition-all",
                    filter === f ? "bg-white text-[var(--portal-dark)]" : "text-white/80 hover:text-white"
                  )}
                >
                  {f === "all"
                    ? t("buyer_orders_all")
                    : f === "active"
                      ? t("buyer_orders_active")
                      : t("buyer_orders_settled")}
                </button>
              ))}
            </div>
          }
        />

        {groups.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#D1D5DB] bg-white p-8 text-center">
            <BadgeCheck className="mx-auto h-10 w-10 text-[#9CA3AF]" />
            <p className="mt-3 text-sm font-semibold text-[#4B5563]">
              {t("buyer_orders_empty")}
            </p>
          </div>
        ) : (
          groups.map((g) => (
            <section
              key={g.vendor}
              aria-label={g.vendor}
              className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm sm:p-5"
            >
              {/* Vendor header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F3F4F6] pb-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--portal-light)] font-heading text-lg font-bold text-[var(--portal-dark)]">
                    {g.vendor.charAt(0)}
                  </span>
                  <div>
                    <h2 className="font-heading text-base font-bold text-[#1F2937]">{g.vendor}</h2>
                    <p className="text-xs text-[#6B7280]">
                      {g.vendorType} · {g.contracts.length} {t("buyer_orders_vendor_pos")}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-heading text-base font-bold text-[#1F2937]">
                    {formatInr(g.totalValue)}
                  </p>
                  <p className="text-[11px] font-bold text-emerald-700">
                    {formatInr(g.totalSaved)} {t("buyer_orders_saved")}
                  </p>
                </div>
              </div>

              {/* Contracts */}
              <div className="mt-3 space-y-4">
                {g.contracts.map((c) => {
                  const lotValue = c.quantity * c.agreedPrice;
                  return (
                    <div
                      key={c.id}
                      className="rounded-xl border border-[#F3F4F6] bg-[#F9FAFB] p-3.5 sm:p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-sm font-bold text-[#1F2937]">{c.lotName}</h3>
                            <span className="rounded bg-[#E5E7EB] px-1.5 py-0.5 font-mono text-[10px] font-bold text-[#4B5563]">
                              {c.contractNo}
                            </span>
                            <span
                              className={cn(
                                "rounded-full px-2.5 py-0.5 text-[11px] font-bold",
                                STATUS_STYLE[c.status]
                              )}
                            >
                              {statusLabel(t, c.status)}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-[#6B7280]">
                            {c.quantity} {c.unit} @ {formatInr(c.agreedPrice)}/{c.unit} ·{" "}
                            <span className="font-bold text-[#1F2937]">{formatInr(lotValue)}</span>
                          </p>
                        </div>
                      </div>

                      <div className="mt-3">
                        <EscrowStages stage={c.escrowStage} />
                      </div>

                      <div className="mt-3 grid gap-2 text-xs sm:grid-cols-3">
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-2 text-[#4B5563]">
                          <CalendarClock className="h-3.5 w-3.5 shrink-0 text-[var(--portal)]" />
                          {t("buyer_orders_slot")}: <strong>{c.deliveryDate}</strong>
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-2 text-[#4B5563]">
                          <Lock className="h-3.5 w-3.5 shrink-0 text-amber-600" />
                          {t("buyer_orders_escrow")}:{" "}
                          <strong>
                            {c.escrowAmount > 0
                              ? `${formatInr(c.escrowAmount)} ${t("buyer_orders_locked")}`
                              : "—"}
                          </strong>
                        </span>
                        {c.status !== "settled" && (
                          <button
                            type="button"
                            onClick={() => setShowPin({ ...showPin, [c.id]: !showPin[c.id] })}
                            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg bg-white px-2.5 py-2 font-mono text-[#1F2937]"
                          >
                            {showPin[c.id] ? (
                              <EyeOff className="h-3.5 w-3.5 shrink-0 text-[#6B7280]" />
                            ) : (
                              <Eye className="h-3.5 w-3.5 shrink-0 text-[#6B7280]" />
                            )}
                            <span className="text-[11px] text-[#6B7280]">
                              {t("buyer_orders_pin")}:
                            </span>
                            <strong className="tracking-widest">
                              {showPin[c.id] ? c.handoverPin : "••••"}
                            </strong>
                          </button>
                        )}
                      </div>

                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#F3F4F6] pt-3">
                        <span className="inline-flex items-center gap-1.5 text-[11px] text-[#6B7280]">
                          <Truck className="h-3.5 w-3.5" />
                          {c.deliveryDate}
                        </span>
                        {c.status !== "settled" ? (
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              onClick={() => toast.success(t("buyer_orders_dispute_toast"))}
                              className="min-h-[44px] rounded-xl text-xs font-bold"
                            >
                              {t("buyer_orders_dispute")}
                            </Button>
                            <Button
                              onClick={() => toast.success(t("buyer_orders_tracking_toast"))}
                              className="min-h-[44px] rounded-xl bg-[var(--portal)] text-xs font-bold text-white hover:bg-[var(--portal-dark)]"
                            >
                              {t("buyer_orders_track")}
                            </Button>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-[11px] font-bold text-emerald-800">
                            <BadgeCheck className="h-3.5 w-3.5" />
                            {t("buyer_orders_status_settled")}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))
        )}
      </div>
    </PortalShell>
  );
}
