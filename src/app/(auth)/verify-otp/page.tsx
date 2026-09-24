import type { Metadata } from "next";
import { Suspense } from "react";
import { VerifyOtpForm } from "./verify-otp-form";

export const metadata: Metadata = {
  title: "Verify Security OTP",
  description: "Verify your one-time password to complete authentication on Krishi Setu.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading…</div>}>
      <VerifyOtpForm />
    </Suspense>
  );
}
