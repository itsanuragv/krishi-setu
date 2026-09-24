"use client";

import React from "react";

interface IconProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

/**
 * Ultra-Bright Kisan AI Sparkle Icon
 * Combines an organic AI star with radiant solar gold, vivid cyan, and lush agricultural emerald gradients.
 */
export function KisanAIIcon({ className = "", size = 26, glow = true }: IconProps) {
  const gradId = React.useId();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 filter drop-shadow-[0_0_8px_rgba(250,204,21,0.7)] ${className}`}
    >
      <defs>
        <linearGradient id={`kisan-ai-grad-${gradId}`} x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFF04B" />
          <stop offset="25%" stopColor="#FF9900" />
          <stop offset="50%" stopColor="#00F5FF" />
          <stop offset="80%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#A855F7" />
        </linearGradient>
        {glow && (
          <filter id={`kisan-ai-glow-${gradId}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1.8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        )}
      </defs>

      {/* Orbiting Golden Satellite Sparkles */}
      <circle cx="19.5" cy="4.5" r="1.5" fill="#FFE600" className="animate-golden-twinkle" />
      <circle cx="4.5" cy="19.5" r="1.3" fill="#00F5FF" className="animate-golden-twinkle" />
      <circle cx="20" cy="19" r="1" fill="#10B981" className="animate-pulse" />

      {/* Radiant Organic 4-Point AI Star */}
      <path
        d="M12 2C12 7.52285 7.52285 12 2 12C7.52285 12 12 16.4771 12 22C12 16.4771 16.4771 12 22 12C16.4771 12 12 7.52285 12 2Z"
        fill={`url(#kisan-ai-grad-${gradId})`}
        filter={glow ? `url(#kisan-ai-glow-${gradId})` : undefined}
      />
      {/* Brilliant White Core Flare */}
      <circle cx="12" cy="12" r="2.2" fill="#FFFFFF" opacity="0.9" />
    </svg>
  );
}

export const GeminiSparkleIcon = KisanAIIcon;

/**
 * Super-Bright Neon Audio Frequency Waveform Visualizer
 * High-contrast, vivid neon bars clearly visible on any background!
 */
export function GeminiWaveform({
  active = false,
  variant = "gemini",
  className = "",
}: {
  active?: boolean;
  variant?: "gemini" | "listening" | "speaking";
  className?: string;
}) {
  const getGradient = (barIndex: number) => {
    if (variant === "listening") {
      // Fresh Emerald & Vivid Cyan for active listening (clean, high-tech, no red/orange)
      return barIndex % 2 === 0
        ? "bg-gradient-to-t from-emerald-500 via-teal-400 to-cyan-300 shadow-[0_0_8px_rgba(16,185,129,0.7)]"
        : "bg-gradient-to-t from-teal-500 via-cyan-400 to-emerald-200 shadow-[0_0_8px_rgba(6,182,212,0.7)]";
    }
    if (variant === "speaking") {
      // Vivid Electric Aqua & Lime
      return barIndex % 2 === 0
        ? "bg-gradient-to-t from-cyan-400 via-teal-300 to-emerald-200 shadow-[0_0_8px_rgba(34,211,238,0.8)]"
        : "bg-gradient-to-t from-emerald-400 via-lime-300 to-yellow-200 shadow-[0_0_8px_rgba(52,211,153,0.8)]";
    }
    // High-Vibrancy Rainbow Spectrum (Lime, Aqua, Violet, Gold)
    const grads = [
      "bg-gradient-to-t from-emerald-400 to-cyan-200 shadow-[0_0_8px_rgba(52,211,153,0.7)]",
      "bg-gradient-to-t from-cyan-400 to-sky-200 shadow-[0_0_8px_rgba(56,189,248,0.7)]",
      "bg-gradient-to-t from-amber-400 to-yellow-200 shadow-[0_0_8px_rgba(250,204,21,0.7)]",
      "bg-gradient-to-t from-fuchsia-400 to-pink-200 shadow-[0_0_8px_rgba(232,121,249,0.7)]",
    ];
    return grads[barIndex % grads.length];
  };

  return (
    <div className={`flex items-center gap-[3.5px] h-5 px-1 ${className}`}>
      <span
        className={`w-[3.5px] rounded-full transition-all duration-300 ${getGradient(0)} ${
          active ? "animate-eq-1" : "h-[7px] opacity-90"
        }`}
      />
      <span
        className={`w-[3.5px] rounded-full transition-all duration-300 ${getGradient(1)} ${
          active ? "animate-eq-2" : "h-[12px] opacity-100"
        }`}
      />
      <span
        className={`w-[3.5px] rounded-full transition-all duration-300 ${getGradient(2)} ${
          active ? "animate-eq-3" : "h-[16px] opacity-100"
        }`}
      />
      <span
        className={`w-[3.5px] rounded-full transition-all duration-300 ${getGradient(3)} ${
          active ? "animate-eq-4" : "h-[10px] opacity-90"
        }`}
      />
      {active && (
        <span
          className={`w-[3.5px] rounded-full transition-all duration-300 ${getGradient(0)} animate-eq-5`}
        />
      )}
    </div>
  );
}

export const KisanWaveform = GeminiWaveform;
