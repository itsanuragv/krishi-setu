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
import { useLanguage } from "@/context/LanguageContext";
import { GeminiSparkleIcon, GeminiWaveform } from "@/components/shared/GeminiLiveIcon";
import { 
  getSpeechRecognition, 
  type SpeechRecognitionInstance, 
  type SpeechRecognitionEvent, 
  type SpeechRecognitionErrorEvent 
} from "@/lib/speech-types";
import { motion, AnimatePresence } from "framer-motion";
import { modalSpringVariants, appleSpringSnappy } from "@/lib/animations";

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
  const { language: currentLang } = useLanguage();
  
  // UI States
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [language, setLanguage] = useState<"hi-IN" | "en-IN">("hi-IN");
  const [audioFeedbackEnabled, setAudioFeedbackEnabled] = useState(true);

  const widgetRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Sync assistant voice language with app language context
  useEffect(() => {
    setLanguage(currentLang === "en" ? "en-IN" : "hi-IN");
  }, [currentLang]);

  // Onboarding Tooltip: Show for first-time visitors after page load
  useEffect(() => {
    if (typeof window === "undefined") return;
    const dismissed = localStorage.getItem("krishi_ai_tooltip_dismissed");
    if (!dismissed) {
      const timer = setTimeout(() => {
        setShowTooltip(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismissTooltip = useCallback(() => {
    setShowTooltip(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("krishi_ai_tooltip_dismissed", "true");
    }
  }, []);

  // Collapse on outside click or Escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const clickedInsideWidget = widgetRef.current?.contains(target);
      const clickedInsideCard = cardRef.current?.contains(target);

      if (!clickedInsideWidget && !clickedInsideCard) {
        if (isOpen) setIsOpen(false);
        if (isExpanded && !isListening && !isSpeaking) {
          setIsExpanded(false);
        }
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (isOpen) setIsOpen(false);
        if (isExpanded && !isListening && !isSpeaking) {
          setIsExpanded(false);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isExpanded, isListening, isSpeaking]);

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
    setIsExpanded(false);
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
    setIsExpanded(true);
    dismissTooltip();

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
    // If the user mentions selling/listing crops, parse field crops, grains, quantity, and price!
    if (
      /bech|sell|fasal|list|anaaj|mandi|बेच|बेचना|बिक्री|लिस्ट|दर्ज|अनाज|फसल/i.test(lower) || 
      /गेहूं|चावल|धान|सोयाबीन|मक्का|बाजरा|ज्वार|चना|सरसों|रागी|wheat|rice|paddy|soya|soyabean|corn|maize|bajra|jowar|chana|mustard|millet/i.test(lower)
    ) {
      let crop = "शरबती गेहूं (Wheat)";
      let variety = "MP Sharbati Golden A+";
      let defaultQuintalPrice = 3400;
      let defaultKgPrice = 34;

      if (/सोयाबीन|soya|soyabean/i.test(lower)) {
        crop = "पीला सोयाबीन (Soyabean)";
        variety = "JS-9560 Bold Grain";
        defaultQuintalPrice = 4850;
        defaultKgPrice = 48;
      } else if (/चावल|धान|बासमती|chawal|rice|paddy|basmati/i.test(lower)) {
        crop = "बासमती धान / चावल (Paddy/Rice)";
        variety = "Pusa 1121 Long Grain";
        defaultQuintalPrice = 7200;
        defaultKgPrice = 72;
      } else if (/मक्का|भुट्टा|makka|corn|maize/i.test(lower)) {
        crop = "देशी पीला मक्का (Yellow Maize)";
        variety = "Pioneer Hybrid 3396";
        defaultQuintalPrice = 2350;
        defaultKgPrice = 24;
      } else if (/बाजरा|bajra|pearl\s*millet/i.test(lower)) {
        crop = "देशी बाजरा (Pearl Millet)";
        variety = "Desi Shanker Shri Anna";
        defaultQuintalPrice = 2600;
        defaultKgPrice = 26;
      } else if (/ज्वार|jowar|sorghum/i.test(lower)) {
        crop = "मालदांडी सफेद ज्वार (White Jowar)";
        variety = "M-35-1 Maldandi Shri Anna";
        defaultQuintalPrice = 5200;
        defaultKgPrice = 52;
      } else if (/चना|chana|chickpea|dollar/i.test(lower)) {
        crop = "मालवा डॉलर चना (Dollar Chana)";
        variety = "Malwa Bold Kabuli";
        defaultQuintalPrice = 6800;
        defaultKgPrice = 68;
      } else if (/सरसों|mustard|sarson/i.test(lower)) {
        crop = "काली सरसों (Mustard Seed)";
        variety = "Pusa Bold Black";
        defaultQuintalPrice = 5600;
        defaultKgPrice = 56;
      } else if (/गेहूं|गेहू|gehu|wheat|sharbati/i.test(lower)) {
        crop = "शरबती गेहूं (Wheat)";
        variety = "MP Sharbati Golden A+";
        defaultQuintalPrice = 3400;
        defaultKgPrice = 34;
      }

      // Unit detection: default to quintal for field crops, support ton, bori, kg
      let unit: "quintal" | "ton" | "bori" | "kg" = "quintal";
      if (/ton|टन/i.test(trimmed)) {
        unit = "ton";
      } else if (/bori|बोरी|कट्टा/i.test(trimmed)) {
        unit = "bori";
      } else if (/kg|kilo|किलो/i.test(trimmed)) {
        unit = "kg";
      } else {
        unit = "quintal";
      }

      const qtyMatch = trimmed.match(/(\d+)\s*(?:quintal|क्विंटल|ton|टन|bori|बोरी|kg|kilo|किलो)/i) || trimmed.match(/(\d+)/);
      const quantity = qtyMatch ? parseInt(qtyMatch[1], 10) : (unit === "quintal" ? 100 : unit === "ton" ? 10 : 50);

      const priceMatch = trimmed.match(/(?:at|@|ke bhav|mein|rup|₹|rs\.?|रुपये|रुपए|भाव)\s*(\d+)/i) || trimmed.match(/(\d+)\s*(?:rupaye|rupee|rs|inr|रुपये|रुपए)/i);
      const price = priceMatch ? parseInt(priceMatch[1], 10) : (unit === "kg" ? defaultKgPrice : defaultQuintalPrice);

      const listingData: CropListingData = {
        crop,
        variety,
        quantityKg: quantity,
        pricePerKg: price,
        unit,
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
      setIsExpanded(true);
      dismissTooltip();
    }
    window.addEventListener("open-voice-assistant", handleOpenEvent);
    return () => {
      window.removeEventListener("open-voice-assistant", handleOpenEvent);
    };
  }, [dismissTooltip]);

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
      setIsExpanded(true);
      dismissTooltip();
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
    { text: "100 क्विंटल सीहोर शरबती गेहूं ₹3,400 प्रति क्विंटल बेचना है", label: "🌾 100q गेहूं बेचें" },
    { text: "50 क्विंटल पीला सोयाबीन ₹4,850/क्विंटल लिस्ट करें", label: "🌱 50q सोयाबीन बेचें" },
    { text: "आज के सीहोर मंडी में गेहूं, सोयाबीन और मक्का का भाव क्या है?", label: "📈 अनाज मंडी भाव" },
    { text: "उपभोक्ता बाज़ार में उच्च गुणवत्ता वाले श्री अन्न और अनाज दिखाओ", label: "🛒 अनाज व श्री अन्न" },
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
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            ref={cardRef}
            variants={modalSpringVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed bottom-16 sm:bottom-20 right-3 sm:right-6 z-40 w-[320px] sm:w-[350px] max-w-[calc(100vw-1.5rem)] max-h-[82vh] overflow-y-auto rounded-3xl apple-glass-elevated rim-light-lg shadow-[0_24px_60px_rgba(0,0,0,0.5)] text-white p-4 space-y-3.5 apple-scrollbar"
            role="region"
            aria-label="Kisan Setu Voice Assistant"
          >
            {/* Top Bar: Minimal Status & Controls */}
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-400 via-emerald-400 to-cyan-400 p-0.5 shadow-md overflow-hidden rim-light">
                  <div className="size-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                    <GeminiSparkleIcon size={18} />
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-black text-white flex items-center gap-1.5 leading-none">
                    <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-emerald-300 bg-clip-text text-transparent font-black tracking-wide">
                      {language === "hi-IN" ? "किसान साथी Live" : "Kisan Saathi Live"}
                    </span>
                    <span className="text-[10px] text-emerald-300 font-bold bg-emerald-900/90 px-1.5 py-0.5 rounded-md border border-emerald-400/50 shadow-xs">
                      AI
                    </span>
                    <span className={`inline-block size-1.5 rounded-full ${isListening ? "bg-emerald-400 animate-ping" : isSpeaking ? "bg-cyan-400 animate-ping" : "bg-emerald-400"}`} />
                  </h3>
                  <span className="text-[9px] text-slate-300 font-medium">वॉयस व नेविगेशन कंट्रोल • Real-time AI</span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* Language Switch */}
                <button
                  type="button"
                  onClick={() => handleLanguageChange(language === "hi-IN" ? "en-IN" : "hi-IN")}
                  className="rounded-full px-2 py-0.5 text-[10px] font-bold bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white border border-white/15 transition-all flex items-center gap-1 active:scale-95"
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
                  className="rounded-full p-1.5 text-slate-300 hover:text-white hover:bg-white/10 transition-colors active:scale-90"
                  title={audioFeedbackEnabled ? "आवाज़ बंद करें (Mute)" : "आवाज़ चालू करें (Unmute)"}
                >
                  {audioFeedbackEnabled ? (
                    <Volume2 className="size-3.5 text-cyan-400" />
                  ) : (
                    <VolumeX className="size-3.5 text-slate-400" />
                  )}
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-full p-1.5 text-slate-300 hover:text-white hover:bg-white/10 transition-colors active:scale-90"
                  title="बंद करें"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            {/* Dynamic Live Activity Box */}
            <div className="rounded-2xl bg-black/40 border border-white/10 p-3 text-xs space-y-2 backdrop-blur-md">
              {/* User prompt preview if any */}
              {lastUserQuery && (
                <div className="text-[10px] text-emerald-400 font-semibold truncate">
                  <span>आप: &ldquo;{lastUserQuery}&rdquo;</span>
                </div>
              )}

              {/* Listening state with animated soundwave */}
              {isListening && (
                <div className="flex items-center gap-2.5 py-1">
                  <GeminiWaveform active variant="listening" className="shrink-0" />
                  <p className="text-xs text-emerald-300 font-medium italic truncate">
                    {interimTranscript ? `"${interimTranscript}..."` : "बोलिए, सुन रहे हैं..."}
                  </p>
                </div>
              )}

              {/* Thinking state */}
              {isThinking && (
                <div className="flex items-center gap-2 text-cyan-300 font-medium py-1">
                  <GeminiSparkleIcon size={16} className="animate-spin" />
                  <span className="bg-gradient-to-r from-cyan-300 via-teal-200 to-amber-200 bg-clip-text text-transparent font-semibold">
                    Gemini विचार कर रहा है...
                  </span>
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
                <div className="flex items-center justify-between pt-1 border-t border-white/[0.08] text-[11px]">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <GeminiWaveform active variant="speaking" className="scale-90" />
                    <span className="text-[10px] text-slate-300 ml-1">असिस्टेंट बोल रहा है</span>
                  </div>
                  <button
                    type="button"
                    onClick={stopSpeaking}
                    className="text-[10px] font-bold text-rose-300 hover:text-white bg-rose-950/80 hover:bg-rose-900 px-2 py-0.5 rounded-lg border border-rose-700/80 transition-colors cursor-pointer active:scale-95"
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
                  <motion.button
                    key={idx}
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    transition={appleSpringSnappy}
                    onClick={() => processWithGemini(item.text)}
                    className="rounded-xl border border-white/10 bg-white/5 hover:bg-emerald-900/40 hover:border-emerald-500/40 px-2.5 py-1.5 text-left text-[11px] font-medium text-slate-200 hover:text-white transition-all truncate group flex items-center justify-between"
                  >
                    <span className="truncate">{item.label}</span>
                    <ArrowRight className="size-2.5 text-slate-500 group-hover:text-emerald-400 shrink-0 transition-transform group-hover:translate-x-0.5 ml-1" />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* 1-Tap Portal Switcher Row (Direct Page Navigation Control) */}
            <div className="pt-2 border-t border-white/[0.08] space-y-1">
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block px-0.5">
                पेज पर जाएं (Page Navigation):
              </span>
              <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
                {portals.map((p) => (
                  <motion.button
                    key={p.route}
                    type="button"
                    whileTap={{ scale: 0.96 }}
                    transition={appleSpringSnappy}
                    onClick={() => executeNavigation(p.route, p.nameHi, p.nameEn)}
                    className="shrink-0 rounded-lg px-2 py-1 text-[10px] font-semibold bg-white/5 border border-white/10 hover:bg-emerald-900/50 hover:border-emerald-500/50 text-slate-300 hover:text-white transition-colors"
                  >
                    {p.label}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. FLOATING AI ASSISTANT WIDGET (FAB & EXPANDED PILL) */}
      <div 
        ref={widgetRef} 
        className="fixed bottom-4 md:bottom-5 right-3 sm:right-5 z-40 select-none flex items-center"
      >
        {/* Onboarding Tooltip / Callout (First-Time Visitor Guide) */}
        {showTooltip && !isExpanded && !isOpen && (
          <div className="absolute bottom-full right-0 mb-3 w-[calc(100vw-2rem)] sm:w-80 max-w-[320px] animate-tooltip-float z-50 pointer-events-auto">
            <div 
              onClick={() => {
                dismissTooltip();
                setIsExpanded(true);
              }}
              className="group relative cursor-pointer rounded-2xl bg-slate-950/95 border border-emerald-500/50 p-3 sm:p-3.5 shadow-[0_12px_36px_rgba(0,0,0,0.55)] backdrop-blur-xl text-white transition-all hover:border-emerald-400 hover:shadow-emerald-950/50"
            >
              {/* Ambient gradient glow behind tooltip */}
              <span className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 opacity-25 blur-sm -z-10 group-hover:opacity-40 transition-opacity" />

              {/* Dismiss '✕' button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  dismissTooltip();
                }}
                aria-label="Dismiss guide"
                title="बंद करें (Dismiss Guide)"
                className="absolute top-2.5 right-2.5 size-5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center border border-slate-700/80 transition-colors"
              >
                <X className="size-3" />
              </button>

              {/* Tooltip Header & Content */}
              <div className="flex items-start gap-2.5 pr-4">
                <div className="size-7 sm:size-8 rounded-xl bg-gradient-to-tr from-amber-400 to-emerald-400 p-0.5 shadow-md flex items-center justify-center shrink-0">
                  <div className="size-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                    <GeminiSparkleIcon size={16} />
                  </div>
                </div>
                <div className="space-y-1 text-left">
                  <p className="text-xs font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-emerald-300 leading-tight">
                    {currentLang === "hi"
                      ? "कृषि सेतु • किसान साथी Live"
                      : "Krishi Setu • Kisan Saathi Live"}
                  </p>
                  <p className="text-[11px] text-slate-200 leading-relaxed font-normal">
                    {currentLang === "hi"
                      ? "मंडी भाव, फसल लिस्टिंग या उपज खरीदने के लिए AI गाइड से पूछें!"
                      : "Ask real-time mandi prices, list crops, or browse harvests with your voice!"}
                  </p>
                  <p className="text-[10px] text-amber-300 font-semibold pt-0.5 flex items-center gap-1">
                    <span className="size-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>
                      {currentLang === "hi" 
                        ? "बोलकर शुरू करने के लिए यहाँ टैप करें" 
                        : "Tap below to start speaking"}
                    </span>
                  </p>
                </div>
              </div>

              {/* Downward Caret pointing straight to circular FAB */}
              <div className="absolute -bottom-2 right-4 sm:right-5 size-0 border-x-8 border-x-transparent border-t-8 border-t-slate-950 filter drop-shadow-[0_3px_2px_rgba(16,185,129,0.3)]" />
            </div>
          </div>
        )}

        {/* Floating Kisan Saathi Live AI Assistant Trigger: Compact, Bright, Responsive & Mobile-Friendly */}
        {!isExpanded ? (
          <div className="animate-float relative group flex items-center justify-center">
            {/* Quick Micro-Badge Floating Tooltip on Desktop Hover */}
            <div className="hidden sm:block absolute bottom-full right-0 mb-3 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:-translate-y-1 z-50">
              <div className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-emerald-400/80 px-3 py-1.5 shadow-[0_10px_30px_rgba(16,185,129,0.4)] backdrop-blur-xl text-white whitespace-nowrap">
                <GeminiSparkleIcon size={16} />
                <div className="text-left">
                  <p className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-emerald-300 leading-none">
                    {currentLang === "hi" ? "किसान साथी Live" : "Kisan Saathi Live"}
                  </p>
                  <p className="text-[10px] text-emerald-300 font-semibold mt-0.5">
                    {currentLang === "hi" ? "बोलकर पूछें • AI वॉयस गाइड" : "Voice AI • Tap to chat"}
                  </p>
                </div>
                <span className="size-2 rounded-full bg-emerald-400 animate-ping ml-1" />
              </div>
              <div className="absolute -bottom-1.5 right-5 size-0 border-x-6 border-x-transparent border-t-6 border-t-slate-950 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]" />
            </div>

            {/* Super-Bright, Sleek & Compact Energy Orb FAB (44px on mobile, 48px on desktop) */}
            <button
              type="button"
              onClick={() => {
                dismissTooltip();
                setIsExpanded(true);
              }}
              aria-label="Open Kisan Saathi Live Voice Assistant"
              title={currentLang === "hi" ? "किसान साथी Live खोलें" : "Open Kisan Saathi Live Assistant"}
              className="group relative flex size-11 sm:size-12 items-center justify-center rounded-full transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer focus:outline-hidden animate-bright-bloom shadow-[0_6px_22px_rgba(16,185,129,0.5)]"
            >
              {/* Vibrant Outer Neon Glow Aura */}
              <span className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-emerald-500 via-cyan-400 via-amber-400 to-teal-500 opacity-75 blur-xs group-hover:opacity-100 transition-opacity" />

              {/* 360-Degree Continuous Rotating Rainbow Conic Border */}
              <div className="absolute -inset-[2px] rounded-full p-[2px] overflow-hidden pointer-events-none">
                <div
                  className="size-full rounded-full animate-gemini-spin"
                  style={{
                    background:
                      "conic-gradient(from 0deg, #FFE600, #FF6600, #FF007A, #9B51E0, #00F5FF, #10B981, #FFE600)",
                  }}
                />
              </div>

              {/* Ultra-Bright Rich Jewel Core */}
              <div className="relative size-full rounded-full bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-0.5 flex items-center justify-center overflow-hidden border border-white/90 shadow-inner">
                {/* Luminous Inner Core */}
                <div className="size-full rounded-full bg-gradient-to-tr from-emerald-950/90 via-slate-950/95 to-teal-950/90 flex flex-col items-center justify-center relative overflow-hidden">
                  {/* Radial Sunburst Flare */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.4),transparent_65%)] pointer-events-none" />

                  {/* Specular Diagonal Light Shimmer Sweep */}
                  <span className="absolute inset-0 w-[45%] h-[200%] bg-gradient-to-r from-transparent via-white/40 to-transparent animate-gemini-shine pointer-events-none" />

                  {/* Centered Radiant Golden Star */}
                  <div className="relative flex items-center justify-center transition-all duration-300 group-hover:scale-115 group-hover:rotate-12">
                    <GeminiSparkleIcon size={22} className="filter drop-shadow-[0_0_10px_rgba(250,204,21,0.9)]" />
                  </div>

                  {/* Active Neon Waveform */}
                  {(isListening || isSpeaking) && (
                    <div className="absolute bottom-0.5 flex items-center justify-center">
                      <GeminiWaveform
                        active={isListening || isSpeaking}
                        variant={isListening ? "listening" : isSpeaking ? "speaking" : "gemini"}
                        className="scale-65"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Satellite Radar Live Beacon Dot */}
              <span className="absolute -top-0.5 -right-0.5 flex size-3.5 sm:size-4">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-90" />
                <span className="relative inline-flex size-3.5 sm:size-4 rounded-full border border-white bg-gradient-to-r from-amber-400 to-yellow-300 shadow-[0_0_8px_rgba(245,158,11,1)]" />
              </span>
            </button>
          </div>
        ) : (
          <div className="relative flex items-center gap-1.5 sm:gap-2 animate-in fade-in zoom-in-95 duration-200">
            {/* Main Interactive Vibrant Capsule - Compact, Calming & Mobile-Optimized */}
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
              aria-label="Toggle Kisan Saathi Live Assistant"
              className={`group relative flex items-center gap-1.5 sm:gap-2 rounded-full pl-1.5 sm:pl-2 pr-2.5 sm:pr-3 py-1 sm:py-1.5 text-white shadow-[0_8px_25px_rgba(16,185,129,0.5),0_0_15px_rgba(6,182,212,0.4)] transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer overflow-hidden border border-white/80 ${
                isListening
                  ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 shadow-emerald-500/50"
                  : isSpeaking
                  ? "bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 shadow-cyan-600/60"
                  : isThinking
                  ? "bg-gradient-to-r from-purple-700 via-indigo-600 to-pink-600 shadow-purple-600/60"
                  : "bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 shadow-emerald-600/60"
              }`}
            >
              {/* Outer Vibrant Bloom Glow */}
              <span
                className={`absolute -inset-1 rounded-full opacity-50 blur-xs group-hover:opacity-90 transition-opacity pointer-events-none ${
                  isListening
                    ? "bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300"
                    : isSpeaking
                    ? "bg-gradient-to-r from-cyan-400 to-emerald-400"
                    : "bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300"
                }`}
              />

              {/* Specular Diagonal Light Shimmer Sweep */}
              <span className="absolute inset-0 w-[40%] h-[200%] bg-gradient-to-r from-transparent via-white/35 to-transparent animate-gemini-shine pointer-events-none" />

              {/* Left Sunburst Golden Avatar Circle (compact 28px/32px) */}
              <div
                className={`relative flex size-7 sm:size-8 items-center justify-center rounded-full text-white shadow-[0_0_10px_rgba(250,204,21,0.7)] shrink-0 transition-transform duration-300 group-hover:scale-105 ${
                  isListening
                    ? "bg-gradient-to-tr from-emerald-400 to-teal-300 text-slate-950"
                    : isSpeaking
                    ? "bg-gradient-to-tr from-cyan-300 to-teal-200 text-slate-950"
                    : "bg-gradient-to-tr from-amber-300 via-yellow-400 to-amber-500 text-slate-950"
                }`}
              >
                <div className="size-full rounded-full bg-slate-950/80 flex items-center justify-center overflow-hidden border border-white/40">
                  {isListening ? (
                    <Mic className="size-3.5 text-emerald-400 animate-bounce" />
                  ) : isSpeaking ? (
                    <Volume2 className="size-3.5 text-cyan-300 animate-bounce" />
                  ) : isThinking ? (
                    <div className="relative flex items-center justify-center">
                      <GeminiSparkleIcon size={14} />
                      <span className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-amber-400 animate-ping" />
                    </div>
                  ) : (
                    <GeminiSparkleIcon size={15} className="group-hover:rotate-12 transition-transform duration-300" />
                  )}
                </div>
              </div>

              {/* Center Typography & Real-time Live Equalizer */}
              <div className="relative text-left leading-none max-w-[105px] sm:max-w-[130px]">
                <div className="flex items-center gap-1">
                  <span className="text-[11px] sm:text-xs font-black tracking-tight text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)] truncate">
                    {isListening
                      ? "सुन रहे हैं..."
                      : isSpeaking
                      ? "बोल रहा है..."
                      : isThinking
                      ? "सोच रहे हैं..."
                      : currentLang === "hi"
                      ? "किसान साथी Live"
                      : "Kisan Saathi Live"}
                  </span>

                  {/* Super-Bright Neon Audio Equalizer */}
                  <GeminiWaveform
                    active={isListening || isSpeaking}
                    variant={isListening ? "listening" : isSpeaking ? "speaking" : "gemini"}
                    className="scale-75 origin-left shrink-0"
                  />

                  {/* Pinging Radar Beacon Dot */}
                  <span className="relative flex size-2 shrink-0 ml-auto sm:ml-0">
                    <span
                      className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-90 ${
                        isListening
                          ? "bg-emerald-300"
                          : isSpeaking
                          ? "bg-white"
                          : "bg-amber-300"
                      }`}
                    />
                    <span
                      className={`relative inline-flex size-2 rounded-full border border-white ${
                        isListening
                          ? "bg-emerald-400"
                          : isSpeaking
                          ? "bg-cyan-300"
                          : "bg-amber-400"
                      }`}
                    />
                  </span>
                </div>

                <p className="text-[8.5px] sm:text-[9.5px] text-amber-200 font-extrabold mt-0.5 truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                  {isListening
                    ? "माइक चालू • बोलिए"
                    : isSpeaking
                    ? "रोकने के लिए टैप करें"
                    : isThinking
                    ? "AI विश्लेषण..."
                    : currentLang === "hi"
                    ? "बोलकर पूछें • Voice AI"
                    : "Direct Voice Assistant"}
                </p>
              </div>

              {/* Interactive Panel Chevron */}
              <div className="relative text-white/90 group-hover:text-white transition-all ml-0.5 shrink-0">
                <div className={`transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}>
                  <ChevronUp className="size-3.5 drop-shadow-xs" />
                </div>
              </div>
            </button>

            {/* Dedicated Golden/Emerald Mic Trigger Button (compact 36px/40px) */}
            <button
              type="button"
              onClick={toggleListening}
              aria-label={isListening ? "Stop listening" : "Start speaking"}
              title={isListening ? "सुन रहे हैं • बंद करने के लिए टैप करें" : "बोलकर पूछें (Speak to Kisan Saathi Live)"}
              className={`group relative flex size-9 sm:size-10 items-center justify-center rounded-full text-slate-950 font-black transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer border border-white shrink-0 ${
                isListening
                  ? "bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 text-slate-950 ring-2 ring-emerald-300/80 shadow-[0_0_18px_rgba(16,185,129,0.7)]"
                  : "bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 hover:from-amber-300 hover:to-yellow-200 shadow-[0_0_18px_rgba(250,204,21,0.7)]"
              }`}
            >
              <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <Mic className={`size-4 sm:size-4.5 ${isListening ? "text-slate-950 animate-bounce" : "group-hover:scale-110 transition-transform"}`} />
            </button>

            {/* Interactive Close / Collapse Trigger (✕) (compact 28px/32px) */}
            <button
              type="button"
              onClick={() => {
                setIsExpanded(false);
                setIsOpen(false);
                stopSpeaking();
              }}
              aria-label="Collapse Assistant"
              title="छोटा करें (Collapse)"
              className="group flex size-7 sm:size-8 items-center justify-center rounded-full bg-white/20 hover:bg-white/35 text-white border border-white/60 transition-all duration-200 active:scale-90 shadow-md cursor-pointer backdrop-blur-md shrink-0"
            >
              <X className="size-3.5 group-hover:rotate-90 transition-transform duration-200" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
