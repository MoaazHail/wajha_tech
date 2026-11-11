import { cn } from "@/shared/lib/utils/cn.util";

/** A pulsing placeholder block for the dark dashboard. Size it with className. */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn("animate-pulse rounded-md bg-white/10", className)} />;
}
