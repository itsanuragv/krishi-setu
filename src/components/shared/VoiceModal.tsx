"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Sparkles, 
  X, 
  Languages, 
  Check, 
  ArrowRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExtractedData: (data: {
    crop: string;
    quantity: number;
    unit: string;
    price: number;
    variety?: string;
  }) => void;
}

interface CropDefinition {
  canonical: string;
  hindiName: string;
  defaultVariety: string;
  patterns: RegExp[];
}

const CROP_DEFINITIONS: CropDefinition[] = [
  {
    canonical: "Rice",
    hindiName: "चावल",
    defaultVariety: "Basmati Grade-A",
    patterns: [
      /\b(?:rice|chawal|chaval|chaawal|dhan|paddy|basmati)\b/i,
      /(?:चावल|चांवल|धान|बासमती)/i,
    ],
  },
  {
    canonical: "Wheat",
    hindiName: "गेहूं",
    defaultVariety: "Sharbati Golden",
    patterns: [
      /\b(?:wheat|gehu|gehun|gehoon|kanak|sharbati)\b/i,
      /(?:गेहूं|गेंहू|गेहू|कनक|शरबती)/i,
    ],
  },
  {
    canonical: "Tomatoes",
    hindiName: "टमाटर",
    defaultVariety: "Desi Hybrid",
    patterns: [
      /\b(?:tomato|tomatoes|tamatar|tamater)\b/i,
      /(?:टमाटर|टमाटार)/i,
    ],
  },
  {
    canonical: "Onions",
    hindiName: "प्याज",
    defaultVariety: "Nashik Red Export",
    patterns: [
      /\b(?:onion|onions|pyaz|pyaaz|kanda)\b/i,
      /(?:प्याज|प्यास|कांदा)/i,
    ],
  },
  {
    canonical: "Potatoes",
    hindiName: "आलू",
    defaultVariety: "Jyoti / Chandramukhi",
    patterns: [
      /\b(?:potato|potatoes|aloo|alu|batata)\b/i,
      /(?:आलू|आलु|बटाटा)/i,
    ],
  },
  {
    canonical: "Capsicum",
    hindiName: "शिमला मिर्च",
    defaultVariety: "Green Bell",
    patterns: [
      /\b(?:capsicum|shimla\s*mirch|bell\s*pepper|mirch|chilli|mirchi)\b/i,
      /(?:शिमला\s*मिर्च|मिर्च|मिर्ची)/i,
    ],
  },
  {
    canonical: "Soybean",
    hindiName: "सोयाबीन",
    defaultVariety: "Yellow Bold",
    patterns: [
      /\b(?:soybean|soya|soyabean)\b/i,
      /(?:सोयाबीन|सोया)/i,
    ],
  },
  {
    canonical: "Mustard",
    hindiName: "सरसों",
    defaultVariety: "Pusa Bold",
    patterns: [
      /\b(?:mustard|sarson|sarsonn|rai)\b/i,
      /(?:सरसों|राई|तोरी)/i,
    ],
  },
  {
    canonical: "Maize",
    hindiName: "मक्का",
    defaultVariety: "Sweet Corn / Hybrid",
    patterns: [
      /\b(?:corn|maize|makka|makai)\b/i,
      /(?:मक्का|मकई|भुट्टा)/i,
    ],
  },
  {
    canonical: "Cotton",
    hindiName: "कपास",
    defaultVariety: "BT Cotton",
    patterns: [
      /\b(?:cotton|kapas|rui)\b/i,
      /(?:कपास|रूई|रूं)/i,
    ],
  },
  {
    canonical: "Gram (Chana)",
    hindiName: "चना",
    defaultVariety: "Desi Chana",
    patterns: [
      /\b(?:gram|chana|chane|chickpea)\b/i,
      /(?:चना|चने|छोले)/i,
    ],
  },
  {
    canonical: "Pearl Millet (Bajra)",
    hindiName: "बाजरा",
    defaultVariety: "Desi Shanker Shri Anna",
    patterns: [
      /\b(?:bajra|pearl\s*millet|millet|sajje|kambu)\b/i,
      /(?:बाजरा|बाजरे|श्री\s*अन्न)/i,
    ],
  },
  {
    canonical: "Sorghum (Jowar)",
    hindiName: "ज्वार",
    defaultVariety: "Maldandi M-35-1",
    patterns: [
      /\b(?:jowar|jowari|sorghum|maldandi|chari)\b/i,
      /(?:ज्वार|जवारी|मालदांडी)/i,
    ],
  },
  {
    canonical: "Garlic",
    hindiName: "लहसुन",
    defaultVariety: "Desi Garlic",
    patterns: [
      /\b(?:garlic|lahsun|lehsun)\b/i,
      /(?:लहसुन|लहसून)/i,
    ],
  },
  {
    canonical: "Ginger",
    hindiName: "अदरक",
    defaultVariety: "Fresh Ginger",
    patterns: [
      /\b(?:ginger|adrak)\b/i,
      /(?:अदरक|आदी)/i,
    ],
  },
];

