"use client";

import { CheckCircle2, Circle, MapPin, Package } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BatchStop {
  id: string;
  title: string;
  address: string;
  kind: "pickup" | "drop";
  packages: string;
  status: "done" | "current" | "upcoming";
  actionLabel?: string;
  onAction?: () => void;
}

interface BatchManifestProps {
  stops: BatchStop[];
  className?: string;
}

/** Batch manifest — stops in OR-Tools optimised order with a progress ring. */
export function BatchManifest({ stops, className }: BatchManifestProps) {
  const done = stops.filter((s) => s.status === "done").length;
  const pct = stops.length ? Math.round((done / stops.length) * 100) : 0;
  const R = 26;
  const C = 2 * Math.PI * R;

  return (
    <div className={cn("rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm", className)}>
      <div className="flex items-center justify-between">
        <div className="text-sm font-bold font-heading text-[#1F2937]">
          {stops.length} stops · {done} done
        </div>
        <div className="relative h-14 w-14" role="img" aria-label={`${pct}% complete`}>
          <svg viewBox="0 0 64 64" className="h-14 w-14 -rotate-90">
            <circle cx="32" cy="32" r={R} fill="none" stroke="#E5E7EB" strokeWidth="7" />
            <circle
              cx="32"
              cy="32"
              r={R}
              fill="none"
              stroke="var(--portal)"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C - (pct / 100) * C}
              className="transition-all"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-[#1F2937]">
            {pct}%
          </span>
        </div>
      </div>
      <ol className="mt-3 space-y-0">
        {stops.map((s, i) => (
          <li key={s.id} className="relative flex gap-3 pb-4 last:pb-0">
            {i < stops.length - 1 && (
              <span
                className={cn(
                  "absolute left-[13px] top-8 h-[calc(100%-2rem)] w-0.5",
                  s.status === "done" ? "bg-[var(--portal)]" : "bg-[#E5E7EB]"
                )}
              />
            )}
            <span className="z-10 mt-0.5">
              {s.status === "done" ? (
                <CheckCircle2 className="h-7 w-7 text-[var(--portal)] bg-white rounded-full" />
              ) : s.status === "current" ? (
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--portal)] text-white text-xs font-bold animate-pulse">
                  {i + 1}
                </span>
              ) : (
                <Circle className="h-7 w-7 text-[#D1D5DB] bg-white rounded-full" />
              )}
            </span>
            <div
              className={cn(
                "flex-1 rounded-xl border p-3",
                s.status === "current"
                  ? "border-[var(--portal)] bg-[var(--portal-soft)]"
                  : "border-[#E5E7EB] bg-white",
                s.status === "done" && "opacity-60"
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide",
                    s.kind === "pickup" ? "bg-[#E8F5E9] text-[#1B5E20]" : "bg-[#DBEAFE] text-[#1E3A8A]"
                  )}
                >
                  {s.kind === "pickup" ? "Pickup" : "Drop"} · #{i + 1}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-[#6B7280]">
                  <Package className="h-3.5 w-3.5" /> {s.packages}
                </span>
              </div>
              <div className="mt-1 text-sm font-semibold text-[#1F2937]">{s.title}</div>
              <div className="flex items-start gap-1 text-xs text-[#6B7280]">
                <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                {s.address}
              </div>
              {s.status === "current" && s.actionLabel && (
                <button
                  type="button"
                  onClick={s.onAction}
                  className="mt-2.5 min-h-[48px] w-full rounded-xl bg-[var(--portal)] font-heading font-bold text-white text-sm transition-all hover:bg-[var(--portal-dark)] active:scale-[0.98]"
                >
                  {s.actionLabel}
                </button>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
