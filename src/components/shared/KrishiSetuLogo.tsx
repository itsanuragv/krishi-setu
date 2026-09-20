"use client";

import React from "react";

interface KrishiSetuLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  textClassName?: string;
  subtextClassName?: string;
}

export function KrishiSetuLogo({
  className = "size-8",
  size = 32,
  showText = false,
  textClassName = "text-base font-extrabold text-slate-900",
  subtextClassName = "text-[10px] font-semibold text-emerald-600",
}: KrishiSetuLogoProps) {
  return (
    <div className="inline-flex items-center gap-2.5 select-none">
      {/* Custom Vector Krishi Setu Emblem */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 drop-shadow-xs transition-transform group-hover:scale-105 ${className}`}
        aria-label="Krishi Setu Logo"
      >
        <defs>
          {/* Gradient definitions */}
          <linearGradient id="ks-bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="50%" stopColor="#047857" />
            <stop offset="100%" stopColor="#0f766e" />
          </linearGradient>

          <linearGradient id="ks-sun-grad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#FDE047" />
          </linearGradient>

          <linearGradient id="ks-bridge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="50%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#6EE7B7" />
          </linearGradient>

          <linearGradient id="ks-wheat-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          <filter id="ks-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#064E3B" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Squircle App Container */}
        <rect width="48" height="48" rx="13" fill="url(#ks-bg-grad)" />

        {/* Subtle Inner Glow Border */}
        <rect
          x="1"
          y="1"
          width="46"
          height="46"
          rx="12"
          fill="none"
          stroke="white"
          strokeOpacity="0.22"
          strokeWidth="1.2"
        />

        {/* Rising Golden Sun / Digital Node */}
        <circle cx="24" cy="18" r="7.5" fill="url(#ks-sun-grad)" opacity="0.95" />
        <circle cx="24" cy="18" r="9.5" fill="none" stroke="#FDE047" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />

        {/* The "Setu" (Bridge Arch) */}
        <path
          d="M7 36.5 C 15 27, 33 27, 41 36.5"
          fill="none"
          stroke="url(#ks-bridge-grad)"
          strokeWidth="3.2"
          strokeLinecap="round"
          filter="url(#ks-shadow)"
        />

        {/* Road/Bridge Suspension Vertical Cables */}
        <path d="M16 31.5 L16 35" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.75" />
        <path d="M21 28.5 L21 34.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.75" />
        <path d="M27 28.5 L27 34.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.75" />
        <path d="M32 31.5 L32 35" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.75" />

        {/* Highway Digital Highway Deck Line */}
        <path
          d="M9 37.5 C 16 33, 32 33, 39 37.5"
          fill="none"
          stroke="#064E3B"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* Krishi Sprout: Left Leaf */}
        <path
          d="M24 25 C 18 22, 17 15, 23.5 13 C 24 18, 23 21, 24 25 Z"
          fill="#A7F3D0"
          filter="url(#ks-shadow)"
        />

        {/* Krishi Sprout: Right Leaf */}
        <path
          d="M24 25 C 30 22, 31 15, 24.5 13 C 24 18, 25 21, 24 25 Z"
          fill="#6EE7B7"
          filter="url(#ks-shadow)"
        />

        {/* Center Golden Wheat Spikelet */}
        <path
          d="M24 26 L24 11"
          stroke="url(#ks-wheat-grad)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="24" cy="11" r="2" fill="#FDE047" />
        <circle cx="21.5" cy="14" r="1.5" fill="#FBBF24" />
        <circle cx="26.5" cy="14" r="1.5" fill="#FBBF24" />
        <circle cx="21.5" cy="18" r="1.5" fill="#FBBF24" />
        <circle cx="26.5" cy="18" r="1.5" fill="#FBBF24" />
      </svg>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className={textClassName}>Krishi Setu</span>
          <span className={subtextClassName}>कृषि सेतु • Bharat Agri</span>
        </div>
      )}
    </div>
  );
}
