"use client";

import React from "react";
import Image from "next/image";

interface KrishiSetuLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  textClassName?: string;
  subtextClassName?: string;
}

export function KrishiSetuLogo({
  className = "size-10",
  size = 40,
  showText = false,
  textClassName = "text-base font-black text-slate-900",
  subtextClassName = "text-[10px] font-semibold text-emerald-600",
}: KrishiSetuLogoProps) {
  return (
    <div className="inline-flex items-center gap-2.5 select-none shrink-0">
      <div
        className={`relative shrink-0 transition-transform group-hover:scale-105 ${className}`}
        style={{ width: size, height: size }}
      >
        <Image
          src="/kisan-setu-emblem.png"
          alt="Kisan Setu Logo"
          fill
          sizes={`${size}px`}
          className="object-contain"
          priority
        />
      </div>

      {showText && (
        <div className="flex flex-col leading-normal overflow-visible">
          <span className={textClassName}>Kisan Setu</span>
          <span className={subtextClassName}>कृषि सेतु • Bharat Agri</span>
        </div>
      )}
    </div>
  );
}
