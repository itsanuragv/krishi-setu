"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { PortalShell, PinPad } from "@/components/portals";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatInr } from "@/lib/utils";
import {
  Camera,
  CheckCircle2,
  Lock,
  Package,
  PartyPopper,
  PhoneCall,
  UserX,
  Timer,
} from "lucide-react";
import { MOCK_DELIVERY_ROUTE } from "@/lib/mock-data";
import { DELIVERY_BUYER_PIN, DELIVERY_PAYOUT } from "@/lib/portal-mocks/delivery";

type Step = "pickup" | "drop" | "done";

const MAX_ATTEMPTS = 3;
const ESCALATION_SECS = 15 * 60;

function fmtCountdown(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function ActiveDeliveryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t } = useLanguage();

  const [step, setStep] = useState<Step>("pickup");
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const [absentOpen, setAbsentOpen] = useState(false);
  const [escalateIn, setEscalateIn] = useState(ESCALATION_SECS);

  // Auto-escalation countdown while the buyer-absent panel is open
  useEffect(() => {
    if (!absentOpen) return;
    setEscalateIn(ESCALATION_SECS);
    const iv = setInterval(() => {
      setEscalateIn((v) => (v > 0 ? v - 1 : 0));
    }, 1000);
    return () => clearInterval(iv);
  }, [absentOpen]);

  function checkPin(entered: string, expected: string) {
    if (locked) return;
    if (entered === expected) {
      if (step === "pickup") {
        toast.success(t("delivery_pickup_done"));
        setAttempts(0);
        setStep("drop");
      } else {
        setStep("done");
      }
      return;
    }
    const next = attempts + 1;
    setAttempts(next);
    setShakeKey((k) => k + 1);
    if (next >= MAX_ATTEMPTS) {
      setLocked(true);
      toast.error(t("delivery_locked"));
    } else {
      toast.error(t("delivery_wrong").replace("{left}", String(MAX_ATTEMPTS - next)));
    }
  }

  const pickups = MOCK_DELIVERY_ROUTE.stops.filter((s) => s.role === "Farmer Pickup");
  const currentStop = MOCK_DELIVERY_ROUTE.stops.find((s) => s.isPinTarget);

  return (
    <PortalShell accent="delivery">
      <style>{`@keyframes dshake{0%,100%{transform:translateX(0)}25%{transform:translateX(-10px)}75%{transform:translateX(10px)}}.dshake{animation:dshake .4s}`}</style>
      <div className="space-y-4">
        {/* Order context */}
        <Card>
          <CardContent className="flex items-center gap-3 py-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--portal-soft)]">
              <Package className="h-6 w-6 text-[var(--portal-dark)]" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-medium text-[#6B7280]">
                {t("delivery_ad_eyebrow")} · {t("delivery_ad_order")} {id}
              </div>
              <div className="truncate font-heading text-sm font-bold text-[#1F2937]">
                {DELIVERY_PAYOUT.orderTitle}
              </div>
            </div>
            {step === "done" ? (
              <CheckCircle2 className="h-7 w-7 shrink-0 text-[#16A34A]" />
            ) : (
              <Badge
                className={cn(
                  "shrink-0 text-white",
                  step === "pickup" ? "bg-[#2E7D32]" : "bg-[#1D4ED8]"
                )}
              >
                {t(step === "pickup" ? "delivery_step1" : "delivery_step2")}
              </Badge>
            )}
          </CardContent>
        </Card>

        {/* Stepper */}
        {step !== "done" && (
          <div className="flex items-center gap-2">
            {["pickup", "drop"].map((s, i) => (
              <div key={s} className="flex flex-1 items-center gap-2">
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full font-heading text-sm font-bold text-white",
                    (step === "pickup" && i === 0) || (step === "drop" && i === 1)
                      ? i === 0
                        ? "bg-[#2E7D32]"
                        : "bg-[#1D4ED8]"
                      : step === "drop" && i === 0
                        ? "bg-[#16A34A]"
                        : "bg-[#D1D5DB]"
                  )}
                >
                  {step === "drop" && i === 0 ? <CheckCircle2 className="h-5 w-5" /> : i + 1}
                </span>
                <span className="text-xs font-semibold text-[#4B5563]">
                  {t(i === 0 ? "delivery_step1" : "delivery_step2")}
                </span>
                {i === 0 && <span className="h-0.5 flex-1 rounded bg-[#E5E7EB]" />}
              </div>
            ))}
          </div>
        )}

        {/* STEP 1 — pickup OTP (green) */}
        {step === "pickup" && (
          <div key={shakeKey} className={cn(shakeKey > 0 && "dshake")}>
            <PinPad
              variant="green"
              label={t("delivery_otp_title")}
              disabled={locked}
              onComplete={(pin) => checkPin(pin, MOCK_DELIVERY_ROUTE.requiredPin)}
            />
            <p className="mt-3 text-center text-sm text-[#4B5563]">{t("delivery_otp_hint")}</p>
            <div className="mt-2 flex justify-center">
              <span className="rounded-full bg-[#E8F5E9] px-4 py-1.5 font-heading text-sm font-bold text-[#1B5E20]">
                {t("delivery_demo_otp").replace("{otp}", MOCK_DELIVERY_ROUTE.requiredPin)}
              </span>
            </div>
            <p className="mt-2 text-center text-xs text-[#6B7280]">
              {pickups.map((p) => p.title).join(" · ")}
            </p>
          </div>
        )}

        {/* STEP 2 — buyer PIN (blue) */}
        {step === "drop" && (
          <div key={shakeKey} className={cn(shakeKey > 0 && "dshake")}>
            <PinPad
              variant="blue"
              label={t("delivery_pin_title")}
              disabled={locked}
              onComplete={(pin) => checkPin(pin, DELIVERY_BUYER_PIN)}
            />
            <p className="mt-3 text-center text-sm text-[#4B5563]">{t("delivery_pin_hint")}</p>
            <div className="mt-2 flex justify-center">
              <span className="rounded-full bg-[#DBEAFE] px-4 py-1.5 font-heading text-sm font-bold text-[#1E3A8A]">
                {t("delivery_demo_pin").replace("{pin}", DELIVERY_BUYER_PIN)}
              </span>
            </div>

            {/* Buyer not available */}
            <Button
              variant="outline"
              onClick={() => setAbsentOpen((o) => !o)}
              className="mt-4 h-14 w-full border-2 font-heading text-base font-bold"
            >
              <UserX className="mr-2 h-5 w-5" />
              {t("delivery_absent")}
            </Button>
            {absentOpen && (
              <Card className="mt-3 border-dashed border-2">
                <CardContent className="space-y-3 pt-4">
                  <div className="text-center font-heading text-sm font-bold text-[#1F2937]">
                    {t("delivery_proof_title")}
                  </div>
                  <p className="text-center text-xs text-[#6B7280]">{t("delivery_proof_hint")}</p>
                  <Button
                    variant="secondary"
                    onClick={() => toast.success(t("delivery_photo_toast"))}
                    className="h-14 w-full font-heading text-base font-bold"
                  >
                    <Camera className="mr-2 h-5 w-5" />
                    {t("delivery_take_photo")}
                  </Button>
                  <div className="flex items-center justify-center gap-2 rounded-xl bg-[#FFF3E0] px-3 py-2.5">
                    <Timer className="h-5 w-5 text-[#D97706]" />
                    <span className="text-sm font-semibold text-[#92400E]">
                      {t("delivery_escalates")}
                    </span>
                    <span className="font-heading text-lg font-extrabold tabular-nums text-[#D97706]">
                      {fmtCountdown(escalateIn)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Lockout */}
        {locked && step !== "done" && (
          <Card className="border-[#DC2626]">
            <CardContent className="flex items-center gap-3 py-4">
              <Lock className="h-8 w-8 shrink-0 text-[#DC2626]" />
              <div className="flex-1">
                <div className="font-heading text-sm font-bold text-[#1F2937]">
                  {t("delivery_locked")}
                </div>
              </div>
              <Button
                onClick={() => toast.info(t("delivery_support"))}
                className="h-14 shrink-0 bg-[#DC2626] font-heading font-bold text-white hover:bg-[#B91C1C]"
              >
                <PhoneCall className="mr-2 h-5 w-5" />
                {t("delivery_support")}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* SUCCESS — money released */}
        {step === "done" && (
          <Card className="border-[#16A34A]">
            <CardContent className="pt-6 text-center">
              <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#E8F5E9]">
                <PartyPopper className="h-10 w-10 text-[#16A34A]" />
              </span>
              <h2 className="mt-4 font-heading text-2xl font-extrabold text-[#1F2937]">
                {t("delivery_success").replace("{amount}", formatInr(DELIVERY_PAYOUT.farmerPayout))}
              </h2>
              <p className="mt-1 text-sm text-[#4B5563]">{t("delivery_success_sub")}</p>
              <div className="mt-2 text-xs text-[#6B7280]">{DELIVERY_PAYOUT.escrowId}</div>

              <div className="mt-5 space-y-2 rounded-2xl bg-[#F9FAFB] p-4 text-left">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#4B5563]">
                    {t("delivery_brk_farmer")} · {DELIVERY_PAYOUT.farmerName}
                  </span>
                  <span className="font-heading font-bold text-[#1F2937]">
                    {formatInr(DELIVERY_PAYOUT.farmerPayout)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#4B5563]">{t("delivery_brk_fee")}</span>
                  <span className="font-heading font-bold text-[#2E7D32]">
                    +{formatInr(DELIVERY_PAYOUT.deliveryFee)}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-[#E5E7EB] pt-2 text-sm">
                  <span className="font-semibold text-[#1F2937]">{t("delivery_brk_total")}</span>
                  <span className="font-heading text-base font-extrabold text-[#1F2937]">
                    {formatInr(DELIVERY_PAYOUT.farmerPayout + DELIVERY_PAYOUT.deliveryFee)}
                  </span>
                </div>
                <div className="text-xs text-[#6B7280]">
                  {DELIVERY_PAYOUT.buyerName}
                  {currentStop ? ` · ${currentStop.location}` : ""}
                </div>
              </div>

              <Button
                asChild
                className="mt-5 h-14 w-full bg-[var(--portal)] font-heading text-base font-bold text-white hover:bg-[var(--portal-dark)]"
              >
                <Link href="/delivery/assignments">{t("delivery_back")}</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </PortalShell>
  );
}
