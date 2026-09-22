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
  Camera,
  Home,
  Sprout,
  ShoppingBag,
  Warehouse,
  Truck,
  ShieldCheck,
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
    "नमस्ते! मैं आपका कृषि सेतु असिस्टेंट हूँ। बोलिए — आप कौन से पेज पर जाना चाहते हैं या कौन सी फसल लिस्ट करनी है?"
  );

  // Active or confirmed listing status
  const [confirmedListing, setConfirmedListing] = useState<CropListingData | null>(null);

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
    // Force stop microphone before speaking so assistant does NOT hear itself
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
      utterance.rate = 0.98;
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
    setIsOpen(false);
  }, [stopSpeaking]);

  /**
   * Action: Execute Crop Listing, Navigate to Farmer Page, Fill Details, Prompt for Photo
   */
  const executeProduceListing = useCallback((cropData: CropListingData) => {
    stopSpeaking();
    setConfirmedListing(cropData);

    // Save to sessionStorage and dispatch event for immediate real-time form fill
    if (typeof window !== "undefined") {
      sessionStorage.setItem("krishi_pending_voice_crop", JSON.stringify(cropData));
      window.dispatchEvent(new CustomEvent("krishi-voice-list-crop", { detail: cropData }));
      window.dispatchEvent(new CustomEvent("krishi-voice-highlight-photo", { detail: cropData }));
    }

    // Always navigate to farmer page if not already there
    if (typeof window !== "undefined" && !window.location.pathname.startsWith("/farmer")) {
      router.push("/farmer");
    } else {
      // If already on farmer page, scroll smoothly to the OpenCV scanner and photo section
      setTimeout(() => {
        document.getElementById("opencv-scanner")?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 800);
    }

    // Voice instruction: Confirm listing details and urge user to upload photo / run camera scan
    const promptSpeech = language === "hi-IN"
      ? `जी किसान भाई, मैंने ${cropData.quantityKg} ${cropData.unit} ${cropData.crop} ₹${cropData.pricePerKg} प्रति ${cropData.unit} लिस्टिंग में भर दिया है! अब कृपया अपनी फसल की फोटो अपलोड करें या AI कैमरा स्कैन करें ताकि आपको ग्रेड A और अच्छा भाव मिल सके।`
      : `Filled ${cropData.quantityKg} ${cropData.unit} ${cropData.crop} at ₹${cropData.pricePerKg}/${cropData.unit} into the form! Now please upload harvest photos or run AI quality scan to earn Grade A!`;

    setLatestResponse(promptSpeech);
    toast.success(`🌾 फसल विवरण फॉर्म में दर्ज: ${cropData.quantityKg} ${cropData.unit} ${cropData.crop}`);
    speak(promptSpeech, language);
  }, [language, router, speak, stopSpeaking]);

  /**
   * Action: Direct Web Page Navigation via Voice / Click
   */
  const executeNavigation = useCallback((route: string, labelHi: string, labelEn: string) => {
    stopSpeaking();
    const spoken = language === "hi-IN" 
      ? `${labelHi} खोला जा रहा है...` 
      : `Opening ${labelEn}...`;
    
    setLatestResponse(spoken);
    speak(spoken, language);
    toast.info(spoken);
    router.push(route);
  }, [language, router, speak, stopSpeaking]);

  /**
   * Process Natural Speech & Commands
   */
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
    setIsOpen(true);

    const lower = trimmed.toLowerCase();

    // 1. FAST CLIENT-SIDE NAVIGATION DETECTION (Instant 0ms latency)
    // Home Page
    if (/^(home|main|go home|open home|होम|मुख्य पृष्ठ|होम पेज|होमपेज)/i.test(lower) || /वापस जाओ|शुरुआती पेज/i.test(lower)) {
      isProcessingRef.current = false;
      setIsThinking(false);
      executeNavigation("/", "होम पेज", "Home Page");
      return;
    }

    // Consumer Marketplace
    if (/consumer|market|bazaar|buy produce|उपभोक्ता|कंज्यूमर|बाज़ार|खरीदना|सब्जी खरीद/i.test(lower) && !/ढूंढ|खोज|search/i.test(lower)) {
      isProcessingRef.current = false;
      setIsThinking(false);
      executeNavigation("/consumer", "उपभोक्ता बाज़ार", "Consumer Marketplace");
      return;
    }

    // Bulk Buyer Portal
    if (/bulk|buyer|b2b|fpo|थोक|थोक बाज़ार|होटल खरीद|संस्थागत/i.test(lower)) {
      isProcessingRef.current = false;
      setIsThinking(false);
      executeNavigation("/buyer/dashboard", "थोक खरीदार पोर्टल", "Bulk Buyer Portal");
      return;
    }

    // Delivery Fleet
    if (/delivery|driver|fleet|logistics|truck|डिलीवरी|लॉजिस्टिक्स|गाड़ी|ट्रक|चालक/i.test(lower)) {
      isProcessingRef.current = false;
      setIsThinking(false);
      executeNavigation("/delivery", "डिलीवरी फ्लीट", "Delivery Fleet");
      return;
    }

    // Admin Control
    if (/admin|dispute|fraud|control|governance|एडमिन|प्रशासन|कंट्रोल|विवाद/i.test(lower)) {
      isProcessingRef.current = false;
      setIsThinking(false);
      executeNavigation("/admin", "प्रशासन नियंत्रण", "Admin Panel");
      return;
    }

    // General Farmer Page Navigation (without crop quantity)
    if (/^(kisan|farmer|open farmer|किसान पोर्टल|किसान पेज|फार्मर पोर्टल)/i.test(lower) && !/\d+/.test(lower)) {
      isProcessingRef.current = false;
      setIsThinking(false);
      executeNavigation("/farmer", "किसान पोर्टल", "Farmer Portal");
      return;
    }

    // 2. FAST CLIENT-SIDE CROP LISTING EXTRACTION
    // If the user mentions selling/listing crops, parse crop, quantity, and price!
    if (/bech|sell|fasal|list|बेच|बेचना|बिक्री|लिस्ट|दर्ज/i.test(lower) || /टमाटर|प्याज|आलू|गेहूं|चावल|मिर्च|tomato|onion|potato|wheat|chilli/i.test(lower)) {
      let crop = "टमाटर (Tomatoes)";
      let variety = "Desi Hybrid (Abhinav)";
      let defaultPrice = 40;

      if (/प्याज|प्याज़|pyaz|onion/i.test(lower)) {
        crop = "नासिक लाल प्याज (Onions)";
        variety = "Nashik Red Garwa";
        defaultPrice = 28;
      } else if (/आलू|aloo|potato/i.test(lower)) {
        crop = "आलू (Potatoes)";
        variety = "Kufri Jyoti";
        defaultPrice = 22;
      } else if (/गेहूं|गेहू|gehu|wheat/i.test(lower)) {
        crop = "गेहूं (Wheat)";
        variety = "MP Sharbati Golden";
        defaultPrice = 28;
      } else if (/चावल|धान|chawal|rice/i.test(lower)) {
        crop = "बासमती चावल (Rice)";
        variety = "Pusa 1121 Long Grain";
        defaultPrice = 65;
      } else if (/मिर्च|mirch|chilli/i.test(lower)) {
        crop = "हरी मिर्च (Chillies)";
        variety = "G-4 Spicy Hybrid";
        defaultPrice = 45;
      }

      const qtyMatch = trimmed.match(/(\d+)\s*(?:kg|kilo|quintal|क्विंटल|किलो)/i) || trimmed.match(/(\d+)/);
      const quantityKg = qtyMatch ? parseInt(qtyMatch[1], 10) : 50;

      const priceMatch = trimmed.match(/(?:at|@|ke bhav|mein|rup|₹|rs\.?|रुपये|रुपए|भाव)\s*(\d+)/i) || trimmed.match(/(\d+)\s*(?:rupaye|rupee|rs|inr|रुपये|रुपए)/i);
      const pricePerKg = priceMatch ? parseInt(priceMatch[1], 10) : defaultPrice;

      const listingData: CropListingData = {
        crop,
        variety,
        quantityKg,
        pricePerKg,
        unit: "kg",
      };

      isProcessingRef.current = false;
      setIsThinking(false);
      executeProduceListing(listingData);
      return;
    }

    // 3. FALLBACK TO GEMINI BACKEND FOR MANDI QUERIES & CONVERSATIONS
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

      // Handle Gemini listing intent
      if (data.intent === "LIST_CROP" && data.cropData) {
        executeProduceListing(data.cropData);
      } else {
        // Normal informational or advisory response
        const responseText = data.spokenResponse || "जानकारी प्राप्त हो गई है।";
        setLatestResponse(responseText);
        speak(responseText, language);

        // Execute route if requested
        if (data.intent === "NAVIGATE" && data.route) {
          router.push(data.route);
        } else if (data.intent === "SEARCH_PRODUCE" && data.route) {
          router.push(data.route);
        }
      }
    } catch (err) {
      console.error("Gemini voice error:", err);
      const fallbackReply = language === "hi-IN" 
        ? "जी, आपका संदेश मिल गया है। आप क्या बेचना या खोजना चाहते हैं?" 
        : "Message received. What crop would you like to list or search?";
      setLatestResponse(fallbackReply);
      speak(fallbackReply, language);
    } finally {
      setIsThinking(false);
      isProcessingRef.current = false;
    }
  }, [language, executeNavigation, executeProduceListing, router, speak, stopSpeaking]);

  // Initialize SpeechRecognition with continuous = false (SINGLE UTTERANCE ONLY)
  useEffect(() => {
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
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

  // Curated Minimal Quick Prompts
  const quickActions = [
    { text: "50 किलो टमाटर ₹40/kg बेचना है", label: "🌾 50kg टमाटर बेचें" },
    { text: "आज के नासिक प्याज के मंडी भाव क्या हैं?", label: "📈 प्याज के मंडी भाव" },
    { text: "उपभोक्ता बाज़ार में ताज़ा सब्जियां दिखाओ", label: "🛒 ताज़ा फसल खरीदें" },
    { text: "डिलीवरी फ्लीट पोर्टल खोलें", label: "🚚 डिलीवरी फ्लीट" },
  ];

  // 1-Tap Portal Navigation Row
  const portals = [
    { label: "🏠 होम", route: "/", nameHi: "होम पेज", nameEn: "Home" },
    { label: "🌾 किसान", route: "/farmer", nameHi: "किसान पोर्टल", nameEn: "Farmer Intake" },
    { label: "🛒 उपभोक्ता", route: "/consumer", nameHi: "उपभोक्ता बाज़ार", nameEn: "Consumer Market" },
    { label: "🏢 थोक", route: "/buyer/dashboard", nameHi: "थोक खरीदार", nameEn: "Bulk Buyers" },
    { label: "🚚 डिलीवरी", route: "/delivery", nameHi: "डिलीवरी फ्लीट", nameEn: "Delivery Fleet" },
    { label: "🛡️ एडमिन", route: "/admin", nameHi: "प्रशासन नियंत्रण", nameEn: "Admin Panel" },
  ];

  return (
    <>
      {/* 1. ULTRA-MINIMAL & SIMPLIFIED FLOATING ASSISTANT CARD */}
      {isOpen && (
        <div 
          className="fixed bottom-34 md:bottom-20 right-3 sm:right-6 z-40 w-[320px] sm:w-[350px] max-w-[calc(100vw-1.5rem)] rounded-3xl border border-emerald-500/30 bg-slate-950/92 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] text-white p-4 space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-200"
          role="region"
          aria-label="Kisan Setu Voice Assistant"
        >
          {/* Top Bar: Minimal Status & Controls */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 text-slate-950 shadow-xs">
                <Sparkles className="size-3.5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5 leading-none">
                  Gemini Live <span className="text-emerald-400">किसान वाणी</span>
                  <span className={`inline-block size-1.5 rounded-full ${isListening ? "bg-rose-400 animate-ping" : isSpeaking ? "bg-cyan-400 animate-ping" : "bg-emerald-400"}`} />
                </h3>
                <span className="text-[9px] text-slate-400">वॉयस व नेविगेशन कंट्रोल</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Language Switch */}
              <button
                type="button"
                onClick={() => handleLanguageChange(language === "hi-IN" ? "en-IN" : "hi-IN")}
                className="rounded-full px-2 py-0.5 text-[10px] font-bold bg-slate-800/90 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 transition-colors flex items-center gap-1"
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
                className="rounded-full p-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
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
                className="rounded-full p-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="बंद करें"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {/* Dynamic Live Activity Box */}
          <div className="rounded-2xl bg-slate-900/85 border border-slate-800/90 p-3 text-xs space-y-2">
            {/* User prompt preview if any */}
            {lastUserQuery && (
              <div className="text-[10px] text-emerald-400 font-semibold truncate">
                <span>आप: &ldquo;{lastUserQuery}&rdquo;</span>
              </div>
            )}

            {/* Listening state with animated soundwave */}
            {isListening && (
              <div className="flex items-center gap-2.5 py-1">
                <div className="flex items-center gap-1 text-rose-400 shrink-0">
                  <span className="w-1 h-3.5 bg-rose-500 rounded-full animate-bounce" />
                  <span className="w-1 h-5 bg-rose-400 rounded-full animate-bounce delay-100" />
                  <span className="w-1 h-2.5 bg-rose-500 rounded-full animate-bounce delay-150" />
                </div>
                <p className="text-xs text-rose-200 font-medium italic truncate">
                  {interimTranscript ? `"${interimTranscript}..."` : "बोलिए, सुन रहे हैं..."}
                </p>
              </div>
            )}

            {/* Thinking state */}
            {isThinking && (
              <div className="flex items-center gap-2 text-cyan-300 font-medium py-1 animate-pulse">
                <Sparkles className="size-3.5 animate-spin" />
                <span>Gemini विचार कर रहा है...</span>
              </div>
            )}

            {/* Assistant response message */}
            {!isListening && !isThinking && (
              <p className="text-slate-200 text-xs leading-relaxed">
                {latestResponse}
              </p>
            )}

            {/* Speaking animation & stop button */}
            {isSpeaking && (
              <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[11px]">
                <div className="flex items-center gap-1 text-emerald-400">
                  <span className="w-1 h-3 bg-emerald-400 rounded-full animate-bounce" />
                  <span className="w-1 h-4 bg-teal-400 rounded-full animate-bounce delay-75" />
                  <span className="w-1 h-2.5 bg-cyan-400 rounded-full animate-bounce delay-150" />
                  <span className="text-[10px] text-slate-400 ml-1">असिस्टेंट बोल रहा है</span>
                </div>
                <button
                  type="button"
                  onClick={stopSpeaking}
                  className="text-[10px] font-bold text-rose-400 hover:text-rose-300 bg-rose-950/70 px-2 py-0.5 rounded-lg border border-rose-800/80 transition-colors"
                >
                  रोकें (Stop)
                </button>
              </div>
            )}
          </div>

          {/* Active Listing Badge with Instant Photo Prompt */}
          {confirmedListing && (
            <div className="rounded-2xl border border-emerald-500/50 bg-emerald-950/40 p-2.5 flex items-center justify-between gap-2 shadow-xs animate-in zoom-in-95">
              <div className="min-w-0 text-xs">
                <div className="flex items-center gap-1 text-emerald-400 font-bold truncate">
                  <CheckCircle2 className="size-3.5 shrink-0" />
                  <span className="truncate">{confirmedListing.crop} ({confirmedListing.quantityKg}{confirmedListing.unit})</span>
                </div>
                <span className="text-[10px] text-slate-300 block mt-0.5">
                  ₹{confirmedListing.pricePerKg}/{confirmedListing.unit} • फॉर्म भर गया
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  router.push("/farmer");
                  setTimeout(() => {
                    document.getElementById("opencv-scanner")?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }, 800);
                }}
                className="shrink-0 flex items-center gap-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2.5 py-1.5 text-[10px] shadow-xs active:scale-95 transition-all"
              >
                <Camera className="size-3" />
                <span>फोटो जोड़ें</span>
              </button>
            </div>
          )}

          {/* Minimal Quick Actions (4 Clean Pills) */}
          <div className="space-y-1.5 pt-0.5">
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold px-0.5">
              <span>त्वरित सुझाव (Quick Actions):</span>
              <span className="text-[9px] text-slate-500">क्लिक करें या बोलें</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {quickActions.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => processWithGemini(item.text)}
                  className="rounded-xl border border-slate-800/90 bg-slate-900/70 hover:bg-emerald-950/60 hover:border-emerald-700/60 px-2.5 py-1.5 text-left text-[11px] font-medium text-slate-200 hover:text-white transition-all truncate group flex items-center justify-between"
                >
                  <span className="truncate">{item.label}</span>
                  <ArrowRight className="size-2.5 text-slate-500 group-hover:text-emerald-400 shrink-0 transition-transform group-hover:translate-x-0.5 ml-1" />
                </button>
              ))}
            </div>
          </div>

          {/* 1-Tap Portal Switcher Row (Direct Page Navigation Control) */}
          <div className="pt-2 border-t border-slate-800/80 space-y-1">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block px-0.5">
              पेज पर जाएं (Page Navigation):
            </span>
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
              {portals.map((p) => (
                <button
                  key={p.route}
                  type="button"
                  onClick={() => executeNavigation(p.route, p.nameHi, p.nameEn)}
                  className="shrink-0 rounded-lg px-2 py-1 text-[10px] font-semibold bg-slate-900 border border-slate-800 hover:bg-emerald-900/50 hover:border-emerald-600 text-slate-300 hover:text-white transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. FLOATING GEMINI LIVE CAPSULE BUTTON */}
      <div className="fixed bottom-20 md:bottom-6 right-3 sm:right-6 z-40 flex items-center gap-2">
        {/* Main Capsule Button */}
        <button
          type="button"
          onClick={() => {
            if (isSpeaking) {
              stopSpeaking();
              return;
            }
            if (isListening) {
              toggleListening();
              return;
            }
            setIsOpen((prev) => !prev);
          }}
          aria-label="Toggle Gemini Live Assistant"
          className={`group relative flex items-center gap-2 rounded-full pl-3 pr-3.5 py-2 text-white shadow-2xl backdrop-blur-md transition-all duration-200 active:scale-95 ${
            isListening 
              ? "bg-rose-950/90 border-2 border-rose-500 shadow-rose-900/50" 
              : isSpeaking
              ? "bg-indigo-950/90 border-2 border-cyan-400 shadow-cyan-900/50"
              : "bg-slate-950/90 border border-emerald-500/40 hover:border-emerald-400 shadow-emerald-950/30 hover:scale-105"
          }`}
        >
          {/* Subtle Glow Aura */}
          <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 opacity-30 blur-xs group-hover:opacity-75 transition-opacity" />

          {/* Icon Orb */}
          <div className={`relative flex size-6 items-center justify-center rounded-full text-white shadow-inner ${
            isListening 
              ? "bg-rose-600 animate-pulse" 
              : isSpeaking
              ? "bg-cyan-600"
              : isThinking
              ? "bg-amber-600 animate-spin"
              : "bg-gradient-to-br from-emerald-600 to-teal-700"
          }`}>
            {isListening ? (
              <MicOff className="size-3 text-white" />
            ) : isSpeaking ? (
              <Volume2 className="size-3 text-white animate-bounce" />
            ) : isThinking ? (
              <Sparkles className="size-3 text-amber-200" />
            ) : (
              <Sparkles className="size-3 text-emerald-200" />
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
            <p className="text-[9px] text-slate-300 font-medium mt-0.5">
              {isSpeaking ? "रोकने के लिए दबाएं" : "किसान वाणी"}
            </p>
          </div>

          {/* Chevron indicator for bubble state */}
          <div className="relative text-slate-400 group-hover:text-white transition-colors ml-0.5">
            {isOpen ? <ChevronDown className="size-3" /> : <ChevronUp className="size-3" />}
          </div>
        </button>

        {/* Dedicated Direct Mic Trigger Button */}
        <button
          type="button"
          onClick={toggleListening}
          aria-label={isListening ? "Stop listening" : "Start speaking"}
          title={isListening ? "माइक बंद करें (Stop Mic)" : "बोलकर पूछें (Speak to Gemini)"}
          className={`flex size-9 sm:size-10 items-center justify-center rounded-full text-white shadow-xl transition-all active:scale-90 ${
            isListening
              ? "bg-rose-600 hover:bg-rose-500 ring-4 ring-rose-500/40 animate-pulse"
              : "bg-emerald-600 hover:bg-emerald-500 hover:scale-105 shadow-emerald-700/40"
          }`}
        >
          {isListening ? (
            <MicOff className="size-4.5" />
          ) : (
            <Mic className="size-4.5" />
          )}
        </button>
      </div>
    </>
  );
}
