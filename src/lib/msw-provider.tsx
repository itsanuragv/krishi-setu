"use client";

import { useEffect, useState, type ReactNode } from "react";

export function MswProvider({ children }: { children: ReactNode }) {
  const isReal = process.env.NEXT_PUBLIC_API_MODE === "real";
  const [ready, setReady] = useState(isReal);

  useEffect(() => {
    if (isReal) {
      setReady(true);
      return;
    }

    let cancelled = false;
    async function start() {
      try {
        const { worker } = await import("@/mocks/browser");
        await worker.start({
          onUnhandledRequest: "bypass",
          serviceWorker: { url: "/mockServiceWorker.js" },
        });
      } catch (err) {
        console.warn("MSW worker registration failed or unsupported in this context:", err);
      } finally {
        if (!cancelled) setReady(true);
      }
    }

    // Safety timeout in case service worker start hangs
    const timer = setTimeout(() => {
      if (!cancelled) setReady(true);
    }, 2000);

    start();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [isReal]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Starting Krishi Setu…
      </div>
    );
  }

  return children;
}
