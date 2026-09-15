"use client";

import { use } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authApi } from "@/features/api";
import { isRole, ROLE_LABEL } from "@/lib/auth/roles";
import { registerSchema, type RegisterInput } from "@/lib/schemas/user";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage({ params }: { params: Promise<{ role: string }> }) {
  const { role: rawRole } = use(params);
  const router = useRouter();
  const setPending = useAuthStore((s) => s.setPending);
  const role = isRole(rawRole) ? rawRole : "farmer";

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role,
      language: "en",
      name: "",
      phone: "",
      district: "",
      state: "",
      village: "",
    },
  });

  async function onSubmit(values: RegisterInput) {
    try {
      await authApi.sendOtp(values.phone);
      setPending(values.phone, values.role);
      sessionStorage.setItem("ks_register", JSON.stringify(values));
      toast.success("OTP sent. Use 123456.");
      router.push("/verify-otp");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not start registration");
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Register as {ROLE_LABEL[role]}</CardTitle>
          <CardDescription>Role-specific fields stay short on purpose — finish on OTP.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="name">{role === "bulk_buyer" ? "Organisation name" : "Full name"}</Label>
              <Input id="name" {...form.register("name")} />
              {form.formState.errors.name && (
                <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Mobile</Label>
              <Input id="phone" inputMode="numeric" maxLength={10} {...form.register("phone")} />
              {form.formState.errors.phone && (
                <p className="text-xs text-destructive">{form.formState.errors.phone.message}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Input id="district" {...form.register("district")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" {...form.register("state")} />
              </div>
            </div>
            {(role === "farmer" || role === "delivery") && (
              <div className="space-y-2">
                <Label htmlFor="village">Village / area</Label>
                <Input id="village" {...form.register("village")} />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <select
                id="language"
                className="h-11 w-full rounded-xl border border-input bg-card px-3"
                {...form.register("language")}
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
              </select>
            </div>
            <Button className="w-full" type="submit" disabled={form.formState.isSubmitting}>
              Send OTP
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
