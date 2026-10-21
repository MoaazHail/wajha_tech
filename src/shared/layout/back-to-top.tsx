'use client'
import { ArrowUpIcon } from "@/shared/ui/icons";
import { useState } from "react";

/** The design pins this to the physical bottom-left, not the logical start edge. */
export function BackToTop() {
  const [isDisplay, setIsDisplay] = useState<boolean>(false)
  return (
    <a
      href="#top"
      aria-label="عودة إلى أعلى الصفحة"
      className="fixed bottom-6 left-6 z-50 flex size-13 items-center justify-center rounded-full border border-white/35 bg-brand text-white shadow-[0_10px_24px_rgba(4,20,66,.32)] transition-[background-color,transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:bg-ink hover:shadow-[0_14px_28px_rgba(4,20,66,.4)]"
    >
      <ArrowUpIcon />
    </a>
  );
}
