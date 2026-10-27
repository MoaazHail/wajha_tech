"use client";

import { useState } from "react";

import { Dialog } from "@/shared/components/dialog";
import { cn } from "@/shared/lib/utils/cn.util";
import { EditIcon, TrashIcon } from "@/shared/ui/icons";

interface CrudCardProps {
  children: React.ReactNode;
  onEdit?: () => void;
  /** Runs after the user confirms the deletion. */
  onDelete?: () => void;
  /** Sentence shown in the delete confirmation. */
  deleteMessage?: string;
  className?: string;
}

const actionClass =
  "flex size-9 items-center justify-center rounded-md border border-line bg-white shadow-sm transition-colors";

/**
 * A card with edit and delete buttons that appear on hover or keyboard focus.
 * On devices without hover the buttons stay visible, since they could never be reached otherwise.
 */
export function CrudCard({ children, onEdit, onDelete, deleteMessage, className }: CrudCardProps) {
  const [confirming, setConfirming] = useState(false);
  const hasActions = Boolean(onEdit || onDelete);

  return (
    <article className={cn("group relative rounded-lg border border-line bg-white p-6", className)}>
      {children}

      {hasActions && (
        <div className="absolute end-3 top-3 flex gap-1.5 transition-opacity [@media(hover:hover)]:opacity-0 group-focus-within:opacity-100 group-hover:opacity-100">
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              aria-label="تعديل"
              className={cn(actionClass, "text-ink hover:bg-surface")}
            >
              <EditIcon />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              aria-label="حذف"
              className={cn(actionClass, "text-red-600 hover:bg-red-50")}
            >
              <TrashIcon />
            </button>
          )}
        </div>
      )}

      {onDelete && (
        <Dialog open={confirming} onClose={() => setConfirming(false)} title="تأكيد الحذف">
          <p className="text-muted">
            {deleteMessage ?? "هل أنت متأكد من حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء."}
          </p>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="rounded-md border border-line px-4 py-2 text-[15px] transition-colors hover:bg-surface"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={() => {
                setConfirming(false);
                onDelete();
              }}
              className="rounded-md bg-red-600 px-4 py-2 text-[15px] font-medium text-white transition-colors hover:bg-red-700"
            >
              حذف
            </button>
          </div>
        </Dialog>
      )}
    </article>
  );
}
