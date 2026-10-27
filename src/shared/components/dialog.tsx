"use client";

import { useEffect, useRef } from "react";

import { CloseIcon } from "@/shared/ui/icons";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

/** Modal built on the native <dialog>: focus trap, Escape and backdrop click come with it. */
export function Dialog({ open, onClose, title, children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
      className="m-auto w-[min(92vw,30rem)] rounded-lg bg-white p-0 text-ink shadow-[0_24px_60px_rgba(4,20,66,.35)] backdrop:bg-ink/50"
    >
      {open && (
        <div className="grid gap-5 p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="إغلاق"
              className="flex size-9 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface hover:text-ink"
            >
              <CloseIcon />
            </button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  );
}
