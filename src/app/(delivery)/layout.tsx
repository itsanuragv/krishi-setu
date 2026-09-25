import { AppShell } from "@/components/shared/app-shell";

export default function DeliveryLayout({ children }: { children: React.ReactNode }) {
  return <AppShell role="delivery">{children}</AppShell>;
}