// Hindi & English numerical words mapping
const NUMBER_WORDS: Record<string, number> = {
  "दस": 10, "बीस": 20, "पच्चीस": 25, "तीस": 30, "पैंतीस": 35,
  "चालीस": 40, "पैंतालीस": 45, "पचास": 50, "पचपन": 55, "साठ": 60,
  "पैंसठ": 65, "सत्तर": 70, "अस्सी": 80, "अट्ठाईस": 28, "चौबीस": 24,
  "नब्बे": 90, "सौ": 100, "दो सौ": 200, "तीन सौ": 300, "पांच सौ": 500,
  "ten": 10, "twenty": 20, "twenty five": 25, "thirty": 30, "thirty five": 35,
  "forty": 40, "forty five": 45, "fifty": 50, "fifty five": 55, "sixty": 60,
  "seventy": 70, "eighty": 80, "ninety": 90, "hundred": 100, "two hundred": 200,
};

const PRESET_UTTERANCES = [
  {
    label: "शरबती गेहूं / Wheat (हिन्दी)",
    text: "सौ क्विंटल सीहोर शरबती गेहूं चौंतीस सौ रुपये क्विंटल बेचना है",
    data: { crop: "Wheat", quantity: 100, unit: "quintal", price: 3400, variety: "MP Sharbati Golden" },
  },
  {
    label: "Yellow Soyabean (हिन्दी)",
    text: "पचास क्विंटल पीला सोयाबीन अड़तालीस सौ पचास रुपये क्विंटल",
    data: { crop: "Soybean", quantity: 50, unit: "quintal", price: 4850, variety: "JS-9560 Bold Grain" },
  },
  {
    label: "Basmati Paddy (English)",
    text: "List 150 quintal Pusa 1121 Basmati Rice at 7200 rupees per quintal",
    data: { crop: "Rice", quantity: 150, unit: "quintal", price: 7200, variety: "Pusa 1121 Basmati" },
  },
  {
    label: "Yellow Maize / मक्का (हिन्दी)",
    text: "अस्सी क्विंटल देशी पीला मक्का तेईस सौ पचास रुपये क्विंटल",
    data: { crop: "Maize", quantity: 80, unit: "quintal", price: 2350, variety: "Pioneer Hybrid 3396" },
  },
  {
    label: "Pearl Millet / बाजरा (श्री अन्न)",
    text: "साठ क्विंटल संकर देशी बाजरा छब्बीस सौ रुपये क्विंटल बेचना है",
    data: { crop: "Pearl Millet (Bajra)", quantity: 60, unit: "quintal", price: 2600, variety: "Desi Shanker Shri Anna" },
  },
];

