"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

interface VoiceFabProps {
  onResult: (transcript: string) => void;
  hint?: string;
  className?: string;
}

/**
 * VoiceFab — giant mic button for illiterate-first input.
 * Uses Web Speech API when available; falls back to a simulated
 * dictation tick (demo mode) otherwise.
 */
export function VoiceFab({ onResult, hint, className }: VoiceFabProps) {
  const { t, language } = useLanguage();
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const recRef = useRef<{ stop: () => void } | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const w = window as unknown as Record<string, unknown>;
    setSupported(!!(w.SpeechRecognition || w.webkitSpeechRecognition));
    return () => {
      try {
        recRef.current?.stop();
      } catch {
        /* noop */
      }
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const stop = useCallback(() => {
    try {
      recRef.current?.stop();
    } catch {
      /* noop */
    }
    if (timerRef.current) clearTimeout(timerRef.current);
    setListening(false);
  }, []);

  const start = useCallback(() => {
    if (listening) {
      stop();
      return;
    }
    const w = window as unknown as Record<string, new () => any>;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) {
      // Demo fallback: pretend to listen, then return empty (caller may open manual form)
      setListening(true);
      timerRef.current = setTimeout(() => {
        setListening(false);
        onResult("");
      }, 1500);
      return;
    }
    const rec = new SR();
    rec.lang = language === "hi" ? "hi-IN" : "en-IN";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e: { results: { [i: number]: { [j: number]: { transcript: string } } } }) => {
      onResult(e.results[0][0].transcript as string);
      setListening(false);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recRef.current = rec;
    setListening(true);
    try {
      rec.start();
    } catch {
      setListening(false);
    }
  }, [language, listening, onResult, stop]);

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <button
        type="button"
        onClick={start}
        aria-label={t("kit_voice_sell")}
        className={cn(
          "relative flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-full text-white shadow-lg transition-transform active:scale-95",
          "bg-[var(--portal)] hover:bg-[var(--portal-dark)]",
          listening && "animate-pulse"
        )}
      >
        {listening && (
          <span className="absolute inset-0 rounded-full bg-[var(--portal)] opacity-40 animate-ping" />
        )}
        <Mic className="relative h-10 w-10 sm:h-12 sm:w-12" strokeWidth={2.2} />
      </button>
      <span className="text-sm font-bold font-heading text-[#1F2937]">
        {listening ? t("kit_voice_listening") : t("kit_voice_sell")}
      </span>
      {(hint || !supported) && (
        <span className="text-xs text-[#6B7280] text-center max-w-[220px]">
          {hint ?? t("kit_voice_not_supported")}
        </span>
      )}
    </div>
  );
}
