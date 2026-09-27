"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarClock, MapPin, Plus, Sprout, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { MOCK_REQUIREMENTS, type Requirement } from "@/lib/mock-data";
import { PortalShell, PortalHero } from "@/components/portals";
import { cn, formatInr } from "@/lib/utils";

const POSTED_KEY = "ks_posted_requirements_v1";

function readPosted(): Requirement[] {
  try {
    const raw = sessionStorage.getItem(POSTED_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const STATUS_STYLE: Record<Requirement["status"], string> = {
  open: "bg-sky-100 text-sky-800",
  filling: "bg-amber-100 text-amber-800",
  fulfilled: "bg-emerald-100 text-emerald-800",
};

function statusLabel(t: (k: string) => string, s: Requirement["status"]) {
  return s === "open"
    ? t("buyer_req_status_open")
    : s === "filling"
      ? t("buyer_req_status_filling")
      : t("buyer_req_status_fulfilled");
}

function RequirementCard({ req }: { req: Requirement }) {
  const { t } = useLanguage();
  const pct = Math.min(100, Math.round((req.pooledKg / Math.max(1, req.quantityKg)) * 100));

  return (
    <article className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-heading text-base font-bold text-[#1F2937]">{req.crop}</h3>
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-[11px] font-bold",
                STATUS_STYLE[req.status]
              )}
            >
              {statusLabel(t, req.status)}
            </span>
          </div>
          <p className="mt-1 text-xs text-[#6B7280]">
            {req.buyerName} · {req.business}
          </p>
        </div>
        <div className="text-right">
          <p className="font-heading text-sm font-bold text-[var(--portal-dark)]">
            {t("buyer_req_target")}: {formatInr(req.targetPrice)}/kg
          </p>
          <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-[#6B7280]">
            <MapPin className="h-3 w-3" />
            {req.district}
          </p>
        </div>
      </div>

      {/* Pooled progress */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-[#4B5563]">
            <span className="font-heading font-bold text-[#1F2937]">{req.pooledKg}</span>
            {" / "}
            {req.quantityKg} kg {t("buyer_req_pooled")}
          </span>
          <span className="font-bold text-[var(--portal-dark)]">{pct}%</span>
        </div>
        <div
          className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-[#F3F4F6]"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,var(--portal),var(--portal-dark))] transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-[#F3F4F6] pt-3 text-xs text-[#6B7280]">
        <span className="inline-flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5" />
          {req.contributors} {t("buyer_req_farmers")}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Sprout className="h-3.5 w-3.5" />
          {req.grade}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <CalendarClock className="h-3.5 w-3.5" />
          {t("buyer_req_deadline")}: {req.deadline}
        </span>
      </div>
    </article>
  );
}

export default function BuyerRequirementsPage() {
  const { t } = useLanguage();
  const [posted] = useState<Requirement[]>(() => readPosted());
  const all = useMemo(() => [...posted, ...MOCK_REQUIREMENTS], [posted]);

  return (
    <PortalShell accent="buyer">
      <div className="space-y-5 sm:space-y-6">
        <PortalHero
          eyebrow={t("buyer_req_eyebrow")}
          title={t("buyer_req_title")}
          subtitle={t("buyer_req_sub")}
          stats={[
            {
              label: t("buyer_req_status_open"),
              value: String(all.filter((r) => r.status === "open").length),
            },
            {
              label: t("buyer_req_status_filling"),
              value: String(all.filter((r) => r.status === "filling").length),
            },
            {
              label: t("buyer_req_status_fulfilled"),
              value: String(all.filter((r) => r.status === "fulfilled").length),
            },
          ]}
          actions={
            <Button
              asChild
              className="min-h-[48px] rounded-xl bg-white font-heading font-bold text-[var(--portal-dark)] hover:bg-white/90"
            >
              <Link href="/buyer/requirements/new">
                <Plus className="mr-2 h-4 w-4" />
                {t("buyer_req_post")}
              </Link>
            </Button>
          }
        />

        {all.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#D1D5DB] bg-white p-8 text-center sm:p-10">
            <Sprout className="mx-auto h-10 w-10 text-[#9CA3AF]" />
            <p className="mx-auto mt-3 max-w-sm text-sm font-semibold text-[#4B5563]">
              {t("buyer_req_empty")}
            </p>
            <Button
              asChild
              className="mt-4 min-h-[48px] rounded-xl bg-[var(--portal)] font-heading font-bold text-white hover:bg-[var(--portal-dark)]"
            >
              <Link href="/buyer/requirements/new">
                <Plus className="mr-2 h-4 w-4" />
                {t("buyer_req_post")}
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {all.map((req) => (
              <RequirementCard key={req.id} req={req} />
            ))}
          </div>
        )}
      </div>
    </PortalShell>
  );
}