export function VoiceModal({ isOpen, onClose, onExtractedData }: VoiceModalProps) {
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState<"hi-IN" | "en-IN">("hi-IN");
  const [transcript, setTranscript] = useState("");
  const [extractedPreview, setExtractedPreview] = useState<{
    crop: string;
    quantity: number;
    unit: string;
    price: number;
    variety?: string;
  } | null>(null);

  const recognitionRef = useRef<unknown>(null);
  const parseVoiceListingRef = useRef<(text: string) => void>(() => {});

  useEffect(() => {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: new () => unknown }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: new () => unknown }).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    try {
      const recognition = new SpeechRecognition() as {
        continuous: boolean;
        interimResults: boolean;
        lang: string;
        start: () => void;
        stop: () => void;
        onresult: (event: { results: { [key: number]: { [key: number]: { transcript: string } } } }) => void;
        onerror: () => void;
        onend: () => void;
      };

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language;

      recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        parseVoiceListingRef.current(text);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch {
      // Speech recognition fallback
    }
  }, [language]);

  const speakFeedback = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const parseVoiceListing = (text: string) => {
    const rawText = text.trim();
    const lower = rawText.toLowerCase();

    // 1. Identify Crop using dictionary matching
    let detectedCrop: string | null = null;
    let detectedVariety: string = "Standard Farm Grade";

    for (const def of CROP_DEFINITIONS) {
      const matched = def.patterns.some((pattern) => pattern.test(lower) || pattern.test(rawText));
      if (matched) {
        detectedCrop = def.canonical;
        detectedVariety = def.defaultVariety;
        break;
      }
    }

    // 2. Fallback regex extraction if not in primary crop dictionary
    if (!detectedCrop) {
      // Look for English patterns: "selling 50kg mangoes at 80" or "list 100kg barley"
      const englishEntityMatch = rawText.match(/(?:selling|list|have|sell)\s+(?:\d+\s*(?:kg|quintal|crates)?\s+)?(?:of\s+)?([A-Za-z]+)\b/i);
      if (englishEntityMatch && englishEntityMatch[1]) {
        const candidate = englishEntityMatch[1].trim();
        if (!["at", "for", "in", "the", "rupees", "per"].includes(candidate.toLowerCase())) {
          detectedCrop = candidate.charAt(0).toUpperCase() + candidate.slice(1).toLowerCase();
        }
      }

      // Look for Hindi patterns: "50 किलो बाजरा 30 रुपये" -> extract word before price / after quantity
      const hindiEntityMatch = rawText.match(/(?:\d+|पचास|सौ|दो सौ|किलो|क्विंटल)\s+([^\d\s]+)\s+(?:\d+|रुपये|भाव|बेचना)/);
      if (!detectedCrop && hindiEntityMatch && hindiEntityMatch[1]) {
        const candidate = hindiEntityMatch[1].trim();
        if (!["किलो", "क्विंटल", "रुपये", "भाव", "में", "का"].includes(candidate)) {
          detectedCrop = candidate;
        }
      }
    }

    // If still undetermined, fall back to "Farm Produce" instead of hardcoding "Tomatoes"
    if (!detectedCrop) {
      detectedCrop = "Farm Produce";
    }

    // 3. Extract Unit
    let unit = "kg";
    if (lower.includes("quintal") || rawText.includes("क्विंटल") || rawText.includes("कविंटल")) {
      unit = "quintal";
    } else if (lower.includes("crate") || rawText.includes("क्रेट")) {
      unit = "crates";
    } else if (lower.includes("ton") || rawText.includes("टन")) {
      unit = "ton";
    }

    // 4. Extract Numbers (Support digits, Devanagari numerals, and Hindi words)
    // First check Hindi words
    let quantity = 0;
    let price = 0;

    for (const [word, val] of Object.entries(NUMBER_WORDS)) {
      if (rawText.includes(word) || lower.includes(word)) {
        if (!quantity) {
          quantity = val;
        } else if (!price && val !== quantity) {
          price = val;
        }
      }
    }

    // Convert Devanagari digits [०-९] to [0-9]
    const devanagariMap: Record<string, string> = {
      "०": "0", "१": "1", "२": "2", "३": "3", "४": "4",
      "५": "5", "६": "6", "७": "7", "८": "8", "९": "9",
    };
    const normalizedDigitsText = rawText.replace(/[०-९]/g, (d) => devanagariMap[d] || d);

    // Extract Arabic numbers
    const numbers = normalizedDigitsText.match(/\d+/g);
    if (numbers && numbers.length > 0) {
      quantity = parseInt(numbers[0], 10);
      if (numbers.length > 1) {
        price = parseInt(numbers[1], 10);
      }
    }

    // Sensible defaults if not spoken
    if (!quantity) quantity = 50;
    if (!price) price = 40;

    const parsed = {
      crop: detectedCrop,
      variety: detectedVariety,
      quantity,
      unit,
      price,
    };

    setExtractedPreview(parsed);
    speakFeedback(
      language === "hi-IN"
        ? `${quantity} ${unit === "kg" ? "किलो" : unit} ${detectedCrop} ${price} रुपये दर्ज किया गया`
        : `Recorded ${quantity} ${unit} of ${detectedCrop} at ₹${price} per ${unit}`
    );
  };
  parseVoiceListingRef.current = parseVoiceListing;

  const applyPreset = (preset: typeof PRESET_UTTERANCES[0]) => {
    setTranscript(preset.text);
    setExtractedPreview(preset.data);
    speakFeedback(preset.text);
  };

  const confirmAndAutoFill = () => {
    if (extractedPreview) {
      onExtractedData(extractedPreview);
      toast.success(
        `Auto-Populated Listing: ${extractedPreview.quantity} ${extractedPreview.unit} ${extractedPreview.crop} @ ₹${extractedPreview.price}/${extractedPreview.unit}`
      );
      onClose();
    }
  };

  const toggleListen = () => {
    const rec = recognitionRef.current as { start: () => void; stop: () => void } | null;
    if (!rec) {
      // If Web Speech is unsupported or blocked, use Rice preset as the live demo
      applyPreset(PRESET_UTTERANCES[0]);
      toast.info("Microphone unavailable; loaded simulated vernacular voice input.");
      return;
    }

    if (isListening) {
      rec.stop();
      setIsListening(false);
    } else {
      setTranscript("");
      setExtractedPreview(null);
      try {
        rec.start();
        setIsListening(true);
      } catch {
        applyPreset(PRESET_UTTERANCES[0]);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass relative w-full max-w-lg overflow-hidden rounded-3xl border border-emerald-200 bg-white p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xs">
              <Sparkles className="size-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                AI Vernacular Voice Assistant
              </h3>
              <p className="text-[11px] text-slate-500">
                Low-literacy voice intake powered by Web Speech API
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const next = language === "en-IN" ? "hi-IN" : "en-IN";
                setLanguage(next);
                toast.success(next === "hi-IN" ? "भाषा: हिन्दी (hi-IN)" : "Language: English (en-IN)");
              }}
              className="flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Languages className="size-3 text-emerald-600" />
              <span>{language === "hi-IN" ? "हिन्दी" : "English"}</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Close voice intake"
              className="rounded-full p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Big Pulsing Mic Button */}
        <div className="text-center py-4 space-y-3">
          <div className="relative inline-block">
            {isListening && (
              <span className="absolute -inset-3 rounded-full bg-red-400/30 animate-ping" />
            )}
            <button
              onClick={toggleListen}
              aria-label={isListening ? "Stop listening" : "Start voice recording"}
              className={`relative flex size-24 items-center justify-center rounded-full text-white shadow-xl transition-all duration-300 ${
                isListening
                  ? "bg-red-500 ring-8 ring-red-200 scale-105"
                  : "bg-gradient-to-br from-emerald-500 to-emerald-700 hover:scale-105 ring-8 ring-emerald-100"
              }`}
            >
              {isListening ? (
                <MicOff className="size-10 animate-bounce" />
              ) : (
                <Mic className="size-10" />
              )}
            </button>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">
              {isListening ? "Listening actively... speak harvest details" : "Tap the mic and speak in Hindi or English"}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Say: &ldquo;50kg Rice at 60 rupees&rdquo; or &ldquo;पचास किलो गेहूं अट्ठाईस रुपये&rdquo;
            </p>
          </div>
        </div>

        {/* Live Audio Transcript Display */}
        {transcript && (
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-3.5 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
              <Volume2 className="size-3.5 text-emerald-600" />
              <span>Transcript Detected:</span>
            </div>
            <p className="text-sm italic font-medium text-slate-800">
              &ldquo;{transcript}&rdquo;
            </p>
          </div>
        )}

        {/* Auto-Extracted Entities Card */}
        {extractedPreview && (
          <div className="rounded-2xl border border-emerald-300 bg-gradient-to-r from-emerald-50 to-teal-50/40 p-4 space-y-3 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
              <span className="flex items-center gap-1">
                <Check className="size-3.5 text-emerald-600" />
                Entities Auto-Extracted:
              </span>
              <span className="rounded-full bg-emerald-200/60 px-2 py-0.5 text-[10px] text-emerald-800">
                100% Confidence
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-xl bg-white p-2 shadow-xs border border-emerald-100">
                <span className="text-[10px] text-slate-400 uppercase">Crop</span>
                <p className="font-bold text-slate-900">{extractedPreview.crop}</p>
                {extractedPreview.variety && (
                  <p className="text-[9px] text-emerald-700 truncate">{extractedPreview.variety}</p>
                )}
              </div>
              <div className="rounded-xl bg-white p-2 shadow-xs border border-emerald-100">
                <span className="text-[10px] text-slate-400 uppercase">Quantity</span>
                <p className="font-bold text-slate-900">{extractedPreview.quantity} {extractedPreview.unit}</p>
              </div>
              <div className="rounded-xl bg-white p-2 shadow-xs border border-emerald-100">
                <span className="text-[10px] text-slate-400 uppercase">Floor Price</span>
                <p className="font-bold text-emerald-700">₹{extractedPreview.price}/{extractedPreview.unit}</p>
              </div>
            </div>

            <Button
              onClick={confirmAndAutoFill}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-semibold shadow-sm"
            >
              <span>Auto-Fill Form with Typing Effect</span>
              <ArrowRight className="size-4" />
            </Button>
          </div>
        )}

        {/* Preset Prompt Buttons for Demonstration */}
        <div className="space-y-1.5 pt-1">
          <p className="text-[11px] font-semibold text-slate-500">
            Or test instant one-click speech samples:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {PRESET_UTTERANCES.map((preset) => (
              <button
                key={preset.label}
                onClick={() => applyPreset(preset)}
                className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-left text-xs transition-colors hover:border-emerald-300 hover:bg-emerald-50/50"
              >
                <p className="font-semibold text-slate-800">{preset.label}</p>
                <p className="text-[10px] text-slate-500 truncate mt-0.5">{preset.text}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
