import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/utils/cn.util";

const ctaVariants = cva(
  "inline-flex items-center gap-2 font-display font-semibold transition-[transform,background-color,border-color] duration-150",
  {
    variants: {
      tone: {
        /** White on blue — hero primary and the closing band. */
        white: "bg-white text-brand hover:-translate-y-0.5",
        /** Blue on light — pricing and the service cards. */
        blue: "bg-brand text-white hover:bg-brand-dark hover:-translate-y-0.5",
        /** Hairline on blue — hero secondary and the header. */
        outline: "border border-white/50 text-white hover:border-white hover:bg-white/10",
      },
      size: {
        sm: "px-[26px] py-[11px] text-[15px] font-medium",
        md: "px-6 py-3.5 text-[15px]",
        lg: "px-7 py-[15px] text-[15.5px]",
        xl: "px-[34px] py-4 text-[17px]",
      },
      shape: {
        square: "",
        rounded: "rounded-md",
        /** The hero button's clipped top corner. */
        cut: "[clip-path:polygon(0_0,calc(100%-18px)_0,100%_18px,100%_100%,0_100%)]",
      },
    },
    defaultVariants: { tone: "blue", size: "md", shape: "rounded" },
  },
);

type CtaLinkProps = ComponentProps<"a"> & VariantProps<typeof ctaVariants>;

/**
 * Every call to action in the design points at WhatsApp, so this is a plain
 * anchor rather than next/link.
 */
export function CtaLink({ className, tone, size, shape, children, ...props }: CtaLinkProps) {
  return (
    <a className={cn(ctaVariants({ tone, size, shape }), className)} {...props}>
      {children}
    </a>
  );
}

/** The ↗ glyph the design sets in the mono face. */
export function CtaArrow({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("font-mono text-[13px]", className)}>
      ↗
    </span>
  );
}
