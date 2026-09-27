"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Camera,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowRight,
  ArrowLeft,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import {
  PortalShell,
  VoiceFab,
  MandiCompareCard,
} from "@/components/portals";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/context/LanguageContext";
import { MOCK_PRODUCE_LISTINGS } from "@/lib/mock-data";
import {
  addFarmerListing,
  buildDraftListing,
  mandiRateForCrop,
  parseVoiceDraft,
} from "@/lib/portal-mocks/farmer";
import { formatInr, cn } from "@/lib/utils";

type QcState = "idle" | "scanning" | "pass" | "fail";

export default function FarmerSellPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [photo, setPhoto] = useState<string | null>(null);
  const [qc, setQc] = useState<QcState>("idle");
  const [qcGrade, setQcGrade] = useState("A");
  const scanTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [fields, setFields] = useState({
    crop: "",
    variety: "",
    quantity: "100",
    unit: "quintal",
    grade: "A",
    harvestDate: new Date().toISOString().slice(0, 10),
    district: "Indore",
    notes: "",
  });
  const [price, setPrice] = useState(3400);

  const steps = [t("farmer_sell_step1"), t("farmer_sell_step2"), t("farmer_sell_step3")];
  const mandi = mandiRateForCrop(fields.crop, MOCK_PRODUCE_LISTINGS);
  const sliderMin = Math.max(500, Math.round((mandi * 0.6) / 50) * 50);
  const sliderMax = Math.round((mandi * 1.8) / 50) * 50;
  const margin = price - mandi;

  useEffect(() => {
    return () => {
      if (scanTimer.current) clearTimeout(scanTimer.current);
    };
  }, []);

  function set<K extends keyof typeof fields>(key: K, value: (typeof fields)[K]) {
    setFields((f) => ({ ...f, [key]: value }));
  }

  function onPhotoFile(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(reader.result as string);
      setQc("idle");
    };
    reader.readAsDataURL(file);
  }

  function runQc() {
    if (!photo || qc === "scanning") return;
    setQc("scanning");
    scanTimer.current = setTimeout(() => {
      const pass = Math.random() < 0.8;
      if (pass) {
        setQcGrade(Math.random() < 0.7 ? "A" : "B");
        setQc("pass");
      } else {
        setQc("fail");
      }
    }, 1600);
  }

  function retake() {
    setPhoto(null);
    setQc("idle");
  }

  function handleVoice(transcript: string) {
    if (!transcript.trim()) {
      toast.error(t("farmer_sell_voice_missed"));
      return;
    }
    const parsed = parseVoiceDraft(transcript);
    setFields((f) => ({
      ...f,
      crop: parsed.crop || f.crop,
      quantity: parsed.quantity ? String(parsed.quantity) : f.quantity,
      unit: parsed.unit || f.unit,
    }));
    if (parsed.price) setPrice(parsed.price);
    toast.success(t("farmer_sell_voice_filled"));
  }

  function goNext() {
    if (step === 0) {
      if (!photo) {
        toast.error(t("farmer_sell_need_photo"));
        return;
      }
      if (qc === "fail") {
        toast.error(t("farmer_sell_qc_fail"));
        return;
      }
      if (qc === "idle") {
        runQc();
        return;
      }
      if (qc === "scanning") return;
      if (qc === "pass") set("grade", qcGrade);
      setStep(1);
    } else if (step === 1) {
      if (!fields.crop.trim() || !fields.quantity || Number(fields.quantity) <= 0) {
        toast.error(t("farmer_sell_need_details"));
        return;
      }
      setStep(2);
    }
  }

  function publish() {
    addFarmerListing(
      buildDraftListing({
        crop: fields.crop,
        quantity: Number(fields.quantity) || 0,
        unit: fields.unit,
        price,
        photo: photo ?? undefined,
      })
    );
    toast.success(t("farmer_sell_published"));
    router.push("/farmer/dashboard");
  }

  return (
    <PortalShell accent="farmer">
      <div className="mx-auto max-w-lg space-y-5 pb-4">
        {/* Header */}
        <header className="pt-1">
          <h1 className="font-heading text-2xl font-bold text-[#1F2937]">
            {t("farmer_sell_title")}
          </h1>
          <p className="mt-1 text-sm text-[#4B5563]">{t("farmer_sell_sub")}</p>
        </header>

        {/* Step indicator */}
        <ol className="flex gap-2" aria-label="steps">
          {steps.map((label, i) => (
            <li
              key={label}
              className={cn(
                "flex h-11 flex-1 items-center justify-center rounded-full px-2 text-center font-heading text-xs font-bold transition-colors",
                i === step
                  ? "bg-[var(--portal)] text-white shadow-sm"
                  : i < step
                    ? "bg-[var(--portal-light)] text-[var(--portal-dark)]"
                    : "bg-[#F3F4F6] text-[#6B7280]"
              )}
            >
              {i + 1}. {label}
            </li>
          ))}
        </ol>

        <Card className="shadow-sm">
          <CardContent className="space-y-5 p-4 sm:p-5">
            {/* ── Step 1: Photo + simulated QC ── */}
            {step === 0 && (
              <div className="space-y-4">
                <div>
                  <p className="font-heading text-base font-bold text-[#1F2937]">
                    {t("farmer_sell_photo_title")}
                  </p>
                  <p className="mt-0.5 text-xs text-[#4B5563]">{t("farmer_sell_photo_hint")}</p>
                </div>

                {photo ? (
                  <div className="relative overflow-hidden rounded-2xl border border-[#E5E7EB]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo} alt="crop" className="aspect-video w-full object-cover" />
                  </div>
                ) : (
                  <label className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[var(--portal)]/40 bg-[var(--portal-soft)] p-6 text-center transition-colors hover:bg-[var(--portal-light)]">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--portal)] text-white">
                      <Camera className="h-7 w-7" />
                    </span>
                    <span className="font-heading text-sm font-bold text-[var(--portal-dark)]">
                      {t("farmer_sell_photo_cta")}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={(e) => onPhotoFile(e.target.files?.[0])}
                    />
                  </label>
                )}

                {photo && qc === "idle" && (
                  <Button
                    onClick={runQc}
                    className="h-12 w-full rounded-xl bg-[var(--portal)] font-heading font-bold text-white hover:bg-[var(--portal-dark)]"
                  >
                    {t("farmer_sell_qc_run")}
                  </Button>
                )}

                {qc === "scanning" && (
                  <div className="flex items-center justify-center gap-2 rounded-2xl bg-[#F3F4F6] p-5 text-sm font-semibold text-[#4B5563]">
                    <Loader2 className="h-5 w-5 animate-spin text-[var(--portal)]" />
                    {t("farmer_sell_qc_scanning")}
                  </div>
                )}

                {qc === "pass" && (
                  <div className="flex items-start gap-3 rounded-2xl border border-[#2E7D32]/30 bg-[#E8F5E9] p-4">
                    <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-[#2E7D32]" />
                    <div>
                      <p className="font-heading text-sm font-bold text-[#1B5E20]">
                        {t("farmer_sell_qc_pass")} — Grade {qcGrade}
                      </p>
                      <p className="mt-0.5 text-xs text-[#2E7D32]">{t("farmer_sell_qc_pass_sub")}</p>
                    </div>
                  </div>
                )}

                {qc === "fail" && (
                  <div className="space-y-3 rounded-2xl border border-[#DC2626]/30 bg-[#FEF2F2] p-4">
                    <div className="flex items-start gap-3">
                      <XCircle className="mt-0.5 h-6 w-6 shrink-0 text-[#DC2626]" />
                      <div>
                        <p className="font-heading text-sm font-bold text-[#991B1B]">
                          {t("farmer_sell_qc_fail")}
                        </p>
                        <p className="mt-0.5 text-xs text-[#B91C1C]">{t("farmer_sell_qc_fail_sub")}</p>
                      </div>
                    </div>
                    <Button
                      onClick={retake}
                      variant="outline"
                      className="h-12 w-full gap-2 rounded-xl border-[#DC2626]/40 font-heading font-bold text-[#B91C1C]"
                    >
                      <RefreshCw className="h-4 w-4" />
                      {t("farmer_sell_retake")}
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* ── Step 2: Details + voice prefill ── */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 rounded-2xl bg-[var(--portal-soft)] p-3">
                  <VoiceFab onResult={handleVoice} className="scale-90" />
                  <p className="text-xs font-medium text-[#4B5563]">
                    {t("farmer_sell_voice_hint")}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#1F2937]">{t("farmer_sell_f_crop")}</Label>
                  <Input
                    value={fields.crop}
                    onChange={(e) => set("crop", e.target.value)}
                    placeholder="Sharbati Wheat"
                    className="h-12 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#1F2937]">{t("farmer_sell_f_variety")}</Label>
                  <Input
                    value={fields.variety}
                    onChange={(e) => set("variety", e.target.value)}
                    placeholder="MP Sharbati Golden"
                    className="h-12 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-[#1F2937]">{t("farmer_sell_f_qty")}</Label>
                    <Input
                      type="number"
                      inputMode="numeric"
                      value={fields.quantity}
                      onChange={(e) => set("quantity", e.target.value)}
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-[#1F2937]">{t("farmer_sell_f_unit")}</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {(["quintal", "kg"] as const).map((u) => (
                        <button
                          key={u}
                          type="button"
                          onClick={() => set("unit", u)}
                          className={cn(
                            "h-12 rounded-xl border font-heading text-xs font-bold transition-colors",
                            fields.unit === u
                              ? "border-[var(--portal)] bg-[var(--portal-light)] text-[var(--portal-dark)]"
                              : "border-[#E5E7EB] bg-white text-[#6B7280]"
                          )}
                        >
                          {u === "quintal" ? t("farmer_sell_unit_quintal") : t("farmer_sell_unit_kg")}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-[#1F2937]">{t("farmer_sell_f_grade")}</Label>
                    <div className="flex gap-2">
                      {(["A", "B", "C"] as const).map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => set("grade", g)}
                          className={cn(
                            "h-12 flex-1 rounded-xl border font-heading text-sm font-bold transition-colors",
                            fields.grade === g
                              ? "border-[var(--portal)] bg-[var(--portal-light)] text-[var(--portal-dark)]"
                              : "border-[#E5E7EB] bg-white text-[#6B7280]"
                          )}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-[#1F2937]">{t("farmer_sell_f_harvest")}</Label>
                    <Input
                      type="date"
                      value={fields.harvestDate}
                      onChange={(e) => set("harvestDate", e.target.value)}
                      className="h-12 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#1F2937]">{t("farmer_sell_f_district")}</Label>
                  <Input
                    value={fields.district}
                    onChange={(e) => set("district", e.target.value)}
                    className="h-12 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#1F2937]">{t("farmer_sell_f_notes")}</Label>
                  <Textarea
                    value={fields.notes}
                    onChange={(e) => set("notes", e.target.value)}
                    rows={2}
                    className="resize-none rounded-xl"
                  />
                </div>
              </div>
            )}

            {/* ── Step 3: Price slider vs mandi ── */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <p className="font-heading text-base font-bold text-[#1F2937]">
                    {fields.crop || t("farmer_sell_step3")} · {fields.quantity}{" "}
                    {fields.unit === "kg" ? t("farmer_unit_kg") : t("farmer_unit_quintal")}
                  </p>
                  <p className="mt-0.5 text-xs text-[#4B5563]">{t("farmer_sell_price_hint")}</p>
                </div>

                <MandiCompareCard
                  crop={fields.crop || "—"}
                  mandiPrice={mandi}
                  yourPrice={price}
                  unit={fields.unit}
                />

                <div className="rounded-2xl border border-[#E5E7EB] p-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold text-[#1F2937]">
                      {t("farmer_sell_price_yours")} (₹/{fields.unit})
                    </Label>
                    <span className="font-heading text-2xl font-bold text-[var(--portal-dark)]">
                      {formatInr(price)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={sliderMin}
                    max={sliderMax}
                    step={50}
                    value={Math.min(Math.max(price, sliderMin), sliderMax)}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="mt-2 h-12 w-full accent-[#2E7D32]"
                    aria-label={t("farmer_sell_price_yours")}
                  />
                  <div className="flex justify-between text-[11px] font-medium text-[#6B7280]">
                    <span>{formatInr(sliderMin)}</span>
                    <span>{formatInr(sliderMax)}</span>
                  </div>
                </div>

                <div
                  className={cn(
                    "flex items-center gap-2 rounded-2xl p-4 font-heading text-sm font-bold",
                    margin >= 0 ? "bg-[#E8F5E9] text-[#1B5E20]" : "bg-[#FEF2F2] text-[#991B1B]"
                  )}
                >
                  <TrendingUp className="h-5 w-5 shrink-0" />
                  {t("farmer_sell_price_margin")}: {margin >= 0 ? "+" : "−"}
                  {formatInr(Math.abs(margin))}/
                  {fields.unit === "kg" ? t("farmer_unit_kg") : t("farmer_unit_quintal")}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3 border-t border-[#F3F4F6] pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="h-12 flex-1 gap-1 rounded-xl font-heading font-bold"
              >
                <ArrowLeft className="h-4 w-4" />
                {t("farmer_sell_prev")}
              </Button>
              {step < 2 ? (
                <Button
                  type="button"
                  onClick={goNext}
                  className="h-12 flex-1 gap-1 rounded-xl bg-[var(--portal)] font-heading font-bold text-white hover:bg-[var(--portal-dark)]"
                >
                  {t("farmer_sell_next")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={publish}
                  className="h-12 flex-1 rounded-xl bg-[var(--portal)] font-heading font-bold text-white hover:bg-[var(--portal-dark)]"
                >
                  {t("farmer_sell_publish")}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalShell>
  );
}
