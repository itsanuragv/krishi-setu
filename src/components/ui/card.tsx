import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({
  className,
  interactive = false,
  ...props
}: React.ComponentProps<"div"> & { interactive?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-white/80 dark:bg-zinc-900/70 backdrop-blur-xl text-card-foreground shadow-[0_4px_24px_-2px_rgba(0,0,0,0.04),0_1px_4px_-1px_rgba(0,0,0,0.02),inset_0_1px_1px_0_rgba(255,255,255,0.75)] transition-all duration-300 ease-[cubic-bezier(0.25,1,0.35,1)]",
        interactive && "cursor-pointer transform-gpu hover:-translate-y-1 hover:shadow-[0_18px_40px_-8px_rgba(0,0,0,0.08),inset_0_1px_1.5px_0_rgba(255,255,255,0.9)] active:scale-[0.985]",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-1.5 p-5 pb-2.5", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return <h3 className={cn("font-display text-lg font-bold tracking-tight text-slate-900", className)} {...props} />;
}

export function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("text-xs sm:text-sm text-muted-foreground leading-relaxed", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("p-5 pt-2.5", className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex items-center p-5 pt-0 border-t border-black/[0.04] mt-2", className)} {...props} />;
}
