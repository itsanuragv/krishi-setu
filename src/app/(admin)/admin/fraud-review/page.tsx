"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function FraudReviewPage() {
  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl">Fraud review</h1>
      <Card>
        <CardHeader>
          <CardTitle>Duplicate listing cluster</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>Two Sharbati wheat listings from the same GPS cell with identical photos — flagged for review.</p>
          <Button
            variant="destructive"
            onClick={() => {
              if (confirm("Take down both listings?")) toast.success("Listings queued for takedown");
            }}
          >
            Confirm takedown
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
