"use client";

import { useEffect, useRef, useState } from "react";

import { Dialog } from "@/shared/components/dialog";
import { cn } from "@/shared/lib/utils/cn.util";
import { EditIcon, MoreIcon, PlusIcon, TrashIcon } from "@/shared/ui/icons";

export type DataTableTheme = "light" | "dark";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  /** Receives the table theme so custom content (badges, links) can match it. */
  cell: (row: T, theme: DataTableTheme) => React.ReactNode;
  /** Uses the primary text colour instead of the muted one. */
  strong?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  columns: ReadonlyArray<DataTableColumn<T>>;
  rows: ReadonlyArray<T>;
  getRowId: (row: T) => string;
  /** Shows the add button in the toolbar. */
  onAdd?: () => void;
  addLabel?: string;
  /** Adds "edit" to the row menu (right-click or the ⋯ button). */
  onEdit?: (row: T) => void;
  /** Adds "delete" to the row menu, behind a confirmation. */
  onDelete?: (row: T) => void;
  /** Sentence shown in the delete confirmation. */
  deleteMessage?: (row: T) => string;
  emptyText?: string;
  /** Colour scheme of the table, its row menu and its empty state. Defaults to "light". */
  theme?: DataTableTheme;
}

interface MenuState<T> {
  row: T;
  x: number;
  y: number;
}

const THEMES = {
  light: {
    wrapper: "border-line bg-white",
    head: "bg-surface text-muted",
    divide: "divide-line",
    strong: "text-ink",
    muted: "text-muted",
    rowHover: "hover:bg-surface/60",
    more: "text-muted hover:bg-surface hover:text-ink",
    menu: "border-line bg-white",
    edit: "text-ink hover:bg-surface",
    remove: "text-red-600 hover:bg-red-50",
  },
  dark: {
    wrapper: "border-white/10 bg-night-tile",
    head: "bg-white/5 text-white/60",
    divide: "divide-white/10",
    strong: "text-white",
    muted: "text-white/65",
    rowHover: "hover:bg-white/5",
    more: "text-white/60 hover:bg-white/10 hover:text-white",
    menu: "border-white/10 bg-night-tile",
    edit: "text-white hover:bg-white/10",
    remove: "text-red-400 hover:bg-red-500/10",
  },
} as const;

const MENU_W = 176;
const MENU_H = 96;

/**
 * Generic table with add / edit / delete. The row menu opens on right-click and
 * from a ⋯ button (for touch and keyboard). Handlers are optional: leave all
 * three out for a read-only table.
 */
export function DataTable<T>({
  columns,
  rows,
  getRowId,
  onAdd,
  addLabel = "إضافة",
  onEdit,
  onDelete,
  deleteMessage,
  emptyText = "لا توجد بيانات",
  theme = "light",
}: DataTableProps<T>) {
  const t = THEMES[theme];
  const [menu, setMenu] = useState<MenuState<T> | null>(null);
  const [pendingDelete, setPendingDelete] = useState<T | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const hasMenu = Boolean(onEdit || onDelete);

  useEffect(() => {
    if (!menu) return;

    const close = () => setMenu(null);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) close();
    };

    menuRef.current?.querySelector<HTMLElement>("button")?.focus();
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [menu]);

  const openMenu = (row: T, x: number, y: number) => {
    setMenu({
      row,
      x: Math.max(8, Math.min(x, window.innerWidth - MENU_W - 8)),
      y: Math.max(8, Math.min(y, window.innerHeight - MENU_H - 8)),
    });
  };

  const confirmDelete = () => {
    if (pendingDelete !== null) onDelete?.(pendingDelete);
    setPendingDelete(null);
  };

  return (
    <div className="grid gap-3">
      {onAdd && (
        <div className="flex justify-start">
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2.5 text-[15px] font-medium text-white transition-colors hover:bg-brand-dark"
          >
            <PlusIcon />
            {addLabel}
          </button>
        </div>
      )}

      <div className={cn("overflow-x-auto rounded-lg border", t.wrapper)}>
        <table className="w-full min-w-[640px] text-start text-[15px]">
          <thead className={cn("text-sm", t.head)}>
            <tr>
              {columns.map((column) => (
                <th key={column.key} scope="col" className="px-4 py-3 text-start font-medium">
                  {column.header}
                </th>
              ))}
              {hasMenu && (
                <th scope="col" className="w-12 px-2 py-3">
                  <span className="sr-only">إجراءات</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody className={cn("divide-y", t.divide)}>
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length + (hasMenu ? 1 : 0)} className={cn("px-4 py-10 text-center", t.muted)}>
                  {emptyText}
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <tr
                key={getRowId(row)}
                onContextMenu={
                  hasMenu
                    ? (event) => {
                        event.preventDefault();
                        openMenu(row, event.clientX, event.clientY);
                      }
                    : undefined
                }
                className={cn(hasMenu && t.rowHover)}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn("px-4 py-3", column.strong ? cn("font-medium", t.strong) : t.muted, column.className)}
                  >
                    {column.cell(row, theme)}
                  </td>
                ))}
                {hasMenu && (
                  <td className="px-2 py-3 text-end">
                    <button
                      type="button"
                      aria-label="إجراءات الصف"
                      aria-haspopup="menu"
                      onClick={(event) => {
                        const rect = event.currentTarget.getBoundingClientRect();
                        openMenu(row, rect.left, rect.bottom + 4);
                      }}
                      className={cn("flex size-8 items-center justify-center rounded-md transition-colors", t.more)}
                    >
                      <MoreIcon />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {menu && (
        <div
          ref={menuRef}
          role="menu"
          style={{ left: menu.x, top: menu.y, width: MENU_W }}
          className={cn("fixed z-[60] grid gap-0.5 rounded-lg border p-1.5 shadow-[0_14px_32px_rgba(4,20,66,.2)]", t.menu)}
        >
          {onEdit && (
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                onEdit(menu.row);
                setMenu(null);
              }}
              className={cn("flex items-center gap-2.5 rounded-md px-3 py-2 text-start text-[15px] transition-colors", t.edit)}
            >
              <EditIcon />
              تعديل
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setPendingDelete(menu.row);
                setMenu(null);
              }}
              className={cn("flex items-center gap-2.5 rounded-md px-3 py-2 text-start text-[15px] transition-colors", t.remove)}
            >
              <TrashIcon />
              حذف
            </button>
          )}
        </div>
      )}

      <Dialog open={pendingDelete !== null} onClose={() => setPendingDelete(null)} title="تأكيد الحذف">
        <p className="text-muted">
          {pendingDelete !== null && deleteMessage
            ? deleteMessage(pendingDelete)
            : "هل أنت متأكد من حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء."}
        </p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setPendingDelete(null)}
            className="rounded-md border border-line px-4 py-2 text-[15px] transition-colors hover:bg-surface"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={confirmDelete}
            className="rounded-md bg-red-600 px-4 py-2 text-[15px] font-medium text-white transition-colors hover:bg-red-700"
          >
            حذف
          </button>
        </div>
      </Dialog>
    </div>
  );
}
