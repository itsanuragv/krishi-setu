import Link from "next/link";
import { ArrowRight, ShieldCheck, Smartphone, Sprout, Truck, Users, Warehouse } from "lucide-react";
import { ROLE_LABEL, ROLES, type Role } from "@/lib/auth/roles";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ICONS: Record<Role, typeof Sprout> = {
  farmer: Sprout,
  consumer: Smartphone,
  delivery: Truck,
  admin: ShieldCheck,
  bulk_buyer: Warehouse,
};

const BLURBS: Record<Role, string> = {
  farmer: "List harvest, see matches, get paid at farm-gate rates.",
  consumer: "Buy nearby produce with transparent match scores.",
  delivery: "Pickup codes, live routes, confirm drop-offs.",
  admin: "Users, disputes, fraud review, and marketplace KPIs.",
  bulk_buyer: "Contract-size lots from FPOs and verified farms.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-card/80">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <p className="font-display text-lg font-semibold text-primary">Krishi Setu</p>
          <Button asChild variant="outline" size="sm">
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">SIH 26033 demo</p>
        <h1 className="mt-2 max-w-2xl font-display text-4xl leading-tight text-foreground sm:text-5xl">
          Direct farm-to-buyer trade, built for a phone in the field.
        </h1>
        <p className="mt-4 max-w-xl text-muted-foreground">
          Choose a role to enter the mocked marketplace. OTP for seeded accounts is{" "}
          <strong>123456</strong>.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ROLES.map((role) => {
            const Icon = ICONS[role];
            return (
              <Card key={role}>
                <CardHeader>
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <CardTitle>{ROLE_LABEL[role]}</CardTitle>
                  <CardDescription>{BLURBS[role]}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href={`/register/${role}`}>
                      Continue as {ROLE_LABEL[role]}
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <p className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="size-4" />
          Already registered?{" "}
          <Link className="font-medium text-primary underline" href="/login">
            Login with phone
          </Link>
          . Seeded farmer: 9876543210.
        </p>
      </main>
    </div>
  );
}
