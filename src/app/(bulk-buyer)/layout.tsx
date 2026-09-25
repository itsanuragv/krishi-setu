import { AppShell } from "@/components/shared/app-shell";

export default function BuyerLayout({ children }: { children: React.ReactNode }) {
  return <AppShell role="bulk_buyer">{children}</AppShell>;
}
