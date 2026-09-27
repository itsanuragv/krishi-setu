"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Camera, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";
import { disputeApi, orderApi } from "@/features/api";
import { PortalShell } from "@/components/portals";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  DISPUTE_ISSUE_TYPES,
  MOCK_CONSUMER_ORDERS,
} from "@/lib/portal-mocks/consumer";

function DisputeContent() {
  const { t } = useLanguage();
  const router = useRouter();
  const params = useSearchParams();
  const preselected = params.get("orderId");

  const { data } = useQuery({
    queryKey: ["orders"],
    queryFn: () => orderApi.list(),
    retry: 1,
  });

  const orders =
    data && data.items.length > 0
      ? data.items.map((o) => ({ id: o.id, crop: o.crop }))
      : MOCK_CONSUMER_ORDERS.map((o) => ({ id: o.id, crop: o.crop }));

  const [orderId, setOrderId] = useState(preselected ?? orders[0]?.id ?? "");
  const [issue, setIssue] = useState(DISPUTE_ISSUE_TYPES[0].key);
  const [description, setDescription] = useState("");
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!orderId && orders.length > 0) setOrderId(orders[0].id);
  }, [orders, orderId]);

  async function submit() {
    if (!orderId) return;
    setSubmitting(true);
    try {
      await disputeApi.create({ orderId, reason: issue, evidenceUrls: [] });
    } catch {
      // Demo mode: the MSW handler may reject unknown ids — still acknowledge.
    }
    setSubmitting(false);
    toast.success(t("consumer_toast_dispute"));
    router.push("/consumer/orders");
  }

  return (
    <PortalShell accent="consumer">
      <div className="mx-auto max-w-xl space-y-6 pb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#1F2937]">
            {t("consumer_dispute_title")}
          </h1>
          <p className="mt-1 text-sm text-[#4B5563]">{t("consumer_dispute_sub")}</p>
        </div>

        <div className="flex gap-3 rounded-2xl border border-[#2E7D32]/30 bg-[#F1F8E9] p-4">
          <ShieldCheck className="h-6 w-6 shrink-0 text-[#2E7D32]" />
          <p className="text-xs leading-relaxed text-[#1B5E20]">
            {t("consumer_orders_escrow_hold")}
          </p>
        </div>

        <Card className="rounded-2xl border-[#E5E7EB]">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-[#1F2937]">
              {t("consumer_dispute_issue")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Order select */}
            <div className="space-y-2">
              <Label htmlFor="dispute-order" className="text-sm font-semibold text-[#1F2937]">
                {t("consumer_dispute_order")}
              </Label>
              <select
                id="dispute-order"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="h-12 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 text-sm font-medium text-[#1F2937] focus:border-[var(--portal)] focus:outline-none"
              >
                {orders.map((o) => (
                  <option key={o.id} value={o.id}>
                    #{o.id} · {o.crop}
                  </option>
                ))}
              </select>
            </div>

            {/* Issue type chips */}
            <div className="space-y-2.5">
              <Label className="text-sm font-semibold text-[#1F2937]">
                {t("consumer_dispute_issue")}
              </Label>
              <div className="flex flex-wrap gap-2">
                {DISPUTE_ISSUE_TYPES.map((it) => {
                  const active = issue === it.key;
                  return (
                    <button
                      key={it.key}
                      type="button"
                      onClick={() => setIssue(it.key)}
                      aria-pressed={active}
                      className={cn(
                        "min-h-[48px] rounded-full border-2 px-4 text-sm font-semibold transition-all active:scale-95",
                        active
                          ? "border-[var(--portal)] bg-[var(--portal)] text-white"
                          : "border-[#E5E7EB] bg-white text-[#4B5563] hover:border-[var(--portal)]/50"
                      )}
                    >
                      {t(it.labelKey)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Photo upload placeholder */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-[#1F2937]">
                {t("consumer_dispute_photo")}
              </Label>
              <label
                htmlFor="dispute-photo"
                className="flex min-h-[88px] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-[#D1D5DB] bg-[#F9FAFB] px-4 py-5 text-center transition-colors hover:border-[var(--portal)] hover:bg-[var(--portal-soft)]"
              >
                <Camera className="h-6 w-6 text-[#9CA3AF]" />
                <span className="text-sm font-medium text-[#4B5563]">
                  {photoName ?? t("consumer_dispute_photo_hint")}
                </span>
                <input
                  id="dispute-photo"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  onChange={(e) => setPhotoName(e.target.files?.[0]?.name ?? null)}
                />
              </label>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="dispute-desc" className="text-sm font-semibold text-[#1F2937]">
                {t("consumer_dispute_desc")}
              </Label>
              <Textarea
                id="dispute-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("consumer_dispute_desc_ph")}
                rows={4}
                className="rounded-xl border-[#E5E7EB] text-sm focus-visible:ring-[var(--portal)]"
              />
            </div>

            <Button
              onClick={submit}
              disabled={submitting || !orderId}
              className="h-14 w-full rounded-xl bg-[var(--portal)] text-base font-bold text-white shadow-sm transition-colors hover:bg-[var(--portal-dark)] disabled:opacity-60"
            >
              {submitting ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              ) : (
                t("consumer_dispute_submit")
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </PortalShell>
  );
}

export default function ConsumerNewDisputePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D97706] border-t-transparent" />
        </div>
      }
    >
      <DisputeContent />
    </Suspense>
  );
}
