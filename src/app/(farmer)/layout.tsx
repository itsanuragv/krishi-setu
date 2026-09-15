import { AppShell } from "@/components/shared/app-shell";

export default function FarmerLayout({ children }: { children: React.ReactNode }) {
  return <AppShell role="farmer">{children}</AppShell>;
}
