"use client";

import { useState } from "react";

import { ctaVariants } from "@/shared/components/cta-link";
import { cn } from "@/shared/lib/utils/cn.util";

import { BookingModal } from "./booking-modal";

type BookingButtonProps = Pick<NonNullable<Parameters<typeof ctaVariants>[0]>, "tone" | "size" | "shape"> & {
  children: React.ReactNode;
  className?: string;
};

/** Looks like a call-to-action link, but opens the booking modal. */
export function BookingButton({ tone, size, shape, className, children }: BookingButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={cn(ctaVariants({ tone, size, shape }), className, 'cursor-pointer')}>
        {children}
      </button>
      <BookingModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
