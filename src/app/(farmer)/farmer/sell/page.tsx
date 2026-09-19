"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import imageCompression from "browser-image-compression";
import { 
  Mic, 
  MicOff, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Camera, 
  RotateCcw 
} from "lucide-react";
import { createProductSchema, type CreateProductInput } from "@/lib/schemas/product";
import { productApi } from "@/features/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import { getSpeechRecognition, type SpeechRecognitionInstance, type SpeechRecognitionEvent, type SpeechRecognitionErrorEvent } from "@/lib/speech-types";

const STEPS = ["Details", "Grade & harvest", "Photos", "Review"];

export default function SellPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [step, setStep] = useState(0);
  const [photos, setPhotos] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isVoiceThinking, setIsVoiceThinking] = useState(false);
  const [voiceBannerMsg, setVoiceBannerMsg] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const form = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      crop: "",
      variety: "",
      quantityKg: 50,
      pricePerKg: 20,
      grade: "A",
      harvestDate: new Date().toISOString().slice(0, 10),
      description: "",
      district: "Nashik",
      photos: [],
    },
  });

  const values = form.watch();

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === "hi" ? "hi-IN" : "en-IN";
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore on restricted web views
    }
  }, [language]);

  const processVoiceListing = useCallback(async (text: string) => {
    setIsListening(false);
    setIsVoiceThinking(true);

    try {
      const res = await fetch("/api/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language: language === "hi" ? "hi-IN" : "en-IN" }),
      });

      const data = await res.json();
      const crop = data.cropData?.crop || "Tomatoes";
      const variety = data.cropData?.variety || "Desi Grade-A";
      const qty = data.cropData?.quantityKg || 50;
      const price = data.cropData?.pricePerKg || 35;

      form.setValue("crop", crop);
      form.setValue("variety", variety);
      form.setValue("quantityKg", qty);
      form.setValue("pricePerKg", price);
      form.setValue("description", `Freshly harvested ${crop} (${variety}). Listed via Kisan Voice Saathi.`);

      const spokenFeedback = language === "hi"
        ? `${qty} किलो ${crop} ₹${price} प्रति किलो ऑटो-फिल कर दिया गया है।`
        : `Auto-filled ${qty}kg ${crop} at ₹${price}/kg.`;

      setVoiceBannerMsg(spokenFeedback);
      speak(spokenFeedback);
      toast.success(spokenFeedback);
    } catch (err) {
      console.error("Voice listing parse error:", err);
      toast.error("Could not process voice input. Please try again.");
    } finally {
      setIsVoiceThinking(false);
    }
  }, [form, language, speak]);

  // Speech Recognition setup
  useEffect(() => {
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language === "hi" ? "hi-IN" : "en-IN";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const text = event.results[0][0].transcript;
      processVoiceListing(text);
    };

    recognition.onerror = (e: SpeechRecognitionErrorEvent) => {
      setIsListening(false);
      if (e.error !== "no-speech") {
        toast.error(`Mic Error: ${e.error}`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, [language, processVoiceListing]);

  function toggleMic() {
    if (!recognitionRef.current) {
      toast.error("Web Speech is not supported on this browser. Try the 1-click sample prompts below.");
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

  async function onFiles(files: FileList | null) {
    if (!files) return;
    const compressed: string[] = [];
    for (const file of Array.from(files).slice(0, 4)) {
      if (!file.type.startsWith("image/")) continue;
      if (file.size > 8 * 1024 * 1024) {
        toast.error("Image too large (max 8MB before compress)");
        continue;
      }
      const blob = await imageCompression(file, { maxSizeMB: 0.4, maxWidthOrHeight: 1280 });
      compressed.push(URL.createObjectURL(blob));
    }
    setPhotos((p) => [...p, ...compressed].slice(0, 6));
  }

  async function submit() {
    const parsed = createProductSchema.safeParse({ ...values, photos });
    if (!parsed.success) {
      toast.error("Please complete required fields");
      return;
    }
    try {
      await productApi.create(parsed.data);
      const confirmMsg = language === "hi" ? "आपकी फसल सफलतापूर्वक लिस्ट हो गई है।" : "Your crop listing is published successfully.";
      speak(confirmMsg);
      toast.success(confirmMsg);
      router.push("/farmer/dashboard");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not publish");
    }
  }

  const SAMPLE_SELL_PROMPTS = [
    "50 किलो टमाटर 40 रुपये किलो बेचना है",
    "100 किलो बासमती चावल 60 रुपये",
    "200 किलो नासिक लाल प्याज 24 रुपये",
  ];

  return (
    <div className="mx-auto max-w-lg space-y-5">
      {/* Header & Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">
            {language === "hi" ? "फसल लिस्ट करें" : "Sell Farm Produce"}
          </h1>
          <p className="text-xs text-muted-foreground">
            {language === "hi" ? "बोलकर या फॉर्म भरकर अपनी फसल दर्ज करें" : "Auto-fill using voice or enter crop parameters"}
          </p>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
          Voice First
        </span>
      </div>

      {/* Voice-First Auto-Fill Hero Card */}
      <div className="rounded-3xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
              <Sparkles className="size-4.5" />
            </div>
            <div>
              <p className="font-extrabold text-sm text-slate-900 leading-none">
                {language === "hi" ? "बोलकर ऑटो-फिल करें" : "Voice-to-Form Auto-Fill"}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {language === "hi" ? "फसल का नाम, मात्रा और भाव बोलें" : "Speak crop name, quantity & floor price"}
              </p>
            </div>
          </div>

          <Button
            type="button"
            onClick={toggleMic}
            className={`gap-2 text-xs font-bold rounded-xl h-11 px-4 shadow-sm transition-transform active:scale-95 ${
              isListening ? "bg-rose-600 hover:bg-rose-700 text-white" : "bg-emerald-600 hover:bg-emerald-700 text-white"
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="size-4 animate-pulse" />
                <span>सुन रहे हैं...</span>
              </>
            ) : isVoiceThinking ? (
              <>
                <RotateCcw className="size-4 animate-spin" />
                <span>AI सोच रहा है...</span>
              </>
            ) : (
              <>
                <Mic className="size-4" />
                <span>माइक चालू करें</span>
              </>
            )}
          </Button>
        </div>

        {/* Live Spoken Voice Banner */}
        {voiceBannerMsg && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-100/80 p-2.5 text-xs font-semibold text-emerald-900 border border-emerald-300 animate-in fade-in">
            <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
            <span>{voiceBannerMsg}</span>
          </div>
        )}

        {/* 1-Click Voice Presets */}
        <div className="space-y-1 pt-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            या एक क्लिक में टेस्ट करें (Sample prompts):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {SAMPLE_SELL_PROMPTS.map((promptText, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => processVoiceListing(promptText)}
                className="rounded-lg border border-emerald-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors shadow-2xs"
              >
                🎙️ {promptText}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Steps Indicator */}
      <ol className="flex gap-2 text-xs">
        {STEPS.map((label, i) => (
          <li
            key={label}
            className={`flex-1 rounded-full px-2 py-1 text-center font-bold text-[11px] transition-colors ${
              i === step ? "bg-primary text-primary-foreground shadow-xs" : "bg-muted text-muted-foreground"
            }`}
          >
            {label}
          </li>
        ))}
      </ol>

      {/* Wizard Form Card */}
      <Card className="rounded-3xl border border-slate-200 shadow-sm">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-base font-bold flex items-center justify-between">
            <span>Step {step + 1}: {STEPS[step]}</span>
            <span className="text-xs text-muted-foreground font-normal">
              {step === 0 && "Crop parameters"}
              {step === 1 && "Quality grade"}
              {step === 2 && "Produce photos"}
              {step === 3 && "Final submission"}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          {step === 0 && (
            <>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Crop Name (फसल का नाम)</Label>
                <Input {...form.register("crop")} placeholder="e.g. Tomato, Rice, Wheat" className="rounded-xl h-11" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Variety (किस्म)</Label>
                <Input {...form.register("variety")} placeholder="e.g. Desi Hybrid, Basmati" className="rounded-xl h-11" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Quantity (kg)</Label>
                  <Input type="number" {...form.register("quantityKg")} className="rounded-xl h-11" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Floor Price (₹ / kg)</Label>
                  <Input type="number" {...form.register("pricePerKg")} className="rounded-xl h-11" />
                </div>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Quality Grade</Label>
                <select className="h-11 w-full rounded-xl border border-input bg-card px-3 text-sm font-medium" {...form.register("grade")}>
                  <option value="A">Grade A — Premium Export Quality</option>
                  <option value="B">Grade B — Standard Retail Mandi</option>
                  <option value="C">Grade C — Processing & Puree</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Harvest Date</Label>
                <Input type="date" {...form.register("harvestDate")} className="rounded-xl h-11" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Farm District / Cluster</Label>
                <Input {...form.register("district")} placeholder="Pune / Nashik" className="rounded-xl h-11" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Notes / Freshness description</Label>
                <Textarea {...form.register("description")} rows={3} className="rounded-xl resize-none" />
              </div>
            </>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <Label className="text-xs font-bold text-slate-700">Produce Verification Photos (Max 4)</Label>
              <p className="text-xs text-muted-foreground">
                Photos are compressed automatically on your device before upload to save mobile data.
              </p>
              <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/40 p-6 text-center cursor-pointer hover:bg-emerald-50 transition-colors">
                <Camera className="size-8 text-emerald-600 mb-1" />
                <span className="text-xs font-bold text-emerald-800">Take Live Photo or Upload</span>
                <span className="text-[11px] text-slate-500">Auto-compressed at edge</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => onFiles(e.target.files)} />
              </label>
              {photos.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {photos.map((u, i) => (
                    <div key={i} className="relative aspect-video rounded-xl overflow-hidden border border-slate-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={u} alt="" className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3 rounded-2xl bg-slate-50 p-4 border border-slate-200/80 text-xs">
              <p className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-2">Listing Summary</p>
              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <div>
                  <span className="text-slate-400 block">Crop:</span>
                  <strong className="text-slate-900">{values.crop || "—"}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Variety:</span>
                  <strong className="text-slate-900">{values.variety || "—"}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Quantity:</span>
                  <strong className="text-slate-900">{values.quantityKg} kg</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Price / kg:</span>
                  <strong className="text-emerald-700 font-bold">₹{values.pricePerKg}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Grade:</span>
                  <strong className="text-slate-900">Grade {values.grade}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">District:</span>
                  <strong className="text-slate-900">{values.district}</strong>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex justify-between pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={step === 0}
              onClick={() => setStep((s) => s - 1)}
              className="text-xs rounded-xl"
            >
              Previous
            </Button>
            {step < STEPS.length - 1 ? (
              <Button
                type="button"
                size="sm"
                onClick={() => setStep((s) => s + 1)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs gap-1 rounded-xl font-bold"
              >
                <span>Next Step</span>
                <ArrowRight className="size-3.5" />
              </Button>
            ) : (
              <Button
                type="button"
                size="sm"
                onClick={submit}
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Publish Listing
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
