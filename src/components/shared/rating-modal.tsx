"use client";

import { useState } from "react";
import { Star, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { api } from "@/lib/api-client";

interface RatingModalProps {
  orderId: string;
  farmerName: string;
  crop: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const QUALITY_TAGS = [
  "Fresh Produce 🍅",
  "Exact Weight ⚖️",
  "Zero Damage 🛡️",
  "Fair Price 💰",
  "Fast Delivery ⚡",
  "Polite Farmer 🤝",
];

export function RatingModal({
  orderId,
  farmerName,
  crop,
  isOpen,
  onClose,
  onSuccess,
}: RatingModalProps) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>(["Fresh Produce 🍅", "Zero Damage 🛡️"]);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      await api("/ratings", {
        method: "POST",
        body: JSON.stringify({
          orderId,
          score: rating,
          tags: selectedTags,
          comment: feedback,
        }),
      });
      toast.success(`Thank you! Your feedback helps calibrate ${farmerName}'s Trust Score.`);
      onSuccess?.();
      onClose();
    } catch {
      toast.error("Could not submit rating");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h2 className="font-display font-bold text-lg">Rate Farmer & Produce</h2>
            <p className="text-xs text-muted-foreground">{crop} from {farmerName}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close rating modal"
            className="rounded-full p-1 text-muted-foreground hover:bg-muted"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Star Rating */}
        <div className="text-center py-2 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground">HOW WAS THE PRODUCE QUALITY?</p>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = (hoverRating || rating) >= star;
              return (
                <button
                  key={star}
                  type="button"
                  aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-110 active:scale-95"
                >
                  <Star
                    className={`size-8 ${
                      active ? "fill-amber-400 text-amber-400" : "text-muted stroke-1 fill-muted/30"
                    }`}
                  />
                </button>
              );
            })}
          </div>
          <span className="text-xs font-medium text-amber-700">
            {rating === 5 && "Outstanding Quality!"}
            {rating === 4 && "Very Good & Fresh"}
            {rating === 3 && "Average"}
            {rating === 2 && "Substandard"}
            {rating === 1 && "Poor Quality"}
          </span>
        </div>

        {/* Quality Tags */}
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground">KEY HIGHLIGHTS</p>
          <div className="flex flex-wrap gap-1.5">
            {QUALITY_TAGS.map((tag) => {
              const selected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    selected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Review Comments */}
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground">ADDITIONAL COMMENTS</p>
          <Textarea
            rows={2}
            placeholder="Share details about harvest freshness, packaging, or driver behavior…"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="text-xs resize-none"
          />
        </div>

        <div className="rounded-xl bg-emerald-50 p-2.5 text-[11px] text-emerald-900 flex items-center gap-2 border border-emerald-200">
          <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
          <span>Module 15 Trust Impact: Verified ratings directly calibrate the farmer&apos;s 0-100 score.</span>
        </div>

        <div className="flex gap-2 pt-1">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button className="flex-1" disabled={submitting} onClick={handleSubmit}>
            {submitting ? "Submitting…" : "Submit Review"}
          </Button>
        </div>
      </div>
    </div>
  );
}
