"use client";

import { TrendingUp, Timer, AlertOctagon, MapPin } from "lucide-react";
import { PortalShell, PortalHero, HealthKpis } from "@/components/portals";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatInr } from "@/lib/utils";
import {
  MOCK_GMV_TREND,
  MOCK_ORDERS_BY_DISTRICT,
  MOCK_DISPUTE_RATE_TREND,
  MOCK_PAYOUT_TAT,
} from "@/lib/portal-mocks/admin";
import { MOCK_HEALTH_KPIS } from "@/lib/mock-data";

/** Deterministic SVG sparkline — no chart library. */
function Sparkline({
  values,
  width = 300,
  height = 96,
  stroke = "#334155",
  fill = "rgba(51,65,85,0.08)",
  format,
}: {
  values: number[];
  width?: number;
  height?: number;
  stroke?: string;
  fill?: string;
  format?: (v: number) => string;
}) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pad = 6;
  const pts = values.map((v, i) => {
    const x = pad + (i / (values.length - 1)) * (width - pad * 2);
    const y = pad + (1 - (v - min) / (max - min || 1)) * (height - pad * 2);
    return [x, y] as const;
  });
  const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${pts[pts.length - 1][0].toFixed(1)},${height} L${pts[0][0].toFixed(1)},${height} Z`;
  const last = pts[pts.length - 1];
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img">
      <path d={area} fill={fill} />
      <path d={line} fill="none" stroke={stroke} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={last[0]} cy={last[1]} r={4} fill={stroke} />
      {format && (
        <text x={last[0] - 4} y={Math.max(last[1] - 8, 12)} textAnchor="end" fontSize={11} fontWeight={700} fill={stroke}>
          {format(values[values.length - 1])}
        </text>
      )}
    </svg>
  );
}

/** Semicircle gauge for payout TAT vs target. */
function TatGauge({ value, target }: { value: number; target: number }) {
  const pct = Math.min(value / target, 1);
  const r = 70;
  const len = Math.PI * r;
  return (
    <svg viewBox="0 0 160 92" className="w-full max-w-[220px]" role="img">
      <path d={`M10,84 A${r},${r} 0 0 1 150,84`} fill="none" stroke="#E5E7EB" strokeWidth={14} strokeLinecap="round" />
      <path
        d={`M10,84 A${r},${r} 0 0 1 150,84`}
        fill="none"
        stroke={value <= target ? "#16A34A" : "#DC2626"}
        strokeWidth={14}
        strokeLinecap="round"
        strokeDasharray={`${len * pct} ${len}`}
      />
      <text x={80} y={66} textAnchor="middle" fontSize={24} fontWeight={800} fill="#1F2937" fontFamily="Poppins, sans-serif">
        {value}h
      </text>
      <text x={80} y={82} textAnchor="middle" fontSize={10} fill="#6B7280">
        target ≤ {target}h
      </text>
    </svg>
  );
}

export default function AnalyticsPage() {
  const gmvValues = MOCK_GMV_TREND.map((d) => d.gmv);
  const rateValues = MOCK_DISPUTE_RATE_TREND.map((d) => d.rate);
  const maxOrders = Math.max(...MOCK_ORDERS_BY_DISTRICT.map((d) => d.orders));

  return (
    <PortalShell accent="admin">
      <div className="space-y-5">
        <PortalHero
          eyebrow="Metrics"
          title="Marketplace Health"
          subtitle="All figures are demo aggregates. Live numbers stream from the backend analytics service."
          stats={[
            { label: "14-day GMV", value: formatInr(gmvValues.reduce((a, b) => a + b, 0)) },
            { label: "Orders (top district)", value: `${maxOrders}` },
            { label: "Dispute rate now", value: `${rateValues[rateValues.length - 1]}%` },
            { label: "Payout TAT", value: `${MOCK_PAYOUT_TAT.value}h` },
          ]}
        />

        <div className="grid gap-4 lg:grid-cols-2">
          {/* GMV trend */}
          <Card className="shadow-sm">
            <CardHeader className="pb-1">
              <CardTitle className="flex items-center gap-2 font-heading text-base font-bold">
                <TrendingUp className="h-5 w-5 text-[var(--portal-dark)]" />
                GMV trend — last 14 days
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Sparkline values={gmvValues} format={(v) => formatInr(v)} />
              <div className="mt-1 flex justify-between text-[11px] text-[#9CA3AF]">
                <span>Sep 14 · {formatInr(Math.min(...gmvValues))}</span>
                <span>Sep 27 (today)</span>
              </div>
            </CardContent>
          </Card>

          {/* Dispute rate trend */}
          <Card className="shadow-sm">
            <CardHeader className="pb-1">
              <CardTitle className="flex items-center gap-2 font-heading text-base font-bold">
                <AlertOctagon className="h-5 w-5 text-[#DC2626]" />
                Dispute rate — weekly
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Sparkline
                values={rateValues}
                stroke="#DC2626"
                fill="rgba(220,38,38,0.08)"
                format={(v) => `${v.toFixed(1)}%`}
              />
              <div className="mt-1 flex justify-between text-[11px] text-[#9CA3AF]">
                <span>Week 31</span>
                <span>Week 38 (now)</span>
              </div>
            </CardContent>
          </Card>

          {/* Orders by district */}
          <Card className="shadow-sm">
            <CardHeader className="pb-1">
              <CardTitle className="flex items-center gap-2 font-heading text-base font-bold">
                <MapPin className="h-5 w-5 text-[var(--portal-dark)]" />
                Orders by district
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 pt-3">
              {MOCK_ORDERS_BY_DISTRICT.map((d) => (
                <div key={d.district}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-[#374151]">{d.district}</span>
                    <span className="font-bold font-heading text-[#1F2937]">{d.orders}</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-[#F3F4F6]">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,var(--portal),var(--portal-dark))]"
                      style={{ width: `${(d.orders / maxOrders) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Payout TAT gauge */}
          <Card className="shadow-sm">
            <CardHeader className="pb-1">
              <CardTitle className="flex items-center gap-2 font-heading text-base font-bold">
                <Timer className="h-5 w-5 text-[#16A34A]" />
                Farmer payout TAT
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center pt-2">
              <TatGauge value={MOCK_PAYOUT_TAT.value} target={MOCK_PAYOUT_TAT.target} />
              <p className="mt-1 text-sm text-[#4B5563]">
                PIN handover → UPI release, median. Target met for 8 straight weeks.
              </p>
            </CardContent>
          </Card>
        </div>

        <HealthKpis kpis={MOCK_HEALTH_KPIS} />
      </div>
    </PortalShell>
  );
}
