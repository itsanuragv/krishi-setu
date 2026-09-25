import { AppShell } from "@/components/shared/app-shell";

export default function ConsumerLayout({ children }: { children: React.ReactNode }) {
  return <AppShell role="consumer">{children}</AppShell>;
}
