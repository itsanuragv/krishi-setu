"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Lock, Minus, Plus, ShieldCheck, ShoppingBasket, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";
import { PortalShell } from "@/components/portals";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatInr } from "@/lib/utils";
import { getConsumerProduct } from "@/lib/portal-mocks/consumer";

interface CartItem {
  productId: string;
  qty: number;
}

function CartContent() {
  const { t } = useLanguage();
  const router = useRouter();
  const params = useSearchParams();
  const initialId = params.get("productId");
  const initialQty = Number(params.get("qty") ?? 5) || 5;

  const [cart, setCart] = useState<CartItem[]>(
    initialId && getConsumerProduct(initialId) ? [{ productId: initialId, qty: initialQty }] : []
  );
  const [paying, setPaying] = useState(false);

  const lines = useMemo(
    () =>
      cart
        .map((c) => ({ ...c, product: getConsumerProduct(c.productId) }))
        .filter((l) => l.product),
    [cart]
  );

  const total = lines.reduce((s, l) => s + l.product!.pricePerKg * l.qty, 0);
  const saving = lines.reduce(
    (s, l) => s + (l.product!.retailPricePerKg - l.product!.pricePerKg) * l.qty,
    0
  );

  function setQty(productId: string, qty: number) {
    setCart((prev) =>
      prev.map((c) =>
        c.productId === productId ? { ...c, qty: Math.min(100, Math.max(1, qty)) } : c
      )
    );
  }

  function remove(productId: string) {
    setCart((prev) => prev.filter((c) => c.productId !== productId));
  }

  async function pay() {
    setPaying(true);
    // Mock UPI payment: in production this opens a UPI collect request.
    await new Promise((r) => setTimeout(r, 1200));
    setPaying(false);
    toast.success(t("consumer_toast_paid"));
    router.push("/consumer/orders");
  }

  return (
    <PortalShell accent="consumer">
      <div className="mx-auto max-w-2xl space-y-6 pb-6">
        <div>
          <Link
            href="/consumer/dashboard"
            className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-[var(--portal-dark)]"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("consumer_dash_fresh_title")}
          </Link>
          <h1 className="mt-1 font-heading text-2xl font-bold text-[#1F2937]">
            {t("consumer_cart_title")}
          </h1>
          <p className="mt-1 text-sm text-[#4B5563]">{t("consumer_cart_sub")}</p>
        </div>

        {lines.length === 0 ? (
          <Card className="rounded-2xl border-dashed border-[#D1D5DB] bg-white/60">
            <CardContent className="flex flex-col items-center gap-3 px-6 py-12 text-center">
              <ShoppingBasket className="h-12 w-12 text-[#9CA3AF]" />
              <p className="text-sm font-medium text-[#4B5563]">{t("consumer_cart_empty")}</p>
              <Button
                asChild
                className="h-12 rounded-xl bg-[var(--portal)] px-5 text-sm font-bold text-white hover:bg-[var(--portal-dark)]"
              >
                <Link href="/consumer/dashboard">{t("consumer_cart_browse")}</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Cart items */}
            <div className="space-y-3">
              {lines.map(({ product, qty }) => (
                <Card key={product!.id} className="rounded-2xl border-[#E5E7EB]">
                  <CardContent className="flex gap-4 p-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product!.imageUrl}
                      alt={product!.name}
                      className="h-20 w-20 shrink-0 rounded-xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[#1F2937]">
                        {product!.name}
                      </p>
                      <p className="mt-0.5 text-xs text-[#6B7280]">
                        {formatInr(product!.pricePerKg)}
                        <span className="text-[#9CA3AF]">{t("consumer_pd_per_kg")}</span> ·{" "}
                        {product!.farmerName}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-1 rounded-xl border border-[#E5E7EB] p-1">
                          <button
                            type="button"
                            onClick={() => setQty(product!.id, qty - 1)}
                            aria-label="Decrease quantity"
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#1F2937] hover:bg-[#F3F4F6] active:scale-95"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-12 text-center text-sm font-bold text-[#1F2937]">
                            {qty} kg
                          </span>
                          <button
                            type="button"
                            onClick={() => setQty(product!.id, qty + 1)}
                            aria-label="Increase quantity"
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#1F2937] hover:bg-[#F3F4F6] active:scale-95"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(product!.id)}
                          className="inline-flex min-h-[44px] items-center gap-1 px-2 text-xs font-semibold text-[#DC2626]"
                        >
                          <Trash2 className="h-4 w-4" />
                          {t("consumer_cart_remove")}
                        </button>
                      </div>
                    </div>
                    <p className="shrink-0 text-sm font-bold text-[#1F2937]">
                      {formatInr(product!.pricePerKg * qty)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Escrow checkout summary */}
            <Card className="rounded-2xl border-[var(--portal)]/40 bg-[var(--portal-soft)]">
              <CardContent className="space-y-4 p-5">
                <p className="font-heading text-base font-bold text-[#1F2937]">
                  {t("consumer_cart_summary")}
                </p>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-[#4B5563]">{t("consumer_cart_total")}</dt>
                    <dd className="text-lg font-bold text-[#1F2937]">{formatInr(total)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[#4B5563]">{t("consumer_cart_you_save")}</dt>
                    <dd className="font-bold text-[#1B5E20]">{formatInr(saving)}</dd>
                  </div>
                </dl>
                <div className="flex gap-3 rounded-xl border border-[var(--portal)]/30 bg-white p-3.5">
                  <Lock className="h-5 w-5 shrink-0 text-[var(--portal)]" />
                  <p className="text-xs leading-relaxed text-[#4B5563]">
                    <span className="font-bold text-[var(--portal-dark)]">
                      {t("consumer_cart_escrow_locked")} ·{" "}
                    </span>
                    {t("consumer_cart_escrow_notice")}
                  </p>
                </div>
                <Button
                  onClick={pay}
                  disabled={paying}
                  className="h-14 w-full rounded-xl bg-[var(--portal)] text-base font-bold text-white shadow-sm transition-colors hover:bg-[var(--portal-dark)] disabled:opacity-60"
                >
                  {paying ? (
                    <span className="flex items-center gap-2">
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      …
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5" />
                      {t("consumer_cart_pay_upi")} · {formatInr(total)}
                    </span>
                  )}
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </PortalShell>
  );
}

export default function ConsumerCartOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D97706] border-t-transparent" />
        </div>
      }
    >
      <CartContent />
    </Suspense>
  );
}
