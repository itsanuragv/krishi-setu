"use client";

import { useEffect, useState, type ReactNode } from "react";

export function MswProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(process.env.NEXT_PUBLIC_API_MODE !== "mock");

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_API_MODE !== "mock") {
      setReady(true);
      return;
    }

    let cancelled = false;
    async function start() {
      const { worker } = await import("@/mocks/browser");
      await worker.start({
        onUnhandledRequest: "bypass",
        serviceWorker: { url: "/mockServiceWorker.js" },
      });
      if (!cancelled) setReady(true);
    }
    start();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Starting Krishi Setu…
      </div>
    );
  }

  return children;
}
