"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Mic, MicOff, Search, Sparkles } from "lucide-react";
import { productApi } from "@/features/api";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatInr, formatKg } from "@/lib/utils";
import { toast } from "sonner";
import { getSpeechRecognition, type SpeechRecognitionInstance, type SpeechRecognitionEvent } from "@/lib/speech-types";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [crop, setCrop] = useState(initialQuery);
  const [maxPrice, setMaxPrice] = useState("");
  const [grade, setGrade] = useState("");
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    if (initialQuery) {
      setCrop(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "hi-IN";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const text = event.results[0][0].transcript;
      const clean = text.replace(/(?:dhundo|khojo|chahiye|dikhao|search|buy)/gi, "").trim();
      setCrop(clean);
      toast.success(`Voice Search: "${clean}"`);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  function toggleVoiceSearch() {
    if (!recognitionRef.current) {
      toast.error("Speech recognition not supported in this browser. Please type your query.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        recognitionRef.current.stop();
        setIsListening(false);
      }
    }
  }

  const query = useQuery({
    queryKey: ["products", crop, maxPrice, grade],
    queryFn: () =>
      productApi.list({
        ...(crop ? { crop } : {}),
        ...(maxPrice ? { maxPrice } : {}),
        ...(grade ? { grade } : {}),
      }),
  });

  const items = query.data?.items ?? [];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Marketplace Search</h1>
          <p className="text-xs text-muted-foreground">Find verified farm-gate produce by voice or keywords</p>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 flex items-center gap-1">
          <Sparkles className="size-3 text-emerald-600" />
          Voice Enabled
        </span>
      </div>

      {/* Voice-First Search Input Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <Input 
            placeholder="Search crop name (e.g. Tomato, Rice, Onion) or tap mic..." 
            value={crop} 
            onChange={(e) => setCrop(e.target.value)}
            className="pl-10 pr-12 h-12 rounded-2xl border-slate-300 focus:border-emerald-600 shadow-xs text-sm" 
          />
          <button
            type="button"
            onClick={toggleVoiceSearch}
            className={`absolute right-2 top-1/2 -translate-y-1/2 flex size-8 items-center justify-center rounded-xl transition-all ${
              isListening ? "bg-rose-600 text-white animate-pulse" : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
            }`}
            title="Voice Search (बोलकर खोजें)"
          >
            {isListening ? <MicOff className="size-4" /> : <Mic className="size-4" />}
          </button>
        </div>
      </div>

      {/* Secondary Filter Controls */}
      <div className="grid gap-2 sm:grid-cols-2">
        <Input 
          placeholder="Max Price (₹ / kg)" 
          inputMode="numeric" 
          value={maxPrice} 
          onChange={(e) => setMaxPrice(e.target.value)} 
          className="h-11 rounded-xl"
        />
        <select
          className="h-11 rounded-xl border border-input bg-card px-3 text-sm"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
        >
          <option value="">Any quality grade</option>
          <option value="A">Grade A (Premium)</option>
          <option value="B">Grade B (Standard)</option>
          <option value="C">Grade C (Commercial)</option>
        </select>
      </div>

      {/* Results Count Badge */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
        <span>Showing {items.length} verified listings</span>
        {crop && (
          <span className="font-semibold text-emerald-700">
            Filtered by: &ldquo;{crop}&rdquo;
          </span>
        )}
      </div>

      {/* Produce Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <Link key={p.id} href={`/consumer/product/${p.id}`} className="group">
            <Card className="h-full overflow-hidden rounded-2xl border-slate-200 hover:border-emerald-300 transition-all shadow-xs group-hover:shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.photos[0] || "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600"} alt="" className="h-40 w-full object-cover group-hover:scale-102 transition-transform" />
              <CardContent className="space-y-1.5 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-extrabold text-slate-900 text-base">{p.crop}</p>
                  <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-none font-bold">
                    Grade {p.grade}
                  </Badge>
                </div>
                <p className="text-sm font-semibold text-emerald-700">
                  {formatInr(p.pricePerKg)}/kg • <span className="text-slate-500 font-normal">{formatKg(p.availableKg)} available</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {p.location.district} • Trust Score: {p.farmerTrustScore}/100
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
