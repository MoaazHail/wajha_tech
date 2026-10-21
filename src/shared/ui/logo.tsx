import { cn } from "@/shared/lib/utils/cn.util";
import { SITE } from "@/shared/lib/constants/site.constant";

interface LogoProps {
  size?: number;
  /** Plays the draw + fold intro. Only the header mark uses it. */
  animated?: boolean;
  className?: string;
}

/** The door mark: a white frame with the orange folded corner. */
export function LogoMark({ size = 40, animated = false, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label={SITE.name}
      className={className}
    >
      <path
        d="M0 0 H58 L100 42 V100 H0 Z M14.5 14.5 H72.5 L85.5 27.5 V85.5 H14.5 Z"
        fill="currentColor"
        fillRule="evenodd"
        className={animated ? "animate-draw" : undefined}
      />
      <path
        d="M68 0 H100 V32 Z"
        fill="var(--color-accent)"
        className={animated ? "animate-fold" : undefined}
      />
    </svg>
  );
}

interface LogoLockupProps extends LogoProps {
  /** Mono wordmark size; the Arabic line scales with it. */
  compact?: boolean;
}

/** Mark plus the WAJHA / واجهة wordmark. */
export function Logo({ size = 40, animated = false, compact = false, className }: LogoLockupProps) {
  return (
    <div className={cn("flex flex-none items-center gap-3", className)}>
      <LogoMark size={size} animated={animated} />
      <span className="grid gap-[3px] leading-none">
        <span
          className={cn(
            "font-mono font-medium",
            compact ? "text-[13px] tracking-[.34em] ps-[.34em]" : "text-sm tracking-[.38em] ps-[.38em]",
          )}
        >
          {SITE.wordmark}
        </span>
        <span
          className={cn(
            "font-display font-medium text-white/75",
            compact ? "text-[11px] tracking-[.3em] ps-[.3em]" : "text-xs tracking-[.34em] ps-[.34em]",
          )}
        >
          {SITE.name}
        </span>
      </span>
    </div>
  );
}
