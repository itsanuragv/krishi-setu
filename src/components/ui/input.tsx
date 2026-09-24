import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "flex h-11 w-full rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-white/80 dark:bg-zinc-900/50 backdrop-blur-md px-3.5 text-sm shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] outline-none placeholder:text-muted-foreground/60 transition-all duration-200 ease-[cubic-bezier(0.25,1,0.35,1)] focus-visible:border-emerald-500 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-emerald-500/15 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
