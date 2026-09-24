import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 ease-[cubic-bezier(0.25,1,0.35,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 min-h-11 px-4 select-none cursor-pointer transform-gpu active:scale-[0.97]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_2px_8px_rgba(5,150,105,0.2),inset_0_1px_1px_rgba(255,255,255,0.3)] hover:bg-primary/95 hover:-translate-y-0.5 hover:shadow-[0_6px_18px_rgba(5,150,105,0.28),inset_0_1px_1.5px_rgba(255,255,255,0.45)]",
        secondary:
          "bg-emerald-50/90 text-emerald-900 border border-emerald-200/70 shadow-2xs hover:bg-emerald-100/80 hover:-translate-y-0.5",
        outline:
          "border border-black/[0.08] dark:border-white/[0.1] bg-white/70 dark:bg-zinc-900/50 backdrop-blur-md text-foreground shadow-2xs hover:bg-white/95 hover:border-black/[0.12] hover:-translate-y-0.5 hover:shadow-xs",
        glass:
          "backdrop-blur-xl bg-white/70 dark:bg-zinc-900/60 border border-black/[0.06] dark:border-white/[0.08] text-foreground shadow-[0_2px_8px_rgba(0,0,0,0.03),inset_0_1px_1px_rgba(255,255,255,0.6)] hover:bg-white/90 hover:-translate-y-0.5 hover:shadow-md",
        ghost:
          "text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.06] hover:-translate-y-0.5",
        accent:
          "bg-accent text-accent-foreground shadow-[0_2px_8px_rgba(16,185,129,0.2),inset_0_1px_1px_rgba(255,255,255,0.3)] hover:bg-accent/90 hover:-translate-y-0.5",
        destructive:
          "bg-destructive text-destructive-foreground shadow-[0_2px_8px_rgba(239,68,68,0.2),inset_0_1px_1px_rgba(255,255,255,0.2)] hover:bg-destructive/90 hover:-translate-y-0.5",
      },
      size: {
        default: "h-11",
        sm: "h-9 min-h-9 px-3 text-xs rounded-lg",
        lg: "h-12 min-h-12 px-6 text-base rounded-2xl",
        icon: "h-11 w-11 p-0 rounded-xl",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
