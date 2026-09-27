"use client";

import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type PortalAccent = "farmer" | "consumer" | "buyer" | "delivery" | "admin";

export const PORTAL_ACCENTS: Record<
  PortalAccent,
  { base: string; dark: string; light: string; soft: string }
> = {
  farmer: { base: "#2E7D32", dark: "#1B5E20", light: "#E8F5E9", soft: "#F1F8E9" },
  consumer: { base: "#D97706", dark: "#92400E", light: "#FEF3C7", soft: "#FFFBEB" },
  buyer: { base: "#1D4ED8", dark: "#1E3A8A", light: "#DBEAFE", soft: "#EFF6FF" },
  delivery: { base: "#7C3AED", dark: "#5B21B6", light: "#EDE9FE", soft: "#F5F3FF" },
  admin: { base: "#334155", dark: "#0F172A", light: "#F1F5F9", soft: "#F8FAFC" },
};

/**
 * PortalShell — wraps a role portal page and exposes the portal's identity
 * accent as CSS vars (--portal, --portal-dark, --portal-light, --portal-soft).
 * Base emerald design tokens stay untouched; this is a per-portal tint only.
 */
export function PortalShell({
  accent,
  children,
  className,
}: {
  accent: PortalAccent;
  children: ReactNode;
  className?: string;
}) {
  const a = PORTAL_ACCENTS[accent];
  return (
    <div
      className={cn("portal-scope", className)}
      style={
        {
          "--portal": a.base,
          "--portal-dark": a.dark,
          "--portal-light": a.light,
          "--portal-soft": a.soft,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
