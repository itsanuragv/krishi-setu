"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";
import { createRequirementSchema } from "@/lib/schemas/requirement";
import { PortalShell } from "@/components/portals";
import { cn } from "@/lib/utils";

const POSTED_KEY = "ks_posted_requirements_v1";

const inputCls =
  "h-12 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 text-base font-medium text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[var(--portal)] focus:outline-none focus:ring-2 focus:ring-[var(--portal)]/20";
const labelCls = "block text-sm font-semibold text-[#1F2937] font-heading mb-1.5";

export default function NewRequirementPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [form, setForm] = useState({
    crop: "",
    quantityKg: "",
    grade: "Grade A",
    targetPrice: "",
    district: "",
    deadline: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((prev) => ({ ...prev, [k]: "" }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const parsed = createRequirementSchema.safeParse({
      crop: form.crop.trim(),
      quantityKg: form.quantityKg,
      grade: form.grade,
      targetPrice: form.targetPrice,
      district: form.district.trim(),
      deadline: form.deadline,
    });

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const [k, v] of Object.entries(parsed.error.flatten().fieldErrors)) {
        if (v && v.length > 0) fieldErrors[k] = v[0];
      }
      setErrors(fieldErrors);
      setSubmitting(false);
      return;
    }

    // Mock submit: persist to sessionStorage so the list page shows it.
    try {
      const existing = JSON.parse(sessionStorage.getItem(POSTED_KEY) ?? "[]");
      const entry = {
        id: `req-${Date.now()}`,
        buyerName: "Malwa Agro Mills",
        business: "HoReCa · Indore",
        crop: parsed.data.crop,
        quantityKg: parsed.data.quantityKg,
        grade: parsed.data.grade,
        targetPrice: parsed.data.targetPrice,
        district: parsed.data.district,
        deadline: parsed.data.deadline,
        pooledKg: 0,
        contributors: 0,
        status: "open" as const,
      };
      sessionStorage.setItem(POSTED_KEY, JSON.stringify([entry, ...(Array.isArray(existing) ? existing : [])]));
    } catch {
      // storage unavailable — still confirm the post
    }

    toast.success(t("buyer_req_new_posted"));
    router.push("/buyer/requirements");
  };

  const fieldError = (k: string) =>
    errors[k] ? (
      <p className="mt-1 text-xs font-semibold text-[#DC2626]">{errors[k]}</p>
    ) : null;

  return (
    <PortalShell accent="buyer">
      <div className="mx-auto max-w-2xl space-y-5">
        <div>
          <Link
            href="/buyer/requirements"
            className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-[var(--portal-dark)]"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("buyer_req_new_back")}
          </Link>
          <h1 className="mt-1 font-heading text-2xl font-bold text-[#1F2937] sm:text-3xl">
            {t("buyer_req_new_title")}
          </h1>
          <p className="mt-1.5 text-sm text-[#4B5563] sm:text-base">{t("buyer_req_new_sub")}</p>
        </div>

        <form
          onSubmit={submit}
          noValidate
          className="space-y-4 rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm sm:p-6"
        >
          <div>
            <Label htmlFor="req-crop" className={labelCls}>
              {t("buyer_req_new_crop")} *
            </Label>
            <Input
              id="req-crop"
              value={form.crop}
              onChange={set("crop")}
              placeholder={t("buyer_req_new_crop_ph")}
              className={cn(inputCls, errors.crop && "border-[#DC2626]")}
            />
            {fieldError("crop")}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="req-qty" className={labelCls}>
                {t("buyer_req_new_qty")} *
              </Label>
              <Input
                id="req-qty"
                type="number"
                min={1}
                inputMode="numeric"
                value={form.quantityKg}
                onChange={set("quantityKg")}
                placeholder="500"
                className={cn(inputCls, errors.quantityKg && "border-[#DC2626]")}
              />
              {fieldError("quantityKg")}
            </div>
            <div>
              <Label htmlFor="req-grade" className={labelCls}>
                {t("buyer_req_new_grade")} *
              </Label>
              <select
                id="req-grade"
                value={form.grade}
                onChange={set("grade")}
                className={cn(inputCls, "pr-10", errors.grade && "border-[#DC2626]")}
              >
                <option>Grade A</option>
                <option>Grade B</option>
                <option>Grade C</option>
              </select>
              {fieldError("grade")}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="req-price" className={labelCls}>
                {t("buyer_req_new_price")} *
              </Label>
              <Input
                id="req-price"
                type="number"
                min={1}
                inputMode="decimal"
                value={form.targetPrice}
                onChange={set("targetPrice")}
                placeholder="25"
                className={cn(inputCls, errors.targetPrice && "border-[#DC2626]")}
              />
              {fieldError("targetPrice")}
            </div>
            <div>
              <Label htmlFor="req-district" className={labelCls}>
                {t("buyer_req_new_district")} *
              </Label>
              <Input
                id="req-district"
                value={form.district}
                onChange={set("district")}
                placeholder={t("buyer_req_new_district_ph")}
                className={cn(inputCls, errors.district && "border-[#DC2626]")}
              />
              {fieldError("district")}
            </div>
          </div>

          <div>
            <Label htmlFor="req-deadline" className={labelCls}>
              {t("buyer_req_new_deadline")} *
            </Label>
            <Input
              id="req-deadline"
              type="date"
              value={form.deadline}
              onChange={set("deadline")}
              className={cn(inputCls, errors.deadline && "border-[#DC2626]")}
            />
            {fieldError("deadline")}
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="min-h-[52px] w-full rounded-xl bg-[var(--portal)] font-heading text-base font-bold text-white hover:bg-[var(--portal-dark)] disabled:opacity-60"
          >
            <Send className="mr-2 h-4 w-4" />
            {t("buyer_req_new_submit")}
          </Button>
        </form>
      </div>
    </PortalShell>
  );
}
