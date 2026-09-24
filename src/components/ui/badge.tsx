import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold backdrop-blur-md transition-all duration-200 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.7)]",
        accent:
          "bg-amber-500/15 text-amber-900 border border-amber-500/30 shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.7)]",
        outline:
          "border border-black/[0.08] dark:border-white/[0.1] bg-white/70 dark:bg-zinc-900/60 text-foreground shadow-2xs",
        success:
          "bg-emerald-100/80 text-emerald-900 border border-emerald-300/80 shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.8)]",
        danger:
          "bg-rose-100/80 text-rose-900 border border-rose-300/80 shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.8)]",
        glass:
          "bg-white/60 dark:bg-white/[0.08] border border-black/[0.06] dark:border-white/[0.1] text-foreground shadow-2xs",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}
