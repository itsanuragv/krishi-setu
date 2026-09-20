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
  Bot,
  RotateCcw,
  Radio,
  ArrowRight,
  ChevronDown
} from "lucide-react";
import { toast } from "sonner";
import { 
  getSpeechRecognition, 
  type SpeechRecognitionInstance, 
  type SpeechRecognitionEvent, 
  type SpeechRecognitionErrorEvent 
} from "@/lib/speech-types";

interface Message {
  id: string;
  role: "user" | "gemini";
  text: string;
  time: string;
  intent?: string;
  route?: string;
  suggestedActions?: Array<{
    label: string;
    action: "navigate" | "speak" | "fill";
    route?: string;
    speakText?: string;
  }>;
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
    // Ignore audio context autoplay restrictions
  }
}

// Find optimal native voice for Hindi/English
function getBestVoice(lang: "hi-IN" | "en-IN"): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  if (lang === "hi-IN") {
    // 1. Google हिन्दी or Microsoft Swara/Madhur Natural
    const hiVoice = voices.find(v => 
      v.lang.toLowerCase().startsWith("hi") && 
      (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Swara") || v.name.includes("Madhur"))
    );
    if (hiVoice) return hiVoice;
    const genericHi = voices.find(v => v.lang.toLowerCase().startsWith("hi"));
    if (genericHi) return genericHi;
  }

  // English fallback or en-IN
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
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [liveMode, setLiveMode] = useState(false); // Hands-free continuous Gemini Live
  const [language, setLanguage] = useState<"hi-IN" | "en-IN">("hi-IN");
  const [audioFeedbackEnabled, setAudioFeedbackEnabled] = useState(true);
  
  // Real-time speech streaming
  const [interimTranscript, setInterimTranscript] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");

  // Conversational message history
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "intro-1",
      role: "gemini",
      text: "नमस्ते! मैं आपका कृषि सेतु जेमिनी असिस्टेंट हूँ। आप फसल बेचने, खरीदने या मंडी भाव जानने के लिए बोल सकते हैं।",
      time: "अभी",
      suggestedActions: [
        { label: "फसल बेचें (Sell)", action: "speak", speakText: "मुझे 50 किलो टमाटर बेचना है" },
        { label: "मंडी भाव जानें", action: "speak", speakText: "आज के प्रमुख मंडी भाव क्या हैं?" },
        { label: "किसान पोर्टल खोलें", action: "navigate", route: "/farmer" }
      ]
    }
  ]);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const isProcessingRef = useRef(false);

  // Auto-scroll chat to latest message
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, interimTranscript, isThinking]);

  // Voice synthesis with best native voice matching
  const speak = useCallback((text: string, lang: "hi-IN" | "en-IN", onComplete?: () => void) => {
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

  // Stop speaking on barge-in
  const stopSpeaking = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // Process speech with Gemini backend
  const processWithGemini = useCallback(async (userText: string) => {
    if (!userText.trim() || isProcessingRef.current) return;
    isProcessingRef.current = true;

    stopSpeaking();
    setIsListening(false);
    setInterimTranscript("");
    setIsThinking(true);

    const userMsgId = `user-${Date.now()}`;
    const userMsg: Message = {
      id: userMsgId,
      role: "user",
      text: userText.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);

    try {
      // Build conversation history payload
      const historyPayload = messages.slice(-5).map(m => ({
        role: m.role === "gemini" ? "assistant" as const : "user" as const,
        text: m.text,
      }));

      const res = await fetch("/api/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: userText,
          language,
          history: historyPayload,
        }),
      });

      if (!res.ok) throw new Error("Gemini speech endpoint failed");

      const data = await res.json();
      playAssistantChime("reply");

      const geminiMsg: Message = {
        id: `gemini-${Date.now()}`,
        role: "gemini",
        text: data.spokenResponse || "आदेश समझ लिया गया है।",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        intent: data.intent,
        route: data.route,
        suggestedActions: data.suggestedActions,
      };

      setMessages((prev) => [...prev, geminiMsg]);

      // Speak response with auto-resume in liveMode
      speak(geminiMsg.text, language, () => {
        if (liveMode) {
          setTimeout(() => {
            if (recognitionRef.current && isOpen) {
              try {
                recognitionRef.current.start();
                setIsListening(true);
                playAssistantChime("start");
              } catch {
                // Ignore start collision
              }
            }
          }, 400);
        }
      });

      // Execute auto-action for high-confidence intents if not in multi-turn conversation mode
      if (data.intent === "LIST_CROP" && data.route && !data.clarificationNeeded) {
        toast.success(`Gemini: ${data.spokenResponse}`);
      } else if (data.intent === "SEARCH_PRODUCE" && data.route) {
        const query = data.searchQuery?.query;
        if (query) toast.success(`खोज रहे हैं: ${query}`);
      }
    } catch (err) {
      console.error("Gemini voice error:", err);
      const fallbackReply = language === "hi-IN" 
        ? "जी, आपका संदेश प्राप्त हो गया है। आप क्या सहायता चाहते हैं?" 
        : "Message received. How can I assist you further?";
      
      setMessages((prev) => [
        ...prev, 
        {
          id: `gemini-${Date.now()}`,
          role: "gemini",
          text: fallbackReply,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }
      ]);
      speak(fallbackReply, language);
    } finally {
      setIsThinking(false);
      isProcessingRef.current = false;
    }
  }, [language, liveMode, messages, speak, stopSpeaking, isOpen]);

  // Handle external trigger event
  useEffect(() => {
    function handleOpenEvent() {
      setIsOpen(true);
    }
    window.addEventListener("open-voice-assistant", handleOpenEvent);
    return () => {
      window.removeEventListener("open-voice-assistant", handleOpenEvent);
    };
  }, []);

  // Initialize SpeechRecognition with streaming interim results
  useEffect(() => {
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
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
        setFinalTranscript(final);
        setInterimTranscript("");
        
        // Auto-debounce: send after user pauses speech
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(() => {
          if (isProcessingRef.current) return;
          recognition.stop();
          processWithGemini(final);
        }, 900);
      }
    };

    recognition.onerror = (e: SpeechRecognitionErrorEvent) => {
      setIsListening(false);
      if (e.error !== "no-speech") {
        toast.error(`Mic: ${e.error}`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };
  }, [language, processWithGemini]);

  // Toggle voice recognition
  function toggleListening() {
    stopSpeaking();

    if (!recognitionRef.current) {
      toast.error("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      if (interimTranscript) {
        processWithGemini(interimTranscript);
      }
    } else {
      setInterimTranscript("");
      setFinalTranscript("");
      try {
        playAssistantChime("start");
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        recognitionRef.current.stop();
        setIsListening(false);
      }
    }
  }

  // Switch language
  function handleLanguageChange(newLang: "hi-IN" | "en-IN") {
    setLanguage(newLang);
    if (newLang === "hi-IN") {
      setMessages(prev => [
        ...prev,
        {
          id: `sys-${Date.now()}`,
          role: "gemini",
          text: "भाषा हिन्दी पर सेट हो गई है। आप अपनी स्थानीय भाषा में बोल सकते हैं।",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
      speak("भाषा हिन्दी पर सेट हो गई है।", "hi-IN");
    } else {
      setMessages(prev => [
        ...prev,
        {
          id: `sys-${Date.now()}`,
          role: "gemini",
          text: "Language switched to English. Feel free to speak your queries.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
      speak("Language switched to English.", "en-IN");
    }
  }

  return (
    <>
      {/* 1. Floating Gemini Live Capsule Button */}
      <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 flex items-center animate-in fade-in slide-in-from-bottom-4 duration-300">
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            toggleListening();
          }}
          aria-label="Open Gemini Live Assistant"
          className="group relative flex items-center gap-3 rounded-full bg-slate-950/90 text-white pl-3.5 pr-4 py-2.5 shadow-2xl border border-indigo-500/30 hover:border-indigo-400 backdrop-blur-md hover:scale-105 active:scale-95 transition-all"
        >
          {/* Iridescent Aurora Glow Ring */}
          <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-violet-600 via-cyan-500 to-emerald-500 opacity-60 blur-xs group-hover:opacity-90 transition-opacity" />

          {/* Glowing Animated Gemini Core */}
          <div className="relative flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 via-violet-600 to-cyan-500 text-white shadow-inner">
            <Sparkles className="size-4 animate-pulse text-amber-200" />
          </div>

          <div className="relative text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black tracking-wide text-white">Gemini Live</span>
              <span className="flex size-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <p className="text-[10px] text-slate-300 font-medium leading-none">किसान वाणी</p>
          </div>
        </button>
      </div>

      {/* 2. Full-Screen / Modal Gemini Live Experience */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/80 p-0 sm:p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative flex flex-col w-full h-[88vh] sm:h-[620px] max-w-lg rounded-t-3xl sm:rounded-3xl border border-slate-700/60 bg-gradient-to-b from-slate-900 via-slate-950 to-black text-white shadow-2xl overflow-hidden">
            
            {/* Top Bar Header */}
            <div className="flex items-center justify-between border-b border-slate-800/80 px-5 py-4 bg-slate-900/60 backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 shadow-md">
                  <Sparkles className="size-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm sm:text-base font-black text-white tracking-wide">
                      Gemini Live <span className="text-cyan-400">किसान वाणी</span>
                    </h2>
                    <span className="rounded-full bg-cyan-950 border border-cyan-800/60 px-2 py-0.5 text-[9px] font-bold text-cyan-300 tracking-wider">
                      3.6 FLASH
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Real-time Vernacular Voice Assistant
                  </p>
                </div>
              </div>

              {/* Controls: Mute, Live Mode, Close */}
              <div className="flex items-center gap-1.5">
                {/* Hands-Free Live Mode Toggle */}
                <button
                  type="button"
                  onClick={() => setLiveMode(v => !v)}
                  title={liveMode ? "Hands-free continuous mode ON" : "Turn continuous mode ON"}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[10px] font-bold border transition-colors ${
                    liveMode 
                      ? "bg-emerald-950/80 border-emerald-500 text-emerald-300" 
                      : "bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white"
                  }`}
                >
                  <Radio className={`size-3 ${liveMode ? "animate-pulse text-emerald-400" : ""}`} />
                  <span>Live</span>
                </button>

                {/* Audio Feedback Toggle */}
                <button
                  type="button"
                  onClick={() => {
                    if (isSpeaking) stopSpeaking();
                    setAudioFeedbackEnabled(v => !v);
                  }}
                  className="rounded-full p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title={audioFeedbackEnabled ? "Mute audio" : "Unmute audio"}
                >
                  {audioFeedbackEnabled ? (
                    <Volume2 className="size-4 text-cyan-400" />
                  ) : (
                    <VolumeX className="size-4 text-slate-500" />
                  )}
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => {
                    stopSpeaking();
                    if (recognitionRef.current) recognitionRef.current.stop();
                    setIsOpen(false);
                  }}
                  className="rounded-full p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            {/* Language Selector Strip */}
            <div className="flex items-center justify-between px-5 py-2 bg-slate-950/70 border-b border-slate-800/40 text-xs">
              <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                <Languages className="size-3.5 text-violet-400" />
                Voice Language:
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleLanguageChange("hi-IN")}
                  className={`rounded-full px-3 py-0.5 text-[11px] font-bold transition-all ${
                    language === "hi-IN"
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-xs"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  हिन्दी (Hindi)
                </button>
                <button
                  type="button"
                  onClick={() => handleLanguageChange("en-IN")}
                  className={`rounded-full px-3 py-0.5 text-[11px] font-bold transition-all ${
                    language === "en-IN"
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-xs"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            {/* Conversational Scrollable Message Feed */}
            <div 
              ref={chatScrollRef}
              className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 scrollbar-thin scrollbar-thumb-slate-800"
            >
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-md ${
                      m.role === "user"
                        ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-xs"
                        : "bg-slate-800/90 border border-slate-700/70 text-slate-100 rounded-tl-xs"
                    }`}
                  >
                    {/* Header badge */}
                    <div className="flex items-center gap-1.5 mb-1 opacity-70 text-[10px] font-bold uppercase tracking-wider">
                      {m.role === "user" ? (
                        <span>आप (You)</span>
                      ) : (
                        <span className="flex items-center gap-1 text-cyan-300">
                          <Sparkles className="size-2.5" />
                          Gemini 3.6 Flash
                        </span>
                      )}
                      <span>•</span>
                      <span>{m.time}</span>
                    </div>

                    <p className="whitespace-pre-wrap">{m.text}</p>

                    {/* Action Chips */}
                    {m.suggestedActions && m.suggestedActions.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex flex-wrap gap-1.5">
                        {m.suggestedActions.map((act, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              if (act.action === "navigate" && act.route) {
                                router.push(act.route);
                                setIsOpen(false);
                              } else if (act.speakText) {
                                processWithGemini(act.speakText);
                              }
                            }}
                            className="flex items-center gap-1 rounded-full bg-slate-900/90 hover:bg-indigo-950 border border-slate-700 hover:border-indigo-500 px-2.5 py-1 text-[11px] font-semibold text-slate-200 hover:text-white transition-colors"
                          >
                            <span>{act.label}</span>
                            <ArrowRight className="size-3 text-cyan-400" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Streaming Interim Transcript (Real-time speech feedback) */}
              {interimTranscript && (
                <div className="flex flex-col items-end">
                  <div className="max-w-[85%] rounded-2xl rounded-tr-xs bg-emerald-800/60 border border-emerald-500/40 p-3.5 text-xs sm:text-sm text-emerald-100 animate-pulse">
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-70 block mb-1">
                      Listening in real-time...
                    </span>
                    <p className="italic">
                      &ldquo;{interimTranscript}&rdquo;
                      <span className="inline-block w-1.5 h-3.5 bg-emerald-300 ml-1 animate-ping" />
                    </p>
                  </div>
                </div>
              )}

              {/* Thinking State Indicator */}
              {isThinking && (
                <div className="flex items-center gap-2 text-xs text-cyan-400 animate-pulse">
                  <Sparkles className="size-4 animate-spin text-cyan-300" />
                  <span>Gemini AI सोच रहा है (Reasoning produce intent)...</span>
                </div>
              )}
            </div>

            {/* Bottom Interactive Gemini Orb Section */}
            <div className="relative border-t border-slate-800/80 bg-slate-950 p-4 sm:p-5 flex flex-col items-center justify-center">
              
              {/* Central Glowing Gemini Orb */}
              <div className="relative flex items-center justify-center my-2">
                
                {/* Iridescent Aurora Outer Rings */}
                <div
                  className={`absolute rounded-full transition-all duration-700 pointer-events-none ${
                    isListening
                      ? "size-32 bg-gradient-to-r from-violet-600/40 via-cyan-500/40 to-pink-500/40 blur-xl animate-pulse scale-125"
                      : isThinking
                      ? "size-28 bg-gradient-to-r from-amber-500/40 via-violet-600/40 to-cyan-500/40 blur-lg animate-spin"
                      : isSpeaking
                      ? "size-32 bg-gradient-to-r from-cyan-400/40 via-indigo-500/40 to-violet-500/40 blur-xl animate-ping scale-110"
                      : "size-24 bg-violet-600/20 blur-md"
                  }`}
                />

                {/* Live Dynamic Audio Frequency Bars (Gemini Voice Equalizer) */}
                {isListening && (
                  <div className="absolute flex items-center gap-1 -top-8 pointer-events-none">
                    <span className="w-1 bg-cyan-400 rounded-full animate-bounce h-4" />
                    <span className="w-1 bg-violet-400 rounded-full animate-bounce h-7 delay-75" />
                    <span className="w-1 bg-pink-400 rounded-full animate-bounce h-5 delay-150" />
                    <span className="w-1 bg-emerald-400 rounded-full animate-bounce h-8 delay-100" />
                    <span className="w-1 bg-cyan-300 rounded-full animate-bounce h-3 delay-200" />
                  </div>
                )}

                {/* Primary Core Button */}
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`group relative flex size-18 items-center justify-center rounded-full text-white shadow-2xl transition-all duration-300 active:scale-90 ${
                    isListening
                      ? "bg-gradient-to-tr from-rose-600 via-pink-600 to-rose-500 shadow-rose-500/50 scale-105"
                      : isThinking
                      ? "bg-gradient-to-tr from-amber-600 via-orange-600 to-violet-600 shadow-amber-500/50"
                      : isSpeaking
                      ? "bg-gradient-to-tr from-cyan-600 via-indigo-600 to-violet-600 shadow-cyan-500/50 scale-105"
                      : "bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-600 hover:scale-105 shadow-indigo-500/40"
                  }`}
                  aria-label={isListening ? "Stop listening" : "Start speaking"}
                >
                  {isListening ? (
                    <MicOff className="size-7 animate-pulse text-white" />
                  ) : isThinking ? (
                    <Sparkles className="size-7 animate-spin text-amber-200" />
                  ) : isSpeaking ? (
                    <div className="flex flex-col items-center justify-center">
                      <Volume2 className="size-7 animate-bounce text-white" />
                      <span className="text-[8px] font-bold uppercase tracking-tight mt-0.5">Stop</span>
                    </div>
                  ) : (
                    <Mic className="size-7 text-white group-hover:scale-110 transition-transform" />
                  )}
                </button>
              </div>

              {/* Status Hint */}
              <div className="text-center mt-2 space-y-0.5">
                <p className="text-xs font-bold text-slate-200">
                  {isListening
                    ? "सुन रहे हैं... बोलिए (Listening in real-time...)"
                    : isThinking
                    ? "जेमिनी विचार कर रहा है... (Gemini Reasoning...)"
                    : isSpeaking
                    ? "जेमिनी बोल रहा है (Tap to interrupt)"
                    : "माइक दबाएं और फसल या भाव पूछें (Tap to speak)"}
                </p>
                <p className="text-[10px] text-slate-500">
                  {liveMode 
                    ? "⚡ Live Hands-free Mode Enabled (निरंतर बातचीत मोड)" 
                    : "Powered by Google AI Studio Gemini 3.6 Flash"}
                </p>
              </div>

              {/* Quick Prompt Pills Carousel */}
              <div className="w-full mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { text: "50 किलो टमाटर ₹35 में बेचना है", label: "🍅 50kg टमाटर बेचें" },
                  { text: "आज के नासिक प्याज के मंडी भाव क्या हैं?", label: "🧅 प्याज के मंडी भाव" },
                  { text: "किसान डैशबोर्ड खोलें", label: "📊 किसान पोर्टल" },
                  { text: "ताजा हरी मिर्च खोजें", label: "🛒 हरी मिर्च खोजें" }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => processWithGemini(item.text)}
                    className="shrink-0 rounded-full border border-slate-800 bg-slate-900/80 hover:bg-slate-800 px-3 py-1 text-[11px] text-slate-300 hover:text-white transition-colors"
                  >
                    {item.label}
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
