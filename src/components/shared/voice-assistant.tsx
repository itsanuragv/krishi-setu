"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Languages, 
  Sparkles, 
  X, 
  Bot 
} from "lucide-react";
import { toast } from "sonner";
import { 
  getSpeechRecognition, 
  type SpeechRecognitionInstance, 
  type SpeechRecognitionEvent, 
  type SpeechRecognitionErrorEvent 
} from "@/lib/speech-types";

export function VoiceAssistant() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [language, setLanguage] = useState<"hi-IN" | "en-IN">("hi-IN");
  const [audioFeedbackEnabled, setAudioFeedbackEnabled] = useState(true);
  const [transcript, setTranscript] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  // Speech synthesis (TTS)
  const speak = useCallback((text: string, lang: "hi-IN" | "en-IN") => {
    if (!audioFeedbackEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore audio synthesis errors on restricted environments
    }
  }, [audioFeedbackEnabled]);

  // Process speech using Gemini AI endpoint
  const processWithGeminiAI = useCallback(async (inputText: string) => {
    setIsListening(false);
    setIsThinking(true);

    try {
      const res = await fetch("/api/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText, language }),
      });

      if (!res.ok) {
        throw new Error("Failed to process speech");
      }

      const data = await res.json();
      setAiResponse(data.spokenResponse);
      speak(data.spokenResponse, language);

      // Execute actionable intent
      if (data.intent === "LIST_CROP" && data.route) {
        toast.success(`Gemini AI: ${data.spokenResponse}`);
        setTimeout(() => {
          router.push(data.route);
          setIsOpen(false);
        }, 1200);
      } else if (data.intent === "SEARCH_PRODUCE") {
        const query = data.searchQuery?.query || "";
        toast.success(`Searching: ${query}`);
        setTimeout(() => {
          router.push(query ? `/consumer/search?q=${encodeURIComponent(query)}` : "/consumer");
          setIsOpen(false);
        }, 1200);
      } else if (data.intent === "NAVIGATE" && data.route) {
        setTimeout(() => {
          router.push(data.route);
          setIsOpen(false);
        }, 1000);
      }
    } catch (err) {
      console.error("Gemini voice processing error:", err);
      const fallbackMsg = language === "hi-IN" ? "आदेश समझा गया।" : "Command received.";
      setAiResponse(fallbackMsg);
      speak(fallbackMsg, language);
    } finally {
      setIsThinking(false);
    }
  }, [language, router, speak]);

  // Listen for custom trigger event from navbar or any page button
  useEffect(() => {
    function handleOpenEvent() {
      setIsOpen(true);
    }
    window.addEventListener("open-voice-assistant", handleOpenEvent);
    return () => {
      window.removeEventListener("open-voice-assistant", handleOpenEvent);
    };
  }, []);

  // Initialize SpeechRecognition
  useEffect(() => {
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      processWithGeminiAI(text);
    };

    recognition.onerror = (e: SpeechRecognitionErrorEvent) => {
      setIsListening(false);
      if (e.error !== "no-speech") {
        toast.error(`Voice Error: ${e.error}`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [language, processWithGeminiAI]);

  // Toggle Voice Capture
  function toggleListening() {
    if (!recognitionRef.current) {
      toast.error("Web Speech Recognition is not supported by your browser. Please use Google Chrome or Edge, or select from sample prompts.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript("");
      setAiResponse(null);
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        recognitionRef.current.stop();
        setIsListening(false);
      }
    }
  }

  const SAMPLE_VOICE_COMMANDS = [
    {
      label: "फसल बेचें (List Produce)",
      text: "50 किलो टमाटर 40 रुपये किलो बेचना है",
      icon: "🌾",
    },
    {
      label: "ताजा सब्जी खोजें (Find Produce)",
      text: "नासिक के ताज़ा प्याज दिखाओ",
      icon: "🛒",
    },
    {
      label: "किसान पोर्टल (Farmer Dashboard)",
      text: "किसान पोर्टल खोलो",
      icon: "📊",
    },
    {
      label: "डिलीवरी फ्लीट (Delivery Fleet)",
      text: "डिलीवरी रूट और पिन वेरिफिकेशन दिखाओ",
      icon: "🚚",
    },
  ];

  return (
    <>
      {/* Global Persistent Floating Microphone Trigger */}
      <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 flex items-center gap-2 animate-in fade-in duration-300">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open Kisan Voice Assistant"
          className="group relative flex size-14 items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-xl hover:scale-105 active:scale-95 transition-transform touch-target border-2 border-white/80"
          title="Kisan Voice Saathi (किसान वाणी)"
        >
          {/* Subtle pulse ripple */}
          <span className="absolute -inset-1 rounded-full bg-emerald-500/30 animate-ping pointer-events-none" />
          <Mic className="size-6 text-white group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-amber-400 text-[9px] font-black text-slate-900 border border-white">
            AI
          </span>
        </button>
      </div>

      {/* Voice Assistant Sheet / Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 sm:p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl border border-emerald-200 bg-white p-5 sm:p-7 shadow-2xl space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md">
                  <Bot className="size-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                      Kisan Voice Saathi (किसान वाणी)
                    </h2>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                      Gemini AI Voice
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Speak naturally in Hindi or English to list, search, or navigate
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* Audio readout mute/unmute toggle */}
                <button
                  type="button"
                  onClick={() => setAudioFeedbackEnabled((v) => !v)}
                  title={audioFeedbackEnabled ? "Mute audio response" : "Enable voice audio"}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                >
                  {audioFeedbackEnabled ? (
                    <Volume2 className="size-4.5 text-emerald-600" />
                  ) : (
                    <VolumeX className="size-4.5 text-slate-400" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            {/* Language Selector */}
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2 border border-slate-200/80 text-xs">
              <span className="text-slate-600 font-semibold px-2 flex items-center gap-1.5">
                <Languages className="size-3.5 text-emerald-600" />
                Voice Language:
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setLanguage("hi-IN")}
                  className={`rounded-lg px-3 py-1 font-bold transition-all ${
                    language === "hi-IN"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  हिन्दी (Hindi)
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("en-IN")}
                  className={`rounded-lg px-3 py-1 font-bold transition-all ${
                    language === "en-IN"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            {/* Central Interactive Microphone & Soundwave Visualizer */}
            <div className="flex flex-col items-center justify-center py-4 space-y-4">
              <div className="relative flex items-center justify-center">
                {/* Active Ripple rings */}
                {isListening && (
                  <>
                    <span className="absolute size-28 rounded-full bg-emerald-400/20 animate-ping pointer-events-none" />
                    <span className="absolute size-24 rounded-full bg-emerald-500/30 animate-pulse pointer-events-none" />
                  </>
                )}
                {isThinking && (
                  <span className="absolute size-24 rounded-full border-4 border-amber-400 border-t-transparent animate-spin pointer-events-none" />
                )}

                <button
                  type="button"
                  onClick={toggleListening}
                  className={`relative flex size-20 items-center justify-center rounded-full text-white shadow-2xl transition-transform active:scale-95 ${
                    isListening
                      ? "bg-rose-600 hover:bg-rose-700"
                      : isThinking
                      ? "bg-amber-600"
                      : "bg-emerald-600 hover:bg-emerald-700"
                  }`}
                >
                  {isListening ? (
                    <MicOff className="size-8 animate-pulse" />
                  ) : (
                    <Mic className="size-8" />
                  )}
                </button>
              </div>

              <div className="text-center space-y-1">
                <p className="text-xs font-bold text-slate-800">
                  {isListening
                    ? "सुन रहे हैं... कृपया बोलें (Listening... Speak now)"
                    : isThinking
                    ? "Gemini AI सोच रहा है... (AI Processing...)"
                    : "माइक बटन दबाएं और बोलें (Tap mic to speak)"}
                </p>
                <p className="text-[11px] text-slate-500">
                  Powered by Google AI Studio Gemini 1.5 Flash
                </p>
              </div>
            </div>

            {/* Transcript & AI Response Card */}
            {(transcript || aiResponse) && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 space-y-2 text-xs">
                {transcript && (
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      You Said:
                    </span>
                    <p className="font-semibold text-slate-900 mt-0.5">&ldquo;{transcript}&rdquo;</p>
                  </div>
                )}
                {aiResponse && (
                  <div className="border-t border-emerald-200/60 pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                      <Sparkles className="size-3 text-emerald-600" />
                      Gemini Voice Reply:
                    </span>
                    <p className="font-bold text-emerald-950 mt-0.5">{aiResponse}</p>
                  </div>
                )}
              </div>
            )}

            {/* Quick 1-Click Sample Speech Utterances */}
            <div className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                या सीधे इन आदेशों को टेस्ट करें (Or test sample commands):
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SAMPLE_VOICE_COMMANDS.map((cmd, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setTranscript(cmd.text);
                      processWithGeminiAI(cmd.text);
                    }}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2.5 text-left text-xs text-slate-700 hover:bg-emerald-50 hover:border-emerald-200 transition-colors shadow-xs"
                  >
                    <span className="text-base">{cmd.icon}</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-900 truncate leading-tight">{cmd.label}</p>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">&ldquo;{cmd.text}&rdquo;</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
