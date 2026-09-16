"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Mic, MicOff, Volume2, Globe, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: { error: string }) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

export function VoiceAssistant() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState<"hi-IN" | "en-IN">("hi-IN");
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState("");
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const processCommandRef = useRef<(text: string) => void>(() => {});

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const text = event.results[0][0].transcript.toLowerCase();
      setTranscript(text);
      processCommandRef.current(text);
    };

    recognition.onerror = (e) => {
      setIsListening(false);
      if (e.error !== "no-speech") {
        toast.error(`Voice error: ${e.error}`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [language]);

  function speak(text: string, lang: "hi-IN" | "en-IN") {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  }

  function processCommand(text: string) {
    // Farmer commands
    if (text.includes("bech") || text.includes("sell") || text.includes("fasal") || text.includes("list")) {
      const msg = language === "hi-IN" ? "फसल बेचने के पेज पर जा रहे हैं" : "Navigating to Sell Produce";
      setFeedback(msg);
      speak(msg, language);
      setTimeout(() => {
        router.push("/farmer/sell");
        setIsOpen(false);
      }, 1000);
      return;
    }

    if (text.includes("kamai") || text.includes("earning") || text.includes("paisa") || text.includes("ledger")) {
      const msg = language === "hi-IN" ? "आपकी कुल कमाई और बैंक खाता विवरण" : "Opening Earnings & Settlement Ledger";
      setFeedback(msg);
      speak(msg, language);
      setTimeout(() => {
        router.push("/farmer/earnings");
        setIsOpen(false);
      }, 1000);
      return;
    }

    if (text.includes("match") || text.includes("khareeddar") || text.includes("buyer")) {
      const msg = language === "hi-IN" ? "खरीदार खोजने की सूची खोल रहे हैं" : "Opening Buyer Matching Engine";
      setFeedback(msg);
      speak(msg, language);
      setTimeout(() => {
        router.push("/farmer/matches");
        setIsOpen(false);
      }, 1000);
      return;
    }

    if (text.includes("order") || text.includes("khareed")) {
      const msg = language === "hi-IN" ? "ऑर्डर सूची खोली जा रही है" : "Opening Orders";
      setFeedback(msg);
      speak(msg, language);
      setTimeout(() => {
        router.push("/farmer/orders");
        setIsOpen(false);
      }, 1000);
      return;
    }

    if (text.includes("rating") || text.includes("trust") || text.includes("score")) {
      const msg = language === "hi-IN" ? "आपका ट्रस्ट स्कोर और समीक्षाएं" : "Opening Trust Score & Ratings";
      setFeedback(msg);
      speak(msg, language);
      setTimeout(() => {
        router.push("/farmer/ratings");
        setIsOpen(false);
      }, 1000);
      return;
    }

    if (text.includes("bazaar") || text.includes("search") || text.includes("market") || text.includes("sabzi")) {
      const msg = language === "hi-IN" ? "मंडी और बाज़ार खोज रहे हैं" : "Opening Marketplace Search";
      setFeedback(msg);
      speak(msg, language);
      setTimeout(() => {
        router.push("/consumer/search");
        setIsOpen(false);
      }, 1000);
      return;
    }

    // Default unrecognized
    const notFound = language === "hi-IN"
      ? `सुना: "${text}". कृपया बोलें: 'फसल बेचो', 'कमाई दिखाओ', या 'ऑर्डर चेक करो'`
      : `Heard: "${text}". Try saying: 'Sell produce', 'Show earnings', or 'Check orders'`;
    setFeedback(notFound);
    speak(language === "hi-IN" ? "कृपया दोबारा बोलें" : "Command not recognized, try again", language);
  }

  function toggleListen() {
    if (!recognitionRef.current) {
      toast.error("Speech Recognition is not supported on this browser.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript("");
      setFeedback("");
      try {
        recognitionRef.current.lang = language;
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error(err);
      }
    }
  }

  processCommandRef.current = processCommand;

  return (
    <>
      {/* Floating Vernacular Button */}
      <div className="fixed bottom-20 right-4 z-40 lg:bottom-8 lg:right-8">
        <Button
          size="lg"
          onClick={() => {
            setIsOpen((o) => !o);
            if (!isOpen) {
              speak(
                language === "hi-IN"
                  ? "नमस्ते, कृषि सेतु आवाज़ सहायक तैयार है। माइक दबाकर बोलें।"
                  : "Krishi Setu voice assistant ready. Tap the microphone and speak.",
                language
              );
            }
          }}
          className="size-14 rounded-full bg-primary text-primary-foreground shadow-xl hover:bg-primary/90 flex items-center justify-center p-0 ring-4 ring-primary/20 transition-transform active:scale-95"
          title="Vernacular Voice Guidance (हिंदी / English)"
        >
          <Mic className="size-6 animate-pulse" />
        </Button>
      </div>

      {/* Voice Assistant Modal Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="size-5 text-amber-500" />
                <span className="font-display font-bold text-lg">कृषि सेतु Voice AI</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1 text-xs"
                  onClick={() => {
                    const next = language === "hi-IN" ? "en-IN" : "hi-IN";
                    setLanguage(next);
                    toast.success(next === "hi-IN" ? "भाषा: हिन्दी" : "Language: English");
                  }}
                >
                  <Globe className="size-3.5" />
                  {language === "hi-IN" ? "हिन्दी" : "English"}
                </Button>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close voice assistant"
                  className="rounded-full p-1 text-muted-foreground hover:bg-muted"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            <div className="text-center py-4 space-y-4">
              <button
                onClick={toggleListen}
                aria-label={isListening ? "Stop listening" : "Start voice assistant"}
                className={`relative mx-auto size-24 rounded-full flex items-center justify-center transition-all ${
                  isListening
                    ? "bg-red-500 text-white ring-8 ring-red-200 animate-pulse"
                    : "bg-primary text-white hover:bg-primary/90"
                }`}
              >
                {isListening ? <MicOff className="size-10" /> : <Mic className="size-10" />}
              </button>

              <div>
                <p className="text-sm font-semibold">
                  {isListening
                    ? language === "hi-IN" ? "सुन रहे हैं… बोलिए" : "Listening… speak now"
                    : language === "hi-IN" ? "माइक दबाकर बोलें" : "Tap microphone to speak"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {language === "hi-IN"
                    ? "उदाहरण: 'फसल बेचना है', 'कमाई दिखाओ', 'ऑर्डर सूची', 'ट्रस्ट स्कोर'"
                    : "Examples: 'Sell produce', 'Show earnings', 'Check orders', 'Trust score'"}
                </p>
              </div>

              {transcript && (
                <div className="rounded-xl bg-muted/60 p-3 text-xs text-foreground font-medium">
                  &ldquo;{transcript}&rdquo;
                </div>
              )}

              {feedback && (
                <div className="flex items-center justify-center gap-2 text-xs font-semibold text-primary">
                  <Volume2 className="size-4" />
                  <span>{feedback}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
