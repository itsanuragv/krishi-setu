"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { authApi } from "@/features/api";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function LoginForm() {
  const router = useRouter();
  const next = useSearchParams().get("next");
  const setPending = useAuthStore((s) => s.setPending);
  const [phone, setPhone] = useState("9876543210");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.sendOtp(phone);
      setPending(phone);
      toast.success("OTP sent. Use 123456 for this demo.");
      const q = next ? `?next=${encodeURIComponent(next)}` : "";
      router.push(`/verify-otp${q}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send OTP");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
      <Card>
        <CardHeader>
          <CardTitle>Login with phone</CardTitle>
          <CardDescription>We send a 6-digit OTP. Resend is rate-limited in the UI.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="phone">Mobile number</Label>
              <Input
                id="phone"
                inputMode="numeric"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="9876543210"
                required
              />
            </div>
            <Button className="w-full" type="submit" disabled={loading || phone.length !== 10}>
              {loading ? "Sending…" : "Send OTP"}
            </Button>
          </form>
          <p className="mt-4 text-sm text-muted-foreground">
            New here?{" "}
            <Link className="text-primary underline" href="/">
              Choose a role
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
