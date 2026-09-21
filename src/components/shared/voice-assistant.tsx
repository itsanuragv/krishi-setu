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
  ArrowRight,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { toast } from "sonner";
import { 
  getSpeechRecognition, 
  type SpeechRecognitionInstance, 
  type SpeechRecognitionEvent, 
  type SpeechRecognitionErrorEvent 
} from "@/lib/speech-types";

interface CropListingData {
  crop: string;
  variety: string;
  quantityKg: number;
  pricePerKg: number;
  unit: string;
}

// Play pleasant Google-style chimes via Web Audio API without external assets
function playAssistantChime(type: "start" | "reply" | "stop") {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    
    if (type === "start") {
      // Soft ascending chime: C5 (523Hz) -> E5 (659Hz)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.14);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === "reply") {
      // Gemini ready chime: G5 (784Hz) -> C6 (1046Hz)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      gain.gain.setValueAtTime(0.09, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.frequency.setValueAtTime(783.99, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.16);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.36);
    }
  } catch {
    // Ignore audio context restrictions
  }
}

// Find optimal native voice for Hindi/English
function getBestVoice(lang: "hi-IN" | "en-IN"): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  if (lang === "hi-IN") {
    const hiVoice = voices.find(v => 
      v.lang.toLowerCase().startsWith("hi") && 
      (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Swara") || v.name.includes("Madhur"))
    );
    if (hiVoice) return hiVoice;
    const genericHi = voices.find(v => v.lang.toLowerCase().startsWith("hi"));
    if (genericHi) return genericHi;
  }

  const enIndian = voices.find(v => 
    v.lang.toLowerCase().includes("en-in") || 
    v.name.includes("Neerja") || 
    v.name.includes("Prabhat")
  );
  if (enIndian) return enIndian;

  const enNatural = voices.find(v => 
    v.lang.toLowerCase().startsWith("en") && 
    (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Jenny"))
  );
  return enNatural || voices[0] || null;
}

export function VoiceAssistant() {
  const router = useRouter();
  
  // UI States
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [language, setLanguage] = useState<"hi-IN" | "en-IN">("hi-IN");
  const [audioFeedbackEnabled, setAudioFeedbackEnabled] = useState(true);

  // Transcripts & Assistant Feedback
  const [interimTranscript, setInterimTranscript] = useState("");
  const [lastUserQuery, setLastUserQuery] = useState("");
  const [latestResponse, setLatestResponse] = useState<string>(
    "नमस्ते! मैं आपका कृषि सेतु असिस्टेंट हूँ। फसल बेचने, खरीदने या भाव जानने के लिए नीचे दिए सुझाव चुनें या बोलें।"
  );

  // Listing Confirmation Workflow (Yes / No)
  const [pendingListing, setPendingListing] = useState<CropListingData | null>(null);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isProcessingRef = useRef(false);

  // Stop speaking immediately
  const stopSpeaking = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // Voice synthesis with safety: never listen while speaking!
  const speak = useCallback((text: string, lang: "hi-IN" | "en-IN", onComplete?: () => void) => {
    // 1. Force stop microphone before speaking so assistant does NOT hear itself!
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort?.();
      } catch {
        // Ignore abort error
      }
    }
    setIsListening(false);

    if (!audioFeedbackEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) {
      if (onComplete) onComplete();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 1.0;
      utterance.pitch = 1.02;

      const chosenVoice = getBestVoice(lang);
      if (chosenVoice) {
        utterance.voice = chosenVoice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        // Note: NEVER auto-restart speech recognition here to prevent endless loop!
        if (onComplete) onComplete();
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        if (onComplete) onComplete();
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      setIsSpeaking(false);
      if (onComplete) onComplete();
    }
  }, [audioFeedbackEnabled]);

  // Complete cleanup on dismiss / close
  const handleClose = useCallback(() => {
    stopSpeaking();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort?.();
      } catch {
        // Ignore
      }
    }
    setIsListening(false);
    setIsSpeaking(false);
    setIsThinking(false);
    setInterimTranscript("");
    setPendingListing(null);
    setIsOpen(false);
  }, [stopSpeaking]);

  // Confirm pending produce listing (Yes)
  const handleConfirmListing = useCallback(() => {
    if (!pendingListing) return;
    
    stopSpeaking();
    const dataToSave = { ...pendingListing };
    setPendingListing(null);

    // Save to sessionStorage so it loads if navigating
    if (typeof window !== "undefined") {
      sessionStorage.setItem("krishi_pending_voice_crop", JSON.stringify(dataToSave));
      // Dispatch real-time custom event for already open pages
      window.dispatchEvent(new CustomEvent("krishi-voice-list-crop", { detail: dataToSave }));
    }

    const successMsg = language === "hi-IN"
      ? `आपकी ${dataToSave.quantityKg} ${dataToSave.unit} ${dataToSave.crop} की लिस्टिंग सफलतापूर्वक दर्ज कर दी गई है!`
      : `Your listing for ${dataToSave.quantityKg} ${dataToSave.unit} ${dataToSave.crop} is confirmed!`;

    setLatestResponse(successMsg);
    toast.success(successMsg);
    speak(successMsg, language);

    // Navigate to farmer page if not already there
    if (typeof window !== "undefined" && !window.location.pathname.startsWith("/farmer")) {
      router.push("/farmer");
    }
  }, [pendingListing, language, router, speak, stopSpeaking]);

  // Cancel pending produce listing (No)
  const handleCancelListing = useCallback(() => {
    setPendingListing(null);
    stopSpeaking();
    const cancelMsg = language === "hi-IN" 
      ? "लिस्टिंग रद्द कर दी गई है। आप अन्य कोई सहायता पूछ सकते हैं।" 
      : "Listing cancelled. How else can I help?";
    setLatestResponse(cancelMsg);
    toast.info("लिस्टिंग रद्द की गई (Listing Cancelled)");
    speak(cancelMsg, language);
  }, [language, speak, stopSpeaking]);

  // Process text with Gemini API
  const processWithGemini = useCallback(async (userText: string) => {
    const trimmed = userText.trim();
    if (!trimmed || isProcessingRef.current) return;
    isProcessingRef.current = true;

    // Immediately stop listening & stop speaking
    stopSpeaking();
    if (recognitionRef.current) {
      try { recognitionRef.current.abort?.(); } catch {}
    }
    setIsListening(false);
    setInterimTranscript("");
    setLastUserQuery(trimmed);
    setIsThinking(true);
    setIsOpen(true); // Ensure suggestion bubble is visible

    // 1. Check if user is responding to pending confirmation (Yes / No)
    if (pendingListing) {
      const lower = trimmed.toLowerCase();
      // Affirmative keywords (Hindi & English)
      if (/हाँ|हा|yes|yeah|sure|confirm|kar do|kar dijiye|list karo|sahi hai|theek hai/i.test(lower)) {
        isProcessingRef.current = false;
        setIsThinking(false);
        handleConfirmListing();
        return;
      }
      // Negative keywords
      if (/नहीं|ना|no|cancel|radd|mat karo|rehne do|reject/i.test(lower)) {
        isProcessingRef.current = false;
        setIsThinking(false);
        handleCancelListing();
        return;
      }
    }

    try {
      const res = await fetch("/api/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: trimmed,
          language,
        }),
      });

      if (!res.ok) throw new Error("Voice endpoint failed");

      const data = await res.json();
      playAssistantChime("reply");

      // 2. If intent is LIST_CROP, require explicit Yes/No confirmation!
      if (data.intent === "LIST_CROP" && data.cropData) {
        setPendingListing(data.cropData);
        const confirmPrompt = language === "hi-IN"
          ? `क्या आप ${data.cropData.quantityKg} ${data.cropData.unit} ${data.cropData.crop} ₹${data.cropData.pricePerKg} प्रति ${data.cropData.unit} लिस्ट करना चाहते हैं?`
          : `Do you want to confirm listing ${data.cropData.quantityKg} ${data.cropData.unit} ${data.cropData.crop} at ₹${data.cropData.pricePerKg} per ${data.cropData.unit}?`;
        
        setLatestResponse(confirmPrompt);
        speak(confirmPrompt, language);
      } else {
        // Normal conversational or informational response
        const responseText = data.spokenResponse || "जानकारी प्राप्त हो गई है।";
        setLatestResponse(responseText);
        speak(responseText, language);

        // If intent is navigate/search, execute route if requested
        if (data.intent === "SEARCH_PRODUCE" && data.route) {
          toast.success(`खोज रहे हैं: ${data.searchQuery?.query || trimmed}`);
          router.push(data.route);
        } else if (data.intent === "NAVIGATE" && data.route) {
          router.push(data.route);
        }
      }
    } catch (err) {
      console.error("Gemini voice error:", err);
      const fallbackReply = language === "hi-IN" 
        ? "जी, आपका संदेश मिल गया है। आप क्या पूछना चाहते हैं?" 
        : "Message received. How can I assist you?";
      setLatestResponse(fallbackReply);
      speak(fallbackReply, language);
    } finally {
      setIsThinking(false);
      isProcessingRef.current = false;
    }
  }, [language, pendingListing, handleConfirmListing, handleCancelListing, router, speak, stopSpeaking]);

  // Initialize SpeechRecognition with continuous = false (SINGLE UTTERANCE ONLY)
  useEffect(() => {
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    // CRITICAL: continuous MUST be false so it doesn't stay open in the background!
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      let final = "";

      const startIndex = event.resultIndex ?? 0;
      for (let i = startIndex; i < event.results.length; ++i) {
        const item = event.results[i];
        if (item.isFinal) {
          final += item[0].transcript;
        } else {
          interim += item[0].transcript;
        }
      }

      if (interim) {
        setInterimTranscript(interim);
      }

      if (final) {
        setInterimTranscript("");
        // Immediately abort recognition on final phrase
        try {
          recognition.abort?.();
        } catch {
          // Ignore
        }
        setIsListening(false);
        processWithGemini(final);
      }
    };

    recognition.onerror = (e: SpeechRecognitionErrorEvent) => {
      setIsListening(false);
      if (e.error !== "no-speech" && e.error !== "aborted") {
        toast.error(`Mic: ${e.error}`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    const activeSilenceTimer = silenceTimerRef.current;
    return () => {
      try {
        recognition.abort?.();
      } catch {
        // Ignore
      }
      if (activeSilenceTimer) clearTimeout(activeSilenceTimer);
    };
  }, [language, processWithGemini]);

  // External trigger event (e.g. from buttons on the page)
  useEffect(() => {
    function handleOpenEvent() {
      setIsOpen(true);
    }
    window.addEventListener("open-voice-assistant", handleOpenEvent);
    return () => {
      window.removeEventListener("open-voice-assistant", handleOpenEvent);
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort?.();
        } catch {
          // Ignore
        }
      }
    };
  }, []);

  // Toggle voice recognition
  function toggleListening() {
    stopSpeaking();

    if (!recognitionRef.current) {
      toast.error("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current.abort?.();
      } catch {
        // Ignore
      }
      setIsListening(false);
      if (interimTranscript) {
        processWithGemini(interimTranscript);
      }
    } else {
      setIsOpen(true);
      setInterimTranscript("");
      try {
        playAssistantChime("start");
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        try {
          recognitionRef.current.abort?.();
        } catch {
          // Ignore
        }
        setIsListening(false);
      }
    }
  }

  // Switch language
  function handleLanguageChange(newLang: "hi-IN" | "en-IN") {
    setLanguage(newLang);
    const msg = newLang === "hi-IN"
      ? "भाषा हिन्दी पर सेट हो गई है।"
      : "Language set to English.";
    setLatestResponse(msg);
    speak(msg, newLang);
  }

  // Curated Main Text Suggestions
  const suggestions = [
    { text: "50 किलो टमाटर ₹40/kg बेचना है", label: "🍅 50kg टमाटर बेचें" },
    { text: "आज के नासिक प्याज के मंडी भाव क्या हैं?", label: "🧅 प्याज के मंडी भाव" },
    { text: "गेहूं का न्यूनतम समर्थन मूल्य (MSP) बताएं", label: "🌾 गेहूं MSP भाव" },
    { text: "किसान पोर्टल खोलें", label: "🚜 किसान पोर्टल" },
    { text: "ताजा हरी मिर्च खोजें", label: "🛒 हरी मिर्च खोजें" },
    { text: "फसल में कीट लगने पर क्या करें?", label: "🌿 कीट रोकथाम सलाह" },
  ];

  return (
    <>
      {/* 1. DOCKED SUGGESTIONS BUBBLE (Appears directly ABOVE the floating button, NO full-screen modal) */}
      {isOpen && (
        <div 
          className="fixed bottom-36 md:bottom-22 right-4 sm:right-6 z-40 w-[350px] sm:w-[390px] max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-700/80 bg-slate-950/95 backdrop-blur-xl shadow-2xl text-white p-4 animate-in fade-in slide-in-from-bottom-3 duration-200"
          role="region"
          aria-label="Kisan Setu Voice Assistant Suggestions"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 text-slate-950 shadow-xs">
                <Sparkles className="size-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5 leading-none">
                  Gemini Live <span className="text-emerald-400">किसान वाणी</span>
                  <span className="inline-block size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </h3>
                <p className="text-[10px] text-slate-400 leading-none mt-1">
                  Bharat Vernacular Agri AI
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Language Switch */}
              <button
                type="button"
                onClick={() => handleLanguageChange(language === "hi-IN" ? "en-IN" : "hi-IN")}
                className="rounded-full px-2 py-0.5 text-[10px] font-semibold bg-slate-800/90 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 transition-colors flex items-center gap-1"
                title="Change Voice Language"
              >
                <Languages className="size-2.5 text-cyan-400" />
                <span>{language === "hi-IN" ? "हिन्दी" : "Eng"}</span>
              </button>

              {/* Audio Mute/Unmute */}
              <button
                type="button"
                onClick={() => {
                  if (isSpeaking) stopSpeaking();
                  setAudioFeedbackEnabled(v => !v);
                }}
                className="rounded-full p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title={audioFeedbackEnabled ? "आवाज़ बंद करें (Mute)" : "आवाज़ चालू करें (Unmute)"}
              >
                {audioFeedbackEnabled ? (
                  <Volume2 className="size-3.5 text-cyan-400" />
                ) : (
                  <VolumeX className="size-3.5 text-rose-400" />
                )}
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={handleClose}
                className="rounded-full p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="सुझाव बंद करें (Close)"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {/* Assistant Speech / Real-time Status Card */}
          <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-3 mb-3 text-xs space-y-2">
            {/* User query if any */}
            {lastUserQuery && (
              <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                <span>आप: &ldquo;{lastUserQuery}&rdquo;</span>
              </div>
            )}

            {/* Interim listening transcript */}
            {isListening && (
              <div className="flex items-center gap-2 text-rose-300 font-medium animate-pulse">
                <span className="size-2 rounded-full bg-rose-500 animate-ping" />
                <span>{interimTranscript ? `"${interimTranscript}..."` : "बोलिए, सुन रहे हैं..."}</span>
              </div>
            )}

            {/* Thinking indicator */}
            {isThinking && (
              <div className="flex items-center gap-2 text-cyan-300 font-medium animate-pulse">
                <Sparkles className="size-3.5 animate-spin" />
                <span>Gemini विचार कर रहा है...</span>
              </div>
            )}

            {/* Speaking / Latest response */}
            {!isListening && !isThinking && (
              <div className="text-slate-200 text-xs leading-relaxed">
                {latestResponse}
              </div>
            )}

            {/* Speaking equalizer & stop button */}
            {isSpeaking && (
              <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[11px]">
                <div className="flex items-center gap-1 text-cyan-400">
                  <span className="w-1 h-3 bg-cyan-400 rounded-full animate-bounce" />
                  <span className="w-1 h-4 bg-emerald-400 rounded-full animate-bounce delay-75" />
                  <span className="w-1 h-2 bg-indigo-400 rounded-full animate-bounce delay-150" />
                  <span className="text-[10px] text-slate-400 ml-1">बोल रहा है</span>
                </div>
                <button
                  type="button"
                  onClick={stopSpeaking}
                  className="text-[10px] font-bold text-rose-400 hover:text-rose-300 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800/80 transition-colors"
                >
                  रोकें (Stop)
                </button>
              </div>
            )}
          </div>

          {/* 2. CROP LISTING CONFIRMATION CARD (Yes / No confirmation requested by user) */}
          {pendingListing && (
            <div className="rounded-xl border-2 border-emerald-500/70 bg-gradient-to-b from-emerald-950/70 to-slate-950 p-3.5 mb-3 shadow-lg animate-in zoom-in-95 duration-150">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs mb-2">
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                <span>फसल लिस्टिंग की पुष्टि करें (Confirm Listing)</span>
              </div>

              {/* Structured Summary Table */}
              <div className="bg-slate-900/90 rounded-lg p-2.5 border border-emerald-900/60 text-[11px] space-y-1 mb-3">
                <div className="flex justify-between text-slate-300">
                  <span>🌾 फसल (Crop):</span>
                  <span className="font-bold text-white">{pendingListing.crop}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>⚖️ मात्रा (Quantity):</span>
                  <span className="font-bold text-white">{pendingListing.quantityKg} {pendingListing.unit}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>💰 भाव (Rate):</span>
                  <span className="font-bold text-emerald-400">₹{pendingListing.pricePerKg} / {pendingListing.unit}</span>
                </div>
                <div className="flex justify-between text-slate-300 pt-1 border-t border-slate-800">
                  <span>💵 कुल अनुमानित मूल्य:</span>
                  <span className="font-black text-amber-300">₹{pendingListing.quantityKg * pendingListing.pricePerKg}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-300 font-medium text-center mb-3">
                क्या आप यह फसल किसान बाज़ार में लिस्ट करना चाहते हैं?
              </p>

              {/* Big Explicit YES / NO Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleConfirmListing}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-2 text-xs shadow-md transition-all active:scale-95"
                >
                  <CheckCircle2 className="size-3.5" />
                  <span>हाँ, लिस्ट करें</span>
                </button>
                <button
                  type="button"
                  onClick={handleCancelListing}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium py-2 text-xs border border-slate-700 transition-all active:scale-95"
                >
                  <XCircle className="size-3.5 text-rose-400" />
                  <span>नहीं, रद्द करें</span>
                </button>
              </div>
            </div>
          )}

          {/* 3. MAIN TEXT SUGGESTIONS (Above button as requested) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold px-0.5">
              <span>💡 मुख्य सुझाव (Quick Prompts):</span>
              <span className="text-[10px] text-slate-500">क्लिक करें या बोलें</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-40 overflow-y-auto pr-0.5 scrollbar-thin scrollbar-thumb-slate-800">
              {suggestions.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => processWithGemini(item.text)}
                  className="text-left rounded-xl border border-slate-800/90 bg-slate-900/80 hover:bg-emerald-950/60 hover:border-emerald-700/60 p-2 text-[11px] text-slate-200 hover:text-white transition-all group flex items-center justify-between"
                >
                  <span className="truncate pr-1">{item.label}</span>
                  <ArrowRight className="size-3 text-slate-500 group-hover:text-emerald-400 shrink-0 transition-transform group-hover:translate-x-0.5" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. FLOATING GEMINI LIVE CAPSULE BUTTON (Docked at bottom-right) */}
      <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 flex items-center gap-2">
        {/* Main Capsule Button */}
        <button
          type="button"
          onClick={() => {
            // If already open and speaking, clicking stops speaking
            if (isSpeaking) {
              stopSpeaking();
              return;
            }
            // If open and listening, clicking toggles listening
            if (isListening) {
              toggleListening();
              return;
            }
            // Toggle suggestions bubble
            setIsOpen((prev) => !prev);
          }}
          aria-label="Toggle Gemini Live Assistant"
          className={`group relative flex items-center gap-2.5 rounded-full pl-3 pr-4 py-2 text-white shadow-2xl backdrop-blur-md transition-all duration-200 active:scale-95 ${
            isListening 
              ? "bg-rose-950/90 border-2 border-rose-500 shadow-rose-900/50" 
              : isSpeaking
              ? "bg-indigo-950/90 border-2 border-cyan-400 shadow-cyan-900/50"
              : "bg-slate-950/90 border border-emerald-500/40 hover:border-emerald-400 shadow-emerald-950/30 hover:scale-105"
          }`}
        >
          {/* Subtle Glow Aura */}
          <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 opacity-40 blur-xs group-hover:opacity-75 transition-opacity" />

          {/* Icon Orb */}
          <div className={`relative flex size-7 items-center justify-center rounded-full text-white shadow-inner ${
            isListening 
              ? "bg-rose-600 animate-pulse" 
              : isSpeaking
              ? "bg-cyan-600"
              : isThinking
              ? "bg-amber-600 animate-spin"
              : "bg-gradient-to-br from-emerald-600 to-teal-700"
          }`}>
            {isListening ? (
              <MicOff className="size-3.5 text-white" />
            ) : isSpeaking ? (
              <Volume2 className="size-3.5 text-white animate-bounce" />
            ) : isThinking ? (
              <Sparkles className="size-3.5 text-amber-200" />
            ) : (
              <Sparkles className="size-3.5 text-emerald-200" />
            )}
          </div>

          {/* Button Text */}
          <div className="relative text-left leading-none">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black tracking-wide text-white">
                {isListening 
                  ? "सुन रहे हैं..." 
                  : isSpeaking
                  ? "बोल रहा है"
                  : isThinking
                  ? "सोच रहे हैं..."
                  : "Gemini Live"}
              </span>
              <span className={`size-1.5 rounded-full ${
                isListening 
                  ? "bg-rose-400 animate-ping" 
                  : isSpeaking 
                  ? "bg-cyan-400 animate-ping"
                  : "bg-emerald-400"
              }`} />
            </div>
            <p className="text-[10px] text-slate-300 font-medium mt-0.5">
              {isSpeaking ? "रोकने के लिए दबाएं" : "किसान वाणी"}
            </p>
          </div>

          {/* Chevron indicator for bubble state */}
          <div className="relative text-slate-400 group-hover:text-white transition-colors ml-0.5">
            {isOpen ? <ChevronDown className="size-3.5" /> : <ChevronUp className="size-3.5" />}
          </div>
        </button>

        {/* Dedicated Direct Mic Trigger Button */}
        <button
          type="button"
          onClick={toggleListening}
          aria-label={isListening ? "Stop listening" : "Start speaking"}
          title={isListening ? "माइक बंद करें (Stop Mic)" : "बोलकर पूछें (Speak to Gemini)"}
          className={`flex size-10 items-center justify-center rounded-full text-white shadow-xl transition-all active:scale-90 ${
            isListening
              ? "bg-rose-600 hover:bg-rose-500 ring-4 ring-rose-500/40 animate-pulse"
              : "bg-emerald-600 hover:bg-emerald-500 hover:scale-105 shadow-emerald-700/40"
          }`}
        >
          {isListening ? (
            <MicOff className="size-5" />
          ) : (
            <Mic className="size-5" />
          )}
        </button>
      </div>
    </>
  );
}
