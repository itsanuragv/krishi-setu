"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { authApi } from "@/features/api";
import { ROLE_HOME } from "@/lib/auth/roles";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { maskPhone } from "@/lib/utils";

export function VerifyOtpForm() {
  const router = useRouter();
  const next = useSearchParams().get("next");
  const pendingPhone = useAuthStore((s) => s.pendingPhone);
  const pendingRole = useAuthStore((s) => s.pendingRole);
  const setSession = useAuthStore((s) => s.setSession);
  const [otp, setOtp] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [loading, setLoading] = useState(false);

  const extra = useMemo(() => {
    if (typeof window === "undefined") return {};
    const raw = sessionStorage.getItem("ks_register");
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  }, []);

  if (!pendingPhone) {
    router.replace("/login");
    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!pendingPhone) return;
    setLoading(true);
    try {
      const { user } = await authApi.verify({
        phone: pendingPhone,
        otp,
        role: pendingRole ?? undefined,
        ...extra,
      });
      setSession(user);
      sessionStorage.removeItem("ks_register");
      toast.success(`Welcome, ${user.name}`);
      router.replace(next && next.startsWith("/") ? next : ROLE_HOME[user.role]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
      <Card>
        <CardHeader>
          <CardTitle>Enter OTP</CardTitle>
          <CardDescription>Sent to {maskPhone(pendingPhone)}. Demo code: 123456</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="otp">6-digit code</Label>
              <Input
                id="otp"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                autoComplete="one-time-code"
              />
            </div>
            <Button className="w-full" type="submit" disabled={otp.length !== 6 || loading}>
              {loading ? "Verifying…" : "Verify & continue"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              disabled={cooldown > 0}
              onClick={async () => {
                await authApi.sendOtp(pendingPhone);
                setCooldown(30);
                const t = setInterval(() => {
                  setCooldown((c) => {
                    if (c <= 1) {
                      clearInterval(t);
                      return 0;
                    }
                    return c - 1;
                  });
                }, 1000);
                toast.message("OTP resent");
              }}
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
