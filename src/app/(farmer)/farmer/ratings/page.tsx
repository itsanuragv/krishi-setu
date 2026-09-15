"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ShieldCheck, CheckCircle2, TrendingUp, AlertCircle, Award } from "lucide-react";

const REVIEWS = [
  {
    id: "r-1",
    buyerName: "Ananya Sharma",
    buyerType: "Consumer (Pune)",
    rating: 5,
    date: "12 Sep 2026",
    crop: "Tomato (Abhinav)",
    comment: "Top quality farm-fresh tomatoes! Zero bruises, exact weight, and delivered within 8 hours of harvest.",
  },
  {
    id: "r-2",
    buyerName: "Nashik Green Cooperative",
    buyerType: "FPO Bulk Buyer",
    rating: 5,
    date: "08 Sep 2026",
    crop: "Onion (Nasik Red)",
    comment: "Consistent Grade-A sorting. Direct truck loading at farm gate went smoothly. Fair floor pricing.",
  },
  {
    id: "r-3",
    buyerName: "Rahul Deshmukh",
    buyerType: "Local Retailer",
    rating: 4,
    date: "01 Sep 2026",
    crop: "Potato (Kufri Jyoti)",
    comment: "Good produce, very fresh. Delivery was delayed by 30 mins due to rain, but driver kept updated.",
  },
];

export default function FarmerRatingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Trust Score & Ratings</h1>
          <p className="text-xs text-muted-foreground">
            Module 15: Deterministic Trust Calculation & Algorithmic Matching Priority
          </p>
        </div>
        <Badge className="w-fit bg-emerald-700 text-white gap-1 px-3 py-1">
          <ShieldCheck className="size-4" />
          Verified Producer · Level 1
        </Badge>
      </div>

      {/* Trust Score Hero Card */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-1 border-primary/30 bg-gradient-to-br from-card to-emerald-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
              <Award className="size-4 text-primary" />
              Krishi Setu Trust Index
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-5xl font-bold text-primary">86</span>
              <span className="text-lg text-muted-foreground font-semibold">/ 100</span>
            </div>
            <div className="flex items-center gap-1 text-amber-500">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="size-4 fill-amber-400 text-amber-400" />
              ))}
              <span className="ml-1 text-xs font-bold text-foreground">4.8 (34 reviews)</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Your listings receive a <span className="font-semibold text-emerald-800">+18% boost</span> in the
              5-Factor Matching algorithm.
            </p>
          </CardContent>
        </Card>

        {/* 4 Pillars Breakdown */}
        <div className="grid grid-cols-2 gap-3 md:col-span-2">
          <Card className="p-4 flex flex-col justify-between">
            <span className="text-xs text-muted-foreground">On-Time Dispatch Rate</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-2xl font-bold">98.4%</span>
              <CheckCircle2 className="size-5 text-emerald-600" />
            </div>
            <span className="text-[11px] text-emerald-700">Consistently &lt;12h transit window</span>
          </Card>

          <Card className="p-4 flex flex-col justify-between">
            <span className="text-xs text-muted-foreground">Quality Accuracy (QC)</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-2xl font-bold">99.2%</span>
              <ShieldCheck className="size-5 text-primary" />
            </div>
            <span className="text-[11px] text-emerald-700">Validated by OpenCV pre-upload</span>
          </Card>

          <Card className="p-4 flex flex-col justify-between">
            <span className="text-xs text-muted-foreground">Dispute Frequency</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-2xl font-bold">0.0%</span>
              <Badge variant="outline" className="text-emerald-700 border-emerald-300">Clean</Badge>
            </div>
            <span className="text-[11px] text-muted-foreground">Zero unresolved complaints</span>
          </Card>

          <Card className="p-4 flex flex-col justify-between">
            <span className="text-xs text-muted-foreground">Repeat Buyer Demand</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-2xl font-bold">42%</span>
              <TrendingUp className="size-5 text-amber-600" />
            </div>
            <span className="text-[11px] text-muted-foreground">High consumer loyalty</span>
          </Card>
        </div>
      </div>

      {/* Algorithm Transparency Card */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertCircle className="size-4 text-primary" />
            Transparent Scoring Formula (SIH Governance)
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground space-y-2">
          <p>
            Unlike opaque commercial apps, Krishi Setu uses a transparent scoring function:
          </p>
          <div className="rounded-lg bg-muted/60 p-3 font-mono text-[11px] text-foreground">
            Trust Score = (0.35 × OnTimeRate) + (0.30 × QualityScore) + (0.20 × OrderCompletion) + (0.15 × AvgRating)
          </div>
          <p>
            Scores update nightly via automated Celery jobs after each physical PIN delivery confirmation.
          </p>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-3">
        <h2 className="font-display text-lg font-bold">Recent Verified Buyer Feedback</h2>
        <div className="space-y-3">
          {REVIEWS.map((rev) => (
            <Card key={rev.id}>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{rev.buyerName}</span>
                    <Badge variant="outline" className="text-[10px]">{rev.buyerType}</Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">{rev.date}</span>
                </div>
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-2 text-xs font-medium text-muted-foreground">Crop: {rev.crop}</span>
                </div>
                <p className="text-xs text-foreground/90">{rev.comment}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
