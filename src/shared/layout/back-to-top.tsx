'use client'
import { ArrowUpIcon } from "@/shared/ui/icons";
import { cn } from "@/shared/lib/utils/cn.util";
import { useEffect, useState } from "react";

/** Scroll distance (px) after which the button appears. */
const SHOW_AFTER = 1400;

/** The design pins this to the physical bottom-left, not the logical start edge. */
export function BackToTop() {
  const [isDisplay, setIsDisplay] = useState<boolean>(false);

  useEffect(() => {
    const onScroll = () => setIsDisplay(window.scrollY > SHOW_AFTER);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href="#top"
      aria-label="عودة إلى أعلى الصفحة"
      aria-hidden={!isDisplay}
      tabIndex={isDisplay ? 0 : -1}
      className={cn(
        "fixed bottom-6 left-6 z-50 flex size-13 items-center justify-center rounded-full border border-white/35 bg-brand text-white shadow-[0_10px_24px_rgba(4,20,66,.32)] transition-[background-color,transform,box-shadow,opacity] duration-200",
        isDisplay
          ? "opacity-100 hover:-translate-y-0.5 hover:bg-ink hover:shadow-[0_14px_28px_rgba(4,20,66,.4)]"
          : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <ArrowUpIcon />
    </a>
  );
}
