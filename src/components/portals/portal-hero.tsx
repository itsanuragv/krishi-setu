"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PortalHeroProps {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  stats?: { label: string; value: string }[];
  className?: string;
}

/** Gradient hero band tinted with the portal accent. */
export function PortalHero({ eyebrow, title, subtitle, actions, stats, className }: PortalHeroProps) {
  return (
    <section
      className={cn(
        "rounded-2xl p-5 sm:p-7 text-white shadow-sm",
        "bg-[linear-gradient(135deg,var(--portal),var(--portal-dark))]",
        className
      )}
    >
      {eyebrow && (
        <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-semibold tracking-wide uppercase">
          {eyebrow}
        </span>
      )}
      <h1 className="mt-3 font-heading text-2xl sm:text-3xl font-bold !text-white">{title}</h1>
      {subtitle && <p className="mt-2 text-sm sm:text-base text-white/85 max-w-2xl">{subtitle}</p>}
      {stats && stats.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl bg-white/15 px-3 py-2.5">
              <div className="text-lg font-bold font-heading !text-white">{s.value}</div>
              <div className="text-xs text-white/75">{s.label}</div>
            </div>
          ))}
        </div>
      )}
      {actions && <div className="mt-4 flex flex-wrap gap-3">{actions}</div>}
    </section>
  );
}
