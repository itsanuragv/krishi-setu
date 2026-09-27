"use client";

import { Star, ShieldCheck, CheckCircle2, TrendingUp, BadgeCheck, Lightbulb } from "lucide-react";
import { PortalShell } from "@/components/portals";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";
import { FARMER_PROFILE, FARMER_REVIEWS } from "@/lib/portal-mocks/farmer";
import { cn } from "@/lib/utils";

function ScoreRing({ score }: { score: number }) {
  const size = 168;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--portal)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (score / 100) * c}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-heading text-5xl font-bold text-[#1F2937]">{score}</span>
        <span className="text-xs font-semibold text-[#6B7280]">/ 100</span>
      </div>
    </div>
  );
}

export default function FarmerRatingsPage() {
  const { t } = useLanguage();

  const pillars = [
    {
      label: t("farmer_rate_pillar_ontime"),
      value: "98.4%",
      icon: <CheckCircle2 className="h-5 w-5 text-[#2E7D32]" />,
    },
    {
      label: t("farmer_rate_pillar_qc"),
      value: "99.2%",
      icon: <ShieldCheck className="h-5 w-5 text-[var(--portal)]" />,
    },
    {
      label: t("farmer_rate_pillar_disputes"),
      value: "0",
      icon: <BadgeCheck className="h-5 w-5 text-[#2E7D32]" />,
      tag: t("farmer_rate_pillar_clean"),
    },
    {
      label: t("farmer_rate_pillar_repeat"),
      value: "42%",
      icon: <TrendingUp className="h-5 w-5 text-[#F57C00]" />,
    },
  ];

  const tips = [
    t("farmer_rate_tip1"),
    t("farmer_rate_tip2"),
    t("farmer_rate_tip3"),
    t("farmer_rate_tip4"),
  ];

  return (
    <PortalShell accent="farmer">
      <div className="mx-auto max-w-3xl space-y-6 pb-4">
        <header className="pt-1">
          <h1 className="font-heading text-2xl font-bold text-[#1F2937]">
            {t("farmer_rate_title")}
          </h1>
          <p className="mt-1 text-sm text-[#4B5563]">{t("farmer_rate_sub")}</p>
        </header>

        {/* Score hero */}
        <Card className="overflow-hidden shadow-sm">
          <div className="bg-[linear-gradient(135deg,var(--portal),var(--portal-dark))] p-5 sm:p-6">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-8">
              <div className="rounded-full bg-white/95 p-2">
                <ScoreRing score={FARMER_PROFILE.trustScore} />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <Badge className="gap-1 bg-white/20 text-white hover:bg-white/20">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {t("farmer_rate_verified")}
                </Badge>
                <div className="mt-2 flex items-center justify-center gap-1 sm:justify-start">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="h-4 w-4 fill-[#FBBF24] text-[#FBBF24]" />
                  ))}
                  <span className="ml-1 text-sm font-bold text-white">
                    {FARMER_PROFILE.rating} ({FARMER_PROFILE.reviewCount})
                  </span>
                </div>
                <p className="mt-2 text-sm font-semibold text-white/90">
                  {t("farmer_rate_boost").replace("{pct}", String(FARMER_PROFILE.matchBoostPct))}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Pillars */}
        <div className="grid grid-cols-2 gap-3">
          {pillars.map((p) => (
            <Card key={p.label} className="shadow-sm">
              <CardContent className="flex min-h-[104px] flex-col justify-between gap-2 p-4">
                <span className="text-xs font-medium text-[#4B5563]">{p.label}</span>
                <div className="flex items-center justify-between">
                  <span className="font-heading text-2xl font-bold text-[#1F2937]">{p.value}</span>
                  {p.icon}
                </div>
                {p.tag && (
                  <Badge variant="outline" className="w-fit border-[#2E7D32]/40 text-xs text-[#2E7D32]">
                    {p.tag}
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Reviews */}
        <section className="space-y-3">
          <h2 className="font-heading text-lg font-bold text-[#1F2937]">
            {t("farmer_rate_history")}
          </h2>
          <div className="space-y-3">
            {FARMER_REVIEWS.map((rev) => (
              <Card key={rev.id} className="shadow-sm">
                <CardContent className="space-y-2 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="truncate text-sm font-bold text-[#1F2937]">
                        {rev.buyerName}
                      </span>
                      <Badge variant="outline" className="shrink-0 text-[10px]">
                        {rev.buyerType}
                      </Badge>
                    </div>
                    <span className="shrink-0 text-xs text-[#6B7280]">{rev.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-[#FBBF24] text-[#FBBF24]" />
                    ))}
                    <span className="ml-2 text-xs font-medium text-[#6B7280]">{rev.crop}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-[#4B5563]">{rev.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Tips */}
        <section className="space-y-3">
          <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-[#1F2937]">
            <Lightbulb className="h-5 w-5 text-[#F57C00]" />
            {t("farmer_rate_tips_title")}
          </h2>
          <Card className="shadow-sm">
            <CardContent className="space-y-3 p-4 sm:p-5">
              {tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--portal-light)] font-heading text-sm font-bold text-[var(--portal-dark)]"
                    )}
                  >
                    {i + 1}
                  </span>
                  <p className="pt-1 text-sm leading-relaxed text-[#1F2937]">{tip}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>
    </PortalShell>
  );
}
